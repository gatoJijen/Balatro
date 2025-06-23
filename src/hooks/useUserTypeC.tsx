import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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
                const consumibles: any[] = userData.consumibles || [];

                const typeCounts: { [key in ConsumibleType]: number } = {
                    Tarot: 0,
                    Planet: 0,
                    Espectral: 0,
                };

                // Recorremos el array de mapas y contamos por tipo
                for (const item of consumibles) {
                    const type:ConsumibleType = item?.type;
                    if (type === 'Tarot' || type === 'Planet' || type === 'Espectral') {
                        typeCounts[type]++;
                    }
                }

                setCounts(typeCounts);
            } catch (error) {
                console.error('Error al obtener consumibles por tipo:', error);
            }
        };

        if (uid) {
            fetchData();
        }
    }, [uid]);

    return counts;
};

export default useUserTypeC;
