import React, {useEffect, useState, FC} from 'react';
import Head from 'next/head';
import toastr from 'toastr';
import {adminOnly} from '../../../../hocs/adminOnly';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import {AccountStatus, Account, Role} from '../../../../models/Account';
import {userUpdateInformationFormValidationSchema} from '../../../../view-models/Account';
import {getErrorMessageCode} from '../../../../view-models/Error';
import {accountService} from '../../../../services';
import {FormGroup} from '../../../../components/admin/FormGroup';
import {useTranslation} from 'react-i18next';
import {FormikButton} from '../../../../components/admin/FormikButton';
import {useRouter} from 'next/router';

const AdminAccountEditingPage: FC = () => {
  const {t} = useTranslation();
  const [originalAccount, setOriginalAccount] = useState<Account>();
  const router = useRouter();
  useEffect(() => {
    (async (): Promise<void> => {
      const res = await accountService.findOneForAdmin(
        router.query['userId'] as string,
      );
      setOriginalAccount(res);
    })();
  }, []);
  const handleSave = async (
    values: Account,
    actions: FormikActions<Account>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      const userId = originalAccount.id;
      await accountService.updateAccount(userId, values);
      toastr.success(t('success'));
    } catch (e) {
      toastr.error(t(getErrorMessageCode(e)));
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-edit-account-page" className="shadow">
      <Head>
        <title>
          {t('admin')} - {t('editAccount')}
        </title>
      </Head>
      <Formik
        initialValues={originalAccount}
        enableReinitialize
        onSubmit={handleSave}
        validationSchema={userUpdateInformationFormValidationSchema}>
        {({handleSubmit, setFieldValue}: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>{t('editAccount')}</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <FormGroup
                      name="email"
                      label={t('email')}
                      icon="cil-envelope-closed"
                      required
                    />
                    <FormGroup
                      name="firstName"
                      label={t('firstName')}
                      icon="cil-user"
                      required
                    />
                    <FormGroup
                      name="lastName"
                      label={t('lastName')}
                      icon="cil-user"
                      required
                    />
                    <FormGroup
                      name="role"
                      label={t('role')}
                      tag="select"
                      required>
                      <option value={Role.USER}>{t('user')}</option>
                      <option value={Role.ROOT_ADMIN}>{t('admin')}</option>
                    </FormGroup>
                    <FormGroup
                      name="status"
                      label={t('accountStatus')}
                      tag="select"
                      required>
                      <option value={AccountStatus.ACTIVE}>
                        {t('active')}
                      </option>
                      <option value={AccountStatus.INACTIVE}>
                        {t('inactive')}
                      </option>
                    </FormGroup>
                    <FormGroup
                      name="emailVerified"
                      label={t('emailVerification')}
                      tag="select"
                      onChange={(e): void =>
                        setFieldValue(
                          'emailVerified',
                          e.target.value === 'true',
                        )
                      }
                      required>
                      <option value="true">{t('verified')}</option>
                      <option value="false">{t('notVerified')}</option>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <FormikButton size="sm" color="primary">
                  {t('save')}
                </FormikButton>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default adminOnly(AdminAccountEditingPage);
