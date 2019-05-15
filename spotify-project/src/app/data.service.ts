import { Injectable } from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import { Track, Artist, PlayHistoryObject } from './models/SpotifyObjects';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private timeRange: string;
  private topSpotifyTracks: Subject<Track[]> = new Subject();
  private recentlyPlayedTracks: Subject<PlayHistoryObject[]> = new Subject();
  private topSpotifyArtists: Subject<Artist[]> = new Subject();
  private topSpotifyGenres: Subject<[[string, number]]> = new Subject();

  constructor(
    private spotifyService: SpotifyService,
  ) { }

  public updateData(timeRange: string) {
    this.timeRange = timeRange;
    this.updateTopTracksAndGenres();
    this.updateTopArtists();
    this.updateRecentlyPlayed()
  }

  public get topTracks(): Observable<Track[]> {
    return this.topSpotifyTracks;
  }

  public get recentlyPlayed(): Observable<PlayHistoryObject[]> {
    return this.recentlyPlayedTracks;
  }

  public get topArtists(): Observable<Artist[]> {
    return this.topSpotifyArtists;
  }

  public get topGeneres(): Observable<[[string, number]]> {
    return this.topSpotifyGenres;
  }

  private updateTopTracksAndGenres() {
    this.spotifyService.getTopSongsNew(this.timeRange).subscribe(async (tracks: [Track[], Track[]]) => {
      let flatTracks = this.flattenArray(tracks);
      this.topSpotifyTracks.next(flatTracks);

      //Calculate geners
      let artistIds = this.extractArtistIds(flatTracks);
      //API call can only handle 50 ids at time
      if (artistIds.length > 50) {
        let artists = [];
        let i: number, j: number, chunk = 50;
        for (i = 0, j = artistIds.length; i < j; i += chunk) {
          let chunkIds = artistIds.slice(i, i + chunk);
          let chunkOfArtists = await this.spotifyService.getArtists(chunkIds).toPromise();
          artists.push(chunkOfArtists);
        }
        let flattendArtists = this.flattenArray(artists);
        let genreCountMap = this.countGenres(flattendArtists);
        let sortedGenres = this.sortGenres(genreCountMap);
        this.topSpotifyGenres.next(sortedGenres);
      } else {
        this.spotifyService.getArtists(artistIds).subscribe((artists: Artist[]) => {
          let genreCountMap = this.countGenres(artists);
          let sortedGenres = this.sortGenres(genreCountMap);
          this.topSpotifyGenres.next(sortedGenres);
        });
      }
    });
  }

  private updateTopArtists() {
    this.spotifyService.getTopArtistsNew(this.timeRange).subscribe((artists: [Artist[], Artist[]]) => {
      let flatArtists = this.flattenArray(artists);
      this.topSpotifyArtists.next(flatArtists);
    });
  }

  private updateRecentlyPlayed() {
    this.spotifyService.getRecentlyPlayed(50).subscribe((recentlyPlayed: PlayHistoryObject[]) => {
      this.recentlyPlayedTracks.next(recentlyPlayed);
    })
  }


  //Helper Functions

  private flattenArray(array): [any] {
    return [].concat.apply([], array);
  }

  private extractArtistIds(tracks: Track[]): string[] {
    let artistIds: string[] = [];
    for (let track of tracks) {
      for (let artist of track.artists) {
        artistIds.push(artist.id);
      }
    }
    return artistIds;
    // return Array.from(new Set(artistIds));
  }

  private countGenres(artists: Artist[]) {
    let genreMap = {};

    for (let artist of artists) {
      for (let genre of artist.genres) {
        if (!genreMap[genre]) {
          genreMap[genre] = 1;
        } else {
          genreMap[genre]++;
        }
      }
    }
    return genreMap;
  }

  private sortGenres(genreMap): [[string, number]] {
    let sortable = [];
    for (let genre in genreMap) {
      sortable.push([genre, genreMap[genre]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    //kinda dirty
    return <[[string, number]]>sortable;
  }

}
