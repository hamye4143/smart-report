import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../notification/notification.service';
import {API_BASE_URL} from "src/constants/api-url";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private login_url: string = `${API_BASE_URL}/login`;
  private signup_url: string = `${API_BASE_URL}/signup`;
  private logout_url: string = `${API_BASE_URL}/logout`;
  private get_board_writer: string = `${API_BASE_URL}/blog/`;
  private change_info_url: string = `${API_BASE_URL}/change_info/`;
  private change_name_url: string = `${API_BASE_URL}/change_name/`;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private dialog:MatDialog,
    private notificationService: NotificationService,
    ) { }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  login(credentials: Object) {
    return this.http.post(this.login_url, credentials).pipe(catchError(this.handlerError));
  }

  is_logged_in() { //로그인 여부 확인

    //localStorage: 쿠키와 비슷 . 데이터를 클라이언트에 보존하는 방식 . 영구적으로 사용 가능
    const token = localStorage.getItem('auth_token'); //데이터 불러오기
    if (!token) return false

    const is_expired = this.jwtHelper.isTokenExpired(token);

    return !is_expired;
  }

  logoutHttp() {
    const loginUser = JSON.parse(localStorage.getItem('user_info'));
    return this.http.put(this.logout_url, loginUser.id, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  logout(statement:string) {
    if (statement){
      this.notificationService.openSnackBar(statement)

    }else{
      this.notificationService.openSnackBar('로그아웃되었습니다.')
    }
    this.logoutHttp().subscribe(
      (response) => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('loginUser');
        localStorage.removeItem('isAdmin');

        this.router.navigate(['/login']);
      }
    );

    // localStorage.removeItem('auth_token');
    // localStorage.removeItem('user_info');
    // localStorage.removeItem('loginUser');
    // localStorage.removeItem('isAdmin');

    // this.router.navigate(['/login']);

  }

  //가입 api
  signUp(credentials: Object) {
    return this.http.post(this.signup_url, credentials).pipe(catchError(this.handlerError));
    this.router.navigate(['/login']);
  }

  canChange(board_id: number) { //login한 사람과 글쓴이가 같은지 확인(글 삭제, 수정할때 사용)

    //writer정보 가져오기
    return this.http.get(this.get_board_writer + board_id).pipe(catchError(this.handlerError));

  }

  private handlerError(error: HttpErrorResponse) {
    let message = ''; //재할당이 필요한 변수 -->let 사용
    //에러 유형 구분
    if (error.error instanceof ErrorEvent) {
      //클라이언트 측의 에러
      console.error(`Client-side error: ${error.error.message}`);
      message = error.error.message;
    } else {
      //백엔드 측의 에러
      console.error(`Server-side error: ${error.status}`);
      // message = error.message;
      message = error.error
    }
    //사용자에게 전달할 메시지를 담은 옵저버블 반환
    return throwError({
      title: 'Something wrong! please try again later.',
      message
    });
  }

  // passwordResetRequest(email: string) {
  //    return of(true).delay(1000);
  // }

  changePassword(credentials, user_id) {
    console.log('user_id', user_id)
    return this.http.put(this.change_info_url + user_id, credentials, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }
  changeName(credentials, user_id) {
    console.log('user_id', user_id)
    return this.http.put(this.change_name_url + user_id, credentials, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

}
