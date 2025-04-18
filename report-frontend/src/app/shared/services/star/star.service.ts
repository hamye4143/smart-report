import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API_BASE_URL} from "src/constants/api-url";
import {AuthService} from "src/app/shared/services/guards/auth.service";

@Injectable({
  providedIn: 'root'
})
export class StarService {

  private star_rating_url:string = `${API_BASE_URL}/star_rating`;
  private get_star_value_url:string = `${API_BASE_URL}/get_star_value/`;
  private check_star_value_url:string = `${API_BASE_URL}/has_rated_star`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  starRating(data:Object){
    return this.http.post(this.star_rating_url, data, {
      headers: this.authService.getAuthHeaders()
    });
  }
  getStarValue(blog_id: number){
    return this.http.get(this.get_star_value_url + blog_id);
  }
  checkRating(data:Object){
    return this.http.post(this.check_star_value_url, data);
  }
}
