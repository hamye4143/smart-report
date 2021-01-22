import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AlertDialogBodyComponent} from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import {DialogBodyComponent} from 'src/app/shared/components/dialog-body/dialog-body.component';
import {User} from 'src/app/shared/models/User';
import {BlogService} from 'src/app/shared/services/api-calls/blog.service';
import {FeatureImageService} from 'src/app/shared/services/api-calls/feature-image.service';
import {FileUploadService} from 'src/app/shared/services/api-calls/file-upload.service';
import {AuthService} from 'src/app/shared/services/guards/auth.service';
import {MyinfoService} from 'src/app/shared/services/myinfo/myinfo.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import {FileComponent} from '../../file/file.component';
import {TagComponent} from '../../tag/tag.component';

@Component(
    {selector: 'app-add-blog', templateUrl: './add-blog.component.html', styleUrls: ['./add-blog.component.css']}
)

export class AddBlogComponent implements OnInit {
    myFiles: string[] = [];
    sMsg: string = '';
    // files: any[] = [];
    private selectedFile: File;
    private preview_image: any;
    removable = true;
    private tags: [];
    private title: string;
    private content: string;
    private blog_id: string;
    private show_spinner: boolean = false;
    private returnUrl: string;
    visible1 = false;

    private items = [
        "대분류1",
        "대분류2",
        "대분류3",
        "대분류4",
        "대분류5",
        "대분류6"
    ];
    change = "";
    private items2 = [
        "중분류1",
        "중분류2",
        "중분류3",
        "중분류4",
        "중분류5",
        "중분류6"
    ];
    private items3 = [
        "소분류1",
        "소분류2",
        "소분류3",
        "소분류4",
        "소분류5",
        "소분류6"
    ];
    private items4 = [
        "세분류1",
        "세분류2",
        "세분류3",
        "세분류4",
        "세분류5",
        "세분류6"
    ];

    selectedValue: string;
    show_list = [];
    private categoryList=[];

    foods = [
        {
            value: 'steak-0',
            viewValue: '카테고리1'
        }, {
            value: 'pizza-1',
            viewValue: '카테고리2'
        }, {
            value: 'tacos-2',
            viewValue: '카테고리3'
        }
    ];

    @ViewChild(TagComponent, {static: false})childReference: any;
    @ViewChild("fileDropRef", {static: false})fileDropEl: ElementRef;

    private loginUser: User;
    constructor(
        private image_service : FeatureImageService,
        private blog_service : BlogService,
        private dialog : MatDialog,
        private route : ActivatedRoute,
        private router : Router,
        private auth_service : AuthService,
        private myinfo_service : MyinfoService,
        private file_service : FileUploadService,
        private notificationService: NotificationService

    ) {}

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this
            .route
            .snapshot
            .queryParams['returnUrl'] || '/';

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

    ngAfterViewInit() { //HTML에 작성된 내용이 화면에 모두 출력되고나서 호출

        this.tags = this.childReference.tags;

    }

    processFile(imageInput : any) {
        this.selectedFile = imageInput.files[0];
        this.previewImageLoad();
    }

    previewImageLoad() {
        let reader = new FileReader();
        reader.onloadend = e => {
            this.preview_image = reader.result;
        }
        reader.readAsDataURL(this.selectedFile);
    }

    open_dialog(message : string) {
        const dialogRef = this
            .dialog
            .open(DialogBodyComponent, {
                // width: '550px',
                // height: '200px',
                data: {
                    message
                }

            });
        //알림창 닫으면
        dialogRef
            .afterClosed()
            .subscribe((confirm : boolean) => {
                if (confirm) {
                    this.submit_blog();
                }
            })

    }


    setCategoryList(event) {
      this.categoryList = event;
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
            //this.notificationService.showErrorToastr();
            return false;
        }


        return true;
    }

    async submit_blog() {
        
        if (this.submitCheck()) {

            const frmData = new FormData();

            this.show_spinner = true;
            let feature_image;
            if (!this.selectedFile) {
                feature_image = ""
            } else {
                const image_data = await this
                    .image_service
                    .upload_image(this.selectedFile)
                    .toPromise(); //HTTP 통신을 하는 비동기 처리 코드
                feature_image = image_data["data"].link
            }
            let blog = {
                title: this.title,
                content: this.content,
                feature_image: feature_image,
                tags: [],
                user: this.loginUser,
                files: this.myFiles
            }

            const frmTag = []
            this
                .tags
                .map((element) => {
                    blog
                        .tags
                        .push(element["name"])
                    frmTag.push(element["name"])
                });

            frmData.append("title", this.title)
            frmData.append("content", this.content)
            frmData.append("feature_image", feature_image)
            frmData.append("tags", JSON.stringify(frmTag))
            frmData.append("user", JSON.stringify(this.loginUser))
            frmData.append("category", JSON.stringify(this.categoryList))

            //files
            for (var i = 0; i < this.myFiles.length; i++) {
                frmData.append("fileUpload", this.myFiles[i]);
            }

            //옵저버는 옵저버블(데이터스트림)을 구독하고 옵저버블이 방출한 노티피케이션을 전파받아 사용
            this
                .blog_service
                .add_blog(frmData)
                .subscribe(
                    //next
                    (response : any) => { //콜백 의미
                        this.blog_id = response.id;
                        this.show_spinner = false; //로딩 바 없애기
                        this.title = "";
                        this.content = "";
                        this.preview_image = "";
                        this.tags = [];
                        this.loginUser = null;
                        this.myFiles = [];
                        
                        this.notificationService.openSnackBar('업로드 되었습니다.')
                        // login successful so redirect to return url
                        this.router.navigateByUrl('blog/' + this.blog_id);
                    },
                    //error
                    error => {
                        console.error('[BlogService.add_blog]', error)
                        this.show_spinner = false;
                        this.notificationService.openSnackBar(error.error)
                    },
                    //complete
                    () => {
                        console.log('Streaming finished');
                    }

                );
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

    uploadFiles() {
        const frmData = new FormData();

        for (var i = 0; i < this.myFiles.length; i++) {
            frmData.append("fileUpload", this.myFiles[i]);
        }

        //옵저버는 옵저버블(데이터스트림)을 구독하고 옵저버블이 방출한 노티피케이션을 전파받아 사용
        this
            .blog_service
            .upload_files(frmData)
            .subscribe(
                //next
                (response : any) => { //콜백 의미
                    console.log('response', response)

                    //this.router.navigateByUrl('blog/'+this.blog_id);
                },
                //error
                error => {
                    console.error('[FileService.upload_files]', error)
                    this.show_spinner = false;
                    this.notificationService.openSnackBar(error.error)
                },
                //complete
                () => {
                    console.log('Streaming finished');
                }

            );
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

        this.prepareFilesList(files);

    }

    prepareFilesList(files : Array<any>) {
        for (const item of files) {
            this
                .myFiles
                .push(item);
        }
        console.log(this.myFiles)
        this.fileDropEl.nativeElement.value = "";
    }



}
