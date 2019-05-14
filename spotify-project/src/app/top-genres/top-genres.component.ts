import {Component, Input, OnInit} from '@angular/core';
import {SpotifyService} from "../services/spotify.service";
import {Artist, Track } from "../models/SpotifyObjects";
import {forEach} from "@angular/router/src/utils/collection";
import {generateErrorMessage} from "codelyzer/angular/styles/cssLexer";

@Component({
  selector: 'app-top-genres',
  templateUrl: './top-genres.component.html',
  styleUrls: ['./top-genres.component.css']
})
export class TopGenresComponent implements OnInit {
  @Input() isMobile: Boolean;

  private topSongs: Track[];
  private artists: Artist[] = [];
  private genreMap: Map<string,number> = new Map<string,number>();
  private genre = [];
  private genreCounter = [];
  private genreObject = [];
  private sumValues = 0;
  private genresErmittelt: boolean = false;

  constructor(
    private spotifyService: SpotifyService,
  ) { }

  ngOnInit() {
    //Get data from spotify
    this.spotifyService.timeRange.subscribe(time => {
      this.clear();
      this.spotifyService.getTopSongs('50', undefined, time).subscribe(res => {
        this.topSongs = res;
        let ids = [];
        let countId = 0;
        this.topSongs.forEach(element => {
          //@ts-ignore
          for(let artist of element.artists){
            ids.push(artist.id);
            countId++;
            if(countId == 50){
              this.spotifyService.getArtists(ids).subscribe(res => {
                this.artists = this.artists.concat(res);
              });
              countId = 0;
              ids = [];
            }
          }
          });
        this.spotifyService.getArtists(ids).subscribe(res => {
          this.artists = this.artists.concat(res);
          this.getGenres();
        })
      })
    });
  }

  private getGenres(){
    //Get from each Artist the Genre and count it in a array
    for(let artists of this.artists){
      for(let artist of this.artists){
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
    this.genre = Array.from(this.genreMap.keys());
    this.genreCounter = Array.from(this.genreMap.values());

    for(let i = 0; i < this.genre.length; i++){
      let object = {name: this.genre[i],value: this.genreCounter[i], percent: Math.round((this.genreCounter[i]/this.sumValues*1000))/10};
      this.genreObject.push(object)
    }
    console.log("Genres: ",this.genreObject);

    this.genreObject.sort(function (a, b) {
      return b.value - a.value;
    });

    this.genresErmittelt = true;
  }

  private clear(){
   this.topSongs = []
   this.artists = [];
   this.genreMap = new Map<string,number>();
   this.genre = [];
   this.genreCounter = [];
   this.genreObject = [];
   this.sumValues = 0;
   this.genresErmittelt = false;
  }
}
