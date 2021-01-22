import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  private getAllSortsUrl:string = 'http://localhost:5000/get_all_codes';

  constructor(private http:HttpClient) { }

  getAllSorts(){
    return this.http.get(this.getAllSortsUrl);
  }
  

}
