import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { io } from 'socket.io-client';
import { BaseUrl } from 'configs';
import { RootState } from 'store';
import * as actions from 'slices/play';
import CountDown from "components/countdown";

const StyledButton = styled(Button)(() => ({
  width: 160,
}));

const socket = io(BaseUrl);

const Home = () => {
  const dispatch = useDispatch();
  const { startTime } = useSelector((state: RootState) => state.play);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
      toast.success('Connected server');
      dispatch(actions.setConnected(true));
      socket.emit('GET_ROOM');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      dispatch(actions.setConnected(false));
      dispatch(actions.setPlayerId(null));
    });

    socket.on('PONG', () => {
      console.log('PONG');
    });

    socket.on('JOIN_SUCCESS', (msg) => {
      console.log('join-result', msg)
      const result = JSON.parse(msg);
      dispatch(actions.setLoading(false));
      dispatch(actions.setPlayerId(result.playerId));
      dispatch(actions.setRoomId(result.roomId));
      dispatch(actions.setStartTime(result.startTime));
      toast.success('You has been joined successfully');
    });
    
    socket.on('ROOM_INFO', (msg) => {
      const room = JSON.parse(msg);
      console.log('room-info', room)
      dispatch(actions.setRoomId(room.id));
      dispatch(actions.setStartTime(room.startTime));
    });

    socket.on('START_GAME', (msg) => {
      console.log('start-game', msg);
      toast.success('Game started');
    });

    socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('PONG');
      socket.off('JOIN_SUCCESS');
    };
  }, [dispatch]);

  return (
    <Grid mt={6} sx={{ flexGrow: 1 }} container spacing={2}>
      <CountDown startTime={startTime}></CountDown>
      <Grid item mt={8} xs={12}>
        <Grid container justifyContent="center" spacing={1}>
          <Box sx={{ mt: 1 }}>
            <StyledButton size="large" variant="outlined">
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
  );
};

export default Home;
