import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

export const useCachedMaxIndex = (
  collectionName: string,
  type?: string
): number | null => {
  const [maxIndex, setMaxIndex] = useState<number | null>(null);

  useEffect(() => {
    const cacheKey = type
      ? `maxIndex-${collectionName}-${type}`
      : `maxIndex-${collectionName}`;

    const cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {
      setMaxIndex(Number(cached));
      return;
    }

    const fetchMaxIndex = async () => {
      try {
        let q;

        if (type) {
          q = query(
            collection(db, collectionName),
            where('type', '==', type),
            orderBy('index', 'desc'),
            limit(1)
          );
        } else {
          q = query(
            collection(db, collectionName),
            orderBy('index', 'desc'),
            limit(1)
          );
        }

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const index = snapshot.docs[0].data().index ?? null;
          setMaxIndex(index);
          sessionStorage.setItem(cacheKey, String(index));
        } else {
          setMaxIndex(null);
        }
      } catch (error) {
        console.error('Error al obtener el índice máximo:', error);
        setMaxIndex(null);
      }
    };

    fetchMaxIndex();
  }, [collectionName, type]);

  return maxIndex;
};

