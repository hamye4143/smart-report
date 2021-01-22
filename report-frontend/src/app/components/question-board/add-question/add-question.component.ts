import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionBaseComponent } from 'src/app/common/common';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { User } from 'src/app/shared/models/User';
import { FeatureImageService } from 'src/app/shared/services/api-calls/feature-image.service';
import { QuestionService } from 'src/app/shared/services/api-calls/question.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent extends SubscriptionBaseComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private auth_service: AuthService,
    private myinfo_service: MyinfoService,
    private notificationService: NotificationService
  ) {
    super();
  }
  private title: string;
  private content: string;
  private selectedFile: File;
  private previewImage: any;
  private show_spinner: boolean = false;
  private loginUser: User;
  private questionId: number;



  ngOnInit(): void {
    //공통으로 빼기
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this
        .myinfo_service
        .getUser()
        .then(user => {
          this.loginUser = user;
        });
    } else {
      //로그인 안함 
      this.router.navigateByUrl('login');
    }
  }

  processFile(imageInput: any) {
    console.log('imageINput', imageInput)
    this.selectedFile = imageInput.files[0];
    console.log('imageINput', this.selectedFile)

    this.previewImageLoad();
  }

  previewImageLoad() {
    let reader = new FileReader();
    reader.onloadend = e => {
      this.previewImage = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  open_dialog(message: string) {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      data: {
        message
      }

    });
    //알림창 닫으면 
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.submit_blog();
      }
    })

  }


  submitCheck() {

    this.title = this.title == undefined
      ? ''
      : this
        .title
        .trim();
    this.content = this.content == undefined
      ? ''
      : this
        .content
        .trim();

    if (!this.title || !this.content) { // 둘중에 한개라도 빈칸
      this.notificationService.openSnackBar('제목 또는 내용이 빈값입니다');
      return false;
    }


    return true;
  }

  submit_blog() {
    if (this.submitCheck()) {
      this.show_spinner = true;
      let feature_image; //
      const frmData = new FormData();



      feature_image = this.selectedFile
      console.log('selectedFile', this.selectedFile)



      frmData.append("title", this.title)
      frmData.append("content", this.content)
      frmData.append("feature_image", "this.selectedFile")
      frmData.append("fileUpload", this.selectedFile)
      frmData.append("user", JSON.stringify(this.loginUser))


      console.log(frmData['feature_image'])

      this.subscription = this.questionService.addQuestion(frmData).subscribe(
        (response: any) => {
          this.questionId = response.id;
          this.show_spinner = false;
          this.title = "";
          this.content = "";
          this.previewImage = "";
          this.loginUser = null;

          this.router.navigateByUrl('/question/' + this.questionId);
          this.notificationService.openSnackBar('업로드 되었습니다.');


        },
        error => {
          console.error('[QuestionService.add_question-board]', error)
          this.show_spinner = false;
        },
        () => {
          console.log('Streaming finished');
        }

      );
    }
  }

}
