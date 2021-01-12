export interface LoginCredentials {
  email: string;
  password: string;
}

export enum Role {
  ADMIN = 'user::admin',
  USER = 'user::user',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Account {
  _id?: string;
  password: string;
  email: string;
  role: Role;
}

export type AccountAnalyticsInfo = Account & {
  journalStreak: number;
  journalCounts: number;
  latestJournalDate: string;
  lastLoginDate: string;
  downgradeDate: number;
  currency: string;
  dailyDonationAmount: number;
  monthlyMaximumDonationAmount: number;
  totalDonationAmount: number;
  phoneOS: string;
  stripeCustomerId: string;
  morningReminderTime: number;
  eveningReminderTime: number;
  currentPlan: string;
  registeredOn: string;
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
    type: 'selection',
    items: [],
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

export type LoginUser = Account;

export const isAdmin = (user: LoginUser): boolean => {
  return user.role === Role.ADMIN;
};

export type AccountFilterPayload = {
  createdDateFrom?: string;
  createdDateTo?: string;
  nameContains?: string;
  emailContains?: string;
  page: number;
  limit: number;
};

export const constraint = {
  email: {
    MAX_LENGTH: 256,
  },
  password: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
};
