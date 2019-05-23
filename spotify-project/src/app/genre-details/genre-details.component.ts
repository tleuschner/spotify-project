import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js/dist/Chart";
import {ChartService} from "../services/chart.service";
import {Artist, Track} from "../models/SpotifyObjects";
import {SpotifyService} from "../services/spotify.service";
import {DataService} from "../services/data.service";
import {DetailObject} from "../models/DetailObject";

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css']
})
export class GenreDetailsComponent implements OnInit {
  @ViewChild('test', { read: ElementRef }) radarChartCanvas: ElementRef;

  private genreObject = [];
  private sumCount;
  private artistToGenre : string[][] = [];
  private showArtistsOfAGenre = [];

  private radarChart: Chart;
  private backgroundColours = [];
  private hoverBackgroundColor = [];

  private distinctPercent = [];
  private distinctName = [];


  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.spotifyService.timeRange.subscribe((time: string) => {
      this.dataService.updateData(time);
    });
    this.dataService.topGeneres.subscribe(res => {
      this.genreObject = res;
      this.generateSumCount();
      this.populateRadarChart();
    });
    this.dataService.topArtistsToGeneres.subscribe(res => {
      this.artistToGenre = res;
    });
  }

  private populateRadarChart() {

    let ctx = this.radarChartCanvas.nativeElement;

    this.distinctPercent = [];
    this.distinctName = [];
    let isSameValue = -1;
    let newName = "";
    for(let object of this.genreObject){
      if(object[1] != isSameValue){
        this.distinctPercent.push(Math.round((object[1]/this.sumCount*1000))/10);
        if(isSameValue != -1){
          this.distinctName.push(newName);
        }
        isSameValue = object[1];
        newName = object[0];
      } else {
        newName = newName+", "+object[0];
      }
    }
    this.distinctName.push(newName);

    this.setBackgroundColours(this.distinctPercent);

    this.shuffle();

    let data = {
      datasets: [{
        data: this.distinctPercent,
        backgroundColor: this.backgroundColours,
        hoverBackgroundColor: this.hoverBackgroundColor
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: this.distinctName,
    };

    this.radarChart = new Chart(ctx, {
      data: data,
      type: 'polarArea',
      options: {
        onClick: (e) => {
          var element = this.radarChart.getElementAtEvent(e);
          if (element.length) {
            let label = element[0]._view.label.toString();
            this.zeigeGenreInfoAn(label)
          }
        }
      }
    });
    this.chartService.setChart(this.radarChart);
  }

  private zeigeGenreInfoAn(label: string){
    console.log(this.artistToGenre);
    this.showArtistsOfAGenre = [];
    console.log("ArtistToGenre: ",this.artistToGenre);
    for(let proofGenre of label.split(", ")){
      let i = 0;
      for(let genre of this.artistToGenre){
        if(genre[0] === proofGenre){
          console.log(genre);
          console.log("FirstLine: ",genre[0]);
          let findImage = genre[1][1].split(", ");
          console.log("FindImage: ",findImage);
          console.log("I: ",i);
          console.log("Image: ",findImage[i]);
          console.log("Das ist ein",genre);
          this.showArtistsOfAGenre.push(genre);

          /*let details: DetailObject = {
            image: genre[1][1],
            firstLine: genre[0],
            secondLine: null,
            thirdLine: null,
            id: track.id
          }*/
        }
      }
    }
    //this.detailObject.push(detailTrack);
  }

  private setBackgroundColours(anzahl: any[]){
    let counter = anzahl.length;
    for(let i = 0; i < counter; i++){
      let zufallsZahl1 = Math.random()*255;
      let zufallsZahl2 = Math.random()*255;
      let zufallsZahl3 = Math.random()*255;
      let rgba = 'rgba('+zufallsZahl1+', '+zufallsZahl2+', '+zufallsZahl3+', 0.5)';
      this.backgroundColours.push(rgba);
      let rgbaHover = 'rgba('+zufallsZahl1+', '+zufallsZahl2+', '+zufallsZahl3+', 1)';
      this.hoverBackgroundColor.push(rgbaHover);
    }
  }

  private shuffle() {
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
  }

  private generateSumCount(){
    var counter = 0;
    for(let object of this.genreObject){
      counter += object[1];
    }
    this.sumCount = counter;
  }
}
