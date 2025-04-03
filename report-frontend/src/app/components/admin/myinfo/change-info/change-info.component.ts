import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.css']
})
export class ChangeInfoComponent implements OnInit {
  /*비번 번경 */
  form: FormGroup;
  hideCurrentPassword: boolean;
  hideNewPassword: boolean;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  disableSubmit: boolean;
  logger: any;
  form2: FormGroup;
  newName:string;
  currentName:string;
  user:any;

  constructor(
    private authService: AuthService,
    private notificationService:NotificationService,
    private auth_service:AuthService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_info'));
    console.log('yser', this.user)
    this.currentName = this.user['name'];

    this.form = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      newPasswordConfirm: new FormControl('', Validators.required),
    });

    this.form2 = new FormGroup({
      newName: new FormControl('', Validators.required)
    });

    this.form.get('currentPassword').valueChanges
      .subscribe(val => { this.currentPassword = val; });

    this.form.get('newPassword').valueChanges
      .subscribe(val => { this.newPassword = val; });

    this.form.get('newPasswordConfirm').valueChanges
      .subscribe(val => { this.newPasswordConfirm = val; });
    
    this.form2.get('newName').valueChanges
    .subscribe(val => { this.newName = val; });
      
    }
    
  changeName() {
    const user_id = this.user['id'];
    const credentials = {
      newName: this.newName
    }
    this.authService.changeName(credentials,user_id)
    .subscribe(
        data => {
        this.form2.reset();
        // this.notificationService.openSnackBar('이름이 변경되었습니다. 다시 로그인해주세요.');
        this.auth_service.logout('이름이 변경되었습니다. 다시 로그인해주세요.');
        //새로고침 
      },
      error => {
        this.notificationService.openSnackBar(error.message);
      }
    );
  }

  changePassword() {

    if (this.newPassword !== this.newPasswordConfirm) {
      this.notificationService.openSnackBar('새로운 비밀번호가 매치하지 않습니다.');
      // alert('New passwords do not match.');
      return;
    }
    const email = this.user['email'];
    const user_id = this.user['id'];

    const credentials = {
      email:email, 
      currentPassword:this.currentPassword,
      newPassword:this.newPassword
    }
    
    this.authService.changePassword(credentials,user_id)
      .subscribe(
        data => {
          // this.logger.info(`User ${email} changed password.`);
          this.form.reset();
          this.notificationService.openSnackBar('비밀번호가 변경되었습니다.');
          // alert('Your password has been changed.');
        },
        error => {
          
          this.notificationService.openSnackBar(error.message);
          // alert('현재 비밀번호가 맞지않습니다.')
        }
      );
  }

}
