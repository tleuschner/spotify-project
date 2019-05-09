import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { Artist } from '../models/SpotifyObjects';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {
  @Input() isMobile: Boolean;

  private topArtists: Artist[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe(time => {
        this.spotifyService.getTopArtists('3', undefined, time).subscribe(res => {
          this.topArtists = res;
        });
    });
  }

}
