import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private add_comment_url:string = 'http://localhost:5000/add_comment';
  private add_recomment_url:string = 'http://localhost:5000/add_recomment';
  private get_comments_url:string = 'http://localhost:5000/get_all_comments/';
  private update_comment_url:string = 'http://localhost:5000/update_comment/';
  private delete_comment_url:string = 'http://localhost:5000/delete_comment/';




  constructor(private http:HttpClient) { }

  add_comment(blog_props){
    return this.http.post(this.add_comment_url,blog_props);
  }

  add_recomment(blog_props){ 
    return this.http.post(this.add_recomment_url,blog_props);
  }

  get_all_comments(blogId){
    return this.http.get(this.get_comments_url + blogId);
  }

  updateComment(commentId,content){
    // return this.http.put(this.get_comments_url + blogId);
    console.log('conetnet',content)
    return this.http.put(this.update_comment_url + commentId, content);
  }

  deleteComment(commentId){
    console.log('commentId',commentId)
    // return this.http.put(this.get_comments_url + blogId);
    return this.http.delete(this.delete_comment_url + commentId);
  }

}
