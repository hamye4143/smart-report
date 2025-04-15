import { Component, OnInit } from '@angular/core';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';

@Component({
  selector: 'app-downloads-history',
  templateUrl: './downloads-history.component.html',
  styleUrls: ['./downloads-history.component.css']
})
export class DownloadsHistoryComponent implements OnInit {

  private download_files = [];

  constructor(private myInfoService: MyinfoService) {
  }

  ngOnInit() {
    this.myInfoService.downloads_history().subscribe(
      (response):any =>{
        this.download_files = response["download_files"]
      });
  }


}
