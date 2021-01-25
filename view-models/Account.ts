import * as Yup from 'yup';
import {
  constraint as AccountConstraint,
  Account,
  AccountFilterPayload,
} from '../models/Account';
import {emailSchema} from './CommonValidationSchemas';
import moment from 'moment';
import {accountService} from '../services';

export const sharedValidationSchema = {
  email: emailSchema,
  password: Yup.string()
    .required()
    .min(AccountConstraint.password.MIN_LENGTH)
    .max(AccountConstraint.password.MAX_LENGTH),
};

export const getAccountName = (account: Account): string => {
  return account.email;
};

export const transformPayload = payload => {
  const transformedPayload: AccountFilterPayload = {
    limit: payload.pageSize,
    page: payload.pageIndex + 1,
    nameContains: payload.filters.name,
    emailContains: payload.filters.email,
    currentPlan:
      payload.filters.currentPlan === 'All'
        ? undefined
        : payload.filters.currentPlan,
    createdDateFrom: payload.filters.registeredOn?.startDate
      ? moment(payload.filters.registeredOn.startDate).format('YYYY-MM-DD')
      : undefined,
    createdDateTo: payload.filters.registeredOn?.endDate
      ? moment(payload.filters.registeredOn.endDate).format('YYYY-MM-DD')
      : undefined,
  } as AccountFilterPayload;
  return transformedPayload;
};

const parseHours = (val: string | number) => {
  const hour = Math.floor(Number(val) / 60);
  const minute = Number(val) % 60;
  return moment()
    .hour(hour)
    .minute(minute)
    .second(0)
    .format('h:mm A');
};

export const AccountTableColumns = [
  {
    field: 'action',
    type: 'action',
    label: 'Delete',
    handler: async (object: Account, callback: () => {}): Promise<void> => {
      const result = confirm(`Delete user ${object.email} permanently?`);
      if (result) {
        await accountService.deleteAccount(object._id);
        callback();
      }
    },
  },
  {
    field: '_id',
    type: 'string',
    label: 'Id',
  },
  {
    field: 'email',
    type: 'string',
    label: 'Email',
    filterable: true,
  },
  {
    field: 'displayName',
    type: 'string',
    label: 'Display Name',
    filterable: true,
  },
  {
    field: 'registeredOn',
    type: 'date',
    label: 'Signup Date',
    filterable: true,
  },
  {
    field: 'currentPlan',
    label: 'Membership Status',
    filterable: true,
    type: 'selection',
    items: [
      {
        value: 'FREE',
        label: 'FREE',
      },
      {
        value: 'ANNUAL_SUBSCRIPTION',
        label: 'ANNUAL_SUBSCRIPTION',
      },
    ],
  },
  {
    field: 'journalStreak',
    label: 'Current Streak',
  },
  {
    field: 'journalCounts',
    label: '# of Journal Entries',
  },
  {
    field: 'latestJournalDate',
    label: 'Last Date of Entry',
    type: 'date',
  },
  {
    field: 'lastLoginDate',
    label: 'Last Date of Login',
    type: 'date',
  },
  {
    field: 'downgradeDate',
    label: 'Downgrade Date',
    type: 'date',
  },
  {
    field: 'currency',
    label: 'Currency',
  },
  {
    field: 'dailyDonationAmount',
    label: 'Daily Donation Amount',
  },
  {
    field: 'monthlyMaximumDonationAmount',
    label: 'Monthly Maximum Donation Amount',
  },
  {
    field: 'totalDonationAmount',
    label: 'Total Donations Given',
  },
  {
    field: 'phoneOS',
    label: 'Phone OS',
  },
  {
    field: 'stripeCustomerId',
    label: 'Stripe Customer ID',
  },
  {
    field: 'morningReminderTime',
    label: 'Morning Reminder',
    type: 'custom',
    resolver: parseHours,
  },
  {
    field: 'eveningReminderTime',
    label: 'Evening Reminder',
    type: 'custom',
    resolver: parseHours,
  },
];
