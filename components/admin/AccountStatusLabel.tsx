import React, {FC} from 'react';
import classNames from 'classnames';
import {AccountStatusText} from '../../view-models/Account';
import {AccountStatus} from '../../models/Account';

interface Props {
  status: AccountStatus;
}

export const AccountStatusLabel: FC<Props> = ({status}: Props) => (
  <span
    className={classNames(
      'badge',
      status === AccountStatus.ACTIVE ? 'badge-success' : 'badge-secondary',
    )}>
    {AccountStatusText[status || AccountStatus.INACTIVE] || AccountStatusText}
  </span>
);
