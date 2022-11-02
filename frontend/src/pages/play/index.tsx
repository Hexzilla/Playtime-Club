import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import bs58 from 'bs58';
import toast from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box, Button, Card, CardContent, Container, Grid } from '@mui/material';
import { io } from 'socket.io-client';
//import { Unity, useUnityContext } from "react-unity-webgl";
import { DashboardLayout } from '../../components/play/dashboard-layout';
import useInterval from 'hooks/useInterval';
import { RootState } from 'store';
import { setLoading, setPlayerId } from 'slices/play';

const socket = io('http://localhost:8000');

// const unityConfig = {
//   loaderUrl: "Build/public.loader.js",
//   dataUrl: "Build/public.data",
//   frameworkUrl: "Build/public.framework.js",
//   codeUrl: "Build/public.wasm",
// };

const SolanaBoard = () => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const { loading, connected, playerId } = useSelector((state: RootState) => state.play);

  const handleJoin = async () => {
    try {
      const publicKey = wallet.publicKey;
      if (!publicKey) {
        toast.error('No key associated with the wallet');
        return;
      }

      if (!connected) {
        toast.error('Cannot connect server!');
        return;
      }

      const encoder = new TextEncoder();
      const plainText = JSON.stringify({
        message: 'Join Room',
        address: publicKey.toString(),
        date: new Date(),
      });

      if (!wallet.signMessage) {
        console.log('Unable to sign using this wallet');
        return;
      }

      dispatch(setLoading(true));

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
      }, 1);
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
          <div>You need an SOL Playtime.club NFT to play. Buy Here</div>
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

const Play = () => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  //const unityContext = useUnityContext(unityConfig);
  //const { sendMessage, addEventListener, removeEventListener } = unityContext;
  const { loading, connected, playerId } = useSelector((state: RootState) => state.play);

  useEffect(() => {
    dispatch(setLoading(socket.connected));

    socket.on('connect', () => {
      console.log('connected');
      dispatch(setLoading(true));
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      dispatch(setLoading(false));
    });

    socket.on('PONG', () => {
      console.log('PONG');
    });

    socket.on('JOIN_SUCCESS', onJoinRoom);

    socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('PONG');
      socket.off('JOIN_SUCCESS');
    };
  }, []);

  const sendPing = () => {
    connected && socket.emit('PING');
  };

  useInterval(() => {
    sendPing();
  }, 5000);

  const onJoinRoom = (playerId) => {
    console.log('onJoinRoom', playerId, loading);
    dispatch(setLoading(false));
    dispatch(setPlayerId(playerId));
    toast.success('You has been joined successfully');
  };

  return (
    <>
      <Head>
        <title>Play</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: '540px',
              }}
            >
              Unity Component
              {/* <Unity
                unityProvider={unityContext.unityProvider}
                style={{
                  height: 540,
                  width: 950,
                  background: "#555",
                }}
              /> */}
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }}>
            <SolanaBoard />
          </Card>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              {/* <WidgetPreviewer
                element={<Table6 />}
                name="Table with search bar and select box"
              /> */}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Play.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Play;
