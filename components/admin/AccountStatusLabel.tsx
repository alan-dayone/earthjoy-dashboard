import React, {FC} from 'react';
import classNames from 'classnames';
import {AccountStatusText} from '../../view-models/Account';
import {AccountStatus} from '../../models/Account';

interface Props {
  status: AccountStatus;
}

export const AccountStatusLabel: FC<Props> = ({status}: Props) => {
  const accountIsActive = status === AccountStatus.ACTIVE;

  return (
    <span
      className={classNames('badge', {
        'badge-success': accountIsActive,
        'badge-secondary': !accountIsActive,
      })}>
      {AccountStatusText[status]}
    </span>
  );
};
