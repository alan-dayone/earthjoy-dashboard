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
