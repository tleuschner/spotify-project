import { Component, Input, OnInit } from '@angular/core';
import { DetailObject } from "../models/DetailObject";
import { SpotifyService } from '../services/spotify.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements OnInit {
  @Input() detailObject: DetailObject;

  constructor(
    private spotifyService: SpotifyService,
    private chartService: ChartService
  ) { }

  ngOnInit() {
    //console.log(this.detailObject);
  }

  private addDataset(detail: DetailObject) {
    let radarChart = this.chartService.getChart();
    console.log(detail);

    this.spotifyService.getAudioFeature(detail.id).subscribe(res => {
      radarChart.data.datasets[1] = [];
      radarChart.data.datasets[1] = {
        label: detail.firstLine,
        data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.2, 0.3],
        fill: true,
        backgroundColor: '#22334450',
        pointBackgroundColor: 'rgba(25, 20, 20, 1)',
        pointBorderColor: 'rgba(30, 215, 96, 0.3)',
      };

      radarChart.update();
      console.log(res);
    });
  }
}
