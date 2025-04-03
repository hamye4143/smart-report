import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { CommentService } from 'src/app/shared/services/api-calls/comment.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  // Sample table example
  public formArray: FormArray;
  public accounts = [
    { name: 'John', role: 'Product Owner', isActive: false },
    { name: 'Jenny', role: 'Developer', isActive: true },
  ];
  content ="";
  content2="";
  contentPlaceholder = "";
  public inner: string ="";
  panelOpenState = false;
  visible = true;
  visible2 = false;
  new_reivew = true;
  answer_id;
  showComment= true;
  updateVisible= false;
  idList=[];


  // private inner = "<mat-form-field class='full-width'><input matInput type='text' [(ngModel)]='content2' placeholder='대댓글 쓰기'></mat-form-field> ";
  private loginUser: User;
  private show_spinner: boolean = false;
  // private kk:string;

  constructor(
    private comment_service:CommentService, 
    private auth_service: AuthService, 
    private myinfo_service: MyinfoService,
    private renderer: Renderer2,
    private dialog:MatDialog,
    private notificationService: NotificationService,
    )
     { }
  

  @Input() blog_id ="";
  // @Input() comments;
  comments;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @ViewChild('div',{static:false}) div: ElementRef;
  
  ngOnInit() {
    //공통으로 빼기 
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this.myinfo_service.getUser()
      .then(user => {
        this.loginUser = user;
      });
    }
    this.getAllComments();
    this.formArray = new FormArray(this.toGroups());
  }

  getAllComments(){
    this.comment_service.get_all_comments(this.blog_id).subscribe(
      (response)=>{
        console.log('commentDataLoad',response)
        this.comments = response['data']  
        this.comments.forEach(element => {
          this.idList.push(element.id)
        });


      }
    );

  }

  re_submit_comment(groupNum){
    console.log('re_submit_comment',groupNum)
    const comment = {
      content: this.content,
      user_id: this.loginUser.id,
      blog_id: this.blog_id,//자식(대댓글)
      // order:0 //댓글과 대댓글 순서
      groupNum: groupNum
    }

    this.show_spinner = true;

    this.comment_service.add_recomment(comment).subscribe(
      (response:any)=>{ 
        console.log('response',response)
        this.content = "";
        this.show_spinner = false;

        //comment 새로고침 (부모의 get_blog_details() 함수 다시)
        this.parentFun.emit();
      },
      error=>{
        this.show_spinner = false;
      }
    );
  }
  submitCheck() {
    if ( this.content && this.loginUser.id && this.blog_id) {
      const comment = {
        content: this.content,
        user_id: this.loginUser.id,
        blog_id: this.blog_id
      }
      console.log('comment',comment)
      return comment;
    }
    this.notificationService.openSnackBar('빈 값입니다.');
    return false;
  }
  submit_comment(){

    const comment = this.submitCheck();
    if(comment){

      console.log('comment',comment)
      this.show_spinner = true;
  
      this.comment_service.add_comment(comment).subscribe(
        (response:any)=>{ 
          console.log('response',response)
          this.content = "";
          this.contentPlaceholder ="";
          this.show_spinner = false;
          this.notificationService.openSnackBar('댓글이 등록되었습니다.');
          this.getAllComments();
        },
        error=>{
          this.show_spinner = false;
          console.log(error.error);
          this.notificationService.openSnackBar(error.eror);
  
        }
      );
    }
  }


  open_answer_review(id){
    console.log('click',id)
    this.answer_id = id;
    // this.visible = false;
    // this.new_reivew = true;
    //.comment 안보이게
    //#new_comment.append()
    //new_comment_2 만 보이도록 
  
    this.inner = "<mat-form-field class='full-width'><input matInput type='text' [(ngModel)]='content2' placeholder='대댓글 쓰기'></mat-form-field> <button mat-raised-button color='primary' class = 'add_comment'(click)='submit_comment()'>Add Comment</button>";
    //클릭한 id 만 i
    this.visible2 = true;


    // const p: HTMLParagraphElement = this.renderer.createElement('p');
    // console.log('p',this.div.nativeElement)
    // p.innerHTML = "<mat-form-field class='full-width'><input matInput type='text' [(ngModel)]='content2' placeholder='대댓글 쓰기'></mat-form-field> <button mat-raised-button color='primary' class = 'add_comment'(click)='submit_comment()'>Add Comment</button>"
    // this.renderer.appendChild(this.div.nativeElement, p)


  
    // this.inner = "<mat-form-field class='full-width'><input matInput type='text' [(ngModel)]='content2' placeholder='대댓글 쓰기'></mat-form-field> <button mat-raised-button color='primary' class = 'add_comment'(click)='submit_comment()'>Add Comment</button>";


  }
  toGroups(): AbstractControl[] {
    return this.accounts.map((account) => {
      return new FormGroup({
        name: new FormControl(account.name),
        role: new FormControl(account.role),
        isActive: new FormControl(account.isActive),
      });
    });
  }
  getControl(index: number, field: string): FormControl {
    console.log('index',index)
    console.log('index',field)
    return this.formArray.at(index).get(field) as FormControl;
  }

  cancel(index: number, field: string): void {
    const control = this.getControl(index, field);
    control.setValue(this.accounts[index][field]);
  }
  
  updateField(index: number, field: string): void {
    const control = this.getControl(index, field);

    if (control.valid) {
      this.accounts[index][field] = control.value;
    }
  }

  updateMode(commentId,content){
    console.log('commentId',commentId)
    console.log('commentId',content)

    //???
    this.idList.forEach(element => {
      this.cancelEdit(element)
    });
    
     
    const viewEl = document.getElementById("viewComment_"+commentId);
    const editEl = document.getElementById("editComment_"+commentId);
    this.contentPlaceholder = content;
    
    this.renderer.setStyle(viewEl, 'display', 'none');
    this.renderer.setStyle(editEl, 'display', 'block');    
  }

  cancelEdit(commentId){
    const viewEl = document.getElementById("viewComment_"+commentId);
    const editEl = document.getElementById("editComment_"+commentId);

    this.renderer.setStyle(viewEl, 'display', 'block');
    this.renderer.setStyle(editEl, 'display', 'none');    

  }
  updateComment(commentId){
    const data = {
      content: this.contentPlaceholder
    }

    this.comment_service.updateComment(commentId,data).subscribe(
      (response:any)=>{ 
        this.getAllComments();
      },
      error=>{
        this.show_spinner = false;
      }
    );
  }

  open_dialog_delete(message:string, blog_id:string): void {
    let dialogRef = this.dialog.open(DialogBodyComponent,{
      data: {
        message
      }
    })

    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      if(confirm){
        this.deleteComment(blog_id);
      }
    });
  }


  deleteComment(commentId){
    this.comment_service.deleteComment(commentId).subscribe(
      (response:any)=>{ 
        this.getAllComments();
      },
      error=>{
        this.show_spinner = false;
      }
    );
  }

}
