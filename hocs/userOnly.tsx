import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Cookies from 'js-cookie';
import { actions as authRedux, selectors } from '../redux/authRedux';
import { authService } from '../services/';
import Router from 'next/router';

interface PropTypes {
  token: string;
  router: unknown;
}

/* tslint:disable-next-line:variable-name */
export const userOnly = Content => {
  class UserWrapper extends React.Component<PropTypes> {
    static async getInitialProps(context) {
      const props = {
        req: context.req,
        res: context.res,
        store: context.store,
        isServer: context.isServer,
      };
      let currentUser = {};
      let token = '';
      const initialProps = Content.getInitialProps
        ? await Content.getInitialProps(props)
        : {};
      if (context.isServer) {
        if (!context.req.cookies.access_token) {
          context.res.redirect('/admin/login');
          return initialProps;
        }
        authService.setAccessToken(context.req.cookies.access_token);
        token = context.req.cookies.access_token;
        const user = await context.store.dispatch(authRedux.getLoginUser());
        currentUser = user;
        if (!user) {
          context.res.redirect('/admin/login');
          context.res.end();
        }
      } else {
        let user = selectors.getLoginUser(context.store.getState());
        if (!user) {
          user = await context.store.dispatch(authRedux.getLoginUser());
        }
        currentUser = user;
        token = Cookies.get('access_token') || '';
        if (!user) {
          Router.push('/admin/login');
        }
      }
      return {
        ...initialProps,
        token,
        currentUser,
      };
    }

    componentDidMount() {
      if (!this.props.token) {
        Router.replace('/admin/login');
      }
    }

    render() {
      if (!this.props.token) {
        return null;
      }

      return <Content {...this.props} />;
    }
  }

  return composedHoc(UserWrapper);
};

const mapStateToProps = state => ({
  currentUser: selectors.getLoginUser(state),
});
const composedHoc = compose(connect(mapStateToProps));
