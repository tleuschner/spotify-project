import { Component } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi() {
    this.oauthService.setStorage(localStorage);
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
  }
}

const authConfig: AuthConfig = {
  clearHashAfterLogin: true,
  oidc: false,
  clientId: 'a47354060499425696ed113bdee074d2',
  responseType: 'token',
  redirectUri: 'http://localhost:4200',
  scope: 'playlist-read-private user-library-read user-top-read user-read-recently-played user-read-private',
  loginUrl: 'https://accounts.spotify.com/authorize',
};
