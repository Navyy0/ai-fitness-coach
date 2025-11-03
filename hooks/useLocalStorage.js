import { useState } from "react";

// Deprecated: local storage use is being removed. This hook now behaves as an in-memory
// state holder and warns when used. Prefer saving to Supabase instead.
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  const setValue = (value) => {
    console.warn(
      `useLocalStorage('${key}') is deprecated and does not persist data to localStorage. ` +
        `Persist preferences and plans to Supabase instead.`
    );
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
  };

  return [storedValue, setValue];
}

