import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import useUserTypeC from './useUserTypeC';

type UserCounts = {
    countByTypeS: number;
    userCountS: number;
};

export const useCachedUserCounts = (
    uid: string,
    title: string,
    type: string
): UserCounts => {
    const [countByTypeS, setCountByTypeS] = useState<number>(0);
    const [userCountS, setUserCountS] = useState<number>(0);
    const { Tarot, Planet, Espectral } = useUserTypeC(uid);

    useEffect(() => {
        const cacheKey = `user-counts-${uid}-${title}-${type}`;
        const cached = sessionStorage.getItem(cacheKey);
        
        if (cached) {

            const parsed = JSON.parse(cached);
            setCountByTypeS(parsed.countByTypeS || 0);
            setUserCountS(parsed.userCountS || 0);
            return;
        }

        const fetchData = async () => {
            try {
                const userDocRef = doc(db, 'users', uid);
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists()) return;

                const data = userDocSnap.data();
                let countByTypeVal = 0;
                let userCountVal = 0;

                // 🔢 Contar consumibles por tipo
                const consumibles: { type: string }[] = data.consumibles || [];
                if (Array.isArray(consumibles) && type.length > 0) {
                    countByTypeVal = consumibles.filter(item => item.type === type).length;
                }

                // 🔢 Contar otros recursos
                if (title !== 'Consumibles') {
                    const titleLower = title.toLowerCase();
                    const jokersArray = data[titleLower] || [];
                    userCountVal = Array.isArray(jokersArray) ? jokersArray.length : 0;
                } else {
                    switch (type) {
                        case 'Tarot':
                            userCountVal = Tarot;
                            break;
                        case 'Planet':
                            userCountVal = Planet;
                            break;
                        case 'Espectral':
                            userCountVal = Espectral;
                            break;
                        default:
                            userCountVal = 0;
                            break;
                    }
                }

                setCountByTypeS(countByTypeVal);
                setUserCountS(userCountVal);

                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({ countByTypeS: countByTypeVal, userCountS: userCountVal })
                );
            } catch (error) {
                console.error('Error al obtener conteo del usuario:', error);
                setCountByTypeS(0);
                setUserCountS(0);
            }
        };

        if (uid) fetchData();
    }, [uid, title, type, Tarot, Planet, Espectral]);

    return { countByTypeS, userCountS };
};
