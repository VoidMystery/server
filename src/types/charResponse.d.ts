export interface CharResponse {
    code: number
    status: string
    copyright: string
    attributionText: string
    attributionHTML: string
    etag: string
    data: CharData
}

export interface CharData {
    offset: number
    limit: number
    total: number
    count: number
    results: CharResult[]
}

export interface CharResult {
    id: number
    name: string
    description: string
    modified: string
    thumbnail: CharThumbnail
    resourceURI: string
    comics: CharComics
    series: CharSeries
    stories: CharStories
    events: CharEvents
    urls: CharUrl[]
}

interface CharThumbnail {
    path: string
    extension: string
}

interface CharComics {
    available: number
    collectionURI: string
    items: CharItem[]
    returned: number
}

interface CharItem {
    resourceURI: string
    name: string
}

interface CharSeries {
    available: number
    collectionURI: string
    items: CharItem2[]
    returned: number
}

interface CharItem2 {
    resourceURI: string
    name: string
}

interface CharStories {
    available: number
    collectionURI: string
    items: CharItem3[]
    returned: number
}

interface CharItem3 {
    resourceURI: string
    name: string
    type: string
}

interface CharEvents {
    available: number
    collectionURI: string
    items: CharItem4[]
    returned: number
}

interface CharItem4 {
    resourceURI: string
    name: string
}

interface CharUrl {
    type: string
    url: string
}