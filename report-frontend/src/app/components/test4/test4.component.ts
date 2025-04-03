import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-test4',
  templateUrl: './test4.component.html',
  styleUrls: ['./test4.component.css']
})
export class Test4Component implements OnInit {
  DATA = [{
    blogs:[{'id':1,'title':'blog1의 title'},{'id':2,'title':'blog2의 title'}], //이 안에 포함된 블로그 정보들 {},{}
    description: "카테고리 테스트 설명",  
    id: 1,//카테고리admin 순서
    title: "카테고리 테스트 타이틀"
  },{
    blogs:[{'id':1,'title':'blog1의 title'}], //이 안에 포함된 블로그 정보들 {},{}
    description: "카테고리 테스트 설명2",
    id: 2,//카테고리admin 순서 
    title: "카테고리 테스트 타이틀2"
  }]
  @Input() clickList: {};
  @Output() clickListId = new EventEmitter; //클릭한 리스트 몇번인지 '리스트 1'
  @Output() mainList = new EventEmitter;
  mainListData;
  allCategories: any = [];
  datas: any = [];
  maxPkId=1;
  checkedList= [];

  constructor(private router: Router, private category_service: CategoryService,) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnchanges', changes)
  }

  saveAll() { //모든 카테고리 저장 
    console.log('this.',this.mainListData)
    this.category_service.createMainCategory(this.mainListData).subscribe(
      (response)=>{
        console.log('allCategories', this.allCategories);
        this.loadData();
      }
    );
  }
  loadData() {
    //db에서 받아오는 작업 
    //this.mainListData = this.DATA
    this.category_service.loadAllMain().subscribe(
      (Response:any) => {
        this.mainListData = Response.all_categories;
      }
    )
  }

  clickTable(list,index) {
    this.checkedList = [];
    console.log('clickTable', index) //리스트 1

    console.log('clickTable-list', list) //리스트 1
    console.log('vlist.blogss',list.blogs)
    list.blogs.forEach(element => {
      this.checkedList.push(element.id)// 체크된 블로그들 아이디 집합
    });
    console.log('checkedList', this.checkedList) 

    //리스트 1에 대한 테이블 선택하도록 ..  
    //부모에 
    const data = {
      'index':index,
      'checkedList':this.checkedList, //[1,2]
      'row':list
    }
    console.log('data',data)
    this.clickListId.emit(data);
    this.mainList.emit(this.mainListData);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mainListData, event.previousIndex, event.currentIndex);
  }

  addCategory() {
    // const data = [{'title':'제목', 'description':'본문'}]
    const data = {
      blogs:[], //이 안에 포함된 블로그 정보들 {},{}
      description: "설명을 쓰세요.",
      id: null,//카테고리admin 순서 
      title: "제목을 쓰세요."
    }
    this.mainListData.push(data)
  }

  delete(data) {
    console.log('dataId',data)
    this.mainListData.splice(this.mainListData.indexOf(data), 1);
  }

  save(dataId) {
    console.log('save', dataId)
    const data = {
      
    }

  }

}
