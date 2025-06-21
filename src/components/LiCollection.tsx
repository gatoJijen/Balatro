import { db } from '@/firebase/config';
import useUserTypeC from '@/hooks/useUserTypeC';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface Props {
    title: string;
    className?: string;
    uid: string;
    type: string
}

const LiCollection: React.FC<Props> = ({ title, className, uid, type }) => {
    const { Tarot, Planet, Espectral } = useUserTypeC(uid);

    const [maxIndex, setMaxIndex] = useState<number | null>(null);
    const [userCount, setUserCount] = useState<number | null>(0)

    const [maxIndexT, setMaxIndexT] = useState<number | null>(0)
    useEffect(() => {
        if (type.length > 0) {

            useEffect(() => {

                const getMaxIndexByType = async (type: string): Promise<void> => {
                    try {
                        const q = query(
                            collection(db, 'Consumibles'),
                            where('type', '==', type),
                            orderBy('index', 'desc'),
                            limit(1)
                        );

                        const snapshot = await getDocs(q);

                        if (!snapshot.empty) {
                            const data = snapshot.docs[0].data();
                            setMaxIndexT(data.index ?? null);
                        } else {
                            setMaxIndexT(null);
                        }
                    } catch (error) {
                        console.error('Error obteniendo índice máximo por tipo:', error);
                        setMaxIndexT(null);
                    }
                };

                if (type) {
                    getMaxIndexByType(type);
                }
            }, [type]);
        } else {
            useEffect(() => {
                const fetchUserJokersCount = async () => {
                    try {
                        const userDocRef = doc(db, 'users', uid);
                        const userDocSnap = await getDoc(userDocRef);

                        if (userDocSnap.exists()) {
                            const data = userDocSnap.data();
                            if (title === 'Jokers') {
                                const jokersArray = data.jokers || [];
                                setUserCount(Array.isArray(jokersArray) ? jokersArray.length : 0);
                            }
                        } else {
                            setUserCount(0); // El documento no existe
                        }
                    } catch (error) {
                        console.error('Error al contar los jokers:', error);
                        setUserCount(0);
                    }
                };

                if (uid) {
                    fetchUserJokersCount();
                }
            }, [uid]);

            useEffect(() => {

                const getMaxJokerIndex = async (): Promise<void> => {
                    try {
                        const q = query(
                            collection(db, `${title}`),
                            orderBy('index', 'desc'),
                            limit(1)
                        );

                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const docData = querySnapshot.docs[0].data();
                            setMaxIndex(docData.index ?? null);
                        } else {
                            setMaxIndex(null);
                        }
                    } catch (error) {
                        console.error('Error al obtener el índice más alto:', error);
                        setMaxIndex(null);
                    }
                };

                getMaxJokerIndex();
            }, []);
        }

    })





    return (
        <button className={`${className} primary-text font-bold`}>
            <h1>{title}</h1>
            <p>
  {userCount}/
  {type.length > 0
    ? (type === "Tarot"? 
        (maxIndexT !== null ? maxIndexT : '0')
        :(maxIndexT !== null ? maxIndexT : '0')
    )
    : (maxIndex !== null ? maxIndex : '0')}
</p>

        </button>
    );
};

export default LiCollection;
