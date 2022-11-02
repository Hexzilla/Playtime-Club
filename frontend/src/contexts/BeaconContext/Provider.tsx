import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ContractAbstraction, TezosToolkit, Wallet } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { PermissionScope } from '@airgap/beacon-sdk';
import { BeaconEvent, defaultEventCallbacks } from '@airgap/beacon-sdk';
import { Testnet, Mainnet } from 'configs';
import { BeaconContextApi } from './types';
import { useEffect } from 'react';

export const BeaconContext = createContext<BeaconContextApi>(
  {} as BeaconContextApi
);

const scopes: PermissionScope[] = [
  PermissionScope.OPERATION_REQUEST,
  PermissionScope.SIGN,
];

type WalletType = ContractAbstraction<Wallet> | undefined;

export const BeaconProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit(Mainnet.RpcUrl)
  );
  const [networkType, setNetworkType] = useState(Mainnet.NetworkType);
  const [rpcUrl, setRpcUrl] = useState(Mainnet.RpcUrl);
  const [wallet, setWallet] = useState<BeaconWallet | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [connected, setConnected] = useState<boolean>(false);
  const [contract, setContract] = useState<WalletType>(undefined);

  useEffect(() => {
    setAddress(undefined);
    setConnected(false);
    setContract(undefined);
    setTezos(new TezosToolkit(rpcUrl));
  }, [rpcUrl, setTezos]);

  useEffect(() => {
    const createWallet = async () => {
      if (wallet) {
        await wallet.client.destroy();
        await wallet.disconnect();
      }

      const _wallet = new BeaconWallet({
        name: 'Teo Run',
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
    };
    createWallet();
  }, [tezos, networkType]);

  useEffect(() => {
    const getContracts = async () => {
      const contractAddress =
        networkType === Testnet.NetworkType ? Testnet.TezRun : Mainnet.TezRun;
      console.log('contractAddress', contractAddress);
      const contract = await tezos.wallet.at(contractAddress);
      console.log('TezRun Contract', contract);
      setContract(contract);
    };
    connected && getContracts();
  }, [tezos, connected, networkType]);

  const connectWallet = useCallback(async () => {
    if (wallet) {
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
        console.log('userAddress', address);
        setAddress(address);

        setConnected(true);
        return address;
      } catch (error) {
        console.error(error);
        setConnected(false);
      }
    }
    return Promise.resolve(undefined);
  }, [wallet, networkType, rpcUrl]);

  const disconnectWallet = async (): Promise<void> => {
    setConnected(false);
    if (wallet) {
      //await wallet.client.removeAllAccounts();
      //await wallet.client.removeAllPeers();
      await wallet.client.destroy();
      await wallet.disconnect();
    }
  };

  return (
    <BeaconContext.Provider
      value={{
        tezos,
        wallet,
        connected,
        address,
        contract,
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
