import md5 from "blueimp-md5"

import { InternalServerError } from "../errors/InternalServerError";
import { Char } from "../types/char";
import { CharResponse, CharResult } from "../types/charResponse";

class MarvelService {

    private MARVEL_PRIVATE_KEY;
    private MARVEL_PUBLIC_KEY;
    private MARVEL_API_BASE;

    constructor() {
        if (!process.env.MARVEL_PRIVATE_KEY || !process.env.MARVEL_PUBLIC_KEY || !process.env.MARVEL_API_BASE) throw new InternalServerError("Can't find env variable");
        this.MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
        this.MARVEL_PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY;
        this.MARVEL_API_BASE = process.env.MARVEL_API_BASE;
    }

    getHash = (timestamp: number) => {
        return md5(timestamp + this.MARVEL_PRIVATE_KEY + this.MARVEL_PUBLIC_KEY);
    }

    getCharacterByName = async (name: string): Promise<Char | null> => {
        if (!name || name === '') return null;
        const timestamp = new Date().getTime();
        const characterLink = `${this.MARVEL_API_BASE}characters?name=${name}&ts=${timestamp}&apikey=${this.MARVEL_PUBLIC_KEY}&hash=${this.getHash(timestamp)}`;
        const res = await fetch(characterLink, {method: 'GET', headers: {
            'Content-Type': 'application/json'
        }});
        const data: CharResponse = await res.json();
        return data.data.results.length ? this.transformCharacter(data.data.results[0]) : null;
    }

    transformCharacter = (char: CharResult): Char => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }
}

export const marvelService = new MarvelService();