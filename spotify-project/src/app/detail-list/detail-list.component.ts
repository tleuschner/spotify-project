import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DetailObject } from "../models/DetailObject";
import { SpotifyService } from '../services/spotify.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailListComponent implements OnInit {
  @Input() detailObject: DetailObject;

  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService
  ) { }

  ngOnInit() {
  }

  private addDataset(detail: DetailObject) {
    let radarChart = this.chartService.getChart();

    this.spotifyService.getAudioFeature(detail.id).subscribe(res => {

      let trackFeatureData = [res.danceability, res.energy, 1 - (res.loudness / -60), res.speechiness, res.acousticness, res.instrumentalness, res.liveness, res.valence];
      radarChart.data.datasets[1] = [];
      radarChart.data.datasets[1] = {
        label: detail.firstLine,
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
