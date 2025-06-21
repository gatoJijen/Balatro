/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Loading from "@/components/Loading";
// Importa tu cliente de Supabase y la función de obtener el usuario si es necesario


const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const saveUserToFirestore = async (uid: string, displayName: string, photoURL: string, categoria: string, jokers:any[], vouchers:any[], decks:any[], consumibles:any[], tags:any[], boosters:any[], jokersN:any[], vouchersN:any[], decksN:any[], consumiblesN:any[], tagsN:any[], boostersN:any[]) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      // Si ya existe, salimos (o podríamos hacer merge en vez de overwrite)
      if (snap.exists()) {
        console.log("El usuario ya existe, no lo sobrescribo.");
        return;
      }

      // Si no existe, lo creamos
      await setDoc(userRef, {
        displayName,
        photoURL,
        uid,
        categoria,
        jokers,
        jokersN,
        vouchers,
        vouchersN,
        decks,
        decksN,
        consumibles,
        consumiblesN,
        tags,
        tagsN,
        boosters,
        boostersN
      }, { merge: true }); // sólo afecta a este doc, sin borrar nada fuera de estas claves

      console.log("Usuario guardado en Firestore");
    } catch (err) {
      console.error("Error al guardar el usuario en Firestore:", err);
    }
  };


  const googleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) throw new Error("No se pudo obtener el usuario.");
      // Usa los datos del usuario proporcionados por Google
      const displayName = user.displayName || "UsuarioG";
      const defaultPhotoURL = "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
      const photoURL = user.photoURL || defaultPhotoURL;
      const defaultCategory = "user"
      const defaultCollection: any[] = []

      // Guarda el usuario en Firestore
      await saveUserToFirestore(
        user.uid,
        displayName,
        photoURL,
        defaultCategory,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,
        defaultCollection,

      );
      router.push("/game");
    } catch (err: any) {
      setError(err.message || "Error al registrar con Google");
    } 
  };

  // Efecto para manejar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        //setDisplayName(user.displayName || "");
        //setUrl(user.photoURL || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png");
        //handlePostRequest2(); // Llamamos a la función cada vez que se actualiza el usuario
        router.push("/game");
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
  }, [router]);


  return (
    <section className='flex flex-col h-dvh items-center justify-center'>
      {!loading ? (
        <>
          <header className='absolute h-full w-full z-[99]'>
            <nav className='w-full relative h-full overflow-hidden cursor-default'>
              <picture className='absolute w-[100vw] blur-lg h-[100svh] pointer-events-none'>
                <Image priority src="https://cdn2.steamgriddb.com/logo/f9da6f01e2a315fd257be59d72393996.png" alt='' width={1500} height={100} />
              </picture>
            </nav>
          </header>
          <article className='flex bg-gray-800 border border-white flex-col rounded-2xl justify-center h-[80dvh] pb-[60px] pt-[70px] px-[160px] w-[40dvw]  items-center z-[999] '>
            <header className='m-0 w-[400px] h-[400px] bg-logoLogin flex items-center justify-center z-[999] rounded-t-4xl'>
              <Image className="w-[400px]  " src={"https://cdn2.steamgriddb.com/logo/fab4029f3293f283d3e94873e7ea7db2.png"} alt="Norma logo" width={400} height={90} />
            </header>
            <section className='flex flex-col items-center w-full h-full gap-2 pt-10 z-[999] text-white'>

              {error && (
                <p className="text-red-500 text-sm">
                  {error === "Firebase: Error (auth/email-already-in-use)."
                    ? "Este correo ya está registrado"
                    : error}
                </p>
              )}

            </section>
            <footer className='flex flex-col w-full pb-12 h-full pt-[20px] justify-between items-center gap-5 z-[999]'>
              <button
                onClick={() => { googleRegister(); setLoading(true) }}
                className='border-white scondary-text flex gap-4 items-center justify-center border text-white px-4 w-[370px] py-6 rounded-[12px] fs-1 cursor-pointer'
                disabled={loading}
              >
                <h2 className='text-base font-bold'>Continuar con Google</h2>
                <article className='rotate-180'>
                </article>
              </button>
            </footer>
          </article>
        </>
      ) :
        (<Loading />)

      }

    </section>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

export default Page;