"use client"
import Loading from '@/components/Loading';
import { auth, db } from '@/firebase/config';
import { Decks, Jokers, propsAddDb } from '@/interfaces/global';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


interface UserData {
  displayName: string;
  image: string;
  categoria: string;
};

const page = () => {

    const [user, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

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
            image: docData.image || '',
            categoria: docData.categoria || '',
          };
          setUserData(fetchedUserData);

          // Redirige si no es admin
          if (fetchedUserData.categoria !== 'admin') {
            redirect('/');
          }
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };

    if (uid) {
      fetchUserData();
    }
  }, [uid]);



    const [dbAddS, setDbAddS] = useState<string>('Jokers');
    const [jokerN, setJokerN] = useState<string>('');
    const [jokerRa, setJokerRa] = useState<string>('');
    const [jokerRe, setJokerRe] = useState<string>('none');
    const [jokerT, setJokerT] = useState<string>('');
    const [jokerI, setJokerI] = useState<string>('');
    const [jokerC, setJokerC] = useState<number | any>(0);
    const [jokerId, setJokerId] = useState<number | any>(0);
    const [joker, setJoker] = useState<boolean>(false)
    const [jokerD, setJokerD] = useState<string>('');
    const [deck, setDeck] = useState<boolean>(false);

    useEffect(() => {
        if (dbAddS === 'Jokers') {
            const q = query(
                collection(db, 'Jokers'),
                orderBy('index', 'desc'),
                limit(1)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const jokerData = docSnap.data() as Jokers;
                    setJokerId(jokerData.index); // ✅ Solo el número
                }
            });

            return () => unsubscribe(); // 🔁 Limpia el listener al desmontar
        } if (dbAddS === 'Decks') {
            const q = query(
                collection(db, 'Decks'),
                orderBy('index', 'desc'),
                limit(1)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const deckData = docSnap.data() as Decks;
                    setJokerId(deckData.index); // ✅ Solo el número
                }
            });

            return () => unsubscribe(); // 🔁 Limpia el listener al desmontar
        }

    }, [dbAddS]);


    const [searchIndex, setSearchIndex] = useState<number>(0);
    const [filteredJoker, setFilteredJoker] = useState<Jokers | null>(null);
    const [filteredDecks, setFilteredDecks] = useState<Decks | null>(null);

    const [jokersS, setJokersS] = useState<Jokers[]>([]);
    const [decksS, setDecksS] = useState<Decks[]>([]);



    useEffect(() => {

        if (dbAddS === 'Jokers') {
            const q = query(
                collection(db, "Jokers"),
                orderBy('index', 'desc') // 👈 ordena de mayor a menor
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                let data = snapshot.docs.map((doc) => doc.data() as Jokers);
                setJokersS(data);
            });

            return () => unsubscribe();
        } if (dbAddS === 'Decks') {
            const q = query(
                collection(db, 'Decks'),
                orderBy('index', 'desc') // 👈 ordena de mayor a menor
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                let dataS = snapshot.docs.map((doc) => doc.data() as Decks);
                setDecksS(dataS);
            });

            return () => unsubscribe();
        }

    }, [dbAddS]);

    useEffect(() => {
        if (dbAddS === "Jokers") {
            if (searchIndex !== null) {
                const match = jokersS.find(joker => joker.index === searchIndex);
                setFilteredJoker(match || null);
            } else {
                setFilteredJoker(null);
            }
        } if (dbAddS === "Decks") {
            if (searchIndex !== null) {
                const match = decksS.find(deck => deck.index === searchIndex);
                setFilteredDecks(match || null);
            } else {
                setFilteredDecks(null);
            }
        }


    }, [searchIndex, jokersS, decksS, dbAddS]);

    const addToDb = async (
        index: number,
        dataP: propsAddDb


    ): Promise<void> => {
        const JokerData: Jokers = {
            name: dataP.name,
            rarity: dataP.rarity,
            requeriments: dataP.requeriments,
            type: dataP.type,
            img: dataP.img,
            cost: dataP.cost,
            index
        }
        const DecksData: Decks = {
            name: dataP.name,
            description: dataP.description,
            requeriments: dataP.requeriments,
            img: dataP.img,
            index
        }
        let data = {}
        if (dbAddS === "Jokers") data = JokerData
        if (dbAddS === "Decks") data = DecksData

        await setDoc(doc(db, dbAddS, index.toString()), data);
        if (dbAddS === "Jokers") {
            setJokerN('')
            setJokerI('')
        } if (dbAddS === 'Decks') {
            setJokerN('')
            setJokerI('')
            setJokerD('')
            setJokerRe('')
        }

    }
    const isValid =
        jokerRa.length > 0 &&
        jokerRe.length > 0 &&
        jokerT.length > 0 &&
        jokerI.length > 0 &&
        jokerC >= 0 &&
        jokerId > 0;
    const isValid2 =
        jokerN.length > 0 &&
        jokerRe.length > 0 &&
        jokerD.length > 0 &&
        jokerI.length > 0 &&
        jokerId >= 0;
    const resetStates = () => {
        setJoker(false)
        setJokerN('')
        setJokerRa('')
        setJokerRe('')
        setJokerT('')
        setJokerI('')
        setJokerC(0)
        setJokerId(0)
        setJokerD('')
        setSearchIndex(0)
    }
    return (
        <article>
            {userData ? (
                <>
                    <section className='primary-text flex flex-col gap-4 py-2 px-4'>
                        <select
                            name="JRA"
                            id="jokerRarity"
                            value={jokerRa}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setDbAddS(e.target.value);
                                resetStates()

                            }}
                            className='block border bg-gray-800 w-full p-2 primary-text'
                        >
                            <option className='primary-text bg-gray-800' disabled value="">Seleccione una opción</option>
                            <option className='primary-text bg-gray-800' value="Jokers">Jokers</option>
                            <option className='primary-text bg-gray-800' value="Decks">Decks</option>
                            <option className='primary-text bg-gray-800' value="Stakes">Stakes</option>
                            <option className='primary-text bg-gray-800' value="Consumibles">Consumibles</option>
                        </select>

                        {dbAddS === 'Jokers' && (
                            <header>
                                <input
                                    type="text"
                                    placeholder="Nombre de el joker"
                                    value={jokerN}
                                    onChange={(e) => setJokerN(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <select
                                    name="JRA"
                                    id="jokerRarity"
                                    value={jokerRa}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setJokerRa(e.target.value);
                                    }}
                                    className='block border bg-gray-800 w-full p-2 primary-text'
                                >
                                    <option className='primary-text bg-gray-800' disabled value="">Seleccione una opción</option>
                                    <option className='primary-text bg-gray-800' value="Common">Common</option>
                                    <option className='primary-text bg-gray-800' value="Uncommon">Uncommon</option>
                                    <option className='primary-text bg-gray-800' value="Rare">Rare</option>
                                    <option className='primary-text bg-gray-800' value="Legendary">Legendary</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Requerimientos"
                                    value={jokerRe}
                                    onChange={(e) => setJokerRe(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <select
                                    name="JT"
                                    id="jokerType"
                                    value={jokerT}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setJokerT(e.target.value);
                                    }}
                                    className='block border bg-gray-800 p-2 w-full primary-text'
                                >
                                    <option className='primary-text bg-gray-800' disabled value="">Elije una opcion</option>
                                    <option className='primary-text bg-gray-800' value="+c">+c</option>
                                    <option className='primary-text bg-gray-800' value="+$">+$</option>
                                    <option className='primary-text bg-gray-800' value="+m">+m</option>
                                    <option className='primary-text bg-gray-800' value="Xm">Xm</option>
                                    <option className='primary-text bg-gray-800' value="++">++</option>
                                    <option className='primary-text bg-gray-800' value="!!">!!</option>
                                    <option className='primary-text bg-gray-800' value="...">...</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Imagen de el joker"
                                    value={jokerI}
                                    onChange={(e) => setJokerI(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Costo de el joker"
                                    value={Number(jokerC)}
                                    onChange={(e) => setJokerC(Number(e.target.value))}
                                    className="border p-2 w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Indice de el joker"
                                    value={jokerId + 1}
                                    disabled
                                    className="border p-2 w-full"
                                />
                            </header>
                        )}
                        {dbAddS === 'Decks' && (
                            <header>

                                <select
                                    name="JRA"
                                    id="jokerRarity"
                                    value={jokerN}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setJokerN(e.target.value);
                                    }}
                                    className='block border bg-gray-800 w-full p-2 primary-text'
                                >
                                    <option className='primary-text bg-gray-800' disabled value="">Nombre</option>
                                    <option className='primary-text bg-gray-800' value="Red">Red</option>
                                    <option className='primary-text bg-gray-800' value="Blue">Blue</option>
                                    <option className='primary-text bg-gray-800' value="Yellow">Yellow</option>
                                    <option className='primary-text bg-gray-800' value="Green">Green</option>
                                    <option className='primary-text bg-gray-800' value="Black">Black</option>
                                    <option className='primary-text bg-gray-800' value="Magic">Magic</option>
                                    <option className='primary-text bg-gray-800' value="Nebula">Nebula</option>
                                    <option className='primary-text bg-gray-800' value="Ghost">Ghost</option>
                                    <option className='primary-text bg-gray-800' value="Abandoned">Abandoned</option>
                                    <option className='primary-text bg-gray-800' value="Checkered">Checkered</option>
                                    <option className='primary-text bg-gray-800' value="Zodiac">Zodiac</option>
                                    <option className='primary-text bg-gray-800' value="Painted">Painted</option>
                                    <option className='primary-text bg-gray-800' value="Anaglyph">Anaglyph</option>
                                    <option className='primary-text bg-gray-800' value="Plasma">Plasma</option>
                                    <option className='primary-text bg-gray-800' value="Erratic">Erratic</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Descripcion"
                                    value={jokerD}
                                    onChange={(e) => setJokerD(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Requerimientos"
                                    value={jokerRe}
                                    onChange={(e) => setJokerRe(e.target.value)}
                                    className="border p-2 w-full"
                                />

                                <input
                                    type="text"
                                    placeholder="Imagen de el maso"
                                    value={jokerI}
                                    onChange={(e) => setJokerI(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Indice de el joker"
                                    value={jokerId + 1}
                                    disabled
                                    className="border p-2 w-full"
                                />
                            </header>
                        )}

                        {dbAddS === 'Jokers' && (
                            <footer className='w-full flex gap-4'>
                                <button className={`${!joker ? "cursor-pointer w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={joker ? (() => setJoker(false)) : (() => setJoker(true))}>
                                    Joker?
                                </button>
                                <button className={`${!isValid ? "cursor-not-allowed w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={() => {
                                    if (isValid) {
                                        if (joker) {
                                            addToDb(jokerId + 1, {
                                                name: jokerN + " Joker",
                                                rarity: jokerRa,
                                                requeriments: jokerRe,
                                                type: jokerT,
                                                img: "https://balatrowiki.org" + jokerI,
                                                cost: jokerC
                                            });
                                            alert("Se agregó correctamente el Joker " + jokerN);
                                        } else {
                                            addToDb(jokerId + 1, {
                                                name: jokerN + " Joker",
                                                rarity: jokerRa,
                                                requeriments: jokerRe,
                                                type: jokerT,
                                                img: "https://balatrowiki.org" + jokerI,
                                                cost: jokerC
                                            });
                                            alert("Se agregó correctamente el Joker " + jokerN);
                                        }
                                    } else {
                                        alert('Rellene todos los campos');
                                    }
                                }}>
                                    Add Joker
                                </button>
                            </footer>
                        )}
                        {dbAddS === 'Decks' && (
                            <footer className='w-full flex gap-4'>
                                <button className={`${!deck ? "cursor-pointer w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={deck ? (() => setDeck(false)) : (() => setDeck(true))}>
                                    Deck?
                                </button>
                                <button className={`${!isValid2 ? "cursor-not-allowed w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={() => {
                                    if (isValid2) {
                                        if (deck) {
                                            addToDb(1 + jokerId, {
                                                name: jokerN + " Deck",
                                                description: jokerD,
                                                requeriments: jokerRe,
                                                img: "https://balatrowiki.org" + jokerI
                                            }); alert("Se agrego correctamente el Deck " + jokerN)
                                        } else {
                                            addToDb(1 + jokerId, {
                                                name: jokerN,
                                                description: jokerD,
                                                requeriments: jokerRe,
                                                img: "https://balatrowiki.org" + jokerI
                                            }); alert("Se agrego correctamente el Deck " + jokerN)
                                        }
                                    } else {
                                        alert('Rellene todos los campos');
                                    }
                                }}>
                                    Add Deck
                                </button>
                            </footer>
                        )}

                    </section >
                    <section>
                        <input
                            type="number"
                            value={Number(searchIndex)}
                            placeholder="Buscar por index"
                            onChange={(e) => setSearchIndex(Number(e.target.value))}
                            className="border p-2 w-full"
                        />

                        {dbAddS === 'Jokers' ? (
                            filteredJoker ? (
                                <pre className="bg-gray-800 p-2 rounded">
                                    {JSON.stringify(filteredJoker, null, 2)}
                                </pre>
                            ) : (
                                <p>No se encontró ningún Joker con ese index</p>
                            )) : (<p className='absolute hidden opacity-0'></p>)
                        }
                        {dbAddS === 'Decks' ? (
                            filteredDecks ? (
                                <pre className="bg-gray-800 p-2 rounded">
                                    {JSON.stringify(filteredDecks, null, 2)}
                                </pre>
                            ) : (
                                <p>No se encontró ningún Deck con ese index</p>
                            )) : (<p className='absolute hidden opacity-0'></p>)
                        }

                        {dbAddS === 'Jokers' ? (
                            <h2 className="text-lg font-bold">Todos los Jokers:</h2>
                        ) : (<p className='absolute hidden opacity-0'></p>)
                        }
                        {dbAddS === 'Decks' ? (
                            <h2 className="text-lg font-bold">Todos los Decks:</h2>
                        ) : (<p className='absolute hidden opacity-0'></p>)
                        }

                        <table className="space-y-2 w-[100%]">
                            <tbody>

                                {dbAddS === 'Jokers' ? (
                                    jokersS.map((joker) => (
                                        <tr key={joker.index} className="border h-[200px] flex p-2 rounded">
                                            <td className='w-[5%] flex  justify-center items-center'>{joker.index}</td>
                                            <td className='w-[20%] border-l flex flex-col justify-center items-center'>
                                                <picture> <Image src={joker.img ? joker.img : "https://balatrowiki.org/"} alt={joker.name ? joker.name : ""} width={80} height={80} /></picture>
                                                <strong>{joker.name}</strong>
                                            </td>
                                            <td className='w-[20%] border-l flex justify-center items-center'>
                                                <strong>{joker.rarity}</strong>
                                            </td>
                                            <td className='w-[5%] flex  justify-center items-center'>{joker.cost}</td>
                                            <td className='w-[20%] border-l flex justify-center items-center'>
                                                <strong>{joker.requeriments}</strong>
                                            </td>
                                            <td className='w-[20%] border-l flex justify-center items-center'>
                                                <strong>{joker.type}</strong>
                                            </td>
                                        </tr>
                                    ))) : (<tr className='absolute hidden opacity-0'><td><p></p></td></tr>)}
                                {dbAddS === 'Decks' ? (
                                    decksS.map((deck) => (
                                        <tr key={deck.index} className="border h-[200px] flex p-2 rounded">
                                            <td className='w-[5%] flex  justify-center items-center'>{deck.index}</td>
                                            <td className='w-[20%] border-l flex flex-col justify-center items-center'>
                                                <picture> <Image src={deck.img ? deck.img : "https://balatrowiki.org/"} alt={deck.name ? deck.name : ""} width={80} height={80} /></picture>
                                                <strong>{deck.name}</strong>
                                            </td>
                                            <td className='w-[20%] border-l flex justify-center items-center'>
                                                <strong>{deck.description}</strong>
                                            </td>
                                            <td className='w-[20%] border-l flex justify-center items-center'>
                                                <strong>{deck.requeriments}</strong>
                                            </td>
                                        </tr>
                                    ))) : (<tr><td><p>No se encontró ningún Deck</p></td></tr>)}
                            </tbody>
                        </table>
                    </section>
                </>

            ) : (
                <Loading />
            )}
        </article>

    )
}

export default page