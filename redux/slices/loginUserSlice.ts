import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {authService, accountService} from '../../services';
import {AppThunk} from '../store';
import {LoginCredentials, LoginUser} from '../../models/Account';
import {RootState} from './index';

// Reducers
const slice = createSlice({
  name: 'loginUser',
  initialState: null,
  reducers: {
    setLoginUser: (state, action) => action.payload,
  },
});

export const {reducer, actions} = slice;
// Actions
export const getLoginUser = (): AppThunk<Promise<LoginUser>> => async (
  dispatch: Dispatch,
): Promise<LoginUser> => {
  const user = await authService.getLoginUser();
  dispatch(actions.setLoginUser(user));
  return user;
};

export const updateLoginUserProfile = (
  values: Partial<LoginUser>,
): AppThunk<Promise<void>> => async (
  dispatch: Dispatch,
  getState,
): Promise<void> => {
  const loginUser = getState().loginUser;
  await accountService.updateAccount(loginUser.id, {...values});
  dispatch(actions.setLoginUser({...loginUser, ...values}));
};

export const loginWithEmail = (
  loginForm: LoginCredentials,
): AppThunk<Promise<LoginUser>> => async (
  dispatch: Dispatch,
): Promise<LoginUser> => {
  const user = await authService.loginWithEmail(loginForm);
  dispatch(actions.setLoginUser(user));
  return user;
};

export const logout = (): AppThunk => (dispatch: Dispatch): void => {
  authService.logout();
  dispatch(actions.setLoginUser(null));
};

// Selectors
export const selectors = {
  selectLoginUser: (state: RootState): LoginUser | null => state.loginUser,
};

export default reducer;
