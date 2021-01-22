import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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

export interface LineChartData {
  series: Series[],
  categories: string[]
}

export interface Series {
  name: string,
  data: number[]
}
export enum colors {
  YELLOW = '#ffc260',
  BLUE = '#536DFE',
  LIGHT_BLUE = '#F8F9FF',
  PINK = '#ff4081',
  GREEN = '#3CD4A0',
  VIOLET = '#9013FE'
}
export type ChartOptions = {
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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() LineChartData;
  @Output() todayVisitors = new EventEmitter;

  public apexLineChartOptions: Partial<ChartOptions>;
  public colors: typeof colors = colors;
  constructor() { }

  ngOnInit(): void {
    this.initChart();
  }



  public initChart(): void {


    let data =[];
    let data2= [];
  
    this.apexLineChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        }
      }
    }
    this.LineChartData.then(response => {
      //console.log('response' ,response)

      data = response['visit_count_list']
      data2 = response['visit_date_list']
      // this.todayVisitors = response['todayVisitors']
      this.todayVisitors.emit(response['todayVisitors']);



      
     //console.log('data',data)
      //console.log('data2',data2)
      this.apexLineChartOptions = {
        series: [{name:'Total Visits', data: data}],
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          }
        },
        // colors: [colors.BLUE, colors.YELLOW, colors.PINK],
        colors: [colors.BLUE],
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2.5,
          curve: 'smooth',
          //dashArray : [0]
        },
        legend: {
          show: false
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          labels: {
            trim: false,
            rotate: -45
          },
          categories: data2,
        },
        tooltip: {
          y: [
            {
              title: {
                formatter(val) {
                  return val;
                }
              }
            }
          ]
        }
      };

    });

    //console.log('data' ,data)
    //console.log('apexLineChartOptions',this.apexLineChartOptions)
    /*
    this.apexLineChartOptions = {
      series: [{name:'Total Visits', data: [1,2]}],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      colors: [colors.BLUE, colors.YELLOW, colors.PINK],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth',
        dashArray: [0, 8, 5]
      },
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false,
          rotate: -45
        },
        categories: ["2020-11-27", "2020-11-28"],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter(val) {
                return val + ' (mins)';
              }
            }
          },
          {
            title: {
              formatter(val) {
                return val + ' per session';
              }
            }
          },
          {
            title: {
              formatter(val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: colors.LIGHT_BLUE
      }
    };
    */
  }
}

