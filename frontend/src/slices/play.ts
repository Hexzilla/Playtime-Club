import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayState {
  loading: boolean;
  playerId: string | null;
}

const initialState: PlayState = {
  loading: false,
  playerId: null,
};

const slice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPlayerId(state, action: PayloadAction<string | null>) {
      state.playerId = action.payload;
    },
  }
});

export const { reducer } = slice;

export const { setLoading, setPlayerId } = slice.actions;
