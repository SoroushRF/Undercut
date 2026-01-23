import { useState, useEffect } from 'react';
import { Car } from '@/lib/types';
import { MOCK_CARS } from '@/lib/mock-data';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setCars(MOCK_CARS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { cars, loading };
}
