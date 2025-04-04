import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from 'src/app/shared/services/guards/auth.service';

// redirect.component.ts
@Component({ template: '' })
export class RedirectComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.is_logged_in()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}