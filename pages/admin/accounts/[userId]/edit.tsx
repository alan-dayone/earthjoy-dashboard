import React from 'react';
import Head from 'next/head';
import {NextPageContext, NextPage} from 'next';
import {Router} from 'next/router';
import loGet from 'lodash/get';
import loIsEqual from 'lodash/isEqual';
import toastr from 'toastr';
import classNames from 'classnames';
import {adminOnly} from '../../../../hocs';
import {Formik, FormikActions, FormikProps} from 'formik';
import {AccountStatus, Account} from '../../../../models/Account';
import {
  AccountEmailVerificationText,
  AccountStatusText,
  userUpdateInfomationFormValidationSchema,
} from '../../../../view-models/Account';
import {accountService} from '../../../../services';
import {ToastrWarning} from '../../../../view-models/Toastr';

export function getServerErrorMessage(error): string {
  const errorEnum = loGet(error, 'response.data.error.message');
  if (errorEnum === 'EMAIL_EXISTED') {
    return 'Email already existed';
  }
  return 'Unknown error';
}

class UserToastrWarning extends ToastrWarning {
  public getWarningMessage(): string {
    if (this.code === 'NOTHING_CHANGE') {
      return 'The new user information is the same';
    }
    return 'Warning';
  }
  public alert(): void {
    toastr.warning(this.getWarningMessage());
  }
}

interface Props {
  router: Router;
  originalAccount: Account;
}

const AdminAccountEditingPage: NextPage<Partial<Props>> = ({
  router,
  originalAccount,
}) => {
  const _handleSave = async (
    values: Account,
    actions: FormikActions<Account>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      if (loIsEqual(values, originalAccount))
        throw new UserToastrWarning(UserToastrWarning.NOTHING_CHANGE);
      const userId = loGet(router, ['query', 'userId']) as string;
      await accountService.updateAccount(userId, values);
      toastr.success('Success');
    } catch (e) {
      if (e instanceof UserToastrWarning) e.alert();
      else if (loGet(e, 'e.response.data.error', false))
        toastr.error(getServerErrorMessage(e));
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-edit-account-page" className="shadow">
      <Head>
        <title>Admin - Edit account</title>
      </Head>
      <Formik
        initialValues={originalAccount}
        onSubmit={_handleSave}
        validationSchema={userUpdateInfomationFormValidationSchema}>
        {({
          errors,
          handleChange,
          handleSubmit,
          values,
          isSubmitting,
          setFieldValue,
        }: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>Edit account</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-envelope-closed" />
                          </span>
                        </div>
                        <input
                          className={classNames('form-control', {
                            'is-invalid': errors.email,
                          })}
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>First name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-user" />
                          </span>
                        </div>
                        <input
                          name="firstName"
                          className={classNames('form-control', {
                            'is-invalid': errors.firstName,
                          })}
                          onChange={handleChange}
                          value={values.firstName}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-user" />
                          </span>
                        </div>
                        <input
                          name="lastName"
                          className={classNames('form-control', {
                            'is-invalid': errors.lastName,
                          })}
                          onChange={handleChange}
                          value={values.lastName}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Account status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={values.status}
                        onChange={handleChange}>
                        <option value={AccountStatus.ACTIVE}>
                          {AccountStatusText[AccountStatus.ACTIVE]}
                        </option>
                        <option value={AccountStatus.INACTIVE}>
                          {AccountStatusText[AccountStatus.INACTIVE]}
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email verification</label>
                      <select
                        name="emailVerified"
                        className="form-control"
                        value={values.emailVerified ? 'true' : 'false'}
                        onChange={(e): void => {
                          if (e.target.value === 'true')
                            setFieldValue('emailVerified', true);
                          else setFieldValue('emailVerified', false);
                        }}>
                        <option value="true">
                          {AccountEmailVerificationText.VERIFIED}
                        </option>
                        <option value="false">
                          {AccountEmailVerificationText.NOT_VERIFIED}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-sm btn-primary"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting && (
                    <div
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                    />
                  )}
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
AdminAccountEditingPage.getInitialProps = async (
  context: NextPageContext<Props>,
): Promise<Partial<Props>> => {
  const originalAccount = await accountService.findOneForAdmin(
    context.query['userId'] as string,
  );
  console.log({originalAccount});
  return {
    originalAccount,
  };
};

export default adminOnly(AdminAccountEditingPage);
