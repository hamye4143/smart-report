import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { QuestionService } from 'src/app/shared/services/api-calls/question.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['no', 'title','user','created_at','viewCount','state'];// 'details', update', 'delete',
  private loginUser: User;

  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  constructor(
    private questionService: QuestionService,
    private auth_service:AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private myinfo_service: MyinfoService,
    ) { }

  ngOnInit() {
    //공통으로 빼기 
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this.myinfo_service.getUser()
      .then(user => {
        this.loginUser = user;
      })
      .catch(response =>{
        this.router.navigate(['/login']);
      });
    }
    
    this.loadData();
  }

  loadData() {
    this.questionService.getAllQuestions().subscribe(
      (response: any) => {
        console.log('response',response)
        this.dataSource = new MatTableDataSource(response.allQuestionData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    
    
      });
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
