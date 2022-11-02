import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import bs58 from 'bs58';
import toast from 'react-hot-toast';
import { Button, CardContent, Grid } from '@mui/material';
import { RootState } from 'store';
import { setLoading } from 'slices/play';
import useBeacon from 'hooks/useBeacon';

const TezosBoard = ({ socket }) => {
  const dispatch = useDispatch();
  const { address, connectWallet } = useBeacon();
  const { loading, connected, playerId } = useSelector(
    (state: RootState) => state.play
  );

  const handleJoin = async () => {
    try {
      dispatch(setLoading(true));

      const walletAddress = address ? address : await connectWallet();
      console.log('walletAddress', address, walletAddress)
      if (!walletAddress) {
        return;
      }

      if (!connected) {
        toast.error('Cannot connect server!');
        return;
      }

      /*const encoder = new TextEncoder();
      const plainText = JSON.stringify({
        message: 'Join Room',
        address: publicKey.toString(),
        date: new Date(),
      });

      if (!wallet.signMessage) {
        console.log('Unable to sign using this wallet');
        return;
      }

      const signed = await wallet.signMessage(encoder.encode(plainText));
      console.log('signature', signed);

      const signature = bs58.encode(signed);
      console.log('signed_message', signature);

      const message = {
        address: publicKey.toString(),
        signature,
      };

      setTimeout(() => {
        socket?.emit('JOIN', message);
      }, 1);*/
    } catch (err) {
      console.error(err);
      dispatch(setLoading(false));
      toast.error('Something went wrong!');
    }
  };

  return (
    <CardContent>
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          <div>Playtime</div>
          <div>You need an Tezos Playtime.club NFT to play. Buy Here</div>
        </Grid>
        <Grid item sm={2} xs={6}>
          <Button
            disabled={loading}
            type="button"
            variant="contained"
            size="large"
          >
            {'Detail'}
          </Button>
        </Grid>
        <Grid item sm={2} xs={12}>
          <Button
            disabled={loading || !!playerId}
            type="button"
            variant="contained"
            size="large"
            onClick={handleJoin}
          >
            {'Join'}
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TezosBoard;
