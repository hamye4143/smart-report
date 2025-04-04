import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ITreeOptions, TreeNode } from 'angular-tree-component';
import * as _ from 'lodash';
import { TreeDataService } from 'src/app/shared/services/tree/tree-data.service';
export interface TreeType {
  id: number,
  Name: string,
  Description: string,
  isUse: boolean,
}
@Component({
  selector: 'app-basictree',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @ViewChild('tree') tree;

  constructor(
    private dataService: TreeDataService,
    private router: Router,
  ) {

    this.dataService.getAllSorts().subscribe((response: any) => {
      const o = this.object(response.serialized_data);
      const finalData = o[0].Children;
      this.nodes = finalData;
      if (this.nodes) {
        this.maxId = this.findNodeMaxId(this.nodes);
      }
    });
  }

  ngOnInit() {
    //this.tree.treeModel.expandAll();
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    }, 0)

  }
  ngAfterViewInit() {
    //this.tree.treeModel.expandAll();
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    }, 1)

  }

  parentNode: any;
  totalLength: number;
  songData: []; // 백앤드로 넘겨줄 데이터
  private maxId: number;
  // private tree: TreeComponent;
  private sendData: any;
  clickedPid: number;
  childrendAddData: any;
  nodeBaguni: any;

  options: ITreeOptions = {
    idField: 'Id',
    displayField: 'Name',
    childrenField: 'Children',
    allowDrag: true
  };
  nodes = [];

  // nodes = [
  //   {
  //     pid: 0,
  //     Name: '전체1',
  //     Description: '전체카테고리입니다.',
  //     isUse: true,
  //     Children: [
  //       {
  //         pid: 1,
  //         Name: 'root1',
  //         Description: 'root1입니다.',
  //         isUse: true,
  //         Children: [
  //           { pid: 2, Name: 'child1', Description: 'root1입니다.', isUse: true },
  //           { pid: 3, Name: 'child2', Description: 'root1입니다.', isUse: true }
  //         ]
  //       },
  //       {
  //         pid: 4,
  //         Name: 'root2',
  //         Description: 'root2입니다',
  //         isUse: true,
  //         Children: [
  //           { pid: 5, Name: 'child2.1', Description: 'root1입니다.', isUse: true, Children: [] },
  //           {
  //             pid: 6, Name: 'child2.2', Description: 'root1입니다.', isUse: true, Children: [
  //               { pid: 7, Name: 'grandchild2.2.1', Description: 'root1입니다.', isUse: true, Children: [] }
  //             ]
  //           }
  //         ]
  //       },
  //       { pid: 8, Name: 'root3', Description: 'root2입니다', isUse: true, Children: [] },
  //       { pid: 9, Name: 'root4', Description: 'root2입니다', isUse: true, Children: [] },
  //       { pid: 10, Name: 'root5', Description: 'root2입니다', isUse: true, Children: [] }
  //     ]

  //   }
  // ];


  clickNode(event) {
    this.nodeBaguni = event['node']['data']
    this.clickedPid = event['node']['data']['Id'];
    const sendData = event['node']['data'];
    console.log(sendData)
    this.parentNode = event['node']['data'];

    this.sendData = sendData;
    //자식 컴포넌트에 sendData를 보내고, 수정 한 것을 부모와 양방향 통신 


  }
  /*
    forLoop(eventPid, nodes) {
      for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        let result = this.searchTree(element, eventPid);
        console.log('result를 봅ㅎ시다')
        if (result != null) {
          return result;
        } else {
          continue;
        }
  
      }
    }
    
    change(event) {
      if (event['childrendAddData'] != undefined) {
        this.childrendAddData = event['childrendAddData']
        console.log('childrendAddData', this.childrendAddData['surgeries'])
        const parentNode = this.forLoop(this.clickedPid, this.nodes)
        console.log('parentNode', parentNode)
  
        this.childrendAddData['surgeries'].forEach(element => {
          // console.log('el',parentNode)
          parentNode.Children.push(element)
  
        });
        console.log('heh', this.nodes)
        //this.addNode()
        // this.tree.treeModel.update();
        //tree.treeModel.update();
      }
  
      // const parentNode = this.forLoop(this.clickedPid,this.nodes)
      // console.log('parentNode',parentNode)
  
      // this.childrendAddData['surgeries'].forEach(element => {
      //   parentNode.children.push(element)
      // });
      // this.tree.treeModel.update();
  
  
      event = event['data']
      if (event != undefined) {
  
        const ab = this.forLoop(event.pid, this.nodes)
        if (ab != undefined) {
          ab['Name'] = event.Name;
          ab['Description'] = event.Description;
          ab['isUse'] = event.isUse;
        }
      }
  
    }
  */
  searchTree(element, matchingPid) {
    if (element.Id == matchingPid) {
      return element;
    } else if (element.Children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.Children.length; i++) {
        result = this.searchTree(element.Children[i], matchingPid);
      }
      return result;
    }
    return null;
  }

  // addNode() {

  //   this.nodes.push({ pid: 11, Name: '이름', Description: '설명충', isUse: true, Children: [] });
  //   // this.tree.treeModel.update();
  // }

  // addNode2(parent:TreeNode){
  //   parent.treeModel.setFocus(true);
  //   const value = { pid: 11, Name: '이름', Description: '설명충', isUse: true, Children: [] };
  //   if(parent){
  //     parent.data.Children.push(value);
  //   }
  //   parent.treeModel.update();
  // }

  addNode2(node, tree) {
    tree.treeModel.setFocus(true);
    if (node.data.Children === undefined) {
      node.data.Children = new Array();
    }
    this.maxId = this.findNodeMaxId(this.nodes) + 1;
    alert(this.maxId)
    node.data.Children.push({
      Name: '새로운 카테고리',
      Description: '',
      isUse: true,
      Id: this.maxId,
      hasChildren: false
    });
    tree.treeModel.update();
    tree.treeModel.expandAll();
    // tree.treeModel.getFocusedNode().toggleExpanded()

    // tree.treeModel.focusDrillUp();
  }

  deleteNode(node, tree) {
    let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
    _.remove(parentNode.data.Children, function (child) {
      return child === node.data;
    });
    tree.treeModel.update();
    tree.treeModel.getFocusedNode().toggleExpanded()
    tree.treeModel.expandAll();

    // console.log('node.parent.data.Children',node.parent)
    // if (node.parent.data.Children.length === 0) {
    //     node.parent.data.hasChildren = false;
    // }
  }
  removeNode(node: TreeNode) {
    let parentNode = node.realParent
      ? node.realParent
      : node.treeModel.virtualRoot;

    _.remove(parentNode.data.Children, function (child) {
      return child === node.data;
    });
  }
  deleteNode2() {
    const nodeToDelete = this.tree.treeModel.getNodeById(this.nodeBaguni.Id); //삭제할 노드 선택
    
    if(nodeToDelete.id == 1) {
      alert('전체 카테고리는 삭제 불가');
    }else{
      this.removeNode(nodeToDelete);
      this.tree.treeModel.update();
      nodeToDelete.expand();
    }

  }

  childrenCount(node: TreeNode) {
    const result = node.data.Children == undefined ? 0 : node.data.Children.length
    return result
  }

  childrenCount2(node: TreeNode) {
    const result = node.data.Children == undefined ? 0 : node.data.Children.length
    return result
  }
  // totalLength(node: TreeNode) {
  //   console.log('node',node)
  //   return node.data.length
  // }

  /*
  addChildrenNode() {
    //부모 qid의 노드 찾기 부모.children = [] 가져온 데이터 
    //nodes에서 qid 

    const parentNode = this.forLoop(this.clickedPid, this.nodes)
    console.log('parentNode', parentNode)

  }

  clickAddomde() {
    this.nodes.push({ pid: 11, Name: '이름', Description: '설명충', isUse: true, Children: [] });
    console.log('this.nodes', this.nodes)
  }
*/
  addNode4() {
    this.maxId += 1;
    this.tree.treeModel.setFocus(true);
    const node = this.nodeBaguni
    if (node.Children === undefined) {
      node.Children = new Array();
    }
    // node.Children.push({
    //   Name: '새로운 카테고리',
    //   Description: '',
    //   isUse: true,
    //   Id: this.maxId,
    //   hasChildren: false
    // });

    node.Children.push({
      Description: '',
      Id: this.maxId,
      Name: '',
      code: 'new',
      is_use: 'Y',
      group_code_id: this.parentNode.group_code_id + 1, //this.parentNode.parent_group_code_id + 1
      order: 1,//아무거나 
      parent_group_code_id: this.parentNode.parent_group_code_id + 1,
      parent_id: this.parentNode.Id//부모 아이디  parentNode
    });

    this.tree.treeModel.update();
    console.log('this.nodeBaguni', this.nodeBaguni)
    const someNode = this.tree.treeModel.getNodeById(this.nodeBaguni.Id);
    someNode.expand();
    // const firstRoot = this.tree.treeModel.roots[0];
    // firstRoot.setActiveAndVisible(); 
    const thisNode = this.tree.treeModel.getNodeById(this.maxId);
    thisNode.setActiveAndVisible();

  }

  onTreeLoad(tree) {
    console.log('onTreeLoad', tree)
    tree.treeModel.expandAll();
  }
  addMainNode() {
    //옆에 새로운 화면 
  }

  findNodeMaxId(node) {

    if (node[0]) {
      const flatArray = this.flatJsonArray([], node);
      console.log('비지않음', flatArray)
      const flatArrayWithoutChildren = [];
      flatArray.forEach(element => {
        flatArrayWithoutChildren.push(element.Id);
      });
      return Math.max(...flatArrayWithoutChildren);

    } else {
      console.log('빔')
      return 0;
    }
  }

  flatJsonArray(flattenedAray, node) {
    const array = flattenedAray;
    node.forEach(element => {
      if (element.Children) {
        array.push(element);
        this.flatJsonArray(array, element.Children);
      }
    });
    return array;
  }

  saveCategory() {
    console.log('saveCategory', this.nodes)

    //child 없애고 한개한개 넣어줘야함 
    const real_data = []
    // const sendData = this.nodes[0].Children
    // console.log('sendData', sendData)

    this.result = [];
    if (this.nodes[0]) {
      this.convertTreeToList(this.nodes[0]); //전체 카테고리 있을 시 
      //this.convertTreeToList(this.nodes);
    }


    console.log(this.result)
    this.result.forEach(element => { //this.sendData

      const data = {
        Description: element.Description,
        Id: element.Id,
        Name: element.Name,
        code: element.Name,
        group_code_id: element.group_code_id,
        order: element.order,
        parent_group_code_id: element.parent_group_code_id,
        parent_id: element.parent_id,
        is_use: element.is_use

      }
      real_data.push(data);
    });
    console.log('real_data', real_data)

    this.dataService.submit(real_data).subscribe((response: any) => {
      // this.ngOnInit();
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/sort']);
      });

    });


  }
  object(data) {
    const map = {};
    data.forEach(item => {
      item.Children = map[item.Id]?.Children || [];
      map[item.Id] = item;
      map[item.parent_id] = map[item.parent_id] || { Children: [] };
      map[item.parent_id].Children.push(item);
    });
    return map;
  }

  result = [];
  makeBackendData(sendData) {   //tree_to_list
    //보낼데이터를 하나하나 풀어주는 함수 (object 반대 함수) 
    console.log('makeBackendData', sendData)
    for (let index = 0; index < sendData.length; index++) {
      const element = sendData[index]; //{전체 :, children~~ }
      this.visitNode2(element);
      // if (result != null) {
      //   return result;
      // } else {
      //   continue;
      // }
    }
    return this.result;
  }

  visitNode2(element) {//{전체 :, children~~ }

    if (element.Children != null) {
      for (let i = 0; i < element.Children.length; i++) {
        this.visitNode2(element.Children[i]);
      }
    } else {
      this.result.push(element);
    }

    // if (element.pid == matchingPid) {
    //   return element;
    // } else if (element.children != null) {
    //   var i;
    //   var result = null;
    //   for (i = 0; result == null && i < element.children.length; i++) {
    //     result = this.searchTree(element.children[i], matchingPid);
    //   }
    //   return result;
    // }
    // return null;


  }

  convertTreeToList(root) {
    const stack = [root];
    this.result = [];
  
    while (stack.length !== 0) {
      const node = stack.pop();
      this.result.push(node);
  
      if (node.Children) {
        for (let i = node.Children.length - 1; i >= 0; i--) {
          stack.push(node.Children[i]);
        }
      }
    }
  }


  isExpanded = true;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.tree.treeModel.expandAll();
    } else {
      this.tree.treeModel.collapseAll();
    }
  }
  
  /*
  visitNode(node, hashMap, array) {
    if (!hashMap[node.data]) {
      hashMap[node.data] = true;
      // console.log('node', node)
      array.push(node);
    }
  }
*/
}
