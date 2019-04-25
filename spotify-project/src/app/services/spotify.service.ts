import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { TopArtists, TopArtistsPagingObject } from '../models/TopArtists';
import { TopTracks, TopTracksPagingObject } from '../models/TopTracks';
import { Playlist, Item } from '../models/TopPlaylists';

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

  public getTopArtists(limit = '20', offset = '0', timeRange = 'medium_term'): Observable<TopArtists[]> {
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

  public getPlaylists(): Observable<Item[]> {
    return this.http.get<Playlist>(`${this.apiBaseUrl}/me/playlists`, { headers: this.headers }).pipe(
      map(res => res.items)
    );
  }

  public getRecentlyPlayed(count: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/me/player/recently-played`, {headers: this.headers});
  }



  public setTimeRange(range: string) {
    this.timeRangeSub.next(range);
  }

  public get timeRange(): Observable<string> {
    return this.timeRangeSub.asObservable();
  }
}
