import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { PhantomContext, PhantomProvider, WindowWithSolana } from "./Context";

export interface PhantomProviderProps {
  children: React.ReactNode;
}

const PhantomProvider = ({ children }: PhantomProviderProps) => {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if ("solana" in window) {
      const window_ = window as WindowWithSolana;
      if (window_?.solana?.isPhantom) {
        setProvider(window_.solana);
        // Attemp an eager connection
        window_.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, []);

  useEffect(() => {
    provider?.on("connect", (publicKey: PublicKey) => {
      setPublicKey(publicKey);
      setWalletAddress(publicKey.toString());
    });
    provider?.on("disconnect", () => {
      setPublicKey(null);
      setWalletAddress(null);
    });
  }, [provider]);

  return (
    <PhantomContext.Provider
      value={{
        provider,
        walletAddress,
        setWalletAddress,
        publicKey,
      }}
    >
      {children}
    </PhantomContext.Provider>
  );
};

export default PhantomProvider;
