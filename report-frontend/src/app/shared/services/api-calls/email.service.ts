import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "../../../../constants/api-url";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
    private sendEmailUrl:string = `${API_BASE_URL}/sendEmail`;
  private getAllEmailsUrl:string = `${API_BASE_URL}/getAllEmails`;

  constructor(private http:HttpClient) { }

  sendEmail(emailProps){
    return this.http.post(this.sendEmailUrl,emailProps);
  }

  getAllEmails(userProps){ //보낸 메일 함
    console.log('userProps',userProps)
    return this.http.post(this.getAllEmailsUrl,userProps);
  }
}
