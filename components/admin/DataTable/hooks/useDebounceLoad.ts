/* eslint-disable @typescript-eslint/no-explicit-any */
import {useAsyncDebounce} from 'react-table';

interface Props {
  defaultFn: () => void | Promise<void>;
  beforeFn?: () => void | Promise<void>;
  defaultWait?: number;
}

export function useDebounceLoad({
  beforeFn,
  defaultFn,
  defaultWait,
}: Props): () => void | Promise<void> {
  const asyncDebounceFn = useAsyncDebounce(defaultFn, defaultWait);
  if (defaultFn instanceof Promise)
    return async (): Promise<void> => {
      if (beforeFn) beforeFn();
      await asyncDebounceFn();
    };
  else
    return (): void => {
      if (beforeFn) beforeFn();
      asyncDebounceFn();
    };
}
