import { Component, EventEmitter, OnInit, Output, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { DialogData, TreeData } from 'src/app/shared/models/Category';


@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css']
})
export class AddNodeComponent {
  @Input() isTop: boolean;
  @Input() currentNode: TreeData;
  @Output() addedNode = new EventEmitter;
  name: string;
  description: string;
  group_code_id:number;
  parent_id: number;
  

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewNodeDialog, {
      width: '250px',
      data: {nodeName: this.name, nodeDescription: this.description, Component: '추가'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const node: TreeData = {
          Id: null,
          Name: result.nodeName,
          Description: result.nodeDescription,
          Children: [],
          code: result.nodeName,
          group_code_id: 1, 
          is_use: "Y",
          order: 1,
          parent_group_code_id: "1",
          parent_id: 0
        };
        if (this.isTop) { //메인 카테고리 추가 
          node.group_code_id = 1;
          node.parent_id = 0;
          this.addedNode.emit(node);
        } else {
          //상단의 아이디만 
          this.addedNode.emit({currentNode: this.currentNode, node: node});
        }
      }
    });
  }
}



@Component({
  selector: 'app-new-node',
  templateUrl: '../node-dialog/node-dialog.html',
  styleUrls: ['../node-dialog/node-dialog.css']

})
export class NewNodeDialog {

  constructor(
    public dialogRef: MatDialogRef<NewNodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}