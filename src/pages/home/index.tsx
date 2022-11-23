import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AbortedBeaconError } from "@airgap/beacon-sdk";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RootState } from "store";
import * as actions from "slices/play";
import useBeacon from "hooks/useBeacon";
import useSocket from "hooks/useSocket";
import { requestSign } from "utils/tezos-wallet";
import { MainLayout } from "components/main-layout";
import { CountDown } from "components/countdown";

const StyledButton = styled(Button)(() => ({
  width: 160,
}));

const Home = () => {
  const dispatch = useDispatch();
  const { connected, startTime } = useSelector((state: RootState) => state.play);
  const { socket } = useSocket();
  const { wallet, publicKey, address: walletAddress } = useBeacon();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      toast.success("Connected server");
      dispatch(actions.setConnected(true));
      socket.emit("GET_ROOM");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(actions.setConnected(false));
      dispatch(actions.setPlayerId(null));
    });

    socket.on("PONG", () => {
      console.log("PONG");
    });

    socket.on("JOIN_SUCCESS", (msg) => {
      console.log("join-result", msg);
      const result = JSON.parse(msg);
      dispatch(actions.setLoading(false));
      dispatch(actions.setPlayerId(result.playerId));
      dispatch(actions.setRoomId(result.roomId));
      dispatch(actions.setStartTime(result.startTime));
      toast.success("You has been joined successfully");
      setTimeout(() => redirect('/play'), 1000);
    });

    socket.on("ROOM_INFO", (msg) => {
      const room = JSON.parse(msg);
      console.log("room-info", room);
      dispatch(actions.setRoomId(room.id));
      dispatch(actions.setStartTime(room.startTime));
    });

    socket.on("START_GAME", (msg) => {
      console.log("start-game", msg);
      toast.success("Game started");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("PONG");
      socket.off("JOIN_SUCCESS");
    };
  }, [dispatch]);

  const joinGame = async () => {
    try {
      if (!walletAddress) {
        toast.error("Please connect your wallet");
        return;
      }

      // Check if socket is connected.
      if (!connected) {
        toast.error("Cannot connect server!");
        return;
      }

      // Update loading state.
      dispatch(actions.setLoading(true));

      const dappUrl = "playtime.com";
      const payload: string = [
        "Tezos Signed Message:",
        dappUrl,
        new Date().toISOString(),
        `${dappUrl} would like to join room with ${walletAddress}`,
      ].join(" ");

      const signed = await requestSign(wallet!, walletAddress!, payload);
      console.log("signed", signed);
      if (signed) {
        const { signature } = signed;

        setTimeout(() => {
          const request = {
            network: "tez",
            publicKey,
            address: walletAddress,
            message: payload,
            signature,
          };
          socket?.emit("JOIN", JSON.stringify(request));
        }, 1);
      }
    } catch (err: any) {
      console.error(err);
      if (err instanceof AbortedBeaconError) {
        toast.error(err.description);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  return (
    <MainLayout>
      <div style={{ minHeight: "100vh" }}>
        <Grid mt={6} sx={{ flexGrow: 1 }} container spacing={2}>
          <CountDown startTime={startTime}></CountDown>
          <Grid item mt={8} xs={12}>
            <Grid container justifyContent="center" spacing={1}>
              <Box sx={{ mt: 1 }}>
                <StyledButton
                  size="large"
                  variant="outlined"
                  onClick={joinGame}
                >
                  JOIN GAME
                </StyledButton>
              </Box>
            </Grid>
            <Grid container justifyContent="center" spacing={1}>
              <Box sx={{ mt: 2 }}>
                <StyledButton size="large" variant="outlined">
                  BUY NFT
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MainLayout>
  );
};

export default Home;
