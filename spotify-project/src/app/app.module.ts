import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { TopSongsComponent } from './top-songs/top-songs.component';
import {TopPlaylistsComponent} from "./top-playlists/top-playlists.component";
import {RecentlyPlayedComponent} from "./recently-played/recently-played.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ContentWrapperComponent,
    TopArtistsComponent,
    TopSongsComponent,
    TopPlaylistsComponent,
    RecentlyPlayedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // automatically sends access token in header to spotify 
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['https://api.spotify.com/v1'],
          sendAccessToken: true
      }
  }),
  LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
