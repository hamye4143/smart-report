import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Blog } from '../../models/Blog';
import { BlogService } from '../../services/api-calls/blog.service';
export interface DialogData {
  animal: string;
  name: string;
  date1: Date,
  date2: Date
}
@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.css']
})
export class TableDialogComponent implements OnInit {
  displayedColumns: string[] = ['select','no', 'title', 'content', 'created_at', 'user', 'details'];
  check_row2 = [];
  isopen = true;
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel(true, []);
  private title:string;
  private blogs: Array<Blog> = [];
  group_id:number = 1;
  value

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private blog_service: BlogService, public dialogRef: MatDialogRef<TableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { 
      this.data = this.check_row2
    }

  ngOnInit() {
    this.load_all_blogs();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
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

  custom_toggle(row){
  
    // if (this.check_row2.length > 4){
    //   console.log(this.check_row2.length);
    //   alert('5개 이하만 가능합니다.');
    //   return false;
    // }

    let chk=0;
    let index_=0;
    for (let index = 0; index < this.check_row2.length; index++) {
      const element = this.check_row2[index];
      if(element == row){
        chk=1;
        index_ = index
        break;
      }
    }
  
    chk == 1 ? this.check_row2.splice(index_,1): this.check_row2.push(row);
  

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
