import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-recently-played',
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.css']
})
export class RecentlyPlayedComponent implements OnInit, AfterViewInit {
  @Input() isMobile: Boolean;

  private recentlyPlayed: any;
  private playedAt: Date;

  constructor(
    private spotifyService: SpotifyService,
  ) { }

  ngOnInit() {
    //Get data from spotify
      this.spotifyService.getRecentlyPlayed(50).subscribe(res => {
        this.recentlyPlayed = res;
      });
  }

  private getDate(dateOld: string) {
    //newDate: Date = dateOld.toLocaleString('de-DE', { timeZone: 'UTC' });
    var newDate = new Date(dateOld).toLocaleString();
    return newDate.replace(","," -").substring(0,newDate.length-2);
  }

  ngAfterViewInit() {
    console.log('afterviewinit')
    let removeMyCommas = document.querySelectorAll('#removeComma');
    removeMyCommas.forEach(element => {
      console.log(element.textContent);
      element.textContent = element.textContent.replace(/,(?=[^,]*$)/, '');
    })
  }
}
