import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexResponsive,
  ApexGrid,
  ApexFill
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  colors: string[];
  responsive: ApexResponsive[];
  grid: ApexGrid;
  fill: ApexFill;
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() barChartData: Promise<any>;
  public apexBarChartOptions: Partial<ChartOptions>;

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    // 초기값 (빈 차트)
    this.apexBarChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 340
      }
    };

    this.barChartData.then((response) => {
      // response: { series, categories }
      this.apexBarChartOptions = {
        series: response['series'] || [],
        chart: {
          type: 'bar',
          height: 340
        },
        xaxis: {
          categories: response['categories'] || []
        },
        colors: ['#536DFE', '#ffc260', '#ff4081', '#3CD4A0', '#9013FE'],
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: true
        },
        grid: {
          show: true,
          borderColor: '#e0e6ed'
        },
        fill: {
          opacity: 1
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        tooltip: {
          enabled: true
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 240
              }
            }
          }
        ]
      };
    });
  }
}
