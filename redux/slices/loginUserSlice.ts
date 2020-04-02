import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {authService} from '../../services';
import {AppThunk} from '../store';
import {LoginCredentials, LoginUser} from '../../models/Account';
import {RootState} from './index';

// Reducers
const {reducer, actions} = createSlice({
  name: 'loginUser',
  initialState: null,
  reducers: {
    setLoginUser: (state, action): LoginUser | null => action.payload,
  },
});

// Actions
export const {setLoginUser} = actions;

export const getLoginUser = (): AppThunk<Promise<LoginUser>> => async (
  dispatch: Dispatch,
): Promise<LoginUser> => {
  const user = await authService.getLoginUser();
  dispatch(actions.setLoginUser(user));
  return user;
};

export const loginWithEmail = (
  loginForm: LoginCredentials,
): AppThunk<Promise<LoginUser>> => async (
  dispatch: Dispatch,
): Promise<LoginUser> => {
  const user = await authService.loginWithEmail(loginForm);
  dispatch(setLoginUser(user));
  return user;
};

// Selectors
export const selectors = {
  selectLoginUser: (state: RootState): LoginUser | null => state.loginUser,
};

export default reducer;
