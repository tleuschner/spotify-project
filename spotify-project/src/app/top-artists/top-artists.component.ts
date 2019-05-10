import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { Artist } from '../models/SpotifyObjects';
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {
  @Input() isMobile: Boolean;

  private topArtists: Artist[];
  private isDetail: boolean;

  constructor(private spotifyService: SpotifyService,
              private router: Router) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe(time => {
        this.spotifyService.getTopArtists('3', undefined, time).subscribe(res => {
          this.topArtists = res;
        });
    });

    if(window.location.pathname.includes("/artist-details")){
      this.isDetail= true;
    } else {
      this.isDetail =false;
    }
  }

  private navigate() {
    this.router.navigate(['/artist-details']);
  }

}
