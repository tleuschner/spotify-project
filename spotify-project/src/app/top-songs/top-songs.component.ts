import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { Track } from '../models/SpotifyObjects';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css']
})
export class TopSongsComponent implements OnInit {
  @Input() isMobile: Boolean;

  // private topSongs: TopTracks[];
  private track: Track;
  private artists: string[] = [];

  constructor(
    private spotifyService: SpotifyService,

  ) { }

  ngOnInit() {
    //Get data from spotify
  }
}
