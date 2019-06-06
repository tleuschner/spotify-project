import { Component, OnInit, Input } from '@angular/core';
import { PodiumObject } from '../models/PodiumObject';
import { SpotifyService } from '../services/spotify.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-top-display',
  templateUrl: './top-display.component.html',
  styleUrls: ['./top-display.component.css']
})
export class TopDisplayComponent implements OnInit {
  @Input() isMobile: Boolean;
  @Input() podiumObject: PodiumObject[];
  @Input() routing: string;
  @Input() title: string;
  @Input() isDetail?: boolean;
  @Input() artist?: boolean;

  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService,
  ) { }

  ngOnInit() {
    console.log(this.artist);
  }

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
