import { useCallback } from "react";
import { usePhantomContext } from "./usePhantomContext";

const usePhantom = () => {
  const { walletAddress, provider } = usePhantomContext()!;

  const connectWallet = useCallback(() => {
    provider?.connect().catch((err) => {
      console.error("Connect Error:", err);
    });
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    provider?.disconnect().catch((err) => {
      console.error("Disconnect Error:", err);
    });
  }, [provider]);

  return {
    walletAddress,
    connectWallet,
    disconnectWallet,
  };
};

export default usePhantom;
