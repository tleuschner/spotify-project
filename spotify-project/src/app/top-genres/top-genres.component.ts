import {Component, Input, OnInit} from '@angular/core';
import {SpotifyService} from "../services/spotify.service";
import {Artist, TopTracks} from "../models/SpotifyObjects";
import {forEach} from "@angular/router/src/utils/collection";
import {generateErrorMessage} from "codelyzer/angular/styles/cssLexer";

@Component({
  selector: 'app-top-genres',
  templateUrl: './top-genres.component.html',
  styleUrls: ['./top-genres.component.css']
})
export class TopGenresComponent implements OnInit {
  @Input() isMobile: Boolean;

  private topSongs: TopTracks[];
  private artists: Artist[] = [];
  private genreMap: Map<string,number> = new Map<string,number>();
  private genre = [];
  private genreCounter = [];
  private sumValues = 0;

  constructor(
    private spotifyService: SpotifyService,
  ) { }

  ngOnInit() {
    //Get data from spotify
    this.spotifyService.timeRange.subscribe(time => {
      this.spotifyService.getTopSongs('50', undefined, time).subscribe(res => {
        this.topSongs = res;
        let ids = [];
        let countId = 0;
        this.topSongs.forEach(element => {
          //@ts-ignore
          for(let artist of element.artists){
            ids.push(artist.id)
            countId++;
            if(countId == 50){
              this.spotifyService.getArtists(ids).subscribe(res => {
                console.log(res);
                this.artists = this.artists.concat(res);
                console.log(this.artists);
              })
              countId = 0;
              ids = [];
            }
          }
          });
        this.spotifyService.getArtists(ids).subscribe(res => {
          console.log(res);
          this.artists = this.artists.concat(res);
          console.log(this.artists);
          this.getGenres();
        })
      })
    });
  }

  private getGenres(){
    //Get from each Artist the Genre and count it in a array
    console.log("TEST TEST");
    for(let artists of this.artists){
      console.log(artists);
      //@ts-ignore
      for(let artist of artists.artists){
        for(let genre of artist.genres){
          //console.log("Test: "+genre);
          this.addAndCountGenre(genre);
        }
      }
    }
    this.sortGenre();
  }

  private addAndCountGenre(genre: string){
    this.sumValues++;
    if(this.genreMap.has(genre)){
      let value = this.genreMap.get(genre);
      value++;
      this.genreMap.set(genre,value);
    } else {
      this.genreMap.set(genre,1);
    }
  }

  private sortGenre(){
    //var mapAsc = new Map([...this.genreMap.entries()].sort());
    this.genreMap[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    this.genre = Array.from(this.genreMap.keys());
    this.genreCounter = Array.from(this.genreMap.values());
  }
}
