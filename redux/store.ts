import {createStore, combineReducers, applyMiddleware, DeepPartial} from 'redux';
import thunk from 'redux-thunk';
import {reducer as globalReducer} from './globalRedux';
import * as services from '../services';

export interface TInitialState {
  global: {
    loginUser: {
      id: string;
      data: object | null;
    };
    uiState: {
      id: string;
      data: object | null;
    };
  };
}
const DEFAULT_INITIAL_STATE: DeepPartial<TInitialState> = {
  global: {
    loginUser: {
      id: 'loginUser',
      data: null,
    },
    uiState: {
      id: 'uiState',
      data: {},
    },
  },
};

export const makeStore = (initialState: object) => {
  return createStore(
    combineReducers({
      global: globalReducer,
    }),
    {
      ...DEFAULT_INITIAL_STATE,
      ...initialState,
    },
    applyMiddleware(thunk.withExtraArgument(services)),
  );
};
