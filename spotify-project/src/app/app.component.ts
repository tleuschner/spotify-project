import {AfterViewInit, Component, OnInit} from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';

import * as AOS from 'aos';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements OnInit {
  public done = false;

  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }

  ngOnInit() {
    AOS.init();
  }


  private configureWithNewConfigApi() {
    this.oauthService.setStorage(localStorage);
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}


const authConfig: AuthConfig = {
  clearHashAfterLogin: true,
  oidc: false,
  clientId: 'a47354060499425696ed113bdee074d2',
  responseType: 'token',
  redirectUri: 'http://spotify.timleuschner.de/#/',
  // redirectUri: 'http://localhost:4200',
  scope: 'playlist-read-private user-library-read user-top-read user-read-recently-played user-read-private',
  loginUrl: 'https://accounts.spotify.com/authorize',
};
