import { Component, OnInit } from '@angular/core';
import { TopArtists } from '../models/TopArtists';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {

  private topArtists: TopArtists[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getTopArtists('').subscribe(res => {
      this.topArtists = res;
    })
  }

}
