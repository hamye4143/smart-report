import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/shared/services/api-calls/statistics.service';
import { ChartService } from 'src/app/shared/services/chart-services/chart.service';

enum matSelectedFields {
  weekly = 'Weekly',
  monthly = 'Monthly'
}

@Component({
  selector: 'app-root',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  currentDate = new Date();
  matSelectFields: typeof matSelectedFields = matSelectedFields;
  selectedMatSelectValue = matSelectedFields.weekly;

  // Top 10 리포트
  data: any[] = [];
  dataLengthList: number[] = [];

  // 메인 위젯
  todayVisitors = 0;
  activeUsers = 0;
  newSignups = 0;
  totalregisterCounts = 0;
  logoutCounts = 0;
  deactivateCounts = 0;
  avgSessionTime = '';
  usageRate = 0;
  lastLogin = '';

  // 증감
  todayVsYesterday = '';
  weekVsLastWeek = '';

  // 차트 데이터
  LineChartData$: Promise<Object>;
  barChartData$: Promise<Object>;
  pieChartData$: Promise<Object>;

  // 알림/리포트
  alerts: any[] = [];
  recentReports: any[] = [];

  constructor(
    private service: StatisticsService,
    private chartService: ChartService,
  ) {
    // 차트(예시: service에서 Observable로 리턴)
    this.LineChartData$ = this.chartService.LineChartData();
    this.pieChartData$ = this.chartService.loadPieChartData();
    this.barChartData$ = this.chartService.loadBarChartData();
  }

  ngOnInit() {
    this.loadData(this.selectedMatSelectValue === matSelectedFields.weekly ? 1 : 2);
    this.loadTodayVisitors();
    this.loadRegisteration();
    this.loadWidgets();
    this.loadAlerts();
    this.loadRecentReports();
    
  }

  loadData(type: number) {
    this.service.getTopTenDownloadedFile(type).subscribe(
      (response: any) => {
        this.data = response['serializedResult'] ?? [];
        this.dataLengthList = Array.from({ length: this.data.length }, (_, i) => i); 

        console.log( this.data );
        
      }
    );
  }

  loadTodayVisitors() {
    this.service.gettodayVisitor().subscribe(
      (response:any) => {

        console.log(response);
        
        this.todayVisitors = response.todayVisitors ?? 0;
      }
    )
  }

  loadRegisteration() {
    this.service.getRegisterCounts().subscribe(
      (response: any) => {        
        this.newSignups = response['NewregisterCounts'] ?? 0;
        this.logoutCounts = response['logoutCounts'] ?? 0;
        this.totalregisterCounts = response['TotalregisterCounts'] ?? 0;
        this.deactivateCounts = response['deactivateCounts'] ?? 0;
      }
    );
  }

  loadWidgets() {
    this.service.getDashboardWidgets().subscribe(
      (res: any) => {
       
        // this.todayVisitors = res.todayVisitors ?? 0;
        this.activeUsers = res.activeUsers ?? 0;
        this.avgSessionTime = res.avgSessionTime ?? '';
        this.usageRate = res.usageRate ?? 0;
        this.lastLogin = res.lastLogin ?? '';
        this.todayVsYesterday = res.todayVsYesterday ?? '';
        this.weekVsLastWeek = res.weekVsLastWeek ?? '';
      }
    );
  }

  loadAlerts() {
    this.service.getAlerts().subscribe((res: any) => {
      this.alerts = res.alerts ?? [];
    });
  }

  loadRecentReports() {
    this.service.getRecentReports().subscribe((res: any) => {
      this.recentReports = res.recentReports ?? [];
    });
  }

  setSelectValue(val: string) {
    this.selectedMatSelectValue = val as matSelectedFields;
    this.loadData(val === matSelectedFields.weekly ? 1 : 2);
  }
}
