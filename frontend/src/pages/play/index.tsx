import React, { useEffect, useState } from "react";
import Head from "next/head";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, Card, CardContent, Container, Grid } from "@mui/material";
import { io } from "socket.io-client";
//import { Unity, useUnityContext } from "react-unity-webgl";
import { DashboardLayout } from "../../components/play/dashboard-layout";
import useInterval from "hooks/useInterval";

const socket = io("http://localhost:8000");

// const unityConfig = {
//   loaderUrl: "Build/public.loader.js",
//   dataUrl: "Build/public.data",
//   frameworkUrl: "Build/public.framework.js",
//   codeUrl: "Build/public.wasm",
// };

const Play = () => {
  const wallet = useWallet();
  //const unityContext = useUnityContext(unityConfig);
  //const { sendMessage, addEventListener, removeEventListener } = unityContext;
  const [displayBanner, setDisplayBanner] = useState(true);
  const [isConnected, setIsConnected] = useState(socket?.connected);

  useEffect(() => {
    // Restore the persistent state from local/session storage
    const value = globalThis.sessionStorage.getItem("dismiss-banner");
    if (value === "true") {
      // setDisplayBanner(false);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
        setIsConnected(false);
      });

      socket.on("PONG", () => {
        console.log("PONG");
      });

      socket.connect();

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("PONG");
      };
    }
  }, [socket]);

  const sendPing = () => {
    if (socket && isConnected) {
      socket.emit("PING");
    }
  };

  useInterval(() => {
    sendPing();
  }, 5000);

  const handleJoin = async () => {
    try {
      const publicKey = wallet.publicKey;
      if (!publicKey) {
        console.log("No key associated with the wallet");
        return;
      }

      const encoder = new TextEncoder();
      const plainText = JSON.stringify({
        message: "Join Room",
        address: publicKey.toString(),
        date: new Date(),
      });

      if (!wallet.signMessage) {
        console.log("Unable to sign using this wallet");
        return;
      }

      const signed = await wallet.signMessage(encoder.encode(plainText));
      console.log("signature", signed);

      const signature = bs58.encode(signed);
      console.log("signed_message", signature);

      if (isConnected) {
        const message = {
          address: publicKey.toString(),
          signature,
        };
        socket?.emit("JOIN", message);
      }
    } catch (err) {
      console.error(err);
    }
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
            <CardContent sx={{ display: "flex", justifyContent: "center" }}>
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
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={2} xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Detail
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    onClick={handleJoin}
                  >
                    Join
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
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
