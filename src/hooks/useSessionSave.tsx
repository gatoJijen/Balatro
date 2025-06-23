import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { UserData } from '@/interfaces/global';

const useUserData = (uid: string) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            // Intenta leer desde sessionStorage
            const cachedData = sessionStorage.getItem(`userData-${uid}`);
            if (cachedData) {
                setUserData(JSON.parse(cachedData));
                return;
            } 
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uid', '==', uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    const fetchedUserData: UserData = {
                        displayName: docData.displayName || '',
                        photoURL: docData.photoURL || '',  // Usa 'image' si tu campo se llama así en Firestore
                        categoria: docData.categoria || '',
                    };
                    setUserData(fetchedUserData);
                    sessionStorage.setItem(`userData-${uid}`, JSON.stringify(docData));
                }
            } catch (error) {
                console.error('Error obteniendo datos del usuario:', error);
            }



        };

        if (uid) fetchUserData();
    }, [uid]);

    return userData;
};

export default useUserData;
