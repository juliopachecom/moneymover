import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  })

  const setValue = value => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }
  return [storedValue, setValue]
}

// Función para limpiar el Local Storage de los elementos deseados
export const clearLocalStorage = () => {
  const keysToPreserve = ['currency', 'cookies-aceptadas'];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!keysToPreserve.includes(key)) {
      window.localStorage.removeItem(key);
    }
  }
};