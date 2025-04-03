import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private file_url:string = 'http://localhost:5000/upload_files';

  constructor(private http:HttpClient) { }

  upload_files(files){
    console.log('files',files)
    return this.http.post(this.file_url, files);
  }
}
