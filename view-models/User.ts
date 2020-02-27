import {AccountStatus} from '../models/User';

export const AccountStatusText = {
  [AccountStatus.ACTIVE]: 'Active',
  [AccountStatus.INACTIVE]: 'Inactive',
};

export enum AccountEmailVerificationText {
  VERIFIED = 'Verified',
  NOT_VERIFIED = 'Not verified',
}
