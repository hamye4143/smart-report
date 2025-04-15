import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { DialogStarComponent } from 'src/app/shared/components/dialog-star/dialog-star.component';
import { StarComponent } from '../star/star.component';
import { CommentComponent } from './comment/comment.component';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { AuthGuardService } from 'src/app/shared/services/guards/auth-guard.service';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { User } from 'src/app/shared/models/User';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  selected = 'option2';
  data;
  private loginUser: User;
  category_list = [];
  private blog_id:string;
  private blog_props={
    id:null,
    title: "",
    content:"",
    feature_image: "",
    tags: [],
    created_at:"",
    user_name: "",
    files:[],
    comments:[],
    category:[],
    commentCount:"",
    viewCount:""

  };
  @ViewChild(StarComponent, { static: false }) childC: StarComponent;

  constructor(
    private blog_service:BlogService,
    private active_route:ActivatedRoute,
    private dialog:MatDialog,
    private auth_service:AuthService,
    private auth_gaurd_service:AuthGuardService,
    private myinfo_service: MyinfoService,
    private router: Router,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    //공통으로 빼기
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this.myinfo_service.getUser()
      .then(user => {
        this.loginUser = user;
      })
      .catch(response =>{
        this.router.navigate(['/login']);
      });
    }
    this.active_route.params.subscribe((response)=>{
      this.blog_id = response.id;
      this.get_blog_details();
    })

  }
  show_popup(){
    alert('show_popup');
    //
  }

  get_blog_details(){
    this.blog_service.get_single_blog(this.blog_id).subscribe(
      (response:any)=>{
        this.data = response.single_blog;
        this.blog_props.id = response.single_blog.id;
        this.blog_props.title = response.single_blog.title;
        this.blog_props.content = response.single_blog.content;
        this.blog_props.feature_image = response.single_blog.feature_image;
        this.blog_props.created_at = response.single_blog.created_at;
        this.blog_props.user_name = response.single_blog.author.name;
        this.blog_props.comments = [];
        this.blog_props.commentCount = response.single_blog.comments.length;
        this.blog_props.viewCount = response.single_blog.view_count;


        this.blog_props.category = response.single_blog.category;

        response.single_blog.tags.forEach((element:any)=>{
          this.blog_props.tags.push(element);
        });

        response.single_blog.files.forEach((element:any)=>{
          this.blog_props.files.push(element)
        });

        // response.single_blog.comments.forEach((element:any)=>{
        //   this.blog_props.comments.push(element)
        // });

    },
    error =>{
      console.error('[BlogService.get_blog_detail]',error)
    });
  }

  //모든 파일 다운로드
  download_all_file(){
    this.blog_props.files.forEach(file => {
      this.download_single_file(file.new_name, file.origin_name, file.id);
    });
  }

  //단일 파일 다운로드
  download_single_file(filename, origin_name, file_id){
    this.blog_service.download_single_file(filename,file_id).subscribe(
      (data:any)=>{
        saveAs(data, origin_name)
      },
      error =>{
        console.error('[BlogService.download_single_file]',error)
      }
    );

  }

  async delete_single_blog(blog_id:string){

    //caniAccess?
    await this.auth_gaurd_service.canAccess(blog_id).then((result) => {
      //window.alert(result); // true
      if(!result){
        this.notificationService.openSnackBar('글쓴이가 아니므로 삭제 할 수 없습니다.');

        this.router.navigate(['/admin']);
        }
    });

    this.blog_service.delete_blog(blog_id).subscribe(
      (response)=>{
      if(response){
        this.notificationService.openSnackBar('삭제되었습니다');


        //RefreshComponent 빈 화면 컴포넌트
        //빈화면으로 한 번 갔다가 의도한 패스로 다시 보냄
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/all-blogs']);
        });

      }
    },
    error =>{
      console.error('[BlogService.update_blog]',error)
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
        this.delete_single_blog(blog_id);
      }
    });
  }
  open_dialog(){
    const blog_id = this.blog_id
    const dialogRef = this.dialog.open(DialogStarComponent,{
      data:{
        blog_id
      },
      width:'500px',
      height:'200px'
    });
    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      if(confirm){

        //app-star 새로고침
          this.childC.getStarValue();


      }
    })
  }


}
