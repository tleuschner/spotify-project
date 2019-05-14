import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-recently-played',
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.css']
})
export class RecentlyPlayedComponent implements OnInit, AfterViewInit {
  @Input() isMobile: Boolean;

  private recentlyPlayed: any;
  private isDetail: boolean;
  private artists: string[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router) { }

  ngOnInit() {
    //Get data from spotify
    this.spotifyService.getRecentlyPlayed(50).subscribe(res => {
      this.recentlyPlayed = res;
      for(let i = 0; i<3; i++){
        let newArtists = [];
        for(const artist of res.items[i].track.artists){
          newArtists.push(artist.name);
        }
        this.artists.push(newArtists.join(','));
      }
    });

    if(window.location.pathname.includes("/recently-details")){
      this.isDetail= true;
    } else {
      this.isDetail =false;
    }
  }

  private getDate(dateOld: string) {
    //newDate: Date = dateOld.toLocaleString('de-DE', { timeZone: 'UTC' });
    var newDate = new Date(dateOld).toLocaleString();
    return newDate.replace(",", " -").substring(0, newDate.length - 2);
  }

  private navigate() {
    console.log('called')
    this.router.navigate(['/recently-details']);
  }

  ngAfterViewInit() {
  }

}
