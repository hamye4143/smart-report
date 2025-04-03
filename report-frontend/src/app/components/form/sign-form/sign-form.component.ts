import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.css']
})
export class SignFormComponent implements OnInit {
  @Output() sendSignForm = new EventEmitter<void>();
  public form: FormGroup;
  
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email //or Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', [Validators.required]),
      password_re: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    }, {validator: this.checkPassword});

    // this.form = new FormGroup({
    //   name: new FormControl('', [Validators.required]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   password: new FormControl('', [Validators.required]),
    //   password_re: new FormControl('', [Validators.required])
    // });
  }
  //비밀번호가 일치하는지 유효성 체크
  checkPassword(group: FormGroup) {
    console.log('checkPassword')
    let password = group.controls.password.value;
    let passwordRe = group.controls.password_re.value;
    return password === '' || passwordRe === '' || password === passwordRe ? null : { notSame : true }
  }
  
  public sign(): void {
    if (this.form.valid) {
      console.log('this.form.value',this.form.value)
      this.sendSignForm.emit(this.form.value);
    }
  }

}

