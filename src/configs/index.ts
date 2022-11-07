import { NetworkType } from "@airgap/beacon-sdk";

export const BaseUrl = process.env.REACT_APP_API_URL || 'https://grat.fun';

export const Admin = "tz1bxwduvRwBhq59FmThGKD5ceDFadr57JTq";

export const Mainnet = {
  NetworkType: NetworkType.MAINNET,
  RpcUrl: "https://mainnet.tezos.marigold.dev",
  RpcList: [
    "https://mainnet.tezos.marigold.dev",
  ],
  TezRun: "KT1TK9GheViS3Z8hJSjZnBo7324rXnFtnYGC", //"KT1EEtxiV2qpGrQbG61gCB3gtVWiARxbEv1d",
  uUSD: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
};

export const Testnet = {
  NetworkType: NetworkType.JAKARTANET,
  RpcUrl: "https://jakartanet.tezos.marigold.dev",
  RpcList: [
    "https://jakartanet.tezos.marigold.dev"
  ],
  TezRun: "KT1QqTCsHghND8gfeG55w2pWCskZpFFgjVCV",
  uUSD: "KT1Xf83TTyDDxYxr1x2jKFjHXcCsD4RSnaE5",
};
