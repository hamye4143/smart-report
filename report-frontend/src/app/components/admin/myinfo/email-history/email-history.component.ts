import { Component, OnInit, Renderer2 } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { EmailService } from 'src/app/shared/services/api-calls/email.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';

@Component({
  selector: 'app-email-history',
  templateUrl: './email-history.component.html',
  styleUrls: ['./email-history.component.css']
})
export class EmailHistoryComponent implements OnInit {
  loginUser:User;
  private data;
  //private down:boolean;
  constructor(private emailService: EmailService, 
    private myInfoService: MyinfoService,
    private auth_service : AuthService,
    private myinfo_service : MyinfoService,
    private renderer: Renderer2,) { }

  ngOnInit(): void {

    if (this.auth_service.is_logged_in()) { //로그인했다면
      this
          .myinfo_service
          .getUser()
          .then(user => {
              this.loginUser = user;
              this.loadData();
          });
  }


  }

  loadData(): void {
    const userProps = this.loginUser
    console.log(userProps)
    this.emailService.getAllEmails(userProps).subscribe(
      (response):any =>{
        
        console.log('response',response)
        this.data = response
      });
  }
  cleanString(str) {
    str = str.replace('"[', '[');
    str = str.replace(']"', ']');
    
    const result = JSON.parse(str)
    let string=""
    if(result.length > 1){
      string ="..."
    }
    return result;
  }

  enableButton(index) {
    console.log(index)
    //this.down = !this.down;

    const viewEl = document.getElementById("div_"+index);
    const iconEl = document.getElementById("arrow_drop_down_"+index);
    const iconEl2 = document.getElementById("arrow_drop_up_"+index);

    if(viewEl.style.display == 'none' || viewEl.style.display =='') {
      this.renderer.setStyle(viewEl, 'display', 'table-row');
      this.renderer.setStyle(iconEl, 'display', 'inline');
      this.renderer.setStyle(iconEl2, 'display', 'none');

    }
    else{
      this.renderer.setStyle(viewEl, 'display', 'none');
      this.renderer.setStyle(iconEl, 'display', 'none');
      this.renderer.setStyle(iconEl2, 'display', 'inline');

    }
  }


}
