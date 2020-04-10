import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {MakeStore} from 'next-redux-wrapper';
import rootReducer, {RootState} from './slices';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const dummyStoreToGetType = configureStore({reducer: rootReducer});
export type AppStore = typeof dummyStoreToGetType;
export type AppDispatch = typeof dummyStoreToGetType.dispatch;

export const makeStore: MakeStore = (initialState: RootState): AppStore => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};
