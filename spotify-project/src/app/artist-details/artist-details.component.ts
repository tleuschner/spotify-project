import { Component, OnInit } from '@angular/core';
import {Artist} from "../models/SpotifyObjects";
import {SpotifyService} from "../services/spotify.service";

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailsComponent implements OnInit {

  private topArtists: Artist[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe(time => {
      this.spotifyService.getTopArtists('50', undefined, time).subscribe(res => {
        this.topArtists = res;
      });
    });
  }

}
