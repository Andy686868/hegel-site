import { useEffect, useState } from 'react';

// Этот хук заставляет значение обновляться не сразу, а с задержкой
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Устанавливаем таймер
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Если значение изменилось до истечения таймера - отменяем предыдущий
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}