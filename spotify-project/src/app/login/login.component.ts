import { Component, OnInit } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  seitenaufrufe = "Besucher insgesamt: 2";

  constructor(
    private oauthService: OAuthService,
  ) { }

  ngOnInit() {
  }

  login(): void {
    this.oauthService.initImplicitFlow();
  }


}
