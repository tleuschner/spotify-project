// Generated by https://quicktype.io

export class TopArtistsPagingObject {
    href: string;
    items: TopArtists[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export class TopArtists {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export class ExternalUrls {
    spotify: string;
}

export class Followers {
    href: null;
    total: number;
}

export class Image {
    height: number;
    url: string;
    width: number;
}