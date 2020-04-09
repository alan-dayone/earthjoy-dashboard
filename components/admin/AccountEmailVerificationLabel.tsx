import React, {FC} from 'react';
import classNames from 'classnames';
import {AccountEmailVerificationText} from '../../view-models/User';

interface Props {
  emailVerified: boolean;
}

export const AccountEmailVerificationLabel: FC<Props> = ({
  emailVerified,
}: Props) => (
  <span
    className={classNames('badge', {
      'badge-success': emailVerified,
      'badge-secondary': !emailVerified,
    })}>
    {emailVerified
      ? AccountEmailVerificationText.VERIFIED
      : AccountEmailVerificationText.NOT_VERIFIED}
  </span>
);
