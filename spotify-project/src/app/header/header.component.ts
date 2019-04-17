import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navOpen = false;
  loggedIn = false;

  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
    this.loggedIn = this.oauthService.hasValidAccessToken();
  }

  toggleNavBar() {
    if (!this.navOpen) {
      document.getElementById('nav-container').style.width = "250px";
    } else {
      document.getElementById('nav-container').style.width = "0%";
    }
    this.navOpen = !this.navOpen;
  }

}