
import { MatDialog } from '@angular/material/dialog';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { FeatureImageService } from 'src/app/shared/services/api-calls/feature-image.service';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { TagComponent } from '../../tag/tag.component';
import { User } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { AuthGuardService } from 'src/app/shared/services/guards/auth-guard.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

// interface Blog{
//   title:string,
//   content:string,
//   tags:string[],
//   feature_image:any
// }

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css']
})



export class UpdateBlogComponent implements OnInit {
  private blog_id: string;
  myFiles: string[] = []; //신규
  prevFiles = []; //기존
  removedPrevFileIdList = [] //기존파일들에서 삭제한 파일들의 id 리스트
  private selectedFile: any;
  private show_spinner: boolean = false;
  private returnUrl: string;
  private loginUser: User;
  private title: string;
  private content: string;
  selectedValue: string;
  private categoryList=[];



  private tags: []; // 추가 

  private blog_props = {
    title: "",
    content: "",
    tags: [],
    feature_image: null,
    created_at: null,
    user: null,
    files: [],
    category:[]
  }
  //부모 -> 자식
  @ViewChild(TagComponent, { static: false }) childReference: any;
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  private test: string;

  constructor(private active_route: ActivatedRoute,
    private dialog: MatDialog,
    private blog_service: BlogService,
    private image_service: FeatureImageService,
    private route: ActivatedRoute,
    private router: Router,
    private auth_gaurd_service: AuthGuardService,
    private auth_service : AuthService,
    private myinfo_service : MyinfoService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['rout'] || '/';
    //공통으로 빼기
    if (this.auth_service.is_logged_in()) { //로그인했다면
      this
        .myinfo_service
        .getUser()
        .then(user => {
          this.loginUser = user;
        });
    }
    this.active_route.params.subscribe((response) => {
      this.blog_id = response.id;
      this.get_blog_info();


    });


    //caniAccess?
    this.auth_gaurd_service.canAccess(this.blog_id).then((result) => {
      //window.alert(result); // true
      if (!result) {
        this.notificationService.openSnackBar('글쓴이가 아니므로 접근 할 수 없습니다.');
        this.router.navigate(['/admin']);
      }
    });


  }
  ngAfterViewInit() { //HTML에 작성된 내용이 화면에 모두 출력되고나서 호출

    this.tags = this.childReference.tags;

  }

  processFile(imageInput: any) {
    this.selectedFile = imageInput.files[0];
    this.previewImageLoad();
  }

  previewImageLoad() {
    let reader = new FileReader();
    reader.onloadend = e => {
      this.blog_props.feature_image = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  open_dialog(message: string) {
    const dialogRef = this.dialog.open(DialogBodyComponent, {

      data: {
        message
      }

    });
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.submit_blog();
      }
    })

  }

  get_blog_info() {

    this.blog_service.get_single_blog(this.blog_id).subscribe(

      (response: any) => {
        console.log('response', response.single_blog)
        this.blog_props.title = response.single_blog.title;
        this.blog_props.content = response.single_blog.content;
        this.blog_props.feature_image = response.single_blog.feature_image;
        this.blog_props.category = response.single_blog.category;
        console.log('blog_props.category',this.blog_props.category)
        response.single_blog.files.forEach(element => {
          this.prevFiles.push(element)
        });


        response.single_blog.tags.forEach((element: any) => {
          this.blog_props.tags.push(element);
          this.test = "";
        });
      });
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
      this.notificationService.openSnackBar('제목 또는 내용이 빈값입니다.');
      return false;
    }


    return true;
  }
  async submit_blog() {
    if (true) {//this.submitCheck

      const frmData = new FormData();
      this.show_spinner = true;


      let blog = {
        title: this.title,
        content: this.content,
        feature_image: null,
        tags: [],
        files: this.myFiles
      }

      const frmTag = []
      //추가 --> update 
      this.tags.map((element) => {
        blog.tags.push(element["name"])
        frmTag.push(element["name"])
      });

      const surviedPrevFileIdList = [];

      frmData.append("title", this.blog_props.title)
      frmData.append("content", this.blog_props.content)
      frmData.append("feature_image", "feature_image")
      frmData.append("tags", JSON.stringify(frmTag))
      frmData.append("user", JSON.stringify(this.loginUser))
      frmData.append("category", JSON.stringify(this.categoryList))
      frmData.append("removedPrevFileIdList", JSON.stringify(this.removedPrevFileIdList))


      // frmData.append("user", JSON.stringify(this.loginUser))
      // frmData.append("category", JSON.stringify(this.categoryList))

      //new files
      for (var i = 0; i < this.myFiles.length; i++) {
        frmData.append("fileUpload", this.myFiles[i]);
      }


      this.blog_service.update_blog(frmData, this.blog_id).subscribe(
        (response: any) => {
          this.blog_id = response.blog_id;
          this.show_spinner = false;
          this.notificationService.openSnackBar('게시글이 수정되었습니다.');

          this.router.navigateByUrl('blog/' + this.blog_id);

        },
        error => {
          console.error('[BlogService.update_blog]', error)
          this.notificationService.openSnackBar(error.error);
        }
      );
    }
  }

  setCategoryList(event) {
    console.log('event',event)
    this.categoryList = event;
  }

  /**
 * on file drop handler
 */
  onFileDropped($event) {
    console.log('onFileDropped', $event)
    this.prepareFilesList($event);
  }
  /**
  * handle file from browsing
  */
  fileBrowseHandler(files) {

    console.log('fileBrowseHandler', files)
    this.prepareFilesList(files);

  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this
        .myFiles
        .push(item);
    }
    console.log('this.myFiles', this.myFiles)
    this.fileDropEl.nativeElement.value = "";
  }

  remove_file_all(): void {
    
    this.prevFiles.forEach(element => {
      this.removedPrevFileIdList.push(element.id)
    });
    this.myFiles = [];
    this.prevFiles = [];
  
  }

  remove_file(file): void {
    this.myFiles.splice(this.myFiles.indexOf(file), 1);
  }
  remove_file_prev(file): void {
    console.log(file)
    this.removedPrevFileIdList.push(file.id)
    this.prevFiles.splice(this.prevFiles.indexOf(file), 1);
  }

}


