import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
  private getTopTenDownloadedFileUrl:string = 'http://localhost:5000/getTopTenDownloadedFile/';
  private todayVisitorUrl:string = 'http://localhost:5000/todayVisitor';
  private registerCountsUrl:string = 'http://localhost:5000/registerCounts';

  constructor(private http: HttpClient) { }

  getTopTenDownloadedFile(type_: number){
    return this.http.get(this.getTopTenDownloadedFileUrl + type_);
  }

  gettodayVisitor(){
    return this.http.get(this.todayVisitorUrl);
  }

  getRegisterCounts(){
    return this.http.get(this.registerCountsUrl);
  }
}
