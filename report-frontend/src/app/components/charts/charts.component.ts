import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { StatisticsService } from 'src/app/shared/services/api-calls/statistics.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private service: StatisticsService,
    private blog_service:BlogService) { }
  data:[];
  all_categories:[];
  ngOnInit(): void {
    this.loadData(1);
    this.load_data()

  }
  load_data(){
    this.blog_service.get_all_categories().subscribe(
      (response:any)=>{
        this.all_categories = response.all_categories
          // response.all_blogs.forEach((element:any) => {
          //   this.all_blogs.push(element);
          // });
      },
      error =>{
        console.error('[BlogService.get_all_blogs]',error)
      }
      )
  }

  loadData(type){
    this.service.getTopTenDownloadedFile(type).subscribe(
      (response: any) => {
        this.data = response['serializedResult'];

      }
    );

  }

}
