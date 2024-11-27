'use client';

import { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';
import {
  useSession,
  WalletConnectModalSign,
} from '@walletconnect/modal-sign-react';
import { getAppMetadata } from '@walletconnect/utils';

import { Connect } from '@/components/connect';
import { Disconnect } from '@/components/disconnect';
import { Send } from '@/components/send';
import { Sign } from '@/components/sign';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { NETWORK, NETWORK_MAP, networks } from '@/lib/network';
import { cn } from '@/lib/utils';

export default function Page() {
  // prevent to restore the session automatically
  useLayoutEffect(() => {
    indexedDB.deleteDatabase('WALLET_CONNECT_V2_INDEXED_DB');
  }, []);

  const [network, setNetwork] = useState<NETWORK>();
  const [accounts, setAccounts] = useState({
    xrpl: '',
    trn: '',
  });

  const [destination, setDestination] = useState(
    'rGA3kwmB5hBnvs6VW1fnGKysJfBCUazDrD'
  );
  const [amount, setAmount] = useState('100000');

  // access the connected session
  const session = useSession();

  // get accounts from the connected session
  useEffect(() => {
    if (!session) return;

    setAccounts({
      xrpl: session.namespaces['xrpl'].accounts[0].split(':')[2],
      trn: session.namespaces['eip155'].accounts[0].split(':')[2],
    });
  }, [session]);

  // validate input amount
  const handleInputAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.toString().trim();
    const parsed = parseFloat(trimmed);

    return isNaN(parsed) || parsed < 0
      ? setAmount('')
      : parsed === 0
        ? setAmount('0')
        : setAmount(trimmed);
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col space-y-4 px-4">
      <h1 className="text-center text-3xl font-semibold tracking-[-1.75px] text-primary">
        Girin walletconnect example
      </h1>

      <p>Your accounts</p>
      <ul>
        <li>XRPL: {accounts.xrpl}</li>
        <li>TRN: {accounts.trn}</li>
      </ul>

      <h2 className={cn('text-2xl', !session ? 'text-primary' : '')}>
        1. Connect your wallet to start
      </h2>
      {session ? <Disconnect session={session} /> : <Connect />}

      <h2 className={cn('text-2xl', session && !network ? 'text-primary' : '')}>
        2. Select Network
        {!session && <span>{` - Connect your wallet first`}</span>}
      </h2>

      <p>Current Network: {network && session && NETWORK_MAP[network]}</p>

      <div className="space-x-2">
        {networks.map((network) => (
          <Button
            key={network}
            onClick={() => setNetwork(network)}
            disabled={!session}
          >
            {NETWORK_MAP[network]}
          </Button>
        ))}
      </div>

      <h2 className={cn('text-2xl', session && network ? 'text-primary' : '')}>
        3. Send Request
        {!session && <span>{` - Connect your wallet first`}</span>}
        {session && !network && <span>{` - Select network first`}</span>}
      </h2>

      <p>Destination Address</p>
      <Input
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        disabled={!session || !network}
      />

      <p>Amount</p>
      <Input
        type="number"
        value={amount}
        onChange={handleInputAmount}
        disabled={!session || !network}
      />

      {session && network && (
        <Send
          account={network.startsWith('xrpl') ? accounts.xrpl : accounts.trn}
          network={network}
          amount={amount || '0'}
          destination={destination}
          topic={session.topic}
        />
      )}

      {session && network && network.startsWith('eip155') && (
        <Sign account={accounts.trn} network={network} topic={session.topic} />
      )}

      <WalletConnectModalSign
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID as string}
        metadata={getAppMetadata()}
        modalOptions={{
          themeMode: 'dark',
          themeVariables: {
            '--wcm-background-color': '#292A30CC',
            '--wcm-accent-color': '#34D98F',
            '--wcm-accent-fill-color': '#34D98F',
          },
          enableExplorer: false,
        }}
      />
    </main>
  );
}
