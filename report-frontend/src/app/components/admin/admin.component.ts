
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private loginUser: User;
  constructor(
    private dialog:MatDialog,
    private auth_service:AuthService,
    private router: Router,
    private myinfo_service: MyinfoService) { }

  ngOnInit() {

  }

  open_dialog(message:string){
    const dialogRef = this.dialog.open(DialogBodyComponent,{
      data:{
        message
      },
      width:'550px',
      height:'200px'
    });
    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      if(confirm){
        this.sign_out();
      }
    })
  }

  sign_out(){
    this.auth_service.logout('');
  }

  public reload_all_blogs(params){

    //RefreshComponent 빈 화면 컴포넌트
    //빈화면으로 한 번 갔다가 의도한 패스로 다시 보냄
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/'+params]);
    });
  } 


}
