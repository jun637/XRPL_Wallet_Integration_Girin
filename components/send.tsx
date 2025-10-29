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
  destinationTag?: number;
}

// TODO
type XrplSignTransactionResponse = unknown;

export function Send({
  topic,
  network,
  account,
  amount,
  destination,
  destinationTag,
}: Props) {
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
            ...(typeof destinationTag === 'number'
              ? { DestinationTag: destinationTag }
              : {}),
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
