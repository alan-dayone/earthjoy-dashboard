import React, {FC} from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {Role} from '../../models/Account';

interface Props {
  role: Role;
}

export const AccountRoleLabel: FC<Props> = ({role}: Props) => {
  const {t} = useTranslation();
  return (
    <span
      className={classNames(
        'badge',
        role === Role.ADMIN ? 'badge-danger' : 'badge-success',
      )}>
      {t(role === Role.ADMIN ? 'rootAdmin' : 'user')}
    </span>
  );
};
