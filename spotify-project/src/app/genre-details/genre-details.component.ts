import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js/dist/Chart";
import {ChartService} from "../services/chart.service";
import {Artist, Track} from "../models/SpotifyObjects";
import {SpotifyService} from "../services/spotify.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css']
})
export class GenreDetailsComponent implements OnInit {
  @ViewChild('test', { read: ElementRef }) radarChartCanvas: ElementRef;


  private topSongs: Track[];
  private artists: Artist[] = [];
  private genreMap: Map<string,number> = new Map<string,number>();
  private genre = [];
  private genreCounter = [];
  private genreObject = [];
  private sumValues = 0;
  private genresErmittelt: boolean = false;

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
    })
    this.dataService.topGeneres.subscribe(res => {
      this.genreObject = res;
      this.populateRadarChart();
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
        this.distinctPercent.push(object[1]);
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
      /*options: {
        // This chart will not respond to mousemove, etc
        events: ['click']
      }*/
    });
    /*this.radarChart.onClick = function(evt){
      console.log("KLAPPT!");
      var activePoints = myLineChart.getElementsAtEvent(evt);
      // => activePoints is an array of points on the canvas that are at the same position as the click event.
      console.log(activePoints);
    };*/

    this.chartService.setChart(this.radarChart);
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
    console.log("Percent: ",this.distinctPercent);
  }
}
