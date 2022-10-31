import React from "react";
import { PublicKey } from "@solana/web3.js";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

export type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};

export interface PhantomContextValue {
  provider: PhantomProvider | null;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  publicKey: PublicKey | null;
}

export const PhantomContext = React.createContext<PhantomContextValue>({} as any);

export type PhantomContextInstance = typeof PhantomContext;

if (process.env.NODE_ENV !== "production") {
  PhantomContext.displayName = "PhantomContext";
}

export default PhantomContext;
