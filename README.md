## Getting Started
출처 : https://girin.readme.io/docs/walletconnect-integration

GirinWallet supports XRPL via WalletConnect v2.

- XRPL Specs : https://docs.reown.com/advanced/multichain/rpc-reference/xrpl-rpc
  - Support networks : `xrpl:0` (mainnet), `xprl:1` (testnet)
  - Support methods : `xrpl_signTransaction`

## Integration

### Prerequisites

To get started with WalletConnect integration, you'll first need a Project ID from [cloud.reown.com](https://cloud.reown.com).

If you don't have a Project ID, follow these steps:

1. Visit [cloud.reown.com](https://cloud.reown.com) and sign up
2. Navigate to the `Projects` tab (skip the Quick Start guide as `@reown/appkit` doesn't support XRPL)
3. Create a new project by selecting "another kit" option(현재는 another kit 옵션이 없기 때문에 App kit으로 선택)

   ![create-project](docs/create-project.png)

4. Add your Project ID to a `.env` file:

   ```bash
   NEXT_PUBLIC_PROJECT_ID=your-project-id
   ```

### Install

This example is constructed using the libraries below. You can also implement it by referring to the official WalletConnect v2 documentation.

```bash
yarn add @walletconnect/modal-sign-react @walletconnect/types @walletconnect/utils
```

### Initialize

Add `WalletConnectModalSign` component to your top-level component:

```ts
import { WalletConnectModalSign } from '@walletconnect/modal-sign-react';
import { getAppMetadata } from '@walletconnect/utils';

export default function Page() {

  return (
    <WalletConnectModalSign
          projectId={process.env.NEXT_PUBLIC_PROJECT_ID}
          metadata={getAppMetadata()}
    />
  )
}
```

### Connect

Connect your iOS or Android wallet by scanning a QR code. Connect through the namespace you need to connect to and get account information.

![screenshot-connect](docs/screenshot-connect.png)

```ts
import { useConnect } from '@walletconnect/modal-sign-react';

import { Button } from '@/components/ui/button';

export function Connect() {
  const { connect, loading: isConnecting } = useConnect({
    requiredNamespaces: {
      xrpl: {
        chains: ['xrpl:0', 'xrpl:1'],
        methods: ['xrpl_signTransaction'],
        events: ['chainChanged', 'accountsChanged'],
      },
    },
  });

  async function onConnect() {
    try {
      const session = await connect();
      console.info('connect result', session);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Button
      size="default"
      onClick={onConnect}
      disabled={isConnecting}
      className="w-fit"
    >
      Connect Wallet
    </Button>
  );
}
```

### Disconnect

Disconnect from GirinWallet.

```ts
import { useDisconnect } from '@walletconnect/modal-sign-react';
import { getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';

import { Button } from '@/components/ui/button';

export function Disconnect({ session }: { session: SessionTypes.Struct }) {
  const { disconnect, loading: isDisconnecting } = useDisconnect({
    topic: session.topic,
    reason: getSdkError('USER_DISCONNECTED'),
  });

  const onDisconnect = async () => {
    try {
      await disconnect();
      console.info('disconnected');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button onClick={onDisconnect} disabled={isDisconnecting} className="w-fit">
      Disconnect Wallet
    </Button>
  );
}
```

### SendTransaction

Below is an example of how to send a transaction to XRPL. For detailed response, please check the XRPL specs in WalletConnect V2.

```ts
'use client';

import { useRequest } from '@walletconnect/modal-sign-react';

import { Button } from '@/components/ui/button';

import { NETWORK, NETWORK_MAP } from '@/lib/network';

interface Props {
  topic: string;
  account: string;
  network: NETWORK;
  amount: string;
  destination: string;
}

// TODO
type XrplSignTransactionResponse = unknown;

export function Send({ topic, network, account, amount, destination }: Props) {
  // https://docs.reown.com/advanced/multichain/rpc-reference/xrpl-rpc#xrpl_signtransaction
  const { request: xrplSendTransaction } =
    useRequest<XrplSignTransactionResponse>({
      chainId: network, // xrpl:0, xrpl:1
      topic, // session.topic
      request: {
        method: 'xrpl_signTransaction',
        params: {
          tx_json: {
            TransactionType: 'Payment',
            Account: account,
            Destination: destination,
            Amount: amount,
          },
        },
      },
    });

  const onSendTransaction = async () => {
    try {
      const result = await xrplSendTransaction();
      console.info('sendTransaction result', result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      className="w-fit"
      onClick={onSendTransaction}
      disabled={!account || !amount || amount === '0' || !destination}
    >{`xrpl_signTransaction to ${NETWORK_MAP[network]}`}</Button>
  );
}
```

## Example

You can easily conduct integration tests with GirinWallet through the examples below.

![screenshot-example](docs/screenshot-example.png)

- Demo : https://walletconnect-example.netlify.app/
- Source : https://github.com/girin-app/girin-walletconnect-example

```bash
yarn
yarn dev
#Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
```
