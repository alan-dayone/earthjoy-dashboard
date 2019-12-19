/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Formik } from 'formik';
import { adminOnly } from '../../../hocs';
import { authService } from '../../../services';

class AdminLoginPage extends Component {
  render() {
    return (
      <div id="admin-configurations-smtp-settings-page">
        <Head>
          <title>Admin - Configuration: SMTP settings</title>
        </Head>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <strong>SMTP settings</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="name">SMTP server host</label>
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">SMTP server port</label>
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">SMTP account username</label>
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">SMTP account password</label>
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-sm btn-primary" type="submit">
                  Save
                </button>
                &nbsp;
                <button className="btn btn-sm btn-info">Test connection</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default adminOnly(AdminLoginPage, { useAdminLayout: true });
