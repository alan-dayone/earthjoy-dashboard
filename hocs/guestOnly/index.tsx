import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {NextComponentType} from 'next';
import Router from 'next/router';

import {selectors} from '../../redux/authRedux';
import {actions as authRedux} from '../../redux/authRedux';
import {authService} from '../../services';
import {adminLayoutWrapper} from './AdminLayoutWrapper';
import {ExpressReduxNextContext} from '../types';

export const guestOnly = (Content: NextComponentType, options?: {useAdminLayout: boolean}): typeof React.Component => {
  class GuestWrapper extends React.Component {
    static async getInitialProps(context: ExpressReduxNextContext) {
      if (context.isServer) {
        const jwt = context.req?.cookies.jwt;

        if (jwt) {
          authService.setAccessToken(jwt);
          const user = await context.store?.dispatch(authRedux.getLoginUser());

          if (user) {
            context.res?.redirect('/');
            context.res?.end();
            return;
          }
        }
      } else {
        const user = selectors.getLoginUser(context.store.getState());

        if (user) {
          Router.replace('/');
          return;
        }
      }

      return Content.getInitialProps ? Content.getInitialProps(context) : {};
    }

    render() {
      if (options && options.useAdminLayout) {
        return this._renderContentInsideAdminLayout();
      }

      return <Content {...this.props} />;
    }

    _renderContentInsideAdminLayout = () => {
      return adminLayoutWrapper({children: <Content {...this.props} />});
    };
  }

  return composedHoc(GuestWrapper);
};

const mapStateToProps = (state) => ({
  currentUser: selectors.getLoginUser(state),
});
const composedHoc = compose(connect(mapStateToProps));
