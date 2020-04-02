import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {MakeStore} from 'next-redux-wrapper';
import rootReducer, {RootState} from './slices';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const makeStore: MakeStore = (initialState: RootState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};
