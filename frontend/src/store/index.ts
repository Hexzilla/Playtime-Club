import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
