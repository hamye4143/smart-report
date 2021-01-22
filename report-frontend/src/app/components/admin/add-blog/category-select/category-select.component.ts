import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeData } from 'src/app/shared/models/Category';
import { TreeDataService } from 'src/app/shared/services/tree/tree-data.service';
import {of as observableOf} from 'rxjs';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef} from '@angular/core'

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.css']
})
export class CategorySelectComponent implements OnInit,OnChanges {
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  finalData = [];
  private categories;
  typesOfBigCategory:any[]=[];
  private show_list:string[]=[];
  TotalCategory = [];
  private _getChildren = (node : TreeData) => observableOf(node.Children);
  @Output() category_list = new EventEmitter;
  @Input() updateCategory;
  chipsList=[];

  constructor(private dataService : TreeDataService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.setCategories();
  }
  
  ngOnChanges() {
    console.log('updateCategory',this.updateCategory)
    if(this.updateCategory[0]){
      this.updateCategory.forEach(element => {
        this.chipsList.push(element);
      });
    }
  }
  
  loadCategory(){
    this.chipsList.push(this.updateCategory);

  }

  setCategories() { 
    

    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    
    this.dataService.getAllSorts().subscribe((response : any) => {

      if(response.serialized_data[0]){
        this.categories = response.serialized_data
        console.log('this.categories',this.categories)
        const o = this.object(this.categories);

        this.finalData = o[0].Children;
        console.log('this.finalData',this.finalData)

        this.finalData.forEach(element => {
            this.typesOfBigCategory.push(element);
        });

        this.TotalCategory = [];
        this.TotalCategory.push(this.typesOfBigCategory)
        
    }
      
    });
    
  }

  onSelection(e,v){
    console.log('e',e)
    this.chipsList[e.option.value.group_code_id-1] = {'Id':e.option.value.Id ,'Name':e.option.value.Name};
    this.chipsList.splice(e.option.value.group_code_id); 
    console.log('this.chipsList',this.chipsList);
    this.category_list.emit(this.chipsList);
  

    console.log('this.chipsList',this.chipsList);
    //선택한 것의 바로 밑에 제외하고 다 지우기 

    const children = e.option.value.Children;
        //아래에 element 생성 


    console.log('e.option.value.group_code_id',e.option.value.group_code_id)
    console.log('children',children)
    //if(children[0]){
    this.TotalCategory[e.option.value.group_code_id] = children;
    //}
    console.log('TotalCategory',e.option.value.group_code_id+1)
    console.log('this',this.TotalCategory)
    this.TotalCategory.splice(e.option.value.group_code_id+1); //+1

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

}
