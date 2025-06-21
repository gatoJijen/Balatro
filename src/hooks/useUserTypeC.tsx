import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';

type ConsumibleType = 'Tarot' | 'Planet' | 'Espectral';
const useUserTypeC = (uid: string) => {
    const [counts, setCounts] = useState<{ Tarot: number; Planet: number; Espectral: number }>({
        Tarot: 0,
        Planet: 0,
        Espectral: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDocRef = doc(db, 'users', uid);
                const userSnap = await getDoc(userDocRef);

                if (!userSnap.exists()) return;

                const userData = userSnap.data();
                const consumibleIds: string[] = userData.consumibles || [];

                if (!Array.isArray(consumibleIds) || consumibleIds.length === 0) return;

                // Divide en bloques si hay muchos (Firestore limita el 'in' a 10 elementos por query)
                const chunkSize = 10;
                const chunks = Array.from({ length: Math.ceil(consumibleIds.length / chunkSize) }, (_, i) =>
                    consumibleIds.slice(i * chunkSize, i * chunkSize + chunkSize)
                );

                const typeCounts = { Tarot: 0, Planet: 0, Espectral: 0 };

                for (const chunk of chunks) {
                    const q = query(collection(db, 'Consumibles'), where('__name__', 'in', chunk));
                    const snapshot = await getDocs(q);

                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const type = data.type as string;

                        if (['Tarot', 'Planet', 'Espectral'].includes(type)) {
                            typeCounts[type as ConsumibleType]++;
                        }

                    });
                }

                setCounts(typeCounts);
            } catch (error) {
                console.error('Error al contar consumibles por tipo:', error);
            }
        };

        if (uid) {
            fetchData();
        }
    }, [uid]);

    return counts;
};
export default useUserTypeC