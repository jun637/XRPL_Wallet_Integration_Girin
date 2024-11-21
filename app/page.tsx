'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Wallet from '@/components/wallet';
import { useWalletConnectClient } from '@/context/ClientContext';
import { useState } from 'react';

export default function Home() {
  const { accounts, signTransaction } = useWalletConnectClient();
  const [address, setAddress] = useState<string>(
    'rGA3kwmB5hBnvs6VW1fnGKysJfBCUazDrD'
  );
  const [amount, setAmount] = useState<string>('100000');

  const sendTransaction = async (network: string) => {
    const result = await signTransaction(network, {
      TransactionType: 'Payment',
      Account: accounts[0].split(':')[2],
      Destination: address,
      Amount: amount,
    });
    console.log(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-10">
      <h1 className="text-2xl font-bold">Girin WalletConnect Example</h1>
      <div className="flex flex-col space-y-4">
        <Wallet />
        <div className="flex flex-col">
          <h1>XRPL Send</h1>
          <Input
            type="text"
            value={address}
            placeholder="Enter address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            type="text"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            disabled={accounts.length == 0}
            onClick={() => sendTransaction('xrpl:1')}
          >
            XRPL Testnet Send
          </Button>
          <Button
            disabled={accounts.length == 0}
            onClick={() => sendTransaction('xrpl:0')}
          >
            XRPL Mainnet Send
          </Button>
        </div>
        <div className="flex flex-col">
          <h1>The Root Network Send</h1>
          <Input
            type="text"
            value={address}
            placeholder="Enter address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            type="text"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            disabled={accounts.length == 0}
            onClick={() => sendTransaction('xrpl:1')}
          >
            TRN Porcini Send
          </Button>
          <Button
            disabled={accounts.length == 0}
            onClick={() => sendTransaction('xrpl:0')}
          >
            TRN Mainnet Send
          </Button>
        </div>
      </div>
    </main>
  );
}
