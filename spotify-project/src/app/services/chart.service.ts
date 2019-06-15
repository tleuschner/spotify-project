import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/dist/Chart.js'


@Injectable({
  providedIn: 'root'
})
/**
 * service to make chart accessible to every component
 */
export class ChartService {

  private chart: Chart;

  constructor() { }

  public getChart() {
    return this.chart;
  }

  public setChart(chart: Chart) {
    if(this.chart) {
      this.chart.destroy();
    }
    this.chart = chart;
  }
}
