import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-recently-played',
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.css']
})
export class RecentlyPlayedComponent implements OnInit {
  @Input() isMobile: Boolean;


  constructor(
    private spotifyService: SpotifyService,
  ) { }

  ngOnInit() {
    //Get data from spotify

  }
}
