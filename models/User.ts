export enum Role {
  ROOT_ADMIN = 'root_admin',
  USER = 'user',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
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
  password: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
};

export const languages = ['en', 'vn'];
