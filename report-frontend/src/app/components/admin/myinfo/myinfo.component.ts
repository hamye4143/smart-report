import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/shared/models/Blog';
import { User } from 'src/app/shared/models/User';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.css']
})
export class MyinfoComponent implements OnInit{

  loginUser: User;
  blogs: Blog;

  constructor(private myInfoService: MyinfoService) {
    this.myInfoService.getUser().then(user => {
      this.loginUser = user;
    });

    this.myInfoService.getList().then(blog => {
      this.blogs = blog;
    });
  }
  
  ngOnInit() {

  }


  /* 비번 변경 */
  changePassword() { 

    // if (this.newPassword !== this.newPasswordConfirm) {
    //   this.notificationService.openSnackBar('New passwords do not match.');
    //   return;
    // }

    // const email = this.authService.getCurrentUser().email;

    // this.authService.changePassword(email, this.currentPassword, this.newPassword)
    //   .subscribe(
    //     data => {
    //       this.logger.info(`User ${email} changed password.`);
    //       this.form.reset();
    //       this.notificationService.openSnackBar('Your password has been changed.');
    //     },
    //     error => {
    //       this.notificationService.openSnackBar(error.error);
    //     }
    //   );
  }


}
