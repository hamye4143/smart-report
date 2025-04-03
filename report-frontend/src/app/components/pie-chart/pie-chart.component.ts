import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill, ApexGrid,
  ApexLegend, ApexMarkers,
  ApexNonAxisChartSeries, ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis
} from 'ng-apexcharts';

export interface PieChartData {
  series: number[],
  labels: string[]
}
export enum colors {
  YELLOW = '#ffc260',
  BLUE = '#536DFE',
  LIGHT_BLUE = '#F8F9FF',
  PINK = '#ff4081',
  GREEN = '#3CD4A0',
  VIOLET = '#9013FE'
}

type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  labels: string[];
  responsive: ApexResponsive[];
  fill: ApexFill;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartData;
  public apexPieChartOptions: Partial<ChartOptions>;
  public colors: typeof colors = colors;

  public ngOnInit(): void {
    this.initChart();
  }

  public initChart(): void {

    this.apexPieChartOptions = {
      series: [],
      chart: {
        height: 400,
        type: 'donut'
      }
    }

    this.pieChartData.then(response => {
      console.log('response',response)

      this.apexPieChartOptions = {
        series: response['seriesList'],//this.pieChartData.series,
        chart: {
          type: 'donut',
          height: 400
        },
        colors: [
          colors.BLUE,
          colors.YELLOW,
          colors.PINK,
          colors.GREEN,
          colors.VIOLET
        ],
        legend: {
          position: 'bottom',
          itemMargin: {
            horizontal: 5,
            vertical: 30
          },
        },
        labels: response['labelsList']//this.pieChartData.labels
      };

    });
  }
  
}
