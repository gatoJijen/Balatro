"use client"
import { db } from '@/firebase/config';
import { Jokers } from '@/interfaces/global';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [jokerN, setJokerN] = useState<string>('');
    const [jokerRa, setJokerRa] = useState<string>('');
    const [jokerRe, setJokerRe] = useState<string>('none');
    const [jokerT, setJokerT] = useState<string>('');
    const [jokerI, setJokerI] = useState<string>('');
    const [jokerC, setJokerC] = useState<number | any>(0);
    const [jokerId, setJokerId] = useState<number | any>(0);
    const [joker, setJoker] = useState<boolean>(false)

    useEffect(() => {
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
    }, []);


    const [searchIndex, setSearchIndex] = useState<number>(1);
    const [filteredJoker, setFilteredJoker] = useState<Jokers | null>(null);

    const [jokersS, setJokersS] = useState<Jokers[]>([]);



    useEffect(() => {
        const q = query(
            collection(db, 'Jokers'),
            orderBy('index', 'desc') // 👈 ordena de mayor a menor
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data() as Jokers);
            setJokersS(data);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchIndex !== null) {
            const match = jokersS.find(joker => joker.index === searchIndex);
            setFilteredJoker(match || null);
        } else {
            setFilteredJoker(null);
        }
    }, [searchIndex, jokersS]);

    const addToDb = async (
        name: string,
        rarity: string,
        requeriments: string,
        type: string,
        img: string,
        cost: number,
        index: number
    ): Promise<void> => {
        const JokerData: Jokers = {
            name,
            rarity,
            requeriments,
            type,
            img,
            cost,
            index
        }
        await setDoc(doc(db, "Jokers", index.toString()), JokerData);
        setJokerN('')
        setJokerI('')
    }
    const isValid =
        jokerRa.length > 0 &&
        jokerRe.length > 0 &&
        jokerT.length > 0 &&
        jokerI.length > 0 &&
        jokerC > 0 &&
        jokerId > 0;
    return (
        <article>
            <section className='primary-text flex flex-col gap-4 py-2 px-4'>
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
                <footer className='w-full flex gap-4'>
                    <button className={`${!joker ? "cursor-pointer w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={joker ? (() => setJoker(false)) : (() => setJoker(true))}>
                        Joker?
                    </button>
                    <button className={`${!isValid ? "cursor-not-allowed w-[100px] h-[40px] p-2 bg-red-500 hover:bg-red-400 rounded-lg" : "hover:bg-green-400 w-[100px] h-[40px]  bg-green-500 cursor-pointer p-2 rounded-lg"}`} onClick={() => {
                        if (isValid) {
                            if (joker) {
                                addToDb(jokerN + " Joker", jokerRa, jokerRe, jokerT, "https://balatrowiki.org" + jokerI, jokerC, 1 + jokerId); alert("Se agrego correctamente el Joker " + jokerN)
                            } else {
                                addToDb(jokerN, jokerRa, jokerRe, jokerT, "https://balatrowiki.org" + jokerI, jokerC, 1 + jokerId); alert("Se agrego correctamente el Joker " + jokerN)
                            }
                        } else {
                            alert('Rellene todos los campos');
                        }
                    }}>
                        Add Joker
                    </button>
                </footer>


            </section >
            <section>
                <input
                    type="number"
                    value={Number(searchIndex)}
                    placeholder="Buscar por index"
                    onChange={(e) => setSearchIndex(Number(e.target.value))}
                    className="border p-2 w-full"
                />

                {filteredJoker ? (
                    <pre className="bg-gray-800 p-2 rounded">
                        {JSON.stringify(filteredJoker, null, 2)}
                    </pre>
                ) : (
                    <p>No se encontró ningún Joker con ese index</p>
                )}

                <h2 className="text-lg font-bold">Todos los Jokers:</h2>
                <table className="space-y-2 w-[100%]">
                    <tbody>

                        {jokersS.map((joker) => (
                            <tr key={joker.index} className="border h-[200px] flex p-2 rounded">
                                <td className='w-[5%] flex  justify-center items-center'>{joker.index}</td>
                                <td className='w-[20%] border-l flex flex-col justify-center items-center'>
                                    <picture> <Image src={joker.img} alt={joker.name} width={80} height={80} /></picture>
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
                        ))}
                    </tbody>
                </table>
            </section>

        </article>

    )
}

export default page