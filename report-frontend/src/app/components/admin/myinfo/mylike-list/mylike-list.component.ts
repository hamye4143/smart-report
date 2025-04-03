import { Component, OnInit } from '@angular/core';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';

@Component({
  selector: 'app-mylike-list',
  templateUrl: './mylike-list.component.html',
  styleUrls: ['./mylike-list.component.css']
})
export class MylikeListComponent implements OnInit {
  like_lists = []
  constructor(private myInfoService: MyinfoService) { }

  ngOnInit() {
    this.myInfoService.my_like_list().subscribe(
      (response):any =>{
        console.log(response["likes_blog"])
        this.like_lists = response["likes_blog"]
      });
      
  }

}
