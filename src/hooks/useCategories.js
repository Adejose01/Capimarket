import { useState, useEffect } from 'react';
import pb from '../lib/pocketbase';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pb.collection('categories').getFullList()
      .then(setCategories)
      .catch((err) => console.error('Error loading categories:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}
