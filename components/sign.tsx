'use client';

import { useRequest } from '@walletconnect/modal-sign-react';
import { useEffect } from 'react';

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
  const { request: signMessage, data } = useRequest<Response>({
    chainId: network, // eip155:7668, eip155:7672
    topic,
    request: {
      method: 'personal_sign',
      params: ['Hello World', account],
    },
  });

  useEffect(() => {
    if (data) {
      console.log('sign result', data);
    }
  }, [data]);

  return (
    <Button
      className="w-fit"
      onClick={() => signMessage()}
    >{`personal_Sign to ${NETWORK_MAP[network]}`}</Button>
  );
}
