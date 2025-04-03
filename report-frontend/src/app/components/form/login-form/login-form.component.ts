import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { AuthService } from 'src/app/shared/services/guards/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @Output() sendLoginForm = new EventEmitter<void>(); 
  signInForm: FormGroup;

  constructor(private auth_service:AuthService,
    private router:Router, 
    private dialog:MatDialog) { }

  ngOnInit() {

    const savedUserEmail = localStorage.getItem('savedUserEmail');
    console.log('savedUserEmail',savedUserEmail)

    this.signInForm = new FormGroup({
      id: new FormControl(savedUserEmail, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(savedUserEmail !== null)
    });
  }



  public login(): void {
    if (this.signInForm.valid) {
      this.sendLoginForm.emit(this.signInForm.value);
    }
  }
}


