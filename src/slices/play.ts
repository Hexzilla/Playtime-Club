import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayState {
  loading: boolean;
  connected: boolean;
  playerId: string | null;
  roomId: number | null;
  startTime: string | null;
}

const initialState: PlayState = {
  loading: false,
  connected: false,
  playerId: null,
  roomId: 0,
  startTime: null,
};

const slice = createSlice({
  name: "play",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
      if (!state.connected) {
        state.playerId = null;
      }
    },
    setPlayerId(state, action: PayloadAction<string | null>) {
      state.playerId = action.payload;
    },
    setRoomId(state, action: PayloadAction<string | null>) {
      state.roomId = Number(action.payload);
    },
    setStartTime(state, action: PayloadAction<string | null>) {
      state.startTime = action.payload;
    },
    setOpenRoom(state, action: PayloadAction<string | null>) {
      const item = JSON.parse(action.payload!);
      state.roomId = item.id;
      state.startTime = item.startTime;
    },
    setJoinedRoom(state, action: PayloadAction<string | null>) {
      const item = JSON.parse(action.payload!);
      state.playerId = item.playerId;
      state.roomId = item.roomId;
      state.startTime = item.startTime;
    },
  },
});

export const { reducer } = slice;

export const {
  setLoading,
  setConnected,
  setPlayerId,
  setRoomId,
  setStartTime,
  setJoinedRoom,
  setOpenRoom,
} = slice.actions;
