import React from 'react'
import { compose } from 'redux'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../redux/store'
// import nprogress from '../hocs/nprogress'
import '../scss/style.scss'

class ComposedApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  render () {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default compose(
  // nprogress(300, { showSpinner: false }),
  withRedux(makeStore)
)(ComposedApp)
