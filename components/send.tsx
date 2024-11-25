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
type TrnSendTransactionResponse = unknown;

export function Send({ topic, network, account, amount, destination }: Props) {
  const isXrpl = network.startsWith('xrpl');

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

  // https://docs.reown.com/advanced/multichain/rpc-reference/ethereum-rpc#example-parameters-1
  const { request: trnSendTransaction } =
    useRequest<TrnSendTransactionResponse>({
      chainId: network, // eip155:7668, eip155:7672
      topic, // session.topic
      request: {
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: destination,
            maxFeePerGas: '0x029104e28c',
            maxPriorityFeePerGas: '0x3b9aca00',
            gas: '0x5208',
            value: '0x' + BigInt(amount).toString(16),
            data: '0x',
            accessList: [], // mandatory on EIP-1559
            transactionType: 'eip1559',
          },
        ],
      },
    });

  const onSendTransaction = async () => {
    const sendTransaction = isXrpl ? xrplSendTransaction : trnSendTransaction;

    try {
      const result = await sendTransaction();
      console.info('sendTransaction result', result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      className="w-fit"
      onClick={onSendTransaction}
      disabled={!account || !amount || !destination}
    >{`${isXrpl ? 'xrpl_signTransaction' : 'eth_sendTransaction'} to ${NETWORK_MAP[network]}`}</Button>
  );
}
