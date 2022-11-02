import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayState {
  playerId: string | null;
}

const initialState: PlayState = {
  playerId: null,
};

const slice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setPlayerId(state, action: PayloadAction<string | null>) {
      state.playerId = action.payload;
    },
  }
});

export const { reducer } = slice;

export const { setPlayerId } = slice.actions;
