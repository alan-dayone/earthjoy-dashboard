import React from 'react'
import Head from 'next/head'
import { Link } from '../routes'

export const everyone = Content => {
  class Wrapper extends React.Component {
    render () {
      return (
        <div>
          <Head>
            <title>NextJs Boilerplate</title>
            <link
              rel='stylesheet'
              href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
              integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T'
              crossOrigin='anonymous'
            />
          </Head>
          {this._renderNavBar()}
          <Content {...this.props} />
          {this._renderFooter()}
        </div>
      )
    }

    _renderNavBar = () => {
      return (
        <header className='app-navbar navbar navbar-expand navbar-dark'>
          <div className='navbar-nav-scroll'>
            <ul className='navbar-nav bd-navbar-nav'>
              <li className='nav-item'>
                <Link route='/admin/login'>
                  <a className='nav-link active'>common:home</a>
                </Link>
              </li>
            </ul>
          </div>
        </header>
      )
    }

    _renderFooter = () => {
      return (
        <footer className='app-footer text-muted'>
          <div className='container-fluid p-3 p-md-5'>
            <ul className='bd-footer-links'>
              <li>
                <a href='https://gitlab.com/dayone-teams/int-boilerplates/int-loopnext'>
                  GitLab
                </a>
              </li>
              <li>
                <a href='https://www.dayoneteams.com' target='_blank'>
                  About
                </a>
              </li>
            </ul>
            <p>
              Designed and built with all the love in the world by&nbsp;
              <a href='http://www.dayoneteams.com' target='_blank'>
                DayOne Teams
              </a>
            </p>
          </div>
        </footer>
      )
    }
  }

  return Wrapper
}
