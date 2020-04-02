import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {authService} from '../../services';
import {AppThunk} from '../store';
import {LoginCredentials, LoginUser} from '../../models/User';
import {RootState} from './index';

const {reducer, actions} = createSlice({
  name: 'loginUser',
  initialState: null,
  reducers: {
    setLoginUser: (state, action) => action.payload,
  },
});

export const {setLoginUser} = actions;

export const getLoginUser = () => async (dispatch) => {
  const user = await authService.getLoginUser();
  dispatch(actions.setLoginUser(user));
  return user;
};

export const login = (loginForm: LoginCredentials): AppThunk => async (dispatch: Dispatch) => {
  const user = await authService.loginWithEmail(loginForm);
  dispatch(setLoginUser(user));
  return user;
};

export const selectors = {
  selectLoginUser: (state: RootState): LoginUser | null => state.loginUser,
};

export default reducer;
