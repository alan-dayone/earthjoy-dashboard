/* tslint:disable:no-default-export */
import React from 'react';
import Head from 'next/head';
import {NextComponentType} from 'next';
import {everyone} from '../hocs';
import {authService} from '../services';
import {CustomNextPageContext} from '../hocs/types';

interface PageProps {
  verified: boolean;
}

const AccountVerificationPage: NextComponentType<
  CustomNextPageContext,
  {},
  PageProps
> = ({verified}) => (
  <div className="container">
    <Head>
      <title>Account verification</title>
    </Head>
    {verified ? (
      <div className="alert alert-success">
        Your account has been verified successfully.
      </div>
    ) : (
      <div className="alert alert-danger">Failed to verify account.</div>
    )}
  </div>
);

AccountVerificationPage.getInitialProps = async ({
  query,
}): Promise<PageProps> => {
  const accountVerificationToken = query.token as string;

  if (!accountVerificationToken) {
    return {verified: false};
  }

  const verified = await authService.verifyAccount(accountVerificationToken);
  return {verified};
};

export default everyone(AccountVerificationPage);
