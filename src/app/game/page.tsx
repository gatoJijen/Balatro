"use client";

import React, { useEffect, useState } from 'react';

interface Carta {
    id: number;
    nombre: string;
    valor: number;
}

const MAX_APARICIONES = 2;
const MAX_DESCARTES = 100;
const MAX_MULTIPLICACIONES = 100;




const CartasRandom: React.FC = () => {
    const [mazo, setMazo] = useState<Carta[]>([]);
    const [disponibles, setDisponibles] = useState<Carta[]>([]);
    const [seleccionadas, setSeleccionadas] = useState<Carta[]>([]);
    const [resultado, setResultado] = useState<number | null>(null);
    const [apariciones, setApariciones] = useState<Record<string, number>>({});
    const [blind, setBlind] = useState<string>()
    const [sumaM, setSumaM] = useState<number>()
    const [multiplicadorM, setMultiplicadorM] = useState<number>()
    const [descartesUsados, setDescartesUsados] = useState<number>(0);
    const [multiplicacionesUsadas, setMultiplicacionesUsadas] = useState<number>(0);

    // 🔁 Inicializar mazo
    useEffect(() => {
        const mazoCompleto = generarMazo();
        setMazo(mazoCompleto);
        generarCartasDisponibles(mazoCompleto, {});
    }, []);

    useEffect(() => {

        const nombreBase = (nombre: string) => nombre.replace(/[♠️♥️♦️♣️]/g, '');

        const conteo: Record<string, Carta[]> = {};
        const valorCarta = (nombre: string): number => {
            const base = nombreBase(nombre);
            if (base === 'A') return 1;
            if (base === 'J') return 11;
            if (base === 'Q') return 12;
            if (base === 'K') return 13;
            return parseInt(base);
        };

        const obtenerPalo = (nombre: string): string => {
            const match = nombre.match(/[♠️♥️♦️♣️]/);
            return match ? match[0] : '';
        };

        for (const carta of seleccionadas) {
            const base = nombreBase(carta.nombre);
            if (!conteo[base]) conteo[base] = [];
            conteo[base].push(carta);
        }

        const grupos = Object.values(conteo);
        const pares = grupos.filter(grupo => grupo.length === 2);
        const trios = grupos.filter(grupo => grupo.length === 3);

        const esEscaleraValida = (valores: number[]): boolean => {
            const sorted = [...new Set(valores)].sort((a, b) => a - b);
            if (sorted.length !== 5) return false;

            // Comprobar si forman una secuencia consecutiva
            const esSecuencia = sorted.every((val, i, arr) =>
                i === 0 || val === arr[i - 1] + 1
            );
            if (esSecuencia) return true;

            // Comprobar si es 10-J-Q-K-A (tratando A como 14)
            const como14 = valores.map(v => (v === 1 ? 14 : v));
            const sorted14 = [...new Set(como14)].sort((a, b) => a - b);
            return sorted14.join(',') === '10,11,12,13,14';
        };

        // Aplica la mejor jugada posible
        if (pares.length === 2) {
            const suma = 20;
            const multiplicador = 2
            setSumaM(suma)
            setMultiplicadorM(multiplicador)
            setBlind('Doble Par')
        } else if (trios.length === 1 && pares.length === 1) {
            // Trío + un par (no lo pediste explícito, pero puede considerarse futuro)
            const sumaTrio = trios[0].reduce((acc, carta) => acc + carta.valor, 0);
            const sumaPar = pares[0].reduce((acc, carta) => acc + carta.valor, 0);
            const suma = 40
            const multiplicador = 4
            setSumaM(suma)
            setMultiplicadorM(multiplicador)
            setBlind('Full House')
        } else if (trios.length === 1) {
            // Solo trío
            const suma = 30;
            const multiplicador = 3
            setSumaM(suma)
            setMultiplicadorM(multiplicador)
            setBlind('Trio')
        } else if (pares.length === 1) {
            // Solo un par
            const suma = 10;
            const multiplicador = 2
            setSumaM(suma)
            setMultiplicadorM(multiplicador)
            setBlind('Par')
        } else if (seleccionadas.length === 5) {
            const valoresBase = seleccionadas.map(c => valorCarta(c.nombre));
            if (esEscaleraValida(valoresBase)) {
                const suma = 30;
                const multiplicador = 4
                setSumaM(suma)
                setMultiplicadorM(multiplicador)
                setBlind('Escalera')
            }
        }else if (seleccionadas.length === 5) {
            const valores = seleccionadas.map(c => valorCarta(c.nombre));
            const palos = seleccionadas.map(c => obtenerPalo(c.nombre));
            const todosIguales = palos.every(p => p === palos[0]);

            if (esEscaleraValida(valores) && todosIguales) {
                // Escalera de color;
                const suma = 100;
                const multiplicador = 8;
                setSumaM(suma)
                setMultiplicadorM(multiplicador)
                setBlind('Escalera de color')
            } else if (todosIguales) {
                // Color
                const suma = 35
                const multiplicador = 4
                setSumaM(suma)
                setMultiplicadorM(multiplicador)
                setBlind('Color')
            } else if (esEscaleraValida(valores)) {
                const suma = 30;
                const multiplicador = 4
                setSumaM(suma)
                setMultiplicadorM(multiplicador)
                setBlind('Escalera')
            }
            // Luego vienen trío, pares, carta mayor, etc...
        } else {
            const cartaMayor = seleccionadas.reduce((max, carta) =>
                carta.valor > max.valor ? carta : max
                , seleccionadas[0]);

            const suma = 5;
            const multiplicador = 1;
            setSumaM(suma)
            setMultiplicadorM(multiplicador)
            setBlind('Carta alta')
        }
    }, [seleccionadas])

    const manejarSeleccion = (carta: Carta) => {
        setSeleccionadas((prev) => {
            const yaSeleccionada = prev.find((c) => c.id === carta.id);

            if (yaSeleccionada) {
                // Si ya está seleccionada, quitarla
                return prev.filter((c) => c.id !== carta.id);
            } else {
                // Si aún no está y hay menos de 5 seleccionadas, agregarla
                if (prev.length < 5) {
                    return [...prev, carta];
                } else {
                    // Ya hay 5 cartas, no hacer nada
                    return prev;
                }
            }
        });
    };




    const procesarCartas = () => {
        if (multiplicacionesUsadas >= MAX_MULTIPLICACIONES) return;

        const nombreBase = (nombre: string) => nombre.replace(/[♠️♥️♦️♣️]/g, '');
        const valorCarta = (nombre: string): number => {
            const base = nombre.replace(/[♠️♥️♦️♣️]/g, '');
            if (base === 'A') return 1;
            if (base === 'J') return 11;
            if (base === 'Q') return 12;
            if (base === 'K') return 13;
            return parseInt(base);
        };
        const obtenerPalo = (nombre: string): string => {
            const match = nombre.match(/[♠️♥️♦️♣️]/);
            return match ? match[0] : '';
        };



        const esEscaleraValida = (valores: number[]): boolean => {
            const sorted = [...new Set(valores)].sort((a, b) => a - b);
            if (sorted.length !== 5) return false;

            // Comprobar si forman una secuencia consecutiva
            const esSecuencia = sorted.every((val, i, arr) =>
                i === 0 || val === arr[i - 1] + 1
            );
            if (esSecuencia) return true;

            // Comprobar si es 10-J-Q-K-A (tratando A como 14)
            const como14 = valores.map(v => (v === 1 ? 14 : v));
            const sorted14 = [...new Set(como14)].sort((a, b) => a - b);
            return sorted14.join(',') === '10,11,12,13,14';
        };

        const conteo: Record<string, Carta[]> = {};
        for (const carta of seleccionadas) {
            const base = nombreBase(carta.nombre);
            if (!conteo[base]) conteo[base] = [];
            conteo[base].push(carta);
        }

        const grupos = Object.values(conteo);
        const pares = grupos.filter(grupo => grupo.length === 2);
        const trios = grupos.filter(grupo => grupo.length === 3);

        let total = 0;

        // ✅ Detectar escalera (solo si hay 5 cartas)
        if (seleccionadas.length === 5) {
            const valores = seleccionadas.map(c => valorCarta(c.nombre));
            const palos = seleccionadas.map(c => obtenerPalo(c.nombre));
            const todosIguales = palos.every(p => p === palos[0]);

            if (esEscaleraValida(valores) && todosIguales) {
                // Escalera de color
                const suma = seleccionadas.reduce((acc, c) => acc + c.valor, 0);
                total = (suma + 50) * 5;
            } else if (todosIguales) {
                // Color
                const suma = seleccionadas.reduce((acc, c) => acc + c.valor, 0);
                total = (suma + 35) * 4;
            } else if (esEscaleraValida(valores)) {
                // Escalera
                const suma = seleccionadas.reduce((acc, c) => acc + c.valor, 0);
                total = (suma + 30) * 4;
            }
            // Luego vienen trío, pares, carta mayor, etc...
        }

        // 🟡 Si no fue escalera, aplicar otras combinaciones
        if (total === 0) {
            if (pares.length === 2) {
                const suma = pares.flat().reduce((acc, carta) => acc + carta.valor, 0);
                total = (suma + 20) * 2;
            } else if (trios.length === 1 && pares.length === 1) {
                const sumaTrio = trios[0].reduce((acc, carta) => acc + carta.valor, 0);
                const sumaPar = pares[0].reduce((acc, carta) => acc + carta.valor, 0);
                total = (sumaTrio + sumaPar + 40) * 4;
            } else if (trios.length === 1) {
                const suma = trios[0].reduce((acc, carta) => acc + carta.valor, 0);
                total = (suma + 30) * 3;
            } else if (pares.length === 1) {
                const suma = pares[0].reduce((acc, carta) => acc + carta.valor, 0);
                total = (suma + 10) * 2;
            } else {
                const cartaMayor = seleccionadas.reduce(
                    (max, carta) => (carta.valor > max.valor ? carta : max),
                    seleccionadas[0]
                );
                total = cartaMayor.valor + 5;
            }
        }

        setResultado(total);

        // 🧠 Actualizar apariciones
        const nuevasApariciones = { ...apariciones };
        for (const carta of seleccionadas) {
            nuevasApariciones[carta.nombre] = (nuevasApariciones[carta.nombre] || 0) + 1;
        }
        setApariciones(nuevasApariciones);

        // ♻️ Limpiar selección y generar nuevas cartas
        setSeleccionadas([]);
        generarCartasDisponibles(mazo, nuevasApariciones);
        setMultiplicacionesUsadas((prev) => prev + 1);
    };

    const descartarCartas = () => {
        if (descartesUsados >= MAX_DESCARTES) return;

        const cantidadDescartadas = seleccionadas.length;

        const nuevoMazo = mazo.filter(
            (carta) => !seleccionadas.some((sel) => sel.id === carta.id)
        );
        setMazo(nuevoMazo);

        const nuevasDisponibles = disponibles.filter(
            (carta) => !seleccionadas.some((sel) => sel.id === carta.id)
        );

        const nuevasCartas = mezclarCartas(nuevoMazo).filter(
            (carta) =>
                !nuevasDisponibles.some((d) => d.id === carta.id) &&
                (apariciones[carta.nombre] || 0) < MAX_APARICIONES
        ).slice(0, cantidadDescartadas);

        setDisponibles([...nuevasDisponibles, ...nuevasCartas]);
        setSeleccionadas([]);
        setDescartesUsados((prev) => prev + 1);
    };





    const generarCartasDisponibles = (mazo: Carta[], apariciones: Record<string, number>) => {
        const disponiblesFiltradas = mezclarCartas(mazo).filter(
            (carta) => (apariciones[carta.nombre] || 0) < MAX_APARICIONES
        );
        setDisponibles(disponiblesFiltradas.slice(0, 10));
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Cartas disponibles:</h2>
            <div className="flex gap-3 flex-wrap">
                {disponibles.map((carta) => (
                    <button
                        key={carta.id}
                        onClick={() => { setResultado(0); manejarSeleccion(carta) }}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${seleccionadas.find((c) => c.id === carta.id)
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                            }`}
                    >
                        {carta.nombre} ({carta.valor})
                    </button>
                ))}
            </div>
            <div>
                {seleccionadas.length > 0 ? (
                    <>
                        <p>
                            {blind}
                        </p>
                        <h1>{sumaM}</h1>
                        <h1>{multiplicadorM}</h1>
                    </>
                ) : (
                    <p className='hidden absolute opacity-0'>
                        {blind}
                    </p>
                )

                }

            </div>
            {seleccionadas.length !== 5 || multiplicacionesUsadas >= MAX_MULTIPLICACIONES ? (
                <>
                    <button
                        disabled={seleccionadas.length === 0}
                        className={`px-6 py-2 rounded mt-4 transition-colors duration-200 bg-red-500 cursor-not-allowed text-white`}
                    >
                        Multiplicar x2 y reemplazar cartas ({MAX_MULTIPLICACIONES - multiplicacionesUsadas})
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={procesarCartas}
                        className={`px-6 py-2 rounded mt-4 transition-colors duration-200 bg-green-600 text-white hover:bg-green-700`}
                    >
                        Multiplicar x2 y reemplazar cartas ({MAX_MULTIPLICACIONES - multiplicacionesUsadas})
                    </button>

                </>
            )}
            {seleccionadas.length === 0 || descartesUsados >= MAX_DESCARTES ? (
                <button
                    onClick={descartarCartas}
                    className={`px-6 py-2 rounded mt-4 transition-colors duration-200 bg-red-600 cursor-not-allowed text-white`}
                >
                    Descartar ({MAX_DESCARTES - descartesUsados})
                </button>
            ) : (
                <button
                    onClick={descartarCartas}
                    className={`px-6 py-2 rounded mt-4 transition-colors duration-200 bg-green-600 text-white hover:bg-green-700`}
                >
                    Descartar ({MAX_DESCARTES - descartesUsados})
                </button>
            )

            }




            {resultado !== null && (
                <p className="mt-2 text-lg font-semibold">
                    Resultado: {resultado}
                </p>
            )}

            <div>
                <h3 className="text-lg font-semibold mt-4">Cartas seleccionadas:</h3>
                <ul className="list-disc pl-5">
                    {seleccionadas.map((carta) => (
                        <li key={carta.id}>
                            {carta.nombre} (Valor: {carta.valor})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const palos = ['♠️', '♥️', '♦️', '♣️'];
const nombres = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const generarMazo = (): Carta[] => {
    let id = 0;
    const mazo: Carta[] = [];

    for (const palo of palos) {
        for (let i = 0; i < nombres.length; i++) {
            const nombre = nombres[i];
            const valor = i + 1 > 10 ? 10 : i + 1;
            mazo.push({
                id: id++,
                nombre: `${nombre}${palo}`,
                valor,
            });
        }
    }

    return mazo;
};

const mezclarCartas = <T,>(array: T[]): T[] => {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
};

export default CartasRandom;
