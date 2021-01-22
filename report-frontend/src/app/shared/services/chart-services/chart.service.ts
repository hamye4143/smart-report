import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StatisticsService } from '../api-calls/statistics.service';

export interface LineChartData {
  series: Series[],
  categories: string[]
}
interface Series {
  name: string,
  data: number[]
}

@Injectable({
  providedIn: 'root'
})


export class ChartService implements OnInit {
  // service: any;
  visitCountList=[];
  visitDateList=[];
  private todayVisitorUrl:string = 'http://localhost:5000/todayVisitor';
  private searchTopKeywordUrl:string = 'http://localhost:5000/searchTopKeyword';


  constructor(public service:StatisticsService,private http: HttpClient){

  }

  ngOnInit(): void {
    //this.getData();
  }

  public getData(){
    console.log('chartservice. getData')
    this.service.gettodayVisitor().subscribe((response)=>
    {
      console.log('response',response);   
      this.visitCountList = response['visit_count_list'];
      this.visitDateList = response['visit_date_list'];
      console.log('visitCountList',this.visitCountList,this.visitDateList)

    });
  }

  // public dashedLineChartData(): Observable<DashedLineChartData>{
    public LineChartData(){

    console.log('chart.service LineChartData');
    return this.http.get(this.todayVisitorUrl).toPromise();

    // return of({
    //   series: [
    //     {
    //       name: 'Total Visits',
    //        data: [2,3]
    //     }
    //   ],
    //   categories: ['asd','d']
    // });
  }

  public loadPieChartData() {
    return this.http.get(this.searchTopKeywordUrl).toPromise();
    // return of({
    //   series: [
    //     25,15,20,40
    //     // Math.round(Math.random() * 100),
    //     // Math.round(Math.random() * 100),
    //     // Math.round(Math.random() * 100),
    //     // Math.round(Math.random() * 100)
    //   ],
    //   labels: ['Team A','Team A','Team A','Team A']
    // });
  }


  
}
