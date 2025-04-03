import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private add_category_url:string = 'http://localhost:5000/add_category';
  private modify_category_url:string = 'http://localhost:5000/modify_category/';
  private get_all_category_url:string ='http://localhost:5000/load_all_category';
  private createMainCategoryUrl:string = 'http://localhost:5000/createMainCategory';
  private loadAllMainUrl:string ='http://localhost:5000/loadAllMain';


  constructor(private http:HttpClient) { }

  createMainCategory(data:Object){ 
    return this.http.post(this.createMainCategoryUrl,data);
  }

  loadAllMain(){
    return this.http.get(this.loadAllMainUrl);
  }

  /*사용X*/
  add_category(data:Object){ 
    //에러 처리 후 에러 메시지를 생성하여 이를 방출하는 옵저버블 반환 
    return this.http.post(this.add_category_url,data);
  }

  modify_category(data:Object,group_id:number){ 
    return this.http.put(this.modify_category_url + group_id, data);
  }

  get_all_categories(){
    return this.http.get(this.get_all_category_url);
  }
}
