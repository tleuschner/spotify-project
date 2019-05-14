export class AudioFeaturesWrapper {
    audioFeatures: AudioFeatures[];
}

export class PlaylistTracksPagingObject {
    href:     string;
    items:    PlaylistTrack[];
    limit:    number;
    next:     null;
    offset:   number;
    previous: null;
    total:    number;
}

export class TopArtistsPagingObject {
    href: string;
    items: Artist[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export class TopTracksPagingObject {
    href: string;
    items: Track[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export class PlaylistPagingObject {
    href:     string;
    items:    Playlist[];
    limit:    number;
    next:     string;
    offset:   number;
    previous: null;
    total:    number;
}

export class Playlist {
    collaborative: boolean;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    images:        Image[];
    name:          string;
    owner:         Owner;
    primary_color: null;
    public:        boolean;
    snapshot_id:   string;
    tracks:        Tracks;
    type:          ItemType;
    uri:           string;
}

export class Owner {
    display_name:  string;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    type:          OwnerType;
    uri:           string;
}

export enum OwnerType {
    User = "user",
}

export class Tracks {
    href:  string;
    total: number;
}

export enum ItemType {
    Playlist = "playlist",
}

export enum AlbumType {
    Album = "ALBUM",
    Single = "SINGLE",
}

export enum ArtistType {
    Artist = "artist",
}

export enum ReleaseDatePrecision {
    Day = "day",
    Year = "year",
}


export enum ItemType {
    Track = "track",
}


export class Followers {
    href: null;
    total: number;
}


export class RecentlyPlayed {
    items:   RecentlyPlayedItem[];
    next:    string;
    cursors: Cursors;
    limit:   number;
    href:    string;
}

export class Cursors {
    after:  string;
    before: string;
}

export class RecentlyPlayedItem {
    track:     Track;
    played_at: string;
    context:   Context | null;
}

export class Context {
    uri:           string;
    external_urls: ExternalUrls;
    href:          string;
    type:          ContextType;
}

export enum ContextType {
    Artist = "artist",
}

export enum AlbumTypeEnum {
    Album = "album",
    Single = "single",
}

export enum TrackType {
    Track = "track",
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
    artists:           Artist[];
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

export class ExternalIDS {
    isrc: string;
}


export class Image {
    height: number;
    url:    string;
    width:  number;
}

export class Album {
    album_type:             AlbumType;
    artists:                Artist[];
    available_markets:      string[];
    external_urls:          ExternalUrls;
    href:                   string;
    id:                     string;
    images:                 Image[];
    name:                   string;
    release_date:           string;
    release_date_precision: ReleaseDatePrecision;
    total_tracks:           number;
    type:                   AlbumTypeEnum;
    uri:                    string;
}

export class PlayHistoryObject {
    track: Track;
    played_at: string;
    context: ContextObject;
}

export class ContextObject {
    type: string;
    href: string;
    external_urls: ExternalUrls;
    uri: string;
}

export class Artist {
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

export class AudioFeatures {
    danceability:     number;
    energy:           number;
    key:              number;
    loudness:         number;
    mode:             number;
    speechiness:      number;
    acousticness:     number;
    instrumentalness: number;
    liveness:         number;
    valence:          number;
    tempo:            number;
    type:             string;
    id:               string;
    uri:              string;
    track_href:       string;
    analysis_url:     string;
    duration_ms:      number;
    time_signature:   number;
}