import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { StarService } from '../../services/star/star.service';

@Component({
  selector: 'app-dialog-star',
  templateUrl: './dialog-star.component.html',
  styleUrls: ['./dialog-star.component.css']
})
export class DialogStarComponent {

  blog_id: number;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  init_star_value: number;
  value: string = "등록";

  constructor(
    public dialogRef: MatDialogRef<DialogStarComponent>,
    private dialog : MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private star_service: StarService) {
      if (data) {
        this.blog_id = this.data.blog_id;
      }
    this.setStar();
  }

  countStar(star) {
    this.selectedValue = star;
    console.log('Value of star', star);
  }

  setStar() {
    const data = {
      blog_id: this.blog_id,
      user_id: JSON.parse(localStorage.getItem('user_info'))['id']
    }

    this.star_service.checkRating(data).subscribe(
      (response: any) => {
        if (response["star_chk"]) {
          this.init_star_value = response["star_chk"];
          this.selectedValue = this.init_star_value;
          this.value = "재등록"
        }
      }
    );
  }



  onConfirmClick() {
    const data = {
      star_value: this.selectedValue,
      blog_id: this.blog_id,
      user_id: JSON.parse(localStorage.getItem('user_info'))['id']
    }

    console.log('data', data)
    this.star_service.starRating(data).subscribe(
      (response: any) => {
        //성공 후 
        console.log('200', response['message'])
        this.dialogRef.close(true);

      },
      error => {

        console.log(error.error)
        this.dialogRef.close(true);
        this.notificationService.openSnackBar(error.error)
        this.router.navigate(['/login']);
      }
    );
  }

  // open_alert_dialog(message: string) {
  //   let dialogRef = this.dialog.open(AlertDialogBodyComponent, {
  //     width: '550px',
  //     height: '200px',
  //     data: {
  //       message
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirm:boolean)=>{
  //     this.router.navigate(['/login']);
  //   });
  // }

}
