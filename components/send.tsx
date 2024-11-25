'use client';

import { useRequest } from '@walletconnect/modal-sign-react';
import { useEffect } from 'react';

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
type TrnSendTransactionResponse = unknown;

export function Send({ topic, network, account, amount, destination }: Props) {
  const isXrpl = network.startsWith('xrpl');

  const { request: xrplSendTransaction, data: xrplData } =
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

  const { request: trnSendTransaction, data: trnData } =
    useRequest<TrnSendTransactionResponse>({
      chainId: network, // eip155:7668, eip155:7672
      topic, // session.topic
      request: {
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: '0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce',
            value: '0x' + BigInt(amount).toString(16),
            data: '0x',
          },
        ],
      },
    });

  const sendTransaction = isXrpl ? xrplSendTransaction : trnSendTransaction;
  const data = isXrpl ? xrplData : trnData;

  useEffect(() => {
    if (data) {
      console.log('send result', data);
    }
  }, [data]);

  return (
    <Button
      className="w-fit"
      onClick={() => sendTransaction()}
      disabled={!account || !amount || !destination}
    >{`${isXrpl ? 'xrpl_signTransaction' : 'eth_sendTransaction'} to ${NETWORK_MAP[network]}`}</Button>
  );
}
