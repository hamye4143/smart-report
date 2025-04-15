import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/shared/components/table-dialog/table-dialog.component';
import { TreeData } from 'src/app/shared/models/Category';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.css']
})
export class EditNodeComponent {

  @Input() isTop: boolean;
  @Input() currentNode: TreeData;
  @Output() edittedNode = new EventEmitter;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(EditNodeDialog, {
      width: '250px',
      data: {Name: this.currentNode.Name, Description: this.currentNode.Description, Component: '수정'}
    });
    //닫으면
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const node: TreeData = {
          Id: null,
          Name: result.nodeName,
          Description: result.nodeDescription,
          Children: this.currentNode.Children,
          code: result.nodeName,
          group_code_id: this.currentNode.group_code_id,
          is_use: "Y",
          order: 1,
          parent_group_code_id: "1",
          parent_id: this.currentNode.parent_id
        };
        this.edittedNode.emit({currentNode: this.currentNode, node: node});
      }
    });
  }
}



@Component({
  selector: 'app-edit-node-dialog',
  templateUrl: '../node-dialog/node-dialog.html',
  styleUrls: ['../node-dialog/node-dialog.css']

})

export class EditNodeDialog {
  constructor(
    public dialogRef: MatDialogRef<EditNodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
