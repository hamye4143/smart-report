import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';


import { TableDialogComponent } from '../../components/table-dialog/table-dialog.component';

@Injectable()
export class DialogService {
  // animal: string;
  // name: string;
  // date1: any;
  // date2: any
  check_row2=[];
  constructor(public dialog: MatDialog) { }
  openDialog(): Observable<any> {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      width: '50rem',
      data: {check_row2:this.check_row2}
    });

    return dialogRef.afterClosed();
  }
}