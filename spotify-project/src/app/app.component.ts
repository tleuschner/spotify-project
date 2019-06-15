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

  /**
   * configure OAuth Library whenever main component loads
   */
  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }

  /**
   * Initialize AnimateOnScroll Libraray
   */
  ngOnInit() {
    AOS.init();
  }


  /**
   * Sets where to keep access token and tries to login the user
   */
  private configureWithNewConfigApi() {
    this.oauthService.setStorage(localStorage);
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
  }

  /**
   * Adds animations to the route changes
   * @param outlet the routeroutlet which shall be animated
   */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

/**
 * Specify the
 *  - authorization endpoint
 *  - redirection URL
 *  - Client ID registered w/ spotify
 *  - Scope -> what data we are allowed to read from the User
 *  
 */
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
