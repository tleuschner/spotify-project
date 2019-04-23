import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { TopArtists, TopArtistsPagingObject } from '../models/TopArtists';
import { TopTracks, TopTracksPagingObject } from '../models/TopTracks';
import { Playlist, Item } from '../models/Playlists';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService
  ) { }

  private readonly apiBaseUrl = 'https://api.spotify.com/v1';

  private headers = new HttpHeaders({
    "Authorization": "Bearer " + this.oauthService.getAccessToken()
  });

  public getTopArtists(time_range: string): Observable<TopArtists[]> {
    return this.http.get<TopArtistsPagingObject>(`${this.apiBaseUrl}/me/top/artists`, { headers: this.headers }).pipe(
      map(res => res.items)
    );
  }

  public getTopSongs(time_range: string): Observable<TopTracks[]> {
    return this.http.get<TopTracksPagingObject>(`${this.apiBaseUrl}/me/top/tracks`, { headers: this.headers }).pipe(
     map(res => res.items)
    );
  }

  public getPlaylists(): Observable<Item[]> {
    return this.http.get<Playlist>(`${this.apiBaseUrl}/me/playlists`, {headers: this.headers}).pipe(
      map(res => res.items)
    );
  }
}
