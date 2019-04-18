import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navContainer', { read: ElementRef }) navBar: ElementRef;
  isOpen: boolean = false;

  constructor(private oauthService: OAuthService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2) { }

  ngOnInit() {
  }

  toggleNavBar() {
    if(!this.isOpen) {
      this.renderer.setStyle(this.navBar.nativeElement, 'width', '250px');
    } else {
      this.renderer.setStyle(this.navBar.nativeElement, 'width', '0px');
    }
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['login']);
  }

}