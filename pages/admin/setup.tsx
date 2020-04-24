import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NextComponentType} from 'next';
import Head from 'next/head';
import {connect} from 'react-redux';
import Error from 'next/error';
import {withI18next} from '../../hocs/withI18next';
import {guestOnly} from '../../hocs/guestOnly';
import EnterPasswordForm from '../../containers/admin/setup/EnterPasswordForm';
import CreateFirstAdminForm from '../../containers/admin/setup/CreateFirstAdminForm';
import {CustomNextPageContext} from '../../hocs/types';
import {systemService} from '../../services';

enum STEP {
  ENTER_PASSWORD,
  CREATE_FIRST_ADMIN,
}

interface Props {
  isInitialized: boolean;
}

const AdminSetupPage: NextComponentType<
  CustomNextPageContext,
  Props,
  Props
> = ({isInitialized}: Props) => {
  const {t} = useTranslation();

  if (isInitialized) {
    return <Error statusCode={404} />;
  }

  const [step, setStep] = useState<STEP>(STEP.ENTER_PASSWORD);
  const [correctSystemInitPassword, setCorrectSystemInitPassword] = useState<
    string
  >('');

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

AdminSetupPage.getInitialProps = async (): Promise<Props> => {
  return {
    isInitialized: await systemService.checkSystemInitializationStatus(),
  };
};

export default guestOnly(connect()(withI18next(AdminSetupPage)), {
  useAdminLayout: true,
});
