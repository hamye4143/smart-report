import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "src/constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class LikeService {


  private like_post_url: string = `${API_BASE_URL}/like`;
  private has_liked_post_url: string = `${API_BASE_URL}/has_liked_post`;
  private like_counts_url: string = `${API_BASE_URL}/count_like/`;

  private loginUser =JSON.parse(localStorage.getItem('user_info'));
  private user_id = this.loginUser.id;

  constructor(private http:HttpClient) { }

  like_post(post_id){

    const data = {
      user_id: this.user_id,
      post_id: post_id,
      action: 'like'
    }

    // return this.http.post(this.like_post_url + post_id + "/like", data);
    return this.http.post(this.like_post_url , data);

  }

  unlike_post(post_id){

    const data = {
      user_id: this.user_id,
      post_id: post_id,
      action: 'unlike'
    }

    return this.http.post(this.like_post_url , data);

  }

  is_like(post_id){ //본인이 좋아요 눌렀었는지 확인 true or false

    const data = {
      user_id: this.user_id,
      post_id: post_id
    }

    return this.http.post(this.has_liked_post_url,data);

  }

  get_like_counts(blog_id){ //총 좋아요 수 확인
    console.log(blog_id)
    return this.http.get(this.like_counts_url + blog_id);

  }



}
