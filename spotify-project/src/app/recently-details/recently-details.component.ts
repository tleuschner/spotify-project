import { Component, OnInit } from '@angular/core';
import {SpotifyService} from "../services/spotify.service";
import {DetailObject} from "../models/DetailObject";

@Component({
  selector: 'app-recently-details',
  templateUrl: './recently-details.component.html',
  styleUrls: ['./recently-details.component.css']
})
export class RecentlyDetailsComponent implements OnInit {

  private recently: any;
  private recentlyDetails: DetailObject[] = [];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe(time => {
      this.spotifyService.getRecentlyPlayed(50,'3').subscribe(res => {
        console.log(res);
        this.recently = res.items;
        this.recentlyDetails = [];
        let i = 4;
        for(let recent of this.recently) {
          let artists = [];
          for (const artist of recent.track.artists) {
            artists.push(artist.name);
          }
          this.recentlyDetails.push({
            image: recent.track.album.images[0].url,
            firstLine: recent.track.name,
            secondLine: artists.join(', '),
            thirdLine: this.getDate(recent.played_at),
            id: recent.id
          });
          i++;
        }
      });
    });
  }

  private getDate(dateOld: string) {
    //newDate: Date = dateOld.toLocaleString('de-DE', { timeZone: 'UTC' });
    var newDate = new Date(dateOld).toLocaleString();
    return newDate.replace(",", " -").substring(0, newDate.length - 2);
  }

}