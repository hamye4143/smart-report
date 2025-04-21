import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private auth_service: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  sendSignForm(a) {
    this.auth_service.signUp(a).subscribe(
      (response: any) => {
        this.notificationService.openSnackBar('회원가입 성공!');
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error => {
        this.notificationService.openSnackBar(error.message);
      }
    );
  }

  sendLoginForm(a) {
    const credentials = {
      email: a.id,
      password: a.password
    };

    const rememberMe = a.rememberMe;

    this.auth_service.login(credentials).subscribe(
      (response: any) => {
        if (response.token) {
          if (rememberMe) {
            localStorage.setItem('savedUserEmail', a.id);
          } else {
            localStorage.removeItem('savedUserEmail');
          }
          localStorage.setItem('auth_token', response.token);
          const user_info = JSON.stringify(response.user_info);
          localStorage.setItem('user_info', user_info);
          const isAdmin = JSON.parse(user_info)['is_admin'];
          localStorage.setItem('isAdmin', isAdmin);
          this.router.navigate(['/home']);
        }
      },
      error => {
        this.open_alert_dialog('로그인 실패 ' + error.message);
      }
    );
  }

  open_alert_dialog(message: string) {
    this.dialog.open(AlertDialogBodyComponent, {
      width: '550px',
      height: '200px',
      data: { message }
    });
  }
}
