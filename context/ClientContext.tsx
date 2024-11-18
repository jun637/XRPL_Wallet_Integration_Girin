import Client from "@walletconnect/sign-client";
import {
  PairingTypes,
  ProposalTypes,
  SessionTypes,
} from "@walletconnect/types";
import { Web3Modal } from "@web3modal/standalone";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAppMetadata, getSdkError } from "@walletconnect/utils";

interface IContext {
  client: Client | undefined;
  session: SessionTypes.Struct | undefined;
  connect: (pairing?: PairingTypes.Struct) => Promise<void>;
  disconnect: () => Promise<void>;
  isInitializing: boolean;
  pairings: PairingTypes.Struct[];
  accounts: string[];
  signTransaction: (
    chainId: string,
    tx_json: Record<string, unknown>,
    options?: {
      autofill?: boolean;
      submit?: boolean;
    }
  ) => Promise<{
    tx_json: Record<string, unknown>;
  }>;
}

export const ClientContext = createContext<IContext>({} as IContext);

export function ClientContextProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [client, setClient] = useState<Client>();
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [session, setSession] = useState<SessionTypes.Struct>();

  const [isInitializing, setIsInitializing] = useState(false);

  const [accounts, setAccounts] = useState<string[]>([]);

  const web3Modal = useMemo(
    () =>
      new Web3Modal({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
        themeMode: "light",
        walletConnectVersion: 2,
      }),
    []
  );

  const reset = useCallback(() => {
    setSession(undefined);
    setAccounts([]);
  }, []);

  const onSessionConnected = useCallback((_session: SessionTypes.Struct) => {
    const allNamespaceAccounts = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat();

    setSession(_session);
    setAccounts([...new Set(allNamespaceAccounts)]);
  }, []);

  const connect = useCallback(
    async (pairing: PairingTypes.Struct | undefined) => {
      if (!client) {
        return;
      }
      try {
        const requiredNamespaces: ProposalTypes.RequiredNamespaces = {
          xrpl: {
            chains: ["xrpl:0", "xrpl:1"],
            methods: ["xrpl_signTransaction"],
            events: [],
          },
          eip155: {
            chains: ["eip155:7668", "eip155:7672"],
            methods: ["eth_sendTransaction"],
            events: [],
          },
        };

        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces,
        });

        if (uri) {
          const standaloneChains = Object.values(requiredNamespaces)
            .map((namespace) => namespace.chains)
            .flat() as string[];

          web3Modal.openModal({ uri, standaloneChains });
        }

        const session = await approval();
        onSessionConnected(session);
        setPairings(client.pairing.getAll({ active: true }));
      } catch (e) {
        console.error(e);
      } finally {
        web3Modal.closeModal();
      }
    },
    [client, onSessionConnected, web3Modal]
  );

  const disconnect = useCallback(async () => {
    if (!client || !session) {
      return;
    }

    try {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } catch (e) {
      console.error(e);
    } finally {
      reset();
    }
  }, [client, reset, session]);

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const _client = await Client.init({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        metadata: getAppMetadata(),
      });

      setClient(_client);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [createClient, client]);

  const signTransaction = useCallback(
    async (
      chainId: string,
      tx_json: Record<string, unknown>,
      options?: { autofill?: boolean; submit?: boolean }
    ) => {
      const result = await client!.request<{
        tx_json: Record<string, unknown>;
      }>({
        chainId,
        topic: session!.topic,
        request: {
          method: "xrpl_signTransaction",
          params: {
            tx_json,
            autofill: options?.autofill,
            submit: options?.submit,
          },
        },
      });
      console.log(result);
      return result;
    },
    [client, session]
  );

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
      signTransaction,
    }),
    [
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
      signTransaction,
    ]
  );

  return (
    <ClientContext.Provider value={{ ...value }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useWalletConnectClient() {
  return useContext(ClientContext);
}
