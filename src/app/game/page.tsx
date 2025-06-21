"use client"
import LiCollection from '@/components/LiCollection';
import { auth, db } from '@/firebase/config';
import { UserData } from '@/interfaces/global';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [user, setUser] = useState<User | null>(null);
      const [uid, setUid] = useState('');
      const [loading, setLoading] = useState(true);
      const [userData, setUserData] = useState<UserData | null>(null);
      const router = useRouter();

      const [modalCollection, setModalCollection] = useState<boolean>(false)
    
      const redirect = (url: string) => {
        router.push(url);
      };
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setUid(currentUser?.uid || '');
    
          if (!currentUser) {
            redirect('/');
          }
    
          setLoading(false);
        });
    
        return () => unsubscribe();
      }, []);
    
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', uid));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
              const docData = querySnapshot.docs[0].data();
              const fetchedUserData: UserData = {
                displayName: docData.displayName || '',
                image: docData.photoURL || '',
                categoria: docData.categoria || '',
              };
              setUserData(fetchedUserData);
            }
          } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
          }
        };
    
        if (uid) {
          fetchUserData();
        }
      }, [uid]);
  return (
    <article className='flex flex-col gap-8 h-dvh items-center justify-between'>
        <nav className='mt-8 flex justify-end items-center w-dvw px-8'>
            <picture className='rounded-full w-[50px] h-[50px] flex justify-center items-center hover:bg-white/20 '>
                <Image className='w-[50px] h-[50px] rounded-full cursor-pointer' src={userData?.image || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"} alt={userData?.displayName || ""} width={80} height={80}/>
            </picture>
        </nav>
        <footer className='flex items-center justify-evenly gap-4  h-[140px] rounded-lg py-[12px] bg-gray-900 px-[20px] primary-text mb-[25px] '>
                <button className='bg-sky-900 w-[240px] h-[100px] font-bold text-4xl rounded-lg cursor-pointer hover:bg-sky-800 transition-all'>PLAY</button>
                <button className='bg-orange-500 w-[180px] h-[80px] font-bold text-2xl rounded-lg cursor-pointer hover:bg-orange-400 transition-all'>OPTIONS</button>
                <button onClick={()=> setModalCollection(true)} className='bg-green-800 w-[240px] h-[100px] font-bold text-3xl rounded-lg cursor-pointer hover:bg-green-700 transition-all'>COLLECTION</button>
        </footer>
        {modalCollection? (
          <article className='w-dvw absolute flex justify-center items-center h-dvh'>
            <span className='z-50 blur-xl w-dvw h-dvh absolute bg-white/10' ></span>
            <section className='z-[90] w-[50dvw] h-[80dvh] bg-gray-800 rounded-2xl border-4 transition-all border-white/70 flex justify-center items-center flex-col '>
              <article>
                <LiCollection type='Tarot' uid={uid} title='Jokers' className='bg-red-500 cursor-pointer text-2xl' />
              </article>
              <button onClick={()=> setModalCollection(false)}>close</button>
            </section>

          </article>
        )
        :(
          <button className=' hidden opacity-0 absolute'></button>
        )

        }

        
    </article>
  )
}

export default page