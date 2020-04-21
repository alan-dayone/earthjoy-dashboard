import React, {useEffect, useState, FC} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers} from 'formik';
import toastr from 'toastr';
import _isEqual from 'lodash/isEqual';
import Router from 'next/router';
import {adminOnly} from '../../hocs';
import {Account, LoginUser} from '../../models/Account';
import {accountService} from '../../services';
import {FormGroup} from '../../components/admin/FormGroup';
import {AccountStatusLabel} from '../../components/admin/AccountStatusLabel';
import {AccountEmailVerificationLabel} from '../../components/admin/AccountEmailVerificationLabel';
import {
  adminResetNewPasswordFormSchema,
  adminUpdateProfileSchema,
} from '../../view-models/Account';

interface Props {
  loginUser: LoginUser;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ProfilePage: FC<Props> = (props: Props) => {
  console.log(props);
  const {loginUser} = props;
  const [profile, setProfile] = useState<Account>({
    email: '',
    emailVerified: undefined,
    firstName: '',
    lastName: '',
    status: undefined,
  });
  useEffect(() => {
    (async (): Promise<void> => {
      const userProfile = await accountService.findOneForAdmin(loginUser?.id);
      setProfile(userProfile);
    })();
  }, [loginUser]);

  const handleUpdateProfile = async (
    values: Account,
    formikHelpers: FormikHelpers<Account>,
  ): Promise<void> => {
    try {
      formikHelpers.setSubmitting(true);
      if (_isEqual(values, profile)) {
        toastr.warning('New profile is the same.');
        return;
      }
      await accountService.updateAccount(loginUser.id, values);
      toastr.success('Update profile succeed.');
    } catch {
      toastr.error('Update profile failed.');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleChangePassword = async (
    values: ChangePasswordForm,
    formikHelpers: FormikHelpers<ChangePasswordForm>,
  ): Promise<void> => {
    try {
      formikHelpers.setSubmitting(true);
      await accountService.changePassword(
        values.currentPassword,
        values.newPassword,
      );
      toastr.success('Update password succeed.');
      Router.reload();
    } catch {
      toastr.error('Update password failed.');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <div id="admin-profile-page">
      <Head>
        <title>Admin - Profile</title>
      </Head>
      <div className="container card p-4">
        <div className="row">
          <div className="col-6 border-right">
            <h4 className="text-center text-primary pb-2 mb-4 border-bottom">
              Profile
            </h4>
            <Formik
              initialValues={profile}
              enableReinitialize
              onSubmit={handleUpdateProfile}
              validationSchema={adminUpdateProfileSchema}>
              {({handleSubmit, isSubmitting, values}): JSX.Element => (
                <form className="px-5" onSubmit={handleSubmit}>
                  <FormGroup name="firstName" label="First name" />
                  <FormGroup name="lastName" label="Last name" />
                  <FormGroup name="email" label="Email" readOnly />
                  <div className="my-4">
                    Account status:{' '}
                    <AccountStatusLabel status={values.status} />
                  </div>
                  <div className="my-4">
                    Email verified:{' '}
                    <AccountEmailVerificationLabel
                      emailVerified={values.emailVerified}
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-success float-right"
                    type="submit"
                    disabled={isSubmitting}>
                    Save
                  </button>
                </form>
              )}
            </Formik>
          </div>
          <div className="col-6">
            <h4 className="text-center text-primary pb-2 mb-4 border-bottom">
              Change password
            </h4>
            <Formik
              initialValues={initialChangePasswordForm}
              onSubmit={handleChangePassword}
              validationSchema={adminResetNewPasswordFormSchema}>
              {({handleSubmit, isSubmitting}): JSX.Element => (
                <form className="px-5" onSubmit={handleSubmit}>
                  <FormGroup
                    name="currentPassword"
                    type="password"
                    label="Current password"
                    required
                  />
                  <FormGroup
                    name="newPassword"
                    type="password"
                    label="New password"
                    required
                  />
                  <FormGroup
                    name="confirmPassword"
                    type="password"
                    label="Confirm password"
                    required
                  />
                  <button
                    className="btn btn-sm btn-success float-right"
                    type="submit"
                    disabled={isSubmitting}>
                    Change
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(ProfilePage);
