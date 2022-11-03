import { ContractAbstraction, TezosToolkit, Wallet } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";

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
