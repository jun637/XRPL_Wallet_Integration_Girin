'use client';

import { useRequest } from '@walletconnect/modal-sign-react';

import { Button } from '@/components/ui/button';
import { NETWORK, NETWORK_MAP } from '@/lib/network';

interface Props {
  topic: string;
  account: string;
  network: NETWORK;
}

// TODO
type Response = unknown;

export function Sign({ topic, network, account }: Props) {
  // https://docs.reown.com/advanced/multichain/rpc-reference/ethereum-rpc#personal_sign
  const { request: signMessage } = useRequest<Response>({
    chainId: network, // eip155:7668, eip155:7672
    topic,
    request: {
      method: 'personal_sign',
      params: ['Hello World', account],
    },
  });

  const onSign = async () => {
    try {
      const data = await signMessage();
      console.info('sign result', data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      className="w-fit"
      onClick={onSign}
    >{`personal_Sign to ${NETWORK_MAP[network]}`}</Button>
  );
}
