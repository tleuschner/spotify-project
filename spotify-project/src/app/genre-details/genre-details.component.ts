import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js/dist/Chart";
import {SpotifyService} from "../services/spotify.service";
import {DataService} from "../services/data.service";
import {DetailObject} from "../models/DetailObject";

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css']
})
/**
 * Showing the detail information about genres.
 * Every genre will be show in a graph percently.
 * If a genre is clicked, the Informationen which actors are behind a genre will be shown.
 */
export class GenreDetailsComponent implements OnInit {
  @ViewChild('test', { read: ElementRef }) radarChartCanvas: ElementRef;
  //Wird für Performance Gründen benötigt
  private firstCall = true;

  //Menge an Genre und Artist Informationen
  private genreObject = [];
  private sumCount;
  private artistToGenre : string[][] = [];
  public showArtistsOfAGenre = [];

  //Informationen über das Radar
  private radarChart: Chart;
  private backgroundColours = [];
  private hoverBackgroundColor = [];

  //Variablen werden für die vereinfachte Darstellung benötigt. Speziell für die RadarChat Anzeige
  private distinctPercent = [];
  private distinctName = [];
  private detailObject = [];

  constructor(
    private spotifyService: SpotifyService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    //Method used of performance reasons
    this.firstCall = false;
    this.spotifyService.timeRange.subscribe((time: string) => {
      if(!this.firstCall) {
        this.dataService.updateData(time);
      }
      this.firstCall = false;
    });
    //Generate Data and show the genre RadarChart
    this.dataService.topGeneres.subscribe(res => {
      this.genreObject = res;
      this.generateSumCount();
      this.populateRadarChart();
    });
    //Get Artists of a genre
    this.dataService.topArtistsToGeneres.subscribe(res => {
      this.artistToGenre = res;
    });
  }

  private populateRadarChart() {
    //If exists a Radar Chart, destroy it
    if(this.radarChart) {
      this.radarChart.destroy();
    }


    let ctx = this.radarChartCanvas.nativeElement;

    //Initial Values for following content
    this.distinctPercent = [];
    this.distinctName = [];
    let isSameValue = -1;
    let newName = "";

    //Find how many percent an genre in total has and put all genres with the same percent together in an array (distinctPerson/distinctName)
    for(let object of this.genreObject){
      //if object has another count as last genres, push it
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

    //Do display stuff
    this.setBackgroundColours(this.distinctPercent);
    this.shuffle();

    //Set defined data for the Radar Chart
    let data = {
      datasets: [{
        data: this.distinctPercent,
        backgroundColor: this.backgroundColours,
        hoverBackgroundColor: this.hoverBackgroundColor
      }],
      labels: this.distinctName,
    };

    //Initialise Radar Chart
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
  }

  /**
   * The genre or the amount of genres, which contains in the clicked field, will show the artists with the associated genre.
   * @param label
   */
  private zeigeGenreInfoAn(label: string){
    this.showArtistsOfAGenre = [];
    //Each genre will be run through
    for(let proofGenre of label.split(", ")){
      //Each artist of a genre will be displayed
      for(let genre of this.artistToGenre){
        if(genre[0] === proofGenre){
          this.showArtistsOfAGenre.push([genre,this.fuegeArtistDerDetailListeHinzu(genre[1])]);
        }
      }
    }
  }

  /**
   * For the detailList components will be an amount of artist generated, which will each genre shown by clicking on the field at the radar chart
   * @param genre
   */
  private fuegeArtistDerDetailListeHinzu(genre: string){
    let neueDetailList = [];
    this.detailObject = [];
    let artists = genre[0].split(", ");
    let images = genre[1].split(", ");
    for(let i = 0; i < artists.length; i++){
      let details: DetailObject = {
        image: images[i],
        firstLine: artists[i],
        secondLine: null,
        thirdLine: null,
        id: i.toString()
      };
      neueDetailList.push(details);
    }
    return neueDetailList;
  }

  /**
   * Set a random background colour of every single genre
   * @param anzahl
   */
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

  /**
   * Shuffle the places of every genre, that is in the diagram shown
   */
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

  /**
   * Count the genre Objects
   */
  private generateSumCount(){
    var counter = 0;
    for(let object of this.genreObject){
      counter += object[1];
    }
    this.sumCount = counter;
  }
}
