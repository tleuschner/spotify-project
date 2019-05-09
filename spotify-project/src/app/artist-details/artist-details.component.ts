import { Component, OnInit } from '@angular/core';
import {Artist} from "../models/SpotifyObjects";
import {SpotifyService} from "../services/spotify.service";
import {DetailObject} from "../models/DetailObject";

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailsComponent implements OnInit {

  private topArtists: Artist[];
  private artistDetails: DetailObject[] = [];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe(time => {
      this.spotifyService.getTopArtists('50', undefined, time).subscribe(res => {
        this.topArtists = res;
        for(let artist of this.topArtists) {
          let i = 1;
          this.artistDetails.push({
            image: artist.images[0].url,
            firstLine: artist.name,
            secondLine: i.toString(),
            id: artist.id
          });
          i++;
        }
      });
    });
  }

}
