import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { User } from 'src/app/shared/models/User';
import { EmailService } from 'src/app/shared/services/api-calls/email.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
export interface Receiver {
  email: string;
}
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  private title: string = "";
  private content: string = "";
  private from: string = "";
  private to: string = "";
  private myFiles: string[] = [];
  private loginUser: User;
  private wellSent:boolean
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  receivers: string[] = [];
  down: boolean;
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  constructor(
    private dialog: MatDialog, 
    private emailService: EmailService,
    private auth_service : AuthService,
    private myinfo_service : MyinfoService,
    private router: Router,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    //공통으로 빼기
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this
        .myinfo_service
        .getUser()
        .then(user => {
          this.loginUser = user;
        });
    }
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.receivers.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(receiver: string): void {
    const index = this.receivers.indexOf(receiver);

    if (index >= 0) {
      this.receivers.splice(index, 1);
    }
  }
  
  //

  getFileDetails(e) {
    // console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this
        .myFiles
        .push(e.target.files[i]);
    }
  }

  remove_file_all(): void {
    this.myFiles = [];
  }

  remove_file(file): void {
    this
      .myFiles
      .splice(this.myFiles.indexOf(file), 1);
    console.log(this.myFiles)

    // const index = this.tags.indexOf(tag); if (index >= 0) {
    // this.tags.splice(index, 1); }

  }


  /**
 * on file drop handler
 */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  /**
 * handle file from browsing
 */
  fileBrowseHandler(files) {
    console.log('fileBrowseHandler')
    this.down = true;

    this.prepareFilesList(files);

  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this
        .myFiles
        .push(item);
    }
    console.log(this.myFiles)
    this.fileDropEl.nativeElement.value = "";
  }

  open_dialog(message: string) {
    //debugger
    const dialogRef = this.dialog.open(DialogBodyComponent, {

      data: {
        message
      }

    });
    //알림창 닫으면
    dialogRef
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.sendEmail();
        }
      })

  }

  submitCheck() {

    this.title = this.title == undefined? '': this.title.trim();
    this.content = this.content == undefined? '': this.content.trim();
    this.from = this.from == undefined? '': this.from.trim();


    if (!this.title || !this.content || !this.from || this.receivers.length < 1) { 
        this.notificationService.openSnackBar('빈값이 있습니다.');
        return false;
    }


    return true;
}

  sendEmail() {
    if(this.submitCheck()){
      const frmData = new FormData();
      frmData.append("title", this.title)
      frmData.append("content", this.content)
      frmData.append("sender", this.from)
      frmData.append("receivers",JSON.stringify(this.receivers)) //여러면 
      frmData.append("user", JSON.stringify(this.loginUser))
      //files
      for (var i = 0; i < this.myFiles.length; i++) {
        frmData.append("fileUpload", this.myFiles[i]);
      }
      this.emailService.sendEmail(frmData).subscribe(
        (response: any) => {
          console.log('response', response)
          this.wellSent = true;
          this.ngOnInit();
  
        },
        error => {
          console.log('error',error.error)
          this.notificationService.openSnackBar(error.error);
        }
      )
    }
    
  }

  enableButton() {
    this.down = !this.down;
  }

}
