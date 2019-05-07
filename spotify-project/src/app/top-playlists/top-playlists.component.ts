import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import {Playlist} from "../models/TopPlaylists";

@Component({
  selector: 'app-top-playlists',
  templateUrl: './top-playlists.component.html',
  styleUrls: ['./top-playlists.component.css']
})
export class TopPlaylistsComponent implements OnInit {

  private item: Playlist[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getPlaylists().subscribe(res => {
      //document.getElementById('test').innerText = JSON.stringify(res);
      this.item = res;
    });
  }
}
