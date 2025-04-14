import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private getTopTenDownloadedFileUrl:string = `${API_BASE_URL}/getTopTenDownloadedFile/`;
  private todayVisitorUrl:string = `${API_BASE_URL}/todayVisitor`;
  private registerCountsUrl:string = `${API_BASE_URL}/registerCounts`;

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
