export type Char = {
    id: number,
    name: string,
    description: string,
    thumbnail: string,
    homepage: string,
    wiki: string,
    comics: {
        resourceURI: string,
        name: string
    }[]
}