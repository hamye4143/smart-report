import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "src/constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class SortService {

  private getAllSortsUrl:string = `${API_BASE_URL}/get_all_codes`;

  constructor(private http:HttpClient) { }

  getAllSorts(){
    return this.http.get(this.getAllSortsUrl);
  }


}
