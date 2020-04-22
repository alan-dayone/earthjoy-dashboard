import React, {FC} from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

interface Props {
  emailVerified: boolean;
}

export const AccountEmailVerificationLabel: FC<Props> = ({
  emailVerified,
}: Props) => {
  const {t} = useTranslation();
  return (
    <span
      className={classNames('badge', {
        'badge-success': emailVerified,
        'badge-secondary': !emailVerified,
      })}>
      {emailVerified ? t('verified') : t('notVerified')}
    </span>
  );
};
