import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarService {
  private star_rating_url:string = 'http://localhost:5000/star_rating';
  private get_star_value_url:string ='http://localhost:5000/get_star_value/';
  private check_star_value_url:string ='http://localhost:5000/has_rated_star';


  constructor(private http:HttpClient) { }

  starRating(data:Object){
    return this.http.post(this.star_rating_url, data);
  }
  getStarValue(blog_id: number){
    return this.http.get(this.get_star_value_url + blog_id);
  }
  checkRating(data:Object){
    return this.http.post(this.check_star_value_url, data);
  }
}
