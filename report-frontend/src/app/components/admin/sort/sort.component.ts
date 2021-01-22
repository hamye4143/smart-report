import {Component, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, of as observableOf} from 'rxjs';
import {TreeData} from 'src/app/shared/models/Category';
import {TreeDataService} from 'src/app/shared/services/tree/tree-data.service';
import {TreeFunctionService} from 'src/app/shared/services/tree/tree-function.service';
import {SortService} from 'src/app/shared/services/sort/sort.service'
import { CountService } from '@syncfusion/ej2-angular-richtexteditor';
import { DialogBodyComponent } from 'src/app/shared/components/dialog-body/dialog-body.component';
import { AdminComponent } from '../admin.component';
import { MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';
@Component(
    {selector: 'app-sort', templateUrl: './sort.component.html', styleUrls: ['./sort.component.css']}
)
export class SortComponent implements OnInit {
    nestedTreeControl: NestedTreeControl<TreeData>;
    nestedDataSource: MatTreeNestedDataSource<TreeData>;
    finalData = [];
    data;
    sendData = [];
    rrData = [];
    root = null;
    private categoryValue:string;
    private categoryDescription:string;
    isExpandAll: boolean = true;

    constructor(
        private dataService : TreeDataService,
        private service : TreeFunctionService,
        private SortService : SortService,
        private dialog:MatDialog,
        private adminComponent:AdminComponent
    ) {}

    ngOnInit() {


        this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
        
        this.nestedDataSource = new MatTreeNestedDataSource();

        

        this.dataService.getAllSorts().subscribe((response : any) => {
                if(response.serialized_data[0]){

                    this.data = response.serialized_data;
                    this.sendData = response.serialized_data;

                    const o = this.object(this.data);
    
                    this.finalData = o[0].Children;
    
                    let results = []
                    results = this.findAllChildren(2, results, 0) //id 가 1 인 것들의 자식들 찾기
                    this.nestedDataSource.data = this.finalData;
                    this.nestedTreeControl.dataNodes = this.finalData;
                    this.nestedTreeControl.expandAll();
                    this.isExpandAll = true;
                    
                    // this.nestedDataSource.data = this.dataService._dataChange;
    
                }else{
                    // this.nestedDataSource.data = this.dataService._dataChange;

                }


            });

    }


    private _getChildren = (node : TreeData) => observableOf(node.Children);
    hasNestedChild = (_ : number, nodeData : TreeData) => nodeData.Children.length > 0;

    refreshTreeData() {
        const data = this.nestedDataSource.data;
        this.nestedDataSource.data = null;
        this.nestedDataSource.data = data;
    }

    addNode(node : TreeData) {
        console.log('addNode');
      
    //   this.sendData.push(node);  


        node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1; 
        console.log('node.ID', node.Id)
        // node.group_code_id= this.service.findGroupId(this.nestedDataSource.data); // 1(대분류), 2(중분류), 3(소분류)
        // node.parent_id = this.service.findParentId(this.nestedDataSource.data);

        this.nestedDataSource.data.push(node);
        this.refreshTreeData();

        // this.sendData = this.nestedDataSource.data;
        // console.log('addNode의 nestsed', this.nestedDataSource.data)
        this.sendData.push(node);
        console.log('addNOde',this.sendData);
    }

    addChildNode(childrenNodeData) {

      const parent_id = childrenNodeData.currentNode.Id;
      const group_code_id = childrenNodeData.currentNode.group_code_id +1;
      childrenNodeData.node.parent_id = parent_id
      childrenNodeData.node.group_code_id = group_code_id

      
      childrenNodeData.node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
      childrenNodeData.currentNode.Children.push(childrenNodeData.node);
      this.refreshTreeData();
      this.sendData.push(childrenNodeData.node);
      console.log('addChildNode',this.sendData)

    }

    editNode(nodeToBeEdited) {

            
        let index_;
        for (let index = 0; index < this.sendData.length; index++) {
          if(this.sendData[index].Id === nodeToBeEdited.currentNode.Id){
            index_ = index;
              break;
          }
        }
        
        this.sendData[index_] = nodeToBeEdited.node;


    
        const fatherElement: TreeData = this.service.findFatherNode(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);

        let elementPosition: number;
        //내가 바꿈  --> 원래의 아이디 
        nodeToBeEdited.node.Id = nodeToBeEdited.currentNode.Id;
        console.log(' nodeToBeEdited.node;', nodeToBeEdited.node);//변경된 데이터 

        // nodeToBeEdited.node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
        
        if (fatherElement[0]) { // 자식 노드라면 
            fatherElement[0].Children[fatherElement[1]] = nodeToBeEdited.node;
        } else {
            elementPosition = this.service.findPosition(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);
            this.nestedDataSource.data[elementPosition] = nodeToBeEdited.node;

            // this.sendData[elementPosition] = nodeToBeEdited.node;
        }

        // this.sendData[elementPosition] = nodeToBeEdited.node;
        this.refreshTreeData();
        //this.sendData에서 원래의 id row 지우고, push 하면 됨 
        // this.sendData.push(nodeToBeEdited.data)
        // this.sendData = this.nestedDataSource.data;
        this.nestedTreeControl.expandAll();
        this.isExpandAll = true;
        // this.sendData[?] = nodeToBeEdited.data
        //this.nestedDataSource.data 에서 변경된 
        //senddata에서 변경된 아이템들 삭제 후 붙이기


    }

    deleteNode(nodeToBeDeleted : TreeData) {
        const deletedElement: TreeData = this.service.findFatherNode(nodeToBeDeleted.Id, this.nestedDataSource.data);
        
        // this.sendData.

        let elementPosition: number;
        if (window.confirm(
            'Are you sure you want to delete ' + nodeToBeDeleted.Name + '?'
        )) {
            if (deletedElement[0]) {
                deletedElement[0]
                    .Children
                    .splice(deletedElement[1], 1);
            } else {
                elementPosition = this
                    .service
                    .findPosition(nodeToBeDeleted.Id, this.nestedDataSource.data);
                this
                    .nestedDataSource
                    .data
                    .splice(elementPosition, 1);
            }
            this.refreshTreeData();
        }
        console.log('deleteNode', this.nestedDataSource.data);
        // this.sendData = this.nestedDataSource.data;

    }

    findAllChildren(id, results, depth) {
        for (const d in this.data) {
            if (this.data[d].parent_id == id) {
                this.data[d].depth = depth
                results.push(this.data[d])
                this.findAllChildren(this.data[d].I, results, depth + 1)
            }
        }
        return results
    }

    object(data) {
        var o = {};
        data.forEach(element => {
            element.Children = (o[element.Id] && o[element.Id].Children) || [];
            o[element.Id] = element;
            o[element.parent_id] = o[element.parent_id] || {};
            o[element.parent_id].Children = o[element.parent_id].Children || [];
            o[element.parent_id]
                .Children
                .push(element);
        });

        return o;
    }

    open_dialog(message:string): void {
        let dialogRef = this.dialog.open(DialogBodyComponent,{
          data: {
            message
          }

        })
    
        dialogRef.afterClosed().subscribe((confirm:boolean)=>{
          if(confirm){
            this.submit();
          }
        });
      }
    
    recursive2(element) { // data 모조리 

      //전체 탐색 
      element.forEach(element => {

        
      });
      //if 문 여기다 
      // if(this.root === null ) return;
      // const unvisitiedQueue = this.root;

      // while(unvisitiedQueue.length !== 0 ) {

      // }

      
      // element.forEach(element => {
      

      // });
    
    }
    // recursive(element){ 
    //   console.log('children',element)
      

    //   if(Children[0]){
    //     Children.forEach(element => {
    //       this.rrData.push(element)
    //       if(element.Children[0]){
    //         this.recursive(element.Children)
    //       }
    //     });
    //   }
    // }
    submit(){



    
      const real_data = []
      //child 없애고 
      this.sendData.forEach(element => { //this.sendData
          const data = {
            Description: element.Description,
            Id: element.Id,
            Name: element.Name,
            code: element.code,
            group_code_id: element.group_code_id,
            order:element.order,
            parent_group_code_id: element.parent_group_code_id,
            parent_id: element.parent_id
          } 
          real_data.push(data);
      });
      console.log('sybmit',real_data)
      this.dataService.submit(real_data).subscribe((response : any) => {
        this.adminComponent.reload_all_blogs('sort');
            
      });
    }

    clickSpan(node){
        console.log('clickSpan()',node)
        this.categoryValue = node.Name;
        this.categoryDescription = node.Description;
        console.log('ths',this.categoryValue);

    }
    openDialog(){

        const node: TreeData = {
            Id: null,
            Name: 'result.nodeName',
            Description: 'result.nodeDescription',
            Children: [],
            code: 'result.nodeName',
            group_code_id:1,
            is_use: "Y",
            order: 1,
            parent_group_code_id: "1",
            parent_id: 1
          };


          this.editNode({currentNode: this.nestedDataSource.data, node: node})



    }

    toggle(){
        if(this.isExpandAll) {
            this.isExpandAll = false
            this.nestedTreeControl.collapseAll();

        }else { 
            this.isExpandAll = true
            this.nestedTreeControl.expandAll();

        }

    }


}
