import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "../../../../constants/api-url";
import {AuthService} from "src/app/shared/services/guards/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private add_category_url:string = `${API_BASE_URL}/add_category`;
  private modify_category_url:string = `${API_BASE_URL}/modify_category/`;
  private get_all_category_url:string =`${API_BASE_URL}/load_all_category`;
  private createMainCategoryUrl:string = `${API_BASE_URL}/createMainCategory`;
  private loadAllMainUrl:string =`${API_BASE_URL}/loadAllMain`;


  constructor(private http:HttpClient, private authService: AuthService) { }

  createMainCategory(data:Object){
    return this.http.post(this.createMainCategoryUrl,data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  loadAllMain(){
    return this.http.get(this.loadAllMainUrl);
  }

  /*사용X*/
  add_category(data:Object){
    //에러 처리 후 에러 메시지를 생성하여 이를 방출하는 옵저버블 반환
    return this.http.post(this.add_category_url, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  modify_category(data:Object,group_id:number){
    return this.http.put(this.modify_category_url + group_id, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  get_all_categories(){
    return this.http.get(this.get_all_category_url);
  }
}
