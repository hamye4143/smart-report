import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TreeData } from 'src/app/shared/models/Category';

@Component({
  selector: 'app-delete-node',
  templateUrl: './delete-node.component.html',
  styleUrls: ['../node-dialog/node-dialog.css']
})
export class DeleteNodeComponent {
  @Output() deletedNode = new EventEmitter;
  @Input() currentNode: TreeData;

  deleteNode() {
    this.deletedNode.emit(this.currentNode);
  }

}
