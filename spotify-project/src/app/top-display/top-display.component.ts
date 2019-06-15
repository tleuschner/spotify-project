import { Component, OnInit, Input } from '@angular/core';
import { PodiumObject } from '../models/PodiumObject';
import { SpotifyService } from '../services/spotify.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-top-display',
  templateUrl: './top-display.component.html',
  styleUrls: ['./top-display.component.css']
})

/**
 * Template for generating the Podium
 * Inputs:
 *  - mobile -> decides whether to show as Podium or list view
 *  - podiumObject -> contains the standardized data for generating the Podium
 *  - routing -> Route to navigate to whenever Podium is clicked
 *  - title -> Title above the Podium
 *  - isDetail -> whether to allow the Podium to be clickable (disables routing on click if needed / click for adding audiofeatures to chart)
 *  - aritst -> extra boolean to decide clickability
 */
export class TopDisplayComponent implements OnInit {
  @Input() isMobile: Boolean;
  @Input() podiumObject: PodiumObject[];
  @Input() routing: string;
  @Input() title: string;
  @Input() isDetail?: boolean;
  @Input() artist?: boolean;

  /**
   * 
   * @param spotifyService for retrieving audio features for a track, if it is clicked
   * @param chartService connects chart from different Component to this one (to show audioFeaturs on it)
   */
  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService,
  ) { }

  ngOnInit() {
  }

  /**
   * Method to add Song Data to the Chart
   * @param detail the podium Object containing the Song id for the API call
   */
  private addDataset(detail: PodiumObject) {
    let radarChart = this.chartService.getChart();
    this.spotifyService.getAudioFeature(detail.id).subscribe(res => {

      let trackFeatureData = [res.danceability, res.energy, 1 - (res.loudness / -60), res.speechiness, res.acousticness, res.instrumentalness, res.liveness, res.valence];
      radarChart.data.datasets[1] = [];
      radarChart.data.datasets[1] = {
        label: detail.title,
        data: trackFeatureData,
        fill: true,
        backgroundColor: '#cc000050',
        pointBackgroundColor: 'rgba(25, 20, 20, 1)',
        pointBorderColor: 'rgba(30, 215, 96, 0.3)',
      };

      radarChart.update();
    });
  }
}
