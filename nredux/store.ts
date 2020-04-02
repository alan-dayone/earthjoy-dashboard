import {Action, configureStore, Dispatch, EnhancedStore, ThunkAction} from '@reduxjs/toolkit';
import {ThunkMiddlewareFor} from '@reduxjs/toolkit/src/getDefaultMiddleware';
import {MakeStore} from 'next-redux-wrapper';
import {DispatchForMiddlewares} from '@reduxjs/toolkit/src/tsHelpers';
import rootReducer, {RootState} from './slices';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppDispatch = DispatchForMiddlewares<[ThunkMiddlewareFor<RootState>]> & Dispatch<Action<string>>;
export type AppStore = EnhancedStore<RootState, Action<string>, [ThunkMiddlewareFor<RootState>]>;

export const makeStore: MakeStore = (initialState: RootState): AppStore => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};
