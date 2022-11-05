import { combineReducers } from '@reduxjs/toolkit';
import { reducer as playReducer } from '../slices/play';

export const rootReducer = combineReducers({
  play: playReducer,
});
