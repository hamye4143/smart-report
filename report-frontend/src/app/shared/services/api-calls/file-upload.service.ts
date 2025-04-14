import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private file_url:string = `${API_BASE_URL}/upload_files`;

  constructor(private http:HttpClient) { }

  upload_files(files){
    console.log('files',files)
    return this.http.post(this.file_url, files);
  }
}
