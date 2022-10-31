import React, { useCallback, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import type { WalletError } from '@solana/wallet-adapter-base';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletDialogProvider as MaterialUIWalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new PhantomWalletAdapter(),
      //new UnsafeBurnerWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <MaterialUIWalletDialogProvider>
          <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
        </MaterialUIWalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
