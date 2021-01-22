import { Component, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { File } from 'src/app/shared/models/File';
import { DatePipe } from '@angular/common';
import { Options } from 'ng5-slider';
import { SearchListOptionComponent } from '../search-list-option/search-list-option.component';

@Component({
  selector: 'app-search-list',
  providers: [DatePipe],
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent {
  
  @ViewChildren(SearchListOptionComponent) childReference: any;

  private currentPage: number = 1;
  value: Date = new Date();
  counterValue = 3;
  testValue = { value: -1, value3: -1, value4: -1, value5: -1 };
  config: any;
  collection = [];
  sendData: any = 1;

  sortList = [
    { index: 1, value: '최신순' },
    { index: 2, value: '조회수' },
    { index: 3, value: '별점순' },
    { index: 4, value: '다운로드순' },
  ]



  private searchedFiles: Array<File> = [];
  private keyword: string;
  show_spinner: boolean = false;
  page: number;
  sortBy: number;
  row: number;
  i: string;
  nextUrl: string;
  prevUrl: string;
  totalPagesLength: number;
  totalpagesList: any;

  totalLength = 0;
  tableSize = 1; //row 
  tableSizes = [10, 15, 20];
  public isActive: boolean = true;
  noData = false;
  isSearchOption: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blog_service: BlogService,
    private router: Router,
    public datepipe: DatePipe
  ) {
    this.fetchSearches();
  }

  ngOnInit() {

  }


  options: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: '2', legend: '2개↑' },
      { value: '3', legend: '3개↑' },
      { value: '4', legend: '4개↑' },
      { value: '5', legend: '5개↑' },
      { value: '-1', legend: '전체' },
    ]
  };


  options2: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: '1', legend: '1개↑' },
      { value: '5', legend: '5개↑' },
      { value: '10', legend: '10개↑' },
      { value: '20', legend: '20개↑' },
      { value: '-1', legend: '전체' },
    ]
  };

  options3: Options = {
    animate:false,
    showTicksValues: true,
    stepsArray: [
      { value: '1',legend:'1개↑'  },
      { value: '10',legend:'10개↑'  },
      { value: '20',legend:'20개↑'  },
      { value: '30',legend:'30개↑'  },
      { value: '-1',legend:'전체' },
    ]
  };

  options4: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: '1',legend:'1개↑'  },
      { value: '10',legend:'10개↑'  },
      { value: '20',legend:'20개↑'  },
      { value: '30',legend:'30개↑'  },
      { value: '-1',legend:'전체' },
    ]
  };

  options5: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: '1',legend:'1개↑'  },
      { value: '2',legend:'2개↑'  },
      { value: '5',legend:'5개↑'  },
      { value: '10',legend:'10개↑'  },
      { value: '-1',legend:'전체' },
    ]
  };
  fetchSearches(): void {
    console.log('newPage', this.currentPage)
    console.log('tableSize', this.tableSize)

    //show_spinner

    this.route.queryParams.subscribe(params => {
      //다시 할당 
      this.keyword = params['kw'];

      this.page = params['page'] ? params['page'] : 1; //1 

      console.log('this.page', this.page); //x 

      // this.page = page;
      this.sortBy = params['sortBy'] ? params['sortBy'] : 1;

      this.row = params['row'] ? params['row'] : 1

      this.i = params['i'] ? params['i'] : ''


      this.tableSize = this.row;

      // this.page2 = params['page'] ? params['page'] : 1
      // this.page2 = this.page;
    });

    //keyword를 input value 값으로 설정


    this.blog_service.search_files(this.keyword, this.currentPage, this.sortBy, this.row, this.i).subscribe(
      (response: any) => {
        console.log(response)

        this.show_spinner = false;

        if (response.message) {
          this.totalLength = 0;
          this.noData = true;

        } else {
          this.noData = false;
          this.searchedFiles = response.searchFiles
          console.log('searchedFiles', this.searchedFiles)
          this.totalLength = response.count;
          this.nextUrl = response.next_url;
          this.prevUrl = response.prev_url;
          this.totalPagesLength = response.total_pages;
          this.totalpagesList = Array(this.totalPagesLength).fill(0).map((x, i) => i + 1);
          console.log(this.totalpagesList);
        }



      },
      error => {
        this.show_spinner = false;
        console.log(error);
      }
    );
  }


  searchEvent(event) {
    console.log('event', event)
    this.keyword = event.search_;
    this.i = event.i_;
    console.log('this.i', this.i)


    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search-list'], { queryParams: { kw: this.keyword, page: this.page, sortBy: this.sortBy, row: this.row, i: this.i } });
    });

  }


  pageChange(newPage: number) {
    console.log('currentPage', this.currentPage)//1
    console.log(newPage, 'pageChange');//2
    this.currentPage = newPage; //

    this.router.navigate(["/search-list"], { queryParams: { kw: this.keyword, page: newPage, sortBy: this.sortBy, row: this.row } }).then(() => {
      this.fetchSearches();
    });

  }

  // onTableDataChange(event){
  //   this.currentPage = event;
  //   this.fetchSearches();
  // }  

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.currentPage = 1;

    this.router.navigate(["/search-list"], { queryParams: { kw: this.keyword, page: this.currentPage, sortBy: this.sortBy, row: this.tableSize } }).then(() => {
      this.fetchSearches();
    });
  }

  sortByfunc(num): void {
    this.router.navigate(["/search-list"], { queryParams: { kw: this.keyword, page: this.currentPage, sortBy: num, row: this.tableSize, i: this.i } }).then(() => {
      this.fetchSearches();
    });
  }

  selectedDate(date) {
    // ngModel still returns the old value
    console.log("ngModel: " + this.value);

    // date passes the newly selected value  
    console.log("Selected Value: " + date);

  }

  addEvent(filterValue: string, event) {
    console.log('addEvent')
    if (event.value != undefined) {
      filterValue = this.datepipe.transform(filterValue, 'yyyy-M-dd');

      this.blog_service.searchFilesByDate(filterValue).subscribe(
        (response) => {
          console.log('response', response);

          this.show_spinner = false;
          if (response['message']) {
            this.searchedFiles = []
            this.noData = true;

          } else {
            this.noData = false;
            this.searchedFiles = response['searchFiles']
            console.log('searchedFiles', this.searchedFiles)
            this.totalLength = response['count'];
            this.nextUrl = response['next_url'];
            this.prevUrl = response['prev_url'];
            this.totalPagesLength = response['total_pages'];
            this.totalpagesList = Array(this.totalPagesLength).fill(0).map((x, i) => i + 1);
            console.log(this.totalpagesList);
          }



        }
      );
    }

    console.log('filterValue', filterValue);

  }

  searchListOption(response) {
    if (response.message) {
      this.totalLength = 0;
      this.noData = true;
      this.searchedFiles = [];

    } else {

      console.log('event', response)
      this.noData = false;
      this.searchedFiles = response.searchFiles
      console.log('searchedFiles', this.searchedFiles)
      this.totalLength = response.count;
      this.nextUrl = response.next_url;
      this.prevUrl = response.prev_url;
      this.totalPagesLength = response.total_pages;
      this.totalpagesList = Array(this.totalPagesLength).fill(0).map((x, i) => i + 1);
      console.log(this.totalpagesList);
    }
  }

  optionClick() {
    if (this.isSearchOption) {
      this.isSearchOption = false;
    } else {
      this.isSearchOption = true;
    }
  }

  test_() {
    console.log('childReference', this.childReference);
    this.childReference.apply();
  }
}
