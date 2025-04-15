import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {API_BASE_URL} from "../../../../constants/api-url";
import {AuthService} from "src/app/shared/services/guards/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
    private sendEmailUrl:string = `${API_BASE_URL}/sendEmail`;
  private getAllEmailsUrl:string = `${API_BASE_URL}/getAllEmails`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  sendEmail(emailProps){
    return this.http.post(this.sendEmailUrl, emailProps, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAllEmails(userProps){ //보낸 메일 함
    console.log('userProps',userProps)
    return this.http.post(this.getAllEmailsUrl, userProps, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
