export interface Jokers {
    name: string | undefined;
    rarity: string | undefined;
    requeriments: string | undefined;
    type: string | undefined;
    img: string | undefined;
    cost: number | null | undefined;
    index: number | null
}
export interface Decks {
    name: string | undefined;
    description: string | undefined;
    requeriments: string | undefined;
    img: string | undefined;
    index: number | null;
}
export interface Cards {
    name: string | undefined;
    type: string | undefined;
    value: number | null | undefined;
    img: string | undefined;
    index: number | null;
}
export interface propsAddDb {
    name?: string,
    rarity?: string,
    requeriments?: string,
    type?: string,
    img?: string,
    cost?: number,
    description?: string,
    value?: number |null;
}




export interface UserData {
    displayName: string;
    image: string;
    categoria: string;
};