import { useState, useEffect } from 'react';

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
}

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  }, [key, value]);

  const remove = () => {
    window.localStorage.removeItem(key);
    setValue(initialValue);
  };

  return { value, setValue, remove };
}
