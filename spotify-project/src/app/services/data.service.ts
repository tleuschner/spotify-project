import { Injectable } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { Track, Artist, PlayHistoryObject, AudioFeatures } from '../models/SpotifyObjects';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private timeRange: string;
  private topSpotifyTracks: ReplaySubject<Track[]> = new ReplaySubject(1);
  private recentlyPlayedTracks: ReplaySubject<PlayHistoryObject[]> = new ReplaySubject(1);
  private topSpotifyArtists: ReplaySubject<Artist[]> = new ReplaySubject(1);
  private topSpotifyGenres: ReplaySubject<[[string, number]]> = new ReplaySubject(1);
  private artistsBehindGenres: ReplaySubject<[[string, string]]> = new ReplaySubject(1);

  constructor(
    private spotifyService: SpotifyService,
  ) { }


  public updateData(timeRange: string) {
    this.timeRange = timeRange;
    this.updateTopTracksAndGenres();
    this.updateTopArtists();
    this.updateRecentlyPlayed();
  }

  public get topTracks(): Observable<Track[]> {
    return this.topSpotifyTracks.asObservable();
  }

  public get recentlyPlayed(): Observable<PlayHistoryObject[]> {
    return this.recentlyPlayedTracks.asObservable();
  }

  public get topArtists(): Observable<Artist[]> {
    return this.topSpotifyArtists.asObservable();
  }

  public get topGeneres(): Observable<[[string, number]]> {
    return this.topSpotifyGenres.asObservable();
  }

  public get topArtistsToGeneres(): Observable<[[string, string]]> {
    return this.artistsBehindGenres.asObservable();
  }

  private updateTopTracksAndGenres() {
    this.spotifyService.getTopSongs('49', '0', this.timeRange).subscribe((firstTracks: Track[]) => {
      this.spotifyService.getTopSongs('50', '49', this.timeRange).subscribe(async (secondTracks: Track[]) => {
        let flatTracks = this.flattenArray([firstTracks, secondTracks]);
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
        let responses = this.countGenres(flattendArtists);
        let genreCountMap = responses[0];
        let countArtistToGenre = responses[1];
        let sortedGenres = this.sortGenres(genreCountMap);
        let sortedArtistToGenre = this.sortArtistsToGenres(countArtistToGenre);
        this.topSpotifyGenres.next(sortedGenres);
        this.artistsBehindGenres.next(sortedArtistToGenre);
      } else {
        
        this.spotifyService.getArtists(artistIds).subscribe((artists: Artist[]) => {
          let responses = this.countGenres(artists);
          let genreCountMap = responses[0];
          let countArtistToGenre = responses[1];
          let sortedGenres = this.sortGenres(genreCountMap);
          let sortedArtistToGenre = this.sortArtistsToGenres(countArtistToGenre);
          this.topSpotifyGenres.next(sortedGenres);
          this.artistsBehindGenres.next(sortedArtistToGenre);
        });
      }
      });
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
  }

  private countGenres(artists: Artist[]) {
    let genreMap = {};
    let genreArtistMap = {};

    for (let artist of artists) {
      for (let genre of artist.genres) {
        if (!genreMap[genre]) {
          genreMap[genre] = 1;
          genreArtistMap[genre] = [artist.name,artist.images[0].url];
        } else {
          genreMap[genre]++;
          genreArtistMap[genre] = this.proofExistenzOfArtist(genreArtistMap[genre],[artist.name,artist.images[0].url]);
        }
      }
    }
    return [genreMap,genreArtistMap];
  }

  private proofExistenzOfArtist(names: string[], newName: string[]){
    console.log("DEBUG: ",names,newName);
    let artists = names[0].split(", ");
    for(let artist of artists){
      console.log("ARTIST: ",artist)
      console.log("PROOF: ",artist,"  ||   ",newName[0]);
      if(artist == newName[0]){
        return names;
      }
    }
    names[0] = names[0] + ", " + newName[0];
    names[1] = names[1] + ", " + newName[1];

    return names;
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

  private sortArtistsToGenres(genreMap): [[string, string]] {
    let sortable = [];
    for (let genre in genreMap) {
      sortable.push([genre, genreMap[genre]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    //kinda dirty
    return <[[string, string]]>sortable;
  }
}
