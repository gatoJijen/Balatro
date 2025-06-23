"use client"
import LiCollection from '@/components/LiCollection';
import { auth, db } from '@/firebase/config';
import useUserData from '@/hooks/useSessionSave';
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
  const router = useRouter();
  const [modalCollection, setModalCollection] = useState<boolean>(false)
  const userData = useUserData(uid);

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


  return (
    <article className='flex flex-col gap-8 h-dvh items-center justify-between'>
      <nav className='mt-8 flex justify-end items-center w-dvw px-8'>
        <picture className='rounded-full w-[50px] h-[50px] flex justify-center items-center hover:bg-white/20 '>
          <Image className='w-[50px] h-[50px] rounded-full cursor-pointer' src={userData?.photoURL || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"} alt={userData?.displayName || ""} width={80} height={80} />
        </picture>
      </nav>
      <footer className='flex items-center justify-evenly gap-4  h-[140px] rounded-lg py-[12px] bg-gray-900 px-[20px] primary-text mb-[25px] '>
        <Link href={'/game'} className='bg-sky-900 w-[240px] h-[100px] font-bold text-4xl rounded-lg cursor-pointer hover:bg-sky-800 transition-all'>PLAY</Link>
        <button className='bg-orange-500 w-[180px] h-[80px] font-bold text-2xl rounded-lg cursor-pointer hover:bg-orange-400 transition-all'>OPTIONS</button>
        <button onClick={() => setModalCollection(true)} className='bg-green-800 w-[240px] h-[100px] font-bold text-3xl rounded-lg cursor-pointer hover:bg-green-700 transition-all'>COLLECTION</button>
      </footer>
      {modalCollection ? (
        <article className='w-dvw absolute flex justify-center items-center h-dvh'>
          <span className='z-50 blur-xl w-dvw h-dvh absolute bg-white/10' ></span>
          <section className='z-[90] w-[60dvw] h-[85dvh] bg-gray-800 rounded-2xl border-4 transition-all border-white/70 flex justify-between items-center flex-col '>
            <header className='flex justify-between w-full gap-8 px-8 py-4'>
              <article className='flex flex-col gap-2 w-full '>
                <LiCollection type='' uid={uid} title='Jokers' className='bg-red-500 hover:bg-red-400 cursor-pointer text-3xl py-4 rounded-xl' />
                <LiCollection type='' uid={uid} title='Decks' className='bg-red-500 hover:bg-red-400 cursor-pointer text-2xl rounded-xl' />
                <LiCollection type='' uid={uid} title='Vouchers' className='bg-red-500 hover:bg-red-400 cursor-pointer text-2xl rounded-xl' />
                <section className='bg-gray-900 flex justify-end w-full rounded-xl p-2 pb-4 pr-4 gap-2 relative'>
                  <h2 className='text-white/40 text-2xl font-bold rotate-[-90deg] absolute top-[45%] left-[-40px] '>Consumibles</h2>
                  <article className='flex flex-col w-[80%] gap-2'>
                    <LiCollection type='Tarot' uid={uid} title='Tarot ' oTitle=' Cards' className='bg-indigo-500 hover:bg-indigo-400 cursor-pointer text-2xl rounded-xl w-full' />
                    <LiCollection type='Planet' uid={uid} title='Planet' oTitle=' Cards' className='bg-teal-500 hover:bg-teal-400 cursor-pointer text-2xl rounded-xl w-full' />
                    <LiCollection type='Spectral' uid={uid} title='Spectral' oTitle=' Cards' className='bg-blue-500 hover:bg-blue-400    cursor-pointer text-2xl rounded-xl w-full' />
                  </article>
                </section>
              </article>
              <article className='flex flex-col gap-2 w-full '>
                <LiCollection type='' uid={uid} title='Boosters' oTitle=' Packs' className='bg-red-500 hover:bg-red-400 cursor-pointer text-2xl flex-grow rounded-xl' />
                <LiCollection type='' uid={uid} title='Tags' className='bg-red-500 hover:bg-red-400 cursor-pointer text-2xl rounded-xl flex-grow' />
                <LiCollection type='' uid={uid} title='Blinds' className='bg-red-500 hover:bg-red-400 cursor-pointer text-3xl py-5 rounded-xl flex-grow' />
              </article>
            </header>
            <footer className='w-full pb-4 px-4 '>
              <button className='bg-orange-500 w-full py-1 hover:bg-orange-400 transition-all rounded-xl primary-text text-2xl font-bold cursor-pointer' onClick={() => setModalCollection(false)}>Back</button>
            </footer>
          </section>

        </article>
      )
        : (
          <button className=' hidden opacity-0 absolute'></button>
        )

      }


    </article>
  )
}

export default page