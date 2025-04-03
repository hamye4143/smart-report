import { AuthService } from './auth.service';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private auth_service:AuthService, private router:Router) { }

  user_info: User;
  writer: User;

  canActivate(next:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean{
    if(this.auth_service.is_logged_in()) return true
    
    this.router.navigate(['/login']);
    return true;
  }

  async canAccess(board_id): Promise<boolean>{  //로그인한 회원이 글쓴이 본인인지 확인해주는 함수
    const answer = false;
    //1번 함수의

    //실행순서 보장 
    await this.auth_service.canChange(board_id).toPromise().then(
      response =>{
        this.user_info =JSON.parse(localStorage.getItem('user_info'));
        this.writer = response['single_blog'].author; 
      }
    )

    if(this.user_info.id == this.writer.id){
      return true;
    }else{
      return false;
    }

  }


}
