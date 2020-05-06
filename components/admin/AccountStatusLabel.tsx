import React, {FC} from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {AccountStatus} from '../../models/Account';

interface Props {
  status: AccountStatus;
}

export const AccountStatusLabel: FC<Props> = ({status}: Props) => {
  const {t} = useTranslation();
  return (
    <span
      className={classNames(
        'badge',
        status === AccountStatus.ACTIVE ? 'badge-success' : 'badge-secondary',
      )}>
      {t(status === AccountStatus.ACTIVE ? 'active' : 'inactive')}
    </span>
  );
};
