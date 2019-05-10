import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SpotifyService } from '../services/spotify.service';
import { VisitorsService } from '../services/visitors.service';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})
export class ContentWrapperComponent implements OnInit {
  private isMobile = false;

  constructor(
    private spotifyService: SpotifyService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    // Wahrscheinlich auch über CSS lösbar aber klappt ;)
    this.breakpointObserver.observe(['(min-width: 768px)']).subscribe(result => {
      // this.isMobile = !result.matches
      if (result.matches) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    });
  }
  
}
