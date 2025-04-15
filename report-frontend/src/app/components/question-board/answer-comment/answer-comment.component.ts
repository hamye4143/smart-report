import { Component, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { User } from 'src/app/shared/models/User';
import { QuestionService } from 'src/app/shared/services/api-calls/question.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-answer-comment',
  templateUrl: './answer-comment.component.html',
  styleUrls: ['./answer-comment.component.css']
})
export class AnswerCommentComponent implements OnInit {
  private clickedId: number;
  public mode: 'view' | 'edit' = 'view';
  public groupedForm: FormGroup;
  public identity = {
    title: '',
    content: ''
  };
  private title: string;
  private content: string;
  private loginUser: User;
  private show_spinner: boolean = false;
  private serializedData;
  private visibleCheck = true;
  private visibleResult = false;
  @Input() questionId: number;
  @Input() questionUserId: number;
  @Input() visibleAnswer: boolean;
  @Input() isSelected: boolean = false;
  idList=[];
  contentPlaceholder = "";
  titlePlaceholder = "";


  constructor(
    public dialog: MatDialog,
    private questionService: QuestionService,
    private auth_service: AuthService,
    private myinfo_service: MyinfoService,
    private router: Router,
    private renderer: Renderer2,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    this.initGroupedForm();


    if (this.auth_service.is_logged_in()) {
      const a = await this.myinfo_service.getUser().then(user => {
        this.loginUser = user;
      });
    }
    // this.loadDatas();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('questionId' in changes) {
      if (changes.questionId.currentValue) {
        this.initGroupedForm();
        this.loadDatas();
        this.initGroupedForm();
      }
    }
  }

  loadDatas() {
    this.questionService.getAllAnswers(this.questionId).subscribe(
      (response) => {
        this.serializedData = response['serializedData'];
        this.serializedData.forEach(element => {
          this.idList.push(element.id)
        });
        this.initGroupedForm();
      }
    );
  }
  initGroupedForm(): void {

    this.groupedForm = new FormGroup({
      title: new FormControl(this.identity.title),
      content: new FormControl(this.identity.content)
    });
  }

  async submitAnswer() {

    //공통으로 빼기
    if (this.loginUser && this.loginUser['is_admin'] == 'Y') { //로그인하고, 관리자라면


      const answer = {
        title: this.title,
        content: this.content,
        userId: this.loginUser.id,
        questionId: this.questionId
      }

      this.show_spinner = true;

      this.questionService.addAnswer(answer).subscribe(
        (response: any) => {
          this.title = "";
          this.content = "";
          this.show_spinner = false;
          this.loadDatas();
        },
        error => {
          this.show_spinner = false;
        }
      );

    } else {
      this.notificationService.openSnackBar('권한이 없습니다.');
      this.router.navigateByUrl('login');

    }


  }

  open_dialog(message: string, answerId: number ,type:number): void {
    let dialogRef = this.dialog.open(DialogBodyComponent, {
      data: {
        message
      }
    })

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        if(type == 1){
          this.checkAnswer(answerId);
        }else{
          this.deleteSingleAnswer(answerId);
        }
      }
    });
  }

  checkAnswer(answerId) {
    this.questionService.checkAnswerSelected(answerId).subscribe(
      (response: any) => {
        this.isSelected = true;
        this.loadDatas();
      });
  }

  updateGroupedEdition(answerId): void {
    this.identity = this.groupedForm.value;
    this.questionService.updateSingleAnswer(this.identity, answerId).subscribe(
      (response: any) => {
      });


  }

  cancelGroupedEdition(): void {
    this.groupedForm.setValue(this.identity);
  }

  handleModeChange(mode: 'view' | 'edit', answerId: number): void {
    //지금 클릭한 것만 editMode로, 클릭했던거나, 그 전껀 모두 viewmode로
    // if(){

    // }
    this.cancelGroupedEdition()
    this.mode = mode;
    if (this.mode == 'edit') {
      this.clickedId = answerId;
    }
  }

  async deleteSingleAnswer(answerId) {
    //글쓴이 인지 확인
    this.questionService.deleteSingleAnswer(answerId).subscribe(
      (response) => {
        if (response) {
          this.notificationService.openSnackBar('답변이 삭제되었습니다.');

          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['question/' + this.questionId]);
          });

        }
      },
      error => {
        console.error('[BlogService.update_blog]', error)
      }
    );
  }



  /*
   * new
  */

  updateMode(answerId,content,title){

    //???
    this.idList.forEach(element => {
      this.cancelEdit(element)
    });


    const viewEl = document.getElementById("viewAnswer_"+answerId);
    const editEl = document.getElementById("editAnswer_"+answerId);
    this.contentPlaceholder = content;
    this.titlePlaceholder = title;

    this.renderer.setStyle(viewEl, 'display', 'none');
    this.renderer.setStyle(editEl, 'display', 'block');
  }
  cancelEdit(answerId){
    const viewEl = document.getElementById("viewAnswer_"+answerId);
    const editEl = document.getElementById("editAnswer_"+answerId);

    this.renderer.setStyle(viewEl, 'display', 'block');
    this.renderer.setStyle(editEl, 'display', 'none');

  }

  updateAnswer(answerId){
    const data = {
      title:this.titlePlaceholder,
      content: this.contentPlaceholder
    }

    this.questionService.updateSingleAnswer(data,answerId).subscribe(
      (response:any)=>{
        this.loadDatas();
      },
      error=>{
        this.show_spinner = false;
      }
    );
  }

}

