// Generated by https://quicktype.io

export class PlaylistTracksPagingObject {
    href:     string;
    items:    PlaylistTrack[];
    limit:    number;
    next:     null;
    offset:   number;
    previous: null;
    total:    number;
}

export class PlaylistTrack {
    added_at: string;
    added_by: AddedBy;
    is_local: boolean;
    track?:   Track;
}

export class AddedBy {
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    type:          string;
    uri:           string;
    name?:         string;
}

export class ExternalUrls {
    spotify: string;
}

export class Track {
    album:             Album;
    artists:           AddedBy[];
    available_markets: string[];
    disc_number:       number;
    duration_ms:       number;
    explicit:          boolean;
    external_ids:      ExternalIDS;
    external_urls:     ExternalUrls;
    href:              string;
    id:                string;
    name:              string;
    popularity:        number;
    preview_url:       string;
    track_number:      number;
    type:              string;
    uri:               string;
}

export class Album {
    album_type:        string;
    artists:           AddedBy[];
    available_markets: string[];
    external_urls:     ExternalUrls;
    href:              string;
    id:                string;
    images:            Image[];
    name:              string;
    type:              string;
    uri:               string;
}

export class Image {
    height: number;
    url:    string;
    width:  number;
}

export class ExternalIDS {
    isrc: string;
}
