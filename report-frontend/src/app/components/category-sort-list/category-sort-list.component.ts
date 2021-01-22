import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubscriptionBaseComponent } from 'src/app/common/common';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';

@Component({
  selector: 'app-category-sort-list',
  templateUrl: './category-sort-list.component.html',
  styleUrls: ['./category-sort-list.component.css']
})
export class CategorySortListComponent extends SubscriptionBaseComponent implements OnInit {
  private currentPage: number = 1;
  categoryName: string;
  categroySortList;
  private searchedFiles: Array<File> = [];
  totalLength = 0;
  tableSize = 1; //row 
  tableSizes = [10, 15, 20];
  page: number;
  sortBy: number;
  row: number;
  i:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlogService
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryName = params['cn'];
      this.page = params['page'] ? params['page'] : 1;
      console.log('this.page', this.page);
      this.sortBy = params['sortBy'] ? params['sortBy'] : 1;

      this.row = params['row'] ? params['row'] : 1;
      this.i = params['i'] ? params['i']: '';
      this.tableSize = this.row;
    });

    console.log('this.currentPage', this.currentPage)

    this.subscription = this.service.category_search(this.categoryName, this.currentPage, this.sortBy, this.row).subscribe(
      (response) => {
        console.log(response);
        this.categroySortList = response['categroySortList'];
        this.searchedFiles = response['searchFiles'];
        console.log('searchedFiles', this.searchedFiles)
      }
    );
  }

  pageChange(newPage: number) {
    console.log('currentPage', this.currentPage)//1
    console.log(newPage, 'pageChange');//2
    this.currentPage = newPage;
    this.router.navigate(["/category-list"], { queryParams: { cn: this.categoryName, page: newPage, sortBy: this.sortBy, row: this.row, i:'all' } }).then(() => {
      this.loadData();
    });

  }
  onTableSizeChange(event): void {
    console.log(event)
    this.tableSize = event.target.value;
    this.currentPage = 1;

    this.router.navigate(["/category-list"], { queryParams: { cn: this.categoryName, page: this.currentPage, sortBy: this.sortBy, row: this.tableSize, i:'all' } }).then(() => {
      this.loadData();
    });
  }


  searchEvent(event) {
    //search 
    this.router.navigate(['/search-list'], { queryParams: { kw: event.search_, page: 1, sortBy :1, row:10, i: event.i_ } });


  }


}
