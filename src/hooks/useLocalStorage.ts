import { useState, useEffect, useCallback } from 'react';

interface StoredData<T> {
  value: T;
  timestamp: number;
}

interface UseLocalStorageOptions {
  ttl?: number;
}

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
): UseLocalStorageReturn<T> {
  const ttl = options?.ttl;

  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      if (ttl !== undefined) {
        const stored = JSON.parse(item) as StoredData<T>;
        const elapsed = Date.now() - stored.timestamp;
        if (elapsed >= ttl) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
        return stored.value;
      }

      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (ttl !== undefined) {
        const data: StoredData<T> = { value, timestamp: Date.now() };
        window.localStorage.setItem(key, JSON.stringify(data));
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage full or unavailable
    }
  }, [key, value, ttl]);

  const remove = useCallback(() => {
    window.localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return { value, setValue, remove };
}
