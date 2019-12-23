/* tslint:disable:variable-name */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NextComponentType, NextContext } from 'next';
import { SingletonRouter } from 'next/router';

import { selectors } from '../../redux/authRedux';
import { actions as authRedux } from '../../redux/authRedux';
import { authService } from '../../services';
// import { Router } from '../../routes';
import { AdminLayoutWrapper } from './AdminLayoutWrapper';

interface PropTypes {
  router: SingletonRouter;
}

export const guestOnly = (
  Content: NextComponentType,
  options?: { useAdminLayout: boolean }
) => {
  class GuestWrapper extends React.Component<PropTypes> {
    static async getInitialProps(context) {
      const props = {
        req: context.req,
        res: context.res,
        store: context.store,
        isServer: context.isServer,
      };
      const initialProps = Content.getInitialProps
        ? await Content.getInitialProps(props)
        : {};
      if (context.isServer) {
        if (!context.req.cookies.access_token) {
          return initialProps;
        }
        authService.setAccessToken(context.req.cookies.access_token);
        const user = await context.store.dispatch(authRedux.getLoginUser());
        if (user) {
          context.res.redirect('/');
          context.res.end();
        }
      } else {
        const user = selectors.getLoginUser(context.store.getState());
        if (user) {
          // Router.pushRoute('/');
        }
      }
      return { ...initialProps };
    }

    componentDidMount() {
      if (this.props.token) {
        // Router.replaceRoute('/');
      }
    }

    render() {
      if (options && options.useAdminLayout) {
        return this._renderContentInsideAdminLayout();
      }

      if (this.props.token) {
        return null;
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
