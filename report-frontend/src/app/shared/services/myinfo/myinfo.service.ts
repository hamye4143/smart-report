import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { Blog } from '../../models/Blog';

@Injectable({
  providedIn: 'root'
})
export class MyinfoService implements OnInit{

  private myinfo_url:string = 'http://localhost:5000/myinfo/';
  private myinfo_list_url:string = 'http://localhost:5000/myinfo_list/';
  private downloads_history_url:string = 'http://localhost:5000/myinfo/downloads/'; 
  private mylike_list_url:string = 'http://localhost:5000/myinfo/likelist/'; 


  private user_id:number


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {

  }

  getList(): Promise<Blog>{
    
    return this.http.get(this.myinfo_list_url + this.user_id)
    .toPromise()
    .then(response => {
      localStorage.setItem('loginUser', JSON.stringify(response['serialized_data']));
      return response['serialized_data'];
    })
    .catch(response => {
      localStorage.removeItem('auth_token');
      alert('[회원 정보 조회중 오류 발생]\n' + response.error.msg);   
      return Promise.reject(response.error.msg);
    });

  }
  
  getUser(): Promise<User> {

//  localStorage.setItem('loginUser',null);
    const loginUser =JSON.parse(localStorage.getItem('user_info'));

    // this.user_id=JSON.parse(localStorage.getItem('user_info')).id
    this.user_id = loginUser.id;
    
    if( loginUser == null){ //빈칸이라면
      //다시 setItem
      return this.http.get(this.myinfo_url + this.user_id)
      .toPromise()
      .then(response => {
        localStorage.setItem('loginUser', JSON.stringify(response['serialized_user']));
        return response['serialized_user'];
      })
      .catch(response => {
        localStorage.removeItem('auth_token');
        alert('[회원 정보 조회중 오류 발생]\n' + response.error.msg);   
        //login으로 보내기 
        return Promise.reject(response.error.msg);
      });

  }else {
    return Promise.resolve(loginUser);
  }
}
  //안씀
  get_user_info(user_id:number){
    return this.http.get(this.myinfo_url + user_id).pipe(catchError(this.handlerError));
  }

  downloads_history(){
    return this.http.get(this.downloads_history_url + this.user_id).pipe(catchError(this.handlerError));
  }
  my_like_list(){
    return this.http.get(this.mylike_list_url + this.user_id).pipe(catchError(this.handlerError));
  }
  //안씀
  private handlerError(error: HttpErrorResponse){
    let message = ''; 
    //에러 유형 구분 
    if (error.error instanceof ErrorEvent){
      //클라이언트 측의 에러
      console.error(`Client-side error: ${error.error.message}`);
      message = error.error.message;
    } else{
      //백엔드 측의 에러
      console.error(`Server-side error: ${error.status}`);
      message = error.message;
    }
  //사용자에게 전달할 메시지를 담은 옵저버블 반환
  return throwError({
    title: 'Something wrong! please try again later.',
    message
  });
  }
  
}
