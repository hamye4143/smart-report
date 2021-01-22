import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private add_blog_url:string = 'http://localhost:5000/add_blog';
  private get_all_blogs_url:string = 'http://localhost:5000/blogs';
  private get_all_categories_url:string = 'http://localhost:5000/load_all_category';
  private get_single_blog_url:string = 'http://localhost:5000/blog/';
  private delete_blog_url:string = 'http://localhost:5000/delete_blog/';
  private update_blog_url:string = 'http://localhost:5000/update_blog/';
  private search_blog_url:string = 'http://localhost:5000/search_blogs/';
  private file_url:string = 'http://localhost:5000/upload_files';
  private download_url:string = 'http://localhost:5000/downloadfile';
  private test_url:string = 'http://localhost:5000/test_url';
  private search_file_url:string = 'http://localhost:5000/search';
  private search_file_url2:string = 'http://localhost:5000/search2';

  private search_file_date_url:string = 'http://localhost:5000/searchByDate/';
  // private category_search_url:string = 'http://localhost:5000/categorySearch/';
  private category_search_url:string = 'http://localhost:5000/categorySearch';



  
  constructor(private http:HttpClient) { }


  download_single_file(filename:string, file_id:string){
    
    const user_id = JSON.parse(localStorage.getItem('user_info'))['id'] //전송해줘야함 

    //test
    const params = new HttpParams().set('user_id',user_id).set('file_id', file_id);

    const data = {
      'user_id':user_id,
      'file_id':file_id,
      'filename':filename
    }


    return this.http.post(this.download_url, data, { responseType: 'blob'} ).pipe(catchError(this.handlerError));

  }

  upload_files(files){
    console.log('files',files)
    return this.http.post(this.file_url, files).pipe(catchError(this.handlerError));
  }

  add_blog(blog_props){ //blog_props:Object
    //에러 처리 후 에러 메시지를 생성하여 이를 방출하는 옵저버블 반환 
    return this.http.post(this.add_blog_url,blog_props).pipe(catchError(this.handlerError));
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
    console.log('search_files_page',page)
    return this.http.get(this.search_file_url+'?kw='+keyword+"&page="+page+"&sortBy="+sortBy+"&row="+row+"&i="+i).pipe(catchError(this.handlerError));
  }

  search_files_options(keyword: string, page:number, sortBy:number,row:number, i:string, options){
    console.log('search_files_page',options)
    return this.http.get(this.search_file_url2+'?kw='+keyword+"&page="+page+"&sortBy="+sortBy+"&row="+row+"&i="+i+
    "&op_sValue="+options.value+"&op_hValue="+options.value2
    +"&op_dValue="+options.value3+"&op_vValue="+options.value4+"&op_rValue="+options.value5
    +"&date="+options.date
    
    ).pipe(catchError(this.handlerError));
  }


  searchFilesByDate(date:string){
    console.log('date',date);
    return this.http.get(this.search_file_date_url + date).pipe(catchError(this.handlerError));
  }
  
  update_blog(blog_props: Object, blog_id:string){
    return this.http.put(this.update_blog_url + blog_id, blog_props).pipe(catchError(this.handlerError));
  }

  delete_blog(id:string){
    return this.http.delete(this.delete_blog_url + id).pipe(catchError(this.handlerError));
  }

  category_search(categoryName: string,page:number, sortBy: number, row:number ){
    return this.http.get(this.category_search_url + '?cn='+ categoryName + "&page="+ page + "&sortBy=" + sortBy + "&row"+row).pipe(catchError(this.handlerError));
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
