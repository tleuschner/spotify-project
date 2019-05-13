import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart} from "chart.js/dist/Chart";
import {ChartService} from "../services/chart.service";

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css']
})
export class GenreDetailsComponent implements OnInit {
  @ViewChild('test', { read: ElementRef }) radarChartCanvas: ElementRef;

  private myChart;
  private radarChart: Chart;

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit() {
    this.populateRadarChart('Test');
  }

  private populateRadarChart(label: string) {
    let ctx = this.radarChartCanvas.nativeElement;
    let data = {
      labels: ['Tanzbarkeit', 'Energie', 'Lautstärke', 'Speechiness', 'Akkustik', 'Instrumental', 'Lebhaftigkeit', 'Stimmung'],
      datasets: [{
        label: label,
        data: [12, 19, 3, 5, 2, 3],
        fill: true,
        backgroundColor: '#1db95450',
        pointBackgroundColor: 'rgba(25, 20, 20, 1)',
        pointBorderColor: 'rgba(30, 215, 96, 0.3)',
      }]
    }

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
    });
    this.chartService.setChart(this.radarChart);
  }
}
