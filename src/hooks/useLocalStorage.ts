import { Dispatch, SetStateAction, useState } from 'react';

const canUseLocalStorage = (): boolean =>
  typeof window !== 'undefined' && Boolean(window.localStorage);

export const readLocalStorageValue = <T>(
  key: string,
  fallbackValue: T,
  normalize: (value: unknown) => T = (value) => value as T
): T => {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? normalize(JSON.parse(storedValue)) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
  normalize?: (value: unknown) => T
): [T, Dispatch<SetStateAction<T>>] => {
  const getInitialValue = (): T =>
    typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;

  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorageValue(key, getInitialValue(), normalize)
  );

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    setStoredValue((currentValue) => {
      const nextValue =
        typeof value === 'function'
          ? (value as (currentValue: T) => T)(currentValue)
          : value;

      if (canUseLocalStorage()) {
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Keep React state usable even when storage is unavailable or full.
        }
      }

      return nextValue;
    });
  };

  return [storedValue, setValue];
};
