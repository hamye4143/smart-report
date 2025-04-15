import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {StatisticsService} from '../api-calls/statistics.service';
import {API_BASE_URL} from "constants/api-url";

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
  private todayVisitorUrl:string = `${API_BASE_URL}/todayVisitor`;
  private searchTopKeywordUrl:string = `${API_BASE_URL}/searchTopKeyword`;


  constructor(public service:StatisticsService,private http: HttpClient){

  }

  ngOnInit(): void {
    //this.getData();
  }

  public getData(){
    this.service.gettodayVisitor().subscribe((response)=>
    {
      this.visitCountList = response['visit_count_list'];
      this.visitDateList = response['visit_date_list'];

    });
  }

  // public dashedLineChartData(): Observable<DashedLineChartData>{
    public LineChartData(){

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
