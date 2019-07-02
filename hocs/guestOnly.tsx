import React from 'react';
import Head from 'next/head';

/* tslint:disable:variable-name */
export const guestOnly = (Content, options?) => {
  class GuestWrapper extends React.Component {
    render() {
      return (
        <div>
          {options.useAdminLayout && (
            <Head>
              <link
                href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
                rel="stylesheet"
                type="text/css"
              />
              <link
                href="https://unpkg.com/@coreui/icons/css/coreui-icons.min.css"
                rel="stylesheet"
                type="text/css"
              />
              <link
                href="https://unpkg.com/@coreui/coreui/dist/css/coreui.min.css"
                rel="stylesheet"
                type="text/css"
              />
            </Head>
          )}
          <Content {...this.props} />
        </div>
      );
    }
  }

  return GuestWrapper;
};
