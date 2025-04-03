import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from 'src/app/shared/models/Blog';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { AuthGuardService } from 'src/app/shared/services/guards/auth-guard.service';
import { AuthService } from 'src/app/shared/services/guards/auth.service';
import { MyinfoService } from 'src/app/shared/services/myinfo/myinfo.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-test3',
  templateUrl: './test3.component.html',
  styleUrls: ['./test3.component.css'],
  providers: [DatePipe]
})
export class Test3Component implements OnInit {



  //mainList = [];
  title: string = '제목';
  description: string = '설명';
  private blogs: Array<Blog> = [];
  deleted_blog_id: string;
  show_spinner: boolean = false;
  private returnUrl: string;
  private search: string;
  displayedColumns: string[] = ['select', 'no', 'title', 'user', 'created_at', 'viewCount'];
  dataSource = new MatTableDataSource([]);
  events: string[] = [];
  selection = new SelectionModel(true, []);
  rowClickList = {}; // {'리스트0':{}, '리스트1':{}, '리스트2':{}}
  clickListId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataImsi: object[] = [];
  totalData: {};
  myModel = true;
  checkedList: any[];
  aa: any[];


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
    this.load_all_blogs();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


  }
  mainListFunc(event) {
    this.selection.clear();
    console.log('eve', event)
    this.aa = event //aa는 모든 카테고리 정보 다 담고있음 

    console.log('aa', this.aa)
  }

  saveAll() {

    //모두 저장 
    console.log('saveAll',this.aa);
  }

  custom_click2(row) {
    // this.selection.clear();
    const idx = this.aa[this.clickListId-1].blogs.findIndex(
      (item) => {
        return item.id === row.id
      }
    )

    if (idx > -1) {
      this.aa[this.clickListId-1].blogs.splice(idx, 1)
    }else{
          
      const data = { //클릭한 row의 블로그 내용만 첨가
        title: row.title,
        content: row.content,
        id: row.id
      }

      this.aa[this.clickListId - 1].blogs.push(data);
    }


    /*
    console.log('row',row)
    
    let n = false;

    for (let index = 0; index < this.aa[this.clickListId-1].blogs.length; index++) {
      const element = this.aa[this.clickListId-1].blogs[index];
      if(element['id'] == row.id){
        n = true;
        break;
      }else{
        continue;
      }
      
    }

    

    if(!n){
      const data = { //클릭한 row의 블로그 내용만 첨가
        title:row.title,
        id:row.id
      }
      this.aa[this.clickListId-1].blogs.push(data);
  
    }else{// 없애기 (이미 있다면 )
      // this.aa[this.clickListId-1].blogs.splice();
    }
    */

  }



  load_all_blogs() {
    this.blog_service.get_all_blogs().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.all_blogs);
        // this.dataSource.filterPredicate = (data, filter: string) => !filter || data.created_at.includes(filter);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        //console.log('this.dataSource.data ,', this.dataSource.data)

        this.blogs = response.all_blogs;
      },
      error => {
        console.error('[BlogService.get_all_blogs]', error)
      }
    );
  }


  addEvent(filterValue: string, event) {
    if (event.value != undefined) {
      filterValue = this.datepipe.transform(filterValue, 'M/d/yyyy');
    }

    this.dataSource.filter = filterValue.trim();

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


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle($event) {
    console.log('masterToggle', $event)
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  custom_toggle(row) {
    console.log('custom_toggle', row)

    //this.dataImsi.push(row) 


    //console.log('dataImsi',this.dataImsi)

    // this.rowClickList.push(this.dataImsi);


    this.rowClickList['리스트' + this.clickListId] = this.dataImsi;

    console.log('clickList', this.rowClickList)
  }

  clickListIdFunc(event) {
    console.log('event', event);
    this.dataImsi = [];
    this.selection.clear();

    this.clickListId = event.index;
    console.log('event', this.clickListId); //clickList아이디  //clickListId에만 선택한 row들이 들어가야함 ['리스트1':{},]
    //체크된것들 보여줘야함 ..
    this.checkedList = event.checkedList;
    //원래 체크된 것들 dataImsi 리스트에 넣기 

    event.row.blogs.forEach(element => {
      console.log('row.element', element)
      this.dataImsi.push(element);

    });

  }

  isChecked(row) {
    const rowId = row.id
    const n = this.checkedList.includes(rowId)// true or false 

    return n;

  }



}

