import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { TopTracks } from '../models/TopTracks';

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
    this.spotifyService.getTopSongs('3', undefined, 'long_term').subscribe(res => {
      this.topSongs = res;
    });
  }


}
