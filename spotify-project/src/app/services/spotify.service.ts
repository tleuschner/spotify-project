import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { Artist, TopArtistsPagingObject, TopTracksPagingObject, Track, TopTracks, Playlist, PlaylistPagingObject, AudioFeatures, PlaylistTrack, PlaylistTracksPagingObject, RecentlyPlayed } from '../models/SpotifyObjects';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private timeRangeSub = new BehaviorSubject<string>('medium_term');
  private readonly apiBaseUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService
  ) { }

  private headers = new HttpHeaders({
    "Authorization": "Bearer " + this.oauthService.getAccessToken()
  });

  public getTopArtists(limit = '20', offset = '0', timeRange = 'medium_term'): Observable<Artist[]> {
    return this.http.get<TopArtistsPagingObject>(`${this.apiBaseUrl}/me/top/artists`, {
      headers: this.headers,
      params: {
        limit: limit,
        offset: offset,
        time_range: timeRange
      }
    }).pipe(
      map(res => res.items)
    );
  }

  public getArtists(ids: string[]): Observable<Artist[]> {
    if (ids !== undefined && ids.length <= 100) {
      return this.http.get<any>(`${this.apiBaseUrl}/artists`, {
        headers: this.headers, params: {
          ids: ids.join(',')
        }
      });
      //TODO: do this
    } else {

    }
  }

  public getTopSongs(limit = '20', offset = '0', timeRange = 'medium_term'): Observable<TopTracks[]> {
    return this.http.get<TopTracksPagingObject>(`${this.apiBaseUrl}/me/top/tracks`, {
      headers: this.headers,
      params: {
        limit: limit,
        offset: offset,
        time_range: timeRange
      }
    }).pipe(
      map(res => res.items)
    );
  }

  public getPlaylists(): Observable<Playlist[]> {
    return this.http.get<PlaylistPagingObject>(`${this.apiBaseUrl}/me/playlists`, { headers: this.headers }).pipe(
      map(res => res.items)
    );
  }

  public getRecentlyPlayed(count: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/me/player/recently-played?limit=50`, { headers: this.headers });
  }

  public getAudioFeatures(ids: string[]): Observable<AudioFeatures[]> {
    if (ids !== undefined && ids.length <= 100) {
      return this.http.get<AudioFeatures[]>(`${this.apiBaseUrl}/audio-features`, {
        headers: this.headers, params: {
          ids: ids.join(',')
        }
      });
      //TODO: do this
    } else {

    }
  }

  public getAudioFeature(id : string): Observable<AudioFeatures>{
    return this.http.get<any>(`${this.apiBaseUrl}/audio-features/${id}`, {headers: this.headers}).pipe(
      
    )
  }

  // public getPlaylistTracks(playlistId: string): Observable<PlaylistTrack[]> {
  //   return this.http.get<PlaylistTracksPagingObject>(`${this.apiBaseUrl}/playlists/${playlistId}/tracks`, { headers: this.headers }).pipe(
  //     map(res => res.items)
  //   );
  // }

  public getTracksOfAPlaylist(href: string): Observable<any[]> {
     return this.http.get<any>(href, { headers: this.headers }).pipe(
       map(res => res.items)
     );
  }

  public async getPlaylistTracks(playlistId: string) {
    let allTracks = [];
    let next = await this.http.get<PlaylistTracksPagingObject>(`${this.apiBaseUrl}/playlists/${playlistId}/tracks`, { headers: this.headers }).toPromise();
    allTracks.push(next.items);
    while (next.next != null) {
      let nextUrl = next.next;
      let nextTracks = await this.http.get<PlaylistTracksPagingObject>(nextUrl, { headers: this.headers }).toPromise(); 
      allTracks.push(nextTracks.items);
      next = nextTracks;
    }
    return allTracks;
  }

  //TODO add class instead of any
  public getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/me`, { headers: this.headers });
  }


  public setTimeRange(range: string) {
    this.timeRangeSub.next(range);
  }

  public get timeRange(): Observable<string> {
    return this.timeRangeSub.asObservable();
  }
}
