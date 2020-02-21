enum Role {
  ROOT_ADMIN = 'root_admin',
  USER = 'user',
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
  avatar: {
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png'],
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  },
};

export const languages = ['en', 'vn'];
