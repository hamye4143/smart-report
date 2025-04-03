import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signUpForm: FormGroup;
  data: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth_service: AuthService,
    private dialog:MatDialog,
    private notificationService: NotificationService
    ) {
    this.signUpForm = this.formBuilder.group({
      id: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email //or Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', [Validators.required]),
      password_re: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    }, {validator: this.checkPassword});
  }
  //비밀번호가 일치하는지 유효성 체크
  checkPassword(group: FormGroup) {
    let password = group.controls.password.value;
    let passwordRe = group.controls.password_re.value;
    return password === '' || passwordRe === '' || password === passwordRe ? null : { notSame : true }
  }

  //form field에 쉽게 접근하기 위해 getter 세팅
  get f() { 
    return this.signUpForm.controls;
   }

  submit() {
    if(this.signUpForm.valid){
      console.log(this.signUpForm)
      let credentials = {
        //고치기 
        email:this.signUpForm.value.id,
        password: this.signUpForm.value.password,
        name : this.signUpForm.value.name
      }
      console.log('credentials',credentials)

      this.auth_service.signUp(credentials).subscribe(
        (response:any) =>{
          console.log('response',response)
          this.notificationService.openSnackBar('회원가입 성공!');  

          this.router.navigate(['/login']);
        },
        error => { //에러 발생 
          //에러메시지 받아오기 
          
          console.log('[AuthService.signUp]'+error.message);
        
          
          //알림창 띄우기 
          this.notificationService.openSnackBar(error.message);  

        }
      );
    }
  }




}
