import { useState, useEffect } from "react";

const getSavedValue = (key: any, initialValue: any) => {
  const savedValue = JSON.parse(localStorage.getItem(key) as string);

  if (savedValue) return savedValue;

  // Checkout if the initialValue is a function
  if (initialValue instanceof Function) return initialValue();

  return initialValue;
};

const useLocalStorage = (key: any, initialValue: any) => {
  const [value, setValue] = useState(() => getSavedValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;