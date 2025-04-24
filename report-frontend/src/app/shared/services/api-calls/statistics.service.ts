import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/constants/api-url';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private getTopTenDownloadedFileUrl:string = `${API_BASE_URL}/getTopTenDownloadedFile/`;
  private todayVisitorUrl:string = `${API_BASE_URL}/todayVisitor`;
  private registerCountsUrl:string = `${API_BASE_URL}/registerCounts`;

  private widgetsUrl:string = `${API_BASE_URL}/widgets`;
  private alertsUrl:string = `${API_BASE_URL}/alerts`;
  private recentReportsUrl:string = `${API_BASE_URL}/recent-reports`;

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

  getDashboardWidgets() {
    return this.http.get(this.widgetsUrl);
  }
  getAlerts() {
    return this.http.get(this.alertsUrl);
  }
  getRecentReports() {
    return this.http.get(this.recentReportsUrl);
  }
}
