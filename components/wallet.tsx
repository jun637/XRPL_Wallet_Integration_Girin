import { useWalletConnectClient } from "@/context/ClientContext";
import { Button } from "./ui/button";

export default function Wallet() {
  const { connect, disconnect, accounts } = useWalletConnectClient();
  return (
    <div>
      <h1>Wallet</h1>
      {accounts.length > 0 ? (
        <Button onClick={() => disconnect()}> {accounts.join(",")}</Button>
      ) : (
        <Button onClick={() => connect()}>Connect Wallet</Button>
      )}
    </div>
  );
}
