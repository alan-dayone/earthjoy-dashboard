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
  email: string;
  role: Role;
}

export type LoginUser = Account;

export const isAdmin = (user: LoginUser): boolean => {
  return user.role === Role.ADMIN;
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
