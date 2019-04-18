import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) { }

  private _isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public isAuthenticatedObs(): Observable<boolean> {
    this._isAuthenticatedSubject.next(this.oauthService.hasValidAccessToken());
    return this._isAuthenticatedSubject.asObservable();
  }

}
