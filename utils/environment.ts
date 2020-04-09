export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};
