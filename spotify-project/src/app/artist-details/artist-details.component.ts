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
      this.spotifyService.getTopArtists('50', '3', time).subscribe(res => {
        this.topArtists = res;
        this.artistDetails = [];
        let i = 4;
        for(let artist of this.topArtists) {
          this.artistDetails.push({
            image: artist.images[0].url,
            firstLine: artist.name,
            secondLine: "#"+i.toString(),
            id: artist.id
          });
          i++;
        }
      });
    });
  }
}
