import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LikeService } from 'src/app/shared/services/like/like.service';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {
  @Output() changed = new EventEmitter<boolean>();
  isActive: boolean;
  isLike: boolean;
  blog_id;
  totalLikes: number;

  constructor(
    private like_service: LikeService,
    private blog_service: BlogService,
    private active_route: ActivatedRoute,
    private router: Router,
    private dialog : MatDialog,
    private notificationService: NotificationService

  ) { }

  ngOnInit() {
    this.active_route.params.subscribe((response) => {
      this.blog_id = response.id;
    })

    //like 개수 
    this.set_like_counts();


    //like 상태 가져오기
    this.like_service.is_like(this.blog_id).subscribe((response) => {
      console.log(response)
      this.isLike = response['like_chk'];
    })



  }

  toggle(event) {

    if (!this.isLike) {
      this.like_service.like_post(this.blog_id)
        .subscribe(
          data => {
            console.log(data)
            //색 변화 
            event.target.classList.add('like');
            this.isLike = true;
            //총 몇개인지 다시 불러오기 
            this.set_like_counts();
          },
          error => {
            console.log(error.error);
            this.notificationService.openSnackBar(error.error);
            //this.router.navigate(['/login']);
          }
        );
    } else { //like 상태이면
      this.like_service.unlike_post(this.blog_id)
        .subscribe(
          data => {
            console.log(data)
            //색 변화 
            event.target.classList.remove('like');
            this.isLike = false;
            this.set_like_counts();

          },
          error => {
            console.log(error.error);
            this.notificationService.openSnackBar(error.error)
            this.router.navigate(['/login']);
            //this.open_alert_dialog(error.error);
          }
        );
    }


    /* */

    /*
    event.target.classList.add('class3'); // To ADD
    event.target.classList.remove('class1'); // To Remove
    event.target.classList.contains('class2'); // To check
    event.target.classList.toggle('class4'); // To toggle
    */


  }

  set_like_counts() {
    this.like_service.get_like_counts(this.blog_id).subscribe((response) => {
      this.totalLikes = response['like_counts']
    })
  }

  open_alert_dialog(message: string) {
    let dialogRef = this.dialog.open(AlertDialogBodyComponent, {
      data: {
        message
      }
    });

    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      this.router.navigate(['/login']);
    });
  }

  

}
