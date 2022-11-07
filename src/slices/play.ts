import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayState {
  loading: boolean;
  connected: boolean;
  playerId: string | null;
}

const initialState: PlayState = {
  loading: false,
  connected: false,
  playerId: null,
};

const slice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setPlayerId(state, action: PayloadAction<string | null>) {
      state.playerId = action.payload;
    },
  }
});

export const { reducer } = slice;

export const { setLoading, setConnected, setPlayerId } = slice.actions;
