import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Head from 'next/head';
import {guestOnly} from '../../../hocs/guestOnly';
import EnterPasswordForm from '../../../containers/admin/setup/EnterPasswordForm';
import CreateFirstAdminForm from '../../../containers/admin/setup/CreateFirstAdminForm';

enum STEP {
  ENTER_PASSWORD,
  CREATE_FIRST_ADMIN,
}

const AdminSetupPage: FC = () => {
  const {t} = useTranslation();

  const [step, setStep] = useState<STEP>(STEP.ENTER_PASSWORD);
  const [correctSystemInitPassword, setCorrectSystemInitPassword] = useState<
    string
  >('');

  // TODO: show 404 if system initialized already

  return (
    <div className="align-items-center c-app flex-row pace-done">
      <Head>
        <title>
          {t('admin')} - {t('setup')}
        </title>
      </Head>
      <div className="container">
        <div className="justify-content-center row">
          <div className="col-md-6">
            <div className="p-4 card">
              <div className="card-body">
                {step === STEP.CREATE_FIRST_ADMIN ? (
                  <CreateFirstAdminForm
                    correctSystemInitPassword={correctSystemInitPassword}
                  />
                ) : (
                  <EnterPasswordForm
                    onSuccess={(correctPassword): void => {
                      setStep(STEP.CREATE_FIRST_ADMIN);
                      setCorrectSystemInitPassword(correctPassword);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default guestOnly(AdminSetupPage, {useAdminLayout: true});
