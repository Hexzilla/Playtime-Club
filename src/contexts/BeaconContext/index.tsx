import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, PermissionScope } from '@airgap/beacon-sdk';
import { BeaconEvent, defaultEventCallbacks } from '@airgap/beacon-sdk';
import { Mainnet } from 'configs';
import { useEffect } from 'react';

export interface BeaconContextApi {
  tezos: TezosToolkit
  wallet: BeaconWallet | undefined
  connected: boolean
  address: string | undefined
  rpcUrl: string
  networkType: NetworkType
  connectWallet: () => Promise<string | undefined>
  disconnectWallet: () => Promise<void>
  setNetworkType: (networkType: NetworkType) => void
  setRpcUrl: (url: string) => void
}

export const BeaconContext = createContext<BeaconContextApi>(
  {} as BeaconContextApi
);

const scopes: PermissionScope[] = [
  PermissionScope.OPERATION_REQUEST,
  PermissionScope.SIGN,
];

export const BeaconProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tezos, setTezos] = useState(new TezosToolkit(Mainnet.RpcUrl));
  const [networkType, setNetworkType] = useState(Mainnet.NetworkType);
  const [rpcUrl, setRpcUrl] = useState(Mainnet.RpcUrl);
  const [wallet, setWallet] = useState<BeaconWallet>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    setAddress(undefined);
    setConnected(false);
    setTezos(new TezosToolkit(rpcUrl));
  }, [rpcUrl]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    (async () => {
      if (wallet) {
        await wallet.clearActiveAccount();
      }

      const _wallet = new BeaconWallet({
        name: 'Playtime-Club',
        preferredNetwork: networkType,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT,
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: (data) => console.log(data.publicKey),
          },
        },
      });

      tezos.setWalletProvider(_wallet);
      setWallet(_wallet);
    })();
  }, [tezos, networkType]);

  const connectWallet = useCallback(async () => {
    if (!wallet) {
      return Promise.resolve(undefined);
    }
    try {
      console.log('Request Permission', networkType, rpcUrl);
      await wallet.client.requestPermissions({
        network: {
          type: networkType,
          rpcUrl: rpcUrl,
        },
        scopes,
      });

      const address = await wallet.getPKH();
      setAddress(address);

      setConnected(true);
      return address;
    } catch (error) {
      setConnected(false);
    }
  }, [wallet, networkType, rpcUrl]);

  const disconnectWallet = useCallback(async () => {
    setConnected(false);
    if (wallet) {
      await wallet.clearActiveAccount();
    }
  }, [wallet]);

  return (
    <BeaconContext.Provider
      value={{
        tezos,
        wallet,
        connected,
        address,
        rpcUrl,
        networkType,
        connectWallet,
        disconnectWallet,
        setNetworkType,
        setRpcUrl,
      }}
    >
      {children}
    </BeaconContext.Provider>
  );
};
