/* tslint:disable:variable-name */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NextComponentType } from 'next';
import Router from 'next/router';

import { selectors } from '../../redux/authRedux';
import { actions as authRedux } from '../../redux/authRedux';
import { authService } from '../../services';
// import { Router } from '../../routes';
import { AdminLayoutWrapper } from './AdminLayoutWrapper';

export const guestOnly = (
  Content: NextComponentType,
  options?: { useAdminLayout: boolean }
) => {
  class GuestWrapper extends React.Component {
    static async getInitialProps(context) {
      const props = {
        req: context.req,
        res: context.res,
        store: context.store,
        isServer: context.isServer,
      };

      if (context.isServer) {
        const jwt = context.req.cookies.jwt;

        if (jwt) {
          authService.setAccessToken(jwt);
          const user = await context.store.dispatch(authRedux.getLoginUser());

          if (user) {
            context.res.redirect('/');
            context.res.end();
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
      return (
        <AdminLayoutWrapper>
          <Content {...this.props} />
        </AdminLayoutWrapper>
      );
    };
  }

  return composedHoc(GuestWrapper);
};

const mapStateToProps = state => ({
  currentUser: selectors.getLoginUser(state),
});
const composedHoc = compose(connect(mapStateToProps));
