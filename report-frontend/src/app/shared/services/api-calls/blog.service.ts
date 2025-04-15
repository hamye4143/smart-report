import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {API_BASE_URL} from "../../../../constants/api-url";
import {AuthService} from "src/app/shared/services/guards/auth.service";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private add_blog_url:string = `${API_BASE_URL}/add_blog`;
  private get_all_blogs_url:string = `${API_BASE_URL}/blogs`;
  private get_all_categories_url:string = `${API_BASE_URL}/load_all_category`;
  private get_single_blog_url:string = `${API_BASE_URL}/blog/`;
  private delete_blog_url:string = `${API_BASE_URL}/delete_blog/`;
  private update_blog_url:string = `${API_BASE_URL}/update_blog/`;
  private search_blog_url:string = `${API_BASE_URL}/search_blogs/`;
  private file_url:string = `${API_BASE_URL}/upload_files`;
  private download_url:string = `${API_BASE_URL}/downloadfile`;
  private test_url:string = `${API_BASE_URL}/test_url`;
  private search_file_url:string = `${API_BASE_URL}/search`;
  private search_file_url2:string = `${API_BASE_URL}/search2`;
  private search_file_date_url:string = `${API_BASE_URL}/searchByDate/`;
  // private category_search_url:string = `${API_BASE_URL}/categorySearch/`;
  private category_search_url:string = `${API_BASE_URL}/categorySearch`;


  constructor(private http: HttpClient, private authService: AuthService) {}

  download_single_file(filename:string, file_id:string){

    const user_id = JSON.parse(localStorage.getItem('user_info'))['id'] //전송해줘야함

    //test
    const params = new HttpParams().set('user_id',user_id).set('file_id', file_id);

    const data = {
      'user_id':user_id,
      'file_id':file_id,
      'filename':filename
    }

    return this.http.post(this.download_url, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(catchError(this.handlerError));
  }

  upload_files(files){
    return this.http.post(this.file_url, files, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  add_blog(blog_props){ //blog_props:Object
    //에러 처리 후 에러 메시지를 생성하여 이를 방출하는 옵저버블 반환
    return this.http.post(this.add_blog_url, blog_props,
      {
        headers: this.authService.getAuthHeaders()
      }).pipe(catchError(this.handlerError));
  }

  get_all_blogs(){
    return this.http.get(this.get_all_blogs_url).pipe(catchError(this.handlerError));
  }

  get_all_categories(){
    return this.http.get(this.get_all_categories_url).pipe(catchError(this.handlerError));
  }

  get_single_blog(blog_id:string){
    return this.http.get(this.get_single_blog_url + blog_id).pipe(catchError(this.handlerError));
  }

  search_blogs(contents: string){
    return this.http.get(this.search_blog_url + contents).pipe(catchError(this.handlerError));
  }

  search_files(keyword: string, page:number, sortBy:number,row:number, i:string){
    return this.http.get(this.search_file_url + '?kw=' + keyword + "&page=" + page + "&sortBy=" + sortBy + "&row=" + row + "&i=" + i, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  search_files_options(keyword: string, page:number, sortBy:number,row:number, i:string, options){
    return this.http.get(this.search_file_url2 + '?kw=' + keyword + "&page=" + page + "&sortBy=" + sortBy + "&row=" + row + "&i=" + i +
      "&op_sValue=" + options.value + "&op_hValue=" + options.value2
      + "&op_dValue=" + options.value3 + "&op_vValue=" + options.value4 + "&op_rValue=" + options.value5
      + "&date=" + options.date,
      {
        headers: this.authService.getAuthHeaders()
      }
    ).pipe(catchError(this.handlerError));
  }


  searchFilesByDate(date:string){
    console.log('date',date);
    return this.http.get(this.search_file_date_url + date, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  update_blog(blog_props: Object, blog_id: string){
    return this.http.put(this.update_blog_url + blog_id, blog_props, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  delete_blog(id: string){
    return this.http.delete(this.delete_blog_url + id, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  category_search(categoryName: string,page:number, sortBy: number, row:number ){
    return this.http.get(this.category_search_url + '?cn=' + categoryName + "&page=" + page + "&sortBy=" + sortBy + "&row" + row, {
      headers: this.authService.getAuthHeaders()
    }).pipe(catchError(this.handlerError));
  }

  //에러 핸들러 함수

  private handlerError(error: HttpErrorResponse){
    let message = ''; //재할당이 필요한 변수 -->let 사용
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
