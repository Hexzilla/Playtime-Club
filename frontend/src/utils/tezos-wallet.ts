import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { char2Bytes } from '@taquito/utils';

export const requestSign = (
  wallet: BeaconWallet,
  sourceAddress: string,
  message: string
) => {
  const bytes = char2Bytes(message);
  const payloadBytes =
    '0501' + char2Bytes(bytes.length.toString()) + bytes;

  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress,
  };
  return wallet.client.requestSignPayload(payload);
};
