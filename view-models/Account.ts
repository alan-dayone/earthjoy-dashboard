import * as Yup from 'yup';
import {
  constraint as AccountConstraint,
  Account,
  AccountFilterPayload,
} from '../models/Account';
import {emailSchema} from './CommonValidationSchemas';
import moment from 'moment';

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
  console.log({payload});
  return transformedPayload;
};

export const AccountTableColumns = [
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
    label: 'Registered Date',
    filterable: true,
  },
  {
    field: 'currentPlan',
    label: 'Current Plan',
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
    label: 'Journal Streak',
  },
  {
    field: 'journalCounts',
    label: 'Journal Count',
  },
  {
    field: 'latestJournalDate',
    label: 'Latest Journal Date',
    type: 'date',
  },
  {
    field: 'lastLoginDate',
    label: 'Last Login Date',
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
    label: 'Total Donation Amount',
  },
  {
    field: 'phoneOS',
    label: 'Phone OS',
  },
  {
    field: 'stripeCustomerId',
    label: 'Stripe Customer Id',
  },
  {
    field: 'morningReminderTime',
    label: 'Morning Reminder Time',
  },
  {
    field: 'eveningReminderTime',
    label: 'Evening Reminder Time',
  },
];
