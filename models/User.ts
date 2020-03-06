import loForIn from 'lodash/forIn';

export enum Role {
  ROOT_ADMIN = 'root_admin',
  USER = 'user',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Account {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  status: AccountStatus;
  emailVerified: boolean;
}

/**
 * @description Convert (shallowly) TS data object to suit Formik data object
 * @param data
 * @returns Formik data object
 */
export function toFormikDataObject(data) {
  const newData = {...data};
  loForIn(data, (value, key) => {
    if (typeof value === 'boolean') newData[key] = value ? 'true' : 'false';
  });
  return newData;
}

export function toAccountObject(data) {
  const newData: Account = {
    ...data,
  };
  newData.emailVerified = data.emailVerified === 'true';
  return newData;
}

export const isAdmin = (user: any) => {
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
