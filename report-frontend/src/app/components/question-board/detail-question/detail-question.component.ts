import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { User } from 'src/app/shared/models/User';
import { QuestionService } from 'src/app/shared/services/api-calls/question.service';
import { AuthGuardService } from 'src/app/shared/services/guards/auth-guard.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

interface Account {
  name: string;
  role: string;
  isActive: boolean;
}

type Accounts = Array<Account>;

@Component({
  selector: 'app-detail-question',
  templateUrl: './detail-question.component.html',
  styleUrls: ['./detail-question.component.css']
})
export class DetailQuestionComponent implements OnInit {
  private value = ''
  // multiple form
  public mode: 'view' | 'edit' = 'view';
  public groupedForm: FormGroup;
  public identity = {
    title: '',
    content: ''
  };
  private selectedFile: File;
  private loginUser: User;
  private questionId: number;
  private isSelected: boolean = false;
  private visibleDeleteButton: boolean = true;
  private visibleAnswer:boolean = false;
  private questionProps = {
    title: "",
    content: "",
    feature_image:null,
    created_at: null,
    user_name: "",
    viewCount: "",
    answerCount: "",
    user_id: "",
  };

  constructor(
    private questionService: QuestionService,
    private active_route: ActivatedRoute,
    private dialog: MatDialog,
    private auth_service: AuthService,
    private myinfo_service: MyinfoService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {

    this.initGroupedForm();

    if (this.auth_service.is_logged_in()) { //로그인했다면
      const a = await this.myinfo_service.getUser()
        .then(user => {
          console.log('asfdasd')
          this.loginUser = user;
          console.log('this.', this.loginUser)
        })
        .catch(response => {
          this.router.navigate(['/login']);
        });
    }
    // this.initGroupedForm();

    this.active_route.params.subscribe((response) => {
      this.questionId = response.id;
      console.log('this.questionId', this.questionId)
    })

    this.getQuestionDetail();


  }

  initGroupedForm(): void {
  
    this.groupedForm = new FormGroup({
      title: new FormControl(this.identity.title),
      content: new FormControl(this.identity.content)
    });
  }

  getQuestionDetail() {

    this.questionService.getSingleQuestion(this.questionId).subscribe(
      (response: any) => {
        console.log(response)
        console.log(response.questionData.path);
        this.questionProps.title = response.questionData.title;
        this.questionProps.content = response.questionData.content;
        this.questionProps.feature_image = response.questionData.path;
        this.questionProps.created_at = response.questionData.created_at;
        this.questionProps.user_name = response.questionData.author.name;
        this.questionProps.viewCount = response.questionData.viewCount;
        this.questionProps.answerCount = response.questionData.answerCount;
        this.questionProps.user_id = response.questionData.author_id;
        this.identity.title = response.questionData.title;
        this.identity.content = response.questionData.content;


        this.isSelected = response.questionData.state == 3;
        console.log('this.isSelected', this.isSelected)
        this.initGroupedForm();


      });

  }

  updateGroupedEdition(): void {
    console.log('updateGroupedEdition');
    this.identity = this.groupedForm.value;
    console.log('this.identity',this.identity)
    const frmData = new FormData();

    frmData.append("title", this.identity.title)
    frmData.append("content", this.identity.content)
    frmData.append("fileUpload",this.selectedFile)
    
    this.questionService.updateSingleQuestion(frmData,this.questionId).subscribe(
      (response: any) => {
        console.log('response',response)
    });
    

  }

  cancelGroupedEdition(): void {
    console.log('cancelGroupedEdition');

    this.groupedForm.setValue(this.identity);
  }

  handleModeChange(mode: 'view' | 'edit'): void {
    // console.log('handleModeChange');

    this.mode = mode;
    console.log('handleModeChange',this.mode);
    //edit mode: 삭제 버튼 안보이게
    if(this.mode == 'edit'){
      this.visibleDeleteButton = false;
    }else{
      this.visibleDeleteButton = true;
    }
  }

  processFile(imageInput: any) {
    console.log('imageINput',imageInput)
    this.selectedFile = imageInput.files[0];
    // console.log('imageINput',this.selectedFile)

    this.previewImageLoad();
  }

  previewImageLoad(){
    let reader = new FileReader();
    reader.onloadend = e =>{
      this.questionProps.feature_image = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  open_dialog(message:string): void {
    let dialogRef = this.dialog.open(DialogBodyComponent,{
      data: {
        message
      }
    })

    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      if(confirm){
        this.deleteSingleQuestion();
      }
    });
  }

  async deleteSingleQuestion(){

    //글쓴이 인지 확인 
    this.questionService.deleteSingleQuestion(this.questionId).subscribe(
      (response)=>{
      if(response){
        this.notificationService.openSnackBar('게시글이 삭제되었습니다.');
        //자식 컴포넌트(app-answer-comment) 새로고침
        this.questionId = this.questionId;

      }
    },
    error =>{
      console.error('[BlogService.update_blog]',error)
    }
    );
  }


  seeImage(imgUrl) {
    // console.log(imgUrl)
    window.open(imgUrl, "_blank");
  }







}
