import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //@ViewChild('rememberMe', { read: ElementRef }) rememberMe: ElementRef;
  seitenaufrufe = "Besucher insgesamt: 2";
  private name : string;

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['']);
    }
    this.name = localStorage.getItem("Person").toString();
  }

  login(): void {
    //let rememberCheck = this.rememberMe.nativeElement.checked;
    let skipDialog: Boolean;

    /*if (rememberCheck) {
      localStorage.setItem('skipLoginForm', 'true');
    } else {
      localStorage.removeItem('skipLoginForm');
    }*/

    skipDialog = !!localStorage.getItem('skipLoginForm');


    /*if (!skipDialog) {
       this.oauthService.customQueryParams = { 'show_dialog': true };
    } else {
       this.oauthService.customQueryParams = {};
    }*/

    this.oauthService.initImplicitFlow();
  }

  loginWithDialog(): void {
    let skipDialog: Boolean;

    skipDialog = !!localStorage.getItem('skipLoginForm');


    if (!skipDialog) {
      this.oauthService.customQueryParams = { 'show_dialog': true };
    } else {
      this.oauthService.customQueryParams = {};
    }

    this.oauthService.initImplicitFlow();
  }


}
