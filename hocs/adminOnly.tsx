import React from 'react'
import Head from 'next/head'

export const adminOnly = Content => {
  class AdminWrapper extends React.Component {
    render () {
      return (
        <div>
          <Head>
            <link
              href='https://use.fontawesome.com/releases/v5.3.1/css/all.css'
              rel='stylesheet'
              type='text/css'
            />
            <link
              href='https://unpkg.com/@coreui/icons/css/coreui-icons.min.css'
              rel='stylesheet'
              type='text/css'
            />
            <link
              href='https://unpkg.com/@coreui/coreui/dist/css/coreui.min.css'
              rel='stylesheet'
              type='text/css'
            />
          </Head>
          <Content {...this.props} />
        </div>
      )
    }
  }

  return AdminWrapper
}
