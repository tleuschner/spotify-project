import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js/dist/Chart";
import {ChartService} from "../services/chart.service";
import {Artist, TopTracks} from "../models/SpotifyObjects";
import {SpotifyService} from "../services/spotify.service";

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css']
})
export class GenreDetailsComponent implements OnInit {
  @ViewChild('test', { read: ElementRef }) radarChartCanvas: ElementRef;


  private topSongs: TopTracks[];
  private artists: Artist[] = [];
  private genreMap: Map<string,number> = new Map<string,number>();
  private genre = [];
  private genreCounter = [];
  private genreObject = [];
  private sumValues = 0;
  private genresErmittelt: boolean = false;

  private radarChart: Chart;
  private backgroundColours = [];

  private distinctPercent = [];
  private distinctName = [];

  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService
  ) { }

  ngOnInit() {
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
          //Generate Chart
          this.populateRadarChart();
        })
      })
    });
  }

  private populateRadarChart() {

    let ctx = this.radarChartCanvas.nativeElement;

    this.distinctPercent = [];
    this.distinctName = [];
    let isSameValue = -1;
    let newName = "";
    for(let object of this.genreObject){
      if(object.percent != isSameValue){
        this.distinctPercent.push(object.percent);
        if(isSameValue != -1){
          this.distinctName.push(newName);
        }
        isSameValue = object.percent;
        newName = object.name;
      } else {
        newName = newName+", "+object.name;
      }
    }
    this.distinctName.push(newName);

    this.setBackgroundColours(this.distinctPercent);

    this.shuffle();

    let data = {
      datasets: [{
        data: this.distinctPercent,
        backgroundColor: this.backgroundColours
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: this.distinctName,
    };

    this.radarChart = new Chart(ctx, {
      data: data,
      type: 'polarArea'
    });
    this.chartService.setChart(this.radarChart);
  }

  private setBackgroundColours(anzahl: any[]){
    let counter = anzahl.length;
    for(let i = 0; i < counter; i++){
      let zufallsZahl1 = Math.random()*255;
      let zufallsZahl2 = Math.random()*255;
      let zufallsZahl3 = Math.random()*255;
      let zufallsZahl4 = Math.random()*255;
      let rgba = 'rgba('+zufallsZahl1+', '+zufallsZahl2+', '+zufallsZahl3+', '+zufallsZahl4;
      this.backgroundColours.push(rgba);
    }
  }

  private getGenres(){
    //Get from each Artist the Genre and count it in a array
    for(let artists of this.artists){
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
    this.topSongs = [];
    this.artists = [];
    this.genreMap = new Map<string,number>();
    this.genre = [];
    this.genreCounter = [];
    this.genreObject = [];
    this.sumValues = 0;
    this.genresErmittelt = false;
    this.backgroundColours = [];
  }

  private shuffle() {
    let zufall = Math.random()*255
    var j, x, i;
    for (i = this.distinctName.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = this.distinctName[i];
      this.distinctName[i] = this.distinctName[j];
      this.distinctName[j] = x;
      x = this.distinctPercent[i];
      this.distinctPercent[i] = this.distinctPercent[j];
      this.distinctPercent[j] = x;
    }
    console.log("Percent: ",this.distinctPercent);
  }
}
