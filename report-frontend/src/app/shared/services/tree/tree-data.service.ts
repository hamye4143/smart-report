
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeData } from '../../models/Category';

@Injectable({
  providedIn: 'root'
})
export class TreeDataService {

  private getAllSortsUrl:string = 'http://localhost:5000/get_all_codes';
  private submitUrl:string = 'http://localhost:5000/insert_codes';
  private data;
  private root_data=[];
  
  private final_data=[];
  
  

  
  constructor(private http:HttpClient) { 
    // this.init()

    //순서정하기 

  }

  getAllSorts(){
    return this.http.get(this.getAllSortsUrl);
  }

  submit(data){
    return this.http.post(this.submitUrl,data);
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
  
  object(data){
    var o = {};
    console.log('data',data)
    data.forEach(element => {
      element.Children = o[element.Id] && o[element.Id].Children;
      o[element.Id] = element;
      o[element.parent_id] = o[element.parent_id] || {};
      o[element.parent_id].Children = o[element.parent_id].Children || [];
      o[element.parent_id].Children.push(element);
    });

    return o;
  }
  
  getDescendant(id) {
    // const o = this.object();
    //const o = this.object([{ id: 1, parent: 0, name: "Parent" }, { id: 2, parent: 1, name: "Child 1" }, { id: 3, parent: 2, name: "Grand Child 1" }, { id: 4, parent: 2, name: "Grand Child 2" }, { id: 5, parent: 1, name: "Child 2" }]);

    
    // var result = [];
    // Array.isArray(this.object[id].children) && this.object[id].children.forEach(function iter(a) {
    //     result.push({ id: a.id, parent: a.parent, name: a.name });
    //     Array.isArray(a.children) && a.children.forEach(iter);
    // });
    // return result;
}

  

  // getDescendant(id) {
  //     var result = [];
  //     var data = [{ id: 1, parent: 0, name: "Parent" }, { id: 2, parent: 1, name: "Child 1" }, { id: 3, parent: 2, name: "Grand Child 1" }, { id: 4, parent: 2, name: "Grand Child 2" }, { id: 5, parent: 1, name: "Child 2" }],
  //     object = function (data, root) {
  //         var o = {};
  //         data.forEach(function (a) {
  //             a.children = o[a.id] && o[a.id].children;
  //             o[a.id] = a;
  //             o[a.parent] = o[a.parent] || {};
  //             o[a.parent].children = o[a.parent].children || [];
  //             o[a.parent].children.push(a);
  //         });
  //         return o;
  //     }(data, 0);


  //     Array.isArray(object[id].children) && object[id].children.forEach(function iter(a) {
  //         result.push({ id: a.id, parent: a.parent, name: a.name });
  //         Array.isArray(a.children) && a.children.forEach(iter);
  //     });
  //     return result;
  // }
  //this.final_data 가 빈값이 아니여야지 옵저버블 생성 
  _dataChange2 = new BehaviorSubject(this.final_data);
  _dataChange = 
  // _dataChange = new BehaviorSubject(
     [
       {
        Description: "대분류인 국내도서",
        Id: 1,
        Name: "국내도서",
        code: "knds",
        group_code_id: 1,
        is_use: "Y",
        order: 1,
        parent_group_code_id: "0",
        parent_id: 0,
        Children:[{
          Description: "대분류인 국내도서",
          Id: 2,
          Name: "국내도서",
          code: "knds",
          group_code_id: 1,
          is_use: "Y",
          order: 1,
          parent_group_code_id: "0",
          parent_id: 0,
          Children:[]
        }]
       }
    // {
    //   Id: 1,
    //   Name: '대분류 1', // 국내도서
    //   Description: 'Father 1',
    //   Children: [
    //     {
    //       Id: 3,
    //       Name: '중분류 1', //
    //       Description: 'Children 1',
    //       Children: []
    //     },
    //     {
    //       Id: 4,
    //       Name: '중분류 2',
    //       Description: 'Children 2',
    //       Children: [
    //         {
    //           Id: 5,
    //           Name: '소분류 1',
    //           Description: 'GrandChildren 1',
    //           Children: []
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   Id: 2,
    //   Name: '대분류 2',
    //   Description: 'Father 2',
    //   Children: [
    //     {
    //       Id: 6,
    //       Name: '중분류 1',
    //       Description: 'Children 1',
    //       Children: []
    //     }
    //   ]
    // },
    // {
    //   Id: 11,
    //   Name: '대분류 3', //국내도서
    //   Description: 'Father 3',
    //   Children: [
    //     {
    //       Id: 7,
    //       Name: '중분류 1', //소설 
    //       Description: 'Children 1',
    //       Children: [
    //         {
    //           Id: 8,
    //           Name: '소분류 1', // 한국소설 
    //           Description: 'GrandChildren 1',
    //           Children: [
    //             // {
    //             //   Id: 9,
    //             //   Name: '세분류 1',
    //             //   Description: 'GrandGrandChildren 1',
    //             //   Children: []
    //             // }

    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }
    

 


    
  ]
  


}
