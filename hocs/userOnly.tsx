import React from 'react';
import {connect, ConnectedComponent} from 'react-redux';
import {AnyAction, compose} from 'redux';
import Cookies from 'js-cookie';
import {actions as authRedux, selectors} from '../redux/authRedux';
import {authService} from '../services/';
import {withRouter} from 'next/router';
import {NextComponentType} from "next";
import {ExpressReduxNextContext} from "./types";
import {CommonThunkDispatch, RootState} from "../redux/types";
import {WithRouterProps} from "next/dist/client/with-router";
//
// interface PropTypes {
//   token: string;
// }

/* tslint:disable-next-line:variable-name */
export const userOnly = (Content: NextComponentType):
    ConnectedComponent<any, NextComponentType> => {
  class UserWrapper extends React.Component<any> {
    public static async getInitialProps(context: ExpressReduxNextContext & WithRouterProps) {
      const props = context;
      let currentUser = {};
      let token = '';
      const initialProps = Content.getInitialProps ? await Content.getInitialProps(props) : {};
      const dispatch = context.store?.dispatch as CommonThunkDispatch<AnyAction>;
      if (context.isServer) {
        if (!context.req?.cookies.jwt) {
          context.res?.redirect('/admin/login');
          return initialProps;
        }
        authService.setAccessToken(context.req.cookies.jwt);
        token = context.req.cookies.jwt;
        const user = await dispatch(authRedux.getLoginUser());
        currentUser = user;
        if (!user) {
          context.res?.redirect('/admin/login');
          context.res?.end();
        }
      } else {
        let user = selectors.getLoginUser(context.store?.getState());
        if (!user) {
          user = await dispatch(authRedux.getLoginUser());
        }
        currentUser = user;
        token = Cookies.get('jwt') || '';
        if (!user) {
          const {router} = context;
          router.push('/admin/login');
        }
      }
      return {
        ...initialProps,
        token,
        currentUser,
      };
    }

    public componentDidMount() {
      if (!this.props.token) {
        const {router} = this.props;
        router.replace('/admin/login');
      }
    }

    public render() {
      if (!this.props.token) {
        return null;
      }

      return <Content {...this.props} />;
    }
  }

  return composedHoc(withRouter(UserWrapper));
};

const mapStateToProps = (state: RootState) => ({
  currentUser: selectors.getLoginUser(state),
});
const composedHoc = compose(connect(mapStateToProps));
