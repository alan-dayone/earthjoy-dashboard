import {combineReducers} from 'redux';
import loginUserReducer from './loginUserSlice';

const rootReducer = combineReducers({
  loginUser: loginUserReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
