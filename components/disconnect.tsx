import { useDisconnect } from '@walletconnect/modal-sign-react';
import { getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';

import { Button } from './ui/button';

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
