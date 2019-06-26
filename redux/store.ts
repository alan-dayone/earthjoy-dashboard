import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer as globalReducer } from './globalRedux'
import * as services from '../services'

const DEFAULT_INITIAL_STATE = {
  global: {
    loginUser: {
      id: 'loginUser',
      data: null
    },
    uiState: {
      id: 'uiState',
      data: {}
    }
  }
}

export const makeStore = initialState => {
  return createStore(
    combineReducers({
      global: globalReducer
    }),
    {
      ...DEFAULT_INITIAL_STATE,
      ...initialState
    },
    applyMiddleware(thunk.withExtraArgument(services))
  )
}
