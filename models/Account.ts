export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  email: string;
  role: Role;
}

export enum Role {
  ROOT_ADMIN = 'root_admin',
  USER = 'user',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Account {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  status: AccountStatus;
  emailVerified: boolean;
}

export const isAdmin = (user: LoginUser): boolean => {
  return user.role === Role.ROOT_ADMIN;
};

export const constraint = {
  email: {
    MAX_LENGTH: 256,
  },
  name: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  firstName: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  lastName: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  password: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
};
