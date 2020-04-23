export const getErrorCode = (error): string => {
  if (error.message === 'Network Error') {
    return 'networkError';
  }

  const key = error.response?.data?.error?.message;

  if (/^\w+$/.test(key)) {
    return key;
  }

  if (error.response?.data?.error?.code) {
    return error.response?.data?.error?.code;
  }
};
