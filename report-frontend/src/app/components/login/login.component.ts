import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']//login.component.css
})
export class LoginComponent implements OnInit {
  private email:string;
  private password:string;
  private hide:true;
  signInForm: FormGroup;

  constructor(
    private auth_service:AuthService,
    private router:Router,
    private dialog:MatDialog,
    private notificationService: NotificationService
    )
  {

    const savedUserEmail = localStorage.getItem('savedUserEmail');

    this.signInForm = new FormGroup({
      id: new FormControl(savedUserEmail, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(savedUserEmail !== null)
    });
   }



  //html에서 인풋 폼에 대한 에러 정보를 얻을 수 있도록 get id, password 선언
  get id() {
    return this.signInForm.get('id');
  }
  get password_() {
    return this.signInForm.get('password');
  }

  get rememberMe(){
    return this.signInForm.get('rememberMe');
  }


  ngOnInit() {
  }

  //sign
  sendSignForm(a){

    this.auth_service.signUp(a).subscribe(
      (response:any) =>{
        this.notificationService.openSnackBar('회원가입 성공!');
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error => { //에러 발생
        //에러메시지 받아오기
        //알림창 띄우기
        this.notificationService.openSnackBar(error.message);
      }
    );


  }

  sendLoginForm(a){//submit

    //if (this.signInForm.valid) {
        // let credentials = {
        //   email:this.signInForm.value.id,
        //   password: this.signInForm.value.password
        // }
        let credentials = {
          email:a.id,
          password: a.password
        }

        // let rememberMe = this.signInForm.value.rememberMe;
        const rememberMe = a.rememberMe;
        //로그인
        this.auth_service.login(credentials).subscribe( //subscribe함수를 실행할때 http요청을 함
          (response:any)=>{
            if(response.token){
                if (rememberMe) {
                    localStorage.setItem('savedUserEmail', this.signInForm.value.id);
                } else {
                    localStorage.removeItem('savedUserEmail');
                }
              localStorage.setItem('auth_token', response.token); //api통신성공하면 backend에서의 토큰을 localStorage에 저장
              const user_info = JSON.stringify(response.user_info);
              localStorage.setItem('user_info',user_info);
              const isAdmin = JSON.parse(localStorage.getItem('user_info'))['is_admin'];
              localStorage.setItem('isAdmin',isAdmin);
              this.router.navigate(['/home']);
            }
        },
        error => {
          //('[로그인 실패]\n' + error.msg);
          this.open_alert_dialog('로그인 실패 '+error.message);

        }
        );
    //}
  }

  // submit_form(){
  //   let credentials = {
  //     email:this.email,
  //     password:this.password
  //   }
  //   this.auth_service.login(credentials).subscribe(
  //     (response:any)=>{
  //       if(response.token){
  //         console.log('user_info',response.user_info);
  //         localStorage.setItem('auth_token', response.token); //데이터 저장
  //         this.router.navigate(['/admin']);
  //       }
  //   },
  //   error => {
  //     console.log('[AuthService.login]', error);
  //     //('[로그인 실패]\n' + error.msg);
  //     this.open_alert_dialog('로그인 실패\n<br>'+error.message);

  //   }
  //   );
  // }

  open_alert_dialog(message:string){
    let dialogRef = this.dialog.open(AlertDialogBodyComponent,{
      width:'550px',
      height: '200px',
      data:{
        message
      }
    });
  }



}
