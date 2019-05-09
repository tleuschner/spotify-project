import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/dist/Chart.js'


@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private Chart: Chart;

  constructor() { }

  public getChart() {
    return this.Chart;
  }

  public setChart(chart: Chart) {
    this.Chart = chart;
  }
}
