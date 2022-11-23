import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Box, Card, CardContent, Container } from "@mui/material";
import { Unity, useUnityContext } from "react-unity-webgl";
import { RootState } from "store";
import * as actions from "slices/play";
import useSocket from "hooks/useSocket";
import TezosBoard from "components/play/playtime-tezos";

const unityConfig = {
  loaderUrl: "Build/public.loader.js",
  dataUrl: "Build/public.data",
  frameworkUrl: "Build/public.framework.js",
  codeUrl: "Build/public.wasm",
};

const Play = () => {
  const dispatch = useDispatch();
  //const wallet = useWallet();
  const unityContext = useUnityContext(unityConfig);
  //const { sendMessage, addEventListener, removeEventListener } = unityContext;
  const { connected } = useSelector((state: RootState) => state.play);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("START_GAME", (msg) => {
      console.log("start-game", msg);
      toast.success("Game started");
    });

    return () => {
      socket.off("START_GAME");
    };
  }, [dispatch]);

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
                display: "flex",
                justifyContent: "center",
                minHeight: "540px",
              }}
            >
              <Unity
                unityProvider={unityContext.unityProvider}
                style={{
                  height: 540,
                  width: 950,
                  background: "#555",
                }}
              />
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
