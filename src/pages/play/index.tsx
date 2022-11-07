import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Box, Card, CardContent, Container } from '@mui/material';
import { io } from 'socket.io-client';
//import { Unity, useUnityContext } from "react-unity-webgl";
import useInterval from 'hooks/useInterval';
import { BaseUrl } from 'configs';
import { RootState } from 'store';
import { setLoading, setConnected, setPlayerId } from 'slices/play';
import TezosBoard from '../../components/play/playtime-tezos';
//import SolanaBoard from '../../components/play/playtime-solana';

console.log('BaseUrl', BaseUrl)
const socket = io(BaseUrl);

// const unityConfig = {
//   loaderUrl: "Build/public.loader.js",
//   dataUrl: "Build/public.data",
//   frameworkUrl: "Build/public.framework.js",
//   codeUrl: "Build/public.wasm",
// };

const Play = () => {
  const dispatch = useDispatch();
  //const wallet = useWallet();
  //const unityContext = useUnityContext(unityConfig);
  //const { sendMessage, addEventListener, removeEventListener } = unityContext;
  const { connected } = useSelector((state: RootState) => state.play);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
      toast.success('Connected server');
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      dispatch(setConnected(false));
    });

    socket.on('PONG', () => {
      console.log('PONG');
    });

    socket.on('JOIN_SUCCESS', (playerId) => {
      dispatch(setLoading(false));
      dispatch(setPlayerId(playerId));
      toast.success('You has been joined successfully');
    });

    socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('PONG');
      socket.off('JOIN_SUCCESS');
    };
  }, [dispatch]);

  const sendPing = () => {
    connected && socket.emit('PING');
  };

  useInterval(() => {
    sendPing();
  }, 5000);

  return (
    <>
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
            <TezosBoard socket={socket} />
          </Card>
          {/* <Card sx={{ mt: 3 }}>
            <SolanaBoard socket={socket} />
          </Card> */}
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

export default Play;
