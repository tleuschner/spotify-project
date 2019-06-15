import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private oauthService: OAuthService
    ) { }

    /**
     * emits the boolean whether the user is authenticated or not
     */
  private _isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  /**
   * pushes the boolean value if there is a valid access token (user is authenticated) or not and returns it as Observable
   * for other components to subscribe to it
   */
  public isAuthenticatedObs(): Observable<boolean> {
    this._isAuthenticatedSubject.next(this.oauthService.hasValidAccessToken());
    return this._isAuthenticatedSubject.asObservable();
  }

}
