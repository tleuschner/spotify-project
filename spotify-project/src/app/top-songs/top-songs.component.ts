import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { TopTracks } from '../models/SpotifyObjects';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css']
})
export class TopSongsComponent implements OnInit {
  @Input() isMobile: Boolean;

  private topSongs: TopTracks[];

  constructor(
    private spotifyService: SpotifyService,

  ) { }

  ngOnInit() {
    //Get data from spotify
    this.spotifyService.timeRange.subscribe(time => {
      this.spotifyService.getTopSongs('3', undefined, time).subscribe(res => {
      this.topSongs = res;
      });
    });
  }
}
