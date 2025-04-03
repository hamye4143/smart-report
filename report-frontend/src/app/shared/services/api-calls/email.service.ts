import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private sendEmailUrl:string = 'http://localhost:5000/sendEmail';
  private getAllEmailsUrl:string = 'http://localhost:5000/getAllEmails';

  constructor(private http:HttpClient) { }

  sendEmail(emailProps){ 
    return this.http.post(this.sendEmailUrl,emailProps);
  }

  getAllEmails(userProps){ //보낸 메일 함
    console.log('userProps',userProps)
    return this.http.post(this.getAllEmailsUrl,userProps);
  }
}
