import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from '../services/spotify.service';
import { VisitorsService } from '../services/visitors.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navContainer', { read: ElementRef }) navBar: ElementRef;
  @ViewChild('navbarDropdown', { read: ElementRef }) navDrop: ElementRef;
  private isOpen: boolean = false;
  private timeRange: string;
  private dropdownCaption = 'Zeitraum auswählen';
  private addedUser = false;
  private visitors$: Observable<number>;

  constructor(private oauthService: OAuthService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
    private spotifyService: SpotifyService,
    private visitorsService: VisitorsService
  ) { }

  ngOnInit() {
    this.authService.isAuthenticatedObs().subscribe(res => {
      if (res === true && !this.addedUser) {
        this.addedUser = true;
        this.addVisitor();
      }
    });
  }

  toggleNavBar() {
    if (!this.isOpen) {
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

  changeTimeRange(range: Number) {
    switch (range) {
      case 0:
        this.timeRange = 'short_term';
        this.dropdownCaption = '4 Wochen';
        break;
      case 1:
        this.timeRange = 'medium_term';
        this.dropdownCaption = '6 Monate';
        break;
      case 2:
        this.timeRange = 'long_term';
        this.dropdownCaption = 'Aller Zeiten';
        break;

      default:
        this.timeRange = 'medium_term';
        this.dropdownCaption = 'Zeitraum auswählen';
        break;
    }
    this.spotifyService.setTimeRange(this.timeRange);
    this.navDrop.nativeElement.innerText = this.dropdownCaption;
  }

  private addVisitor() {
    let spotifyId, country;
    this.spotifyService.getUserInfo().subscribe(res => {
      country = res.country;
      spotifyId = res.id;
      if (spotifyId && country) {
        this.visitorsService.postVisitor(spotifyId, country).subscribe(res => {
          if(res.status === 200) {
            //Dunno
          } else {
            //dunno
          }
        });
      }
    });

  }
}