import { Component, Input, Renderer2, ViewChild } from '@angular/core';
import { StatisticsService } from 'src/app/shared/services/api-calls/statistics.service';

// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexTitleSubtitle
// } from "ng-apexcharts";
import { Observable } from 'rxjs';
import { ChartService } from 'src/app/shared/services/chart-services/chart.service';
import { MatSelectChange } from '@angular/material/select';
export interface LineChartData {
  series: Series[],
  categories: string[]
}
interface Series {
  name: string,
  data: number[]
}

export interface PieChartData {
  series: number[],
  labels: string[]
}

enum matSelectedFields {
  weekly = 'Weekly',
  monthly = 'Monthly'
}


@Component({
  selector: 'app-root',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  currentDate = new Date();
  slideIndex = 1;
  arrayUpdated: boolean = false;
  public pieChartData$;
  public matSelectFields: typeof matSelectedFields = matSelectedFields;
  public selectedMatSelectValue = matSelectedFields.weekly;
  parent = document.getElementsByClassName("mySlides");
  public newsdata: any[] = [];
  public newschunk: any = [[]];
  type_ = 1;
  visitCountList =[];
  visitDateList = [];
  data;
  totalregisterCounts:number;
  newregisterCounts:number = 0;
  logoutCounts:number;
  dataLengthList=  [];
  public LineChartData$


   constructor(private service : StatisticsService, private Chartservice: ChartService,private renderer: Renderer2,) {
    this.LineChartData$ =  this.Chartservice.LineChartData();
    this.pieChartData$ = this.Chartservice.loadPieChartData();
    

  }
  
  ngOnInit(){


    this.loadData(1);
    this.loadRegisteration();

  
  }


  loadData(type) {
    this.service.getTopTenDownloadedFile(type).subscribe(
      (response:any) => {
        console.log('respones입니다./',response)
        this.data = response['serializedResult'];
        for (let index = 0; index < this.data.length; index++) { // 0,1,2
          // const element = array[index];
          this.dataLengthList.push(index)
          
        }
      }
    );
  }

 
  loadRegisteration() {
    this.service.getRegisterCounts().subscribe(
      (response:any) => {
        console.log(response)
        this.newregisterCounts = response['NewregisterCounts'];
        this.logoutCounts = response['logoutCounts'];
        this.totalregisterCounts = response['TotalregisterCounts'];
      }
    );
  }

  todayVisitors(t){
    this.todayVisitors = t
  }

  selectedValue(event: MatSelectChange){
    console.log(event.value)
    switch (this.selectedMatSelectValue) {
      case matSelectedFields.weekly:
          this.loadData(1); //주간
        break;
      case matSelectedFields.monthly:
          this.loadData(2); // 월간 
        break;
      default:
    }
  }


}

