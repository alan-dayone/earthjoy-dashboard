import _ from 'lodash'
import globalRedux from './globalRedux'
import uiStateRedux from './uiStateRedux'
import { isAdmin } from '../../common/models/User'

const actionCreators = {}

actionCreators.getLoginUser = () => async (
  dispatch,
  getState,
  { authService }
) => {
  const user = await authService.getLoginUser()
  dispatch(actionCreators.fetchLoginUserSuccess(user))
  return user
}

actionCreators.loginWithEmail = ({ email, password }) => async (
  dispatch,
  getState,
  { authService }
) => {
  const user = await authService.loginWithEmail({ email, password })
  dispatch(actionCreators.fetchLoginUserSuccess(user))

  if (isAdmin(user)) {
    dispatch(uiStateRedux.fetchAdminSideBarStatus())
  }

  return user
}

actionCreators.signupWithEmail = ({ name, email, password }) => async (
  dispatch,
  getState,
  { authService }
) => {
  const user = await authService.signupWithEmail({ name, email, password })
  dispatch(actionCreators.fetchLoginUserSuccess(user))

  if (isAdmin(user)) {
    dispatch(uiStateRedux.fetchAdminSideBarStatus())
  }

  return user
}

actionCreators.logout = () => async (dispatch, getState, { authService }) => {
  await authService.logout()
  dispatch(actionCreators.fetchLoginUserSuccess(null))
}

actionCreators.updateAccountInfo = ({
  name,
  email,
  preferredLanguage
}) => async (dispatch, getState, { authService }) => {
  await authService.updateAccountInfo({ name, email, preferredLanguage })
  dispatch(
    actionCreators.updateLoginUserSuccess({
      name,
      email,
      preferredLanguage
    })
  )
}

actionCreators.updateAvatar = file => async (
  dispatch,
  getState,
  { authService }
) => {
  const user = await authService.uploadAvatar(file)
  dispatch(
    actionCreators.updateLoginUserSuccess({
      avatar: user.avatar
    })
  )
}

actionCreators.updatePassword = (oldPassword, newPassword) => async (
  dispatch,
  getState,
  { authService }
) => {
  await authService.updatePassword({ oldPassword, newPassword })
}

actionCreators.fetchLoginUserSuccess = user =>
  globalRedux.fetchSuccess({ id: 'loginUser', data: user })

actionCreators.updateLoginUserSuccess = data => (dispatch, getState) => {
  const newUserInfo = {
    ...getState().global.loginUser,
    ...data
  }
  dispatch(actionCreators.fetchLoginUserSuccess(newUserInfo))
}

export default actionCreators

export const selector = {
  getLoginUser: state => _.get(state, 'global.loginUser.data')
}
