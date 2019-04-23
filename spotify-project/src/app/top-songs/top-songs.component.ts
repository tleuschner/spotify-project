import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { TopTracks } from '../models/TopTracks';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css']
})
export class TopSongsComponent implements OnInit {

  private topSongs: TopTracks[];

  constructor(
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    this.spotifyService.getTopSongs('').subscribe(res => {
     this.topSongs = res;
    });
  }

}
