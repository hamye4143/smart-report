
import { Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogBodyComponent } from 'src/app/shared/components/alert-dialog-body/alert-dialog-body.component';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { Blog } from 'src/app/shared/models/Blog';
import { User } from 'src/app/shared/models/User';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { AuthGuardService } from 'src/app/shared/services/guards/auth-guard.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { DatePipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.css'],
  providers: [DatePipe]
})

export class AllBlogsComponent implements OnInit {

  private blogs: Array<Blog> = [];
  deleted_blog_id: string;
  show_spinner: boolean = false;
  private returnUrl: string;
  private search: string;
  private loginUser: User;
  private dateValue: any;
  displayedColumns: string[] = ['no', 'title', 'user', 'created_at', 'viewCount'];
  dataSource;

  events: string[] = [];


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private blog_service: BlogService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService,
    private myinfo_service: MyinfoService,
    private auth_gaurd_service: AuthGuardService,
    public datepipe: DatePipe) {
  }

  ngOnInit() {
    console.log('ngOnInit')
    this.load_all_blogs();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


  }



  load_all_blogs() {
    this.blog_service.get_all_blogs().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.all_blogs);
        // this.dataSource.filterPredicate = (data, filter: string) => !filter || data.created_at.includes(filter);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        response.all_blogs.forEach((element: any) => {
          this.blogs.push(element);
        });
      },
      error => {
        console.error('[BlogService.get_all_blogs]', error)
      }
    );
  }

  dateApply() {
    if (this.dateValue != undefined) {
      this.dataSource.filter = this.dateValue.trim();
    }
  }
  addEvent(filterValue: string, event) {
    if (event.value != undefined) {
      console.log(event.value)
      filterValue = this.datepipe.transform(filterValue, 'M/d/yyyy');
      this.dateValue = filterValue;
    }

    //this.dataSource.filter = filterValue.trim();

  }

  public customSort = (event) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  search_blogs() {

    this.blogs = []
    let search_ = "";
    search_ = this.search.trim();


    if (!search_) {
      return false;
    }

    this.show_spinner = true;


    this.blog_service.search_blogs(search_).subscribe(
      (response: any) => {
        this.show_spinner = false;
        response.search_blogs.forEach((element: any) => {
          this.blogs.push(element);
        });
        this.router.navigate(['/admin/all-blogs']);
      },
      error => {
        this.show_spinner = false;
        console.log(error);
      }
    );
  }


}
