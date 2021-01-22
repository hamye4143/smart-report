import { AfterViewChecked, Component, DoCheck, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Tag } from 'src/app/shared/models/Tag';
import { inputs } from '@syncfusion/ej2-angular-richtexteditor/src/rich-text-editor/richtexteditor.component';


@Component({
  selector: 'tag-component',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit,OnChanges {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];
  update_page = true;
  @Input() tags_data:any;
  @Input() test:string;
  constructor() { }

  //자식 컴포넌트에 입력 프로퍼티가 존재하기 때문에 실행
  //입력 프로퍼티가 변경될 때마다 실행
  ngOnChanges(changes: SimpleChanges) {
    console.log('[onChanges]',this.tags_data);
    console.log('[onChanges]',this.test);

    if(changes['tags_data']){
      console.log('changes감지',changes['tags_data'])
    }
    //length가 있을때까지
    if(this.tags_data.length){
      this.tags_data.forEach(element => {        
        this.tags.push({name:element.name});
      });
      }
  }


  ngOnInit() {
    // console.log('[ngOnInit]',this.tags_data)
    // console.log('[ngOnInit]',this.test)
    // if(this.tags_data.length){
    //   this.tags_data.forEach(element => {        
    //     this.tags.push({name:element.name});
    //   });
    //   }
    // this.tags.push({name:'name'}) 
  }



  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    //Reset the input value
    if (input) {
      input.value = '';
    }

    
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  update(event: MatChipInputEvent): void{


  }
  // //update--> setting : 원래 있던 tags 나열
  // //매개변수에 넣어
  // set(event: MatChipInputEvent){
  //   console.log(event)
  //   const value = event.value;
  //   console.log(value);
  //   this.tags.push({name: value.trim()});
  //   console.log(this.tags)

  //   //db에서 원래의 tags 가져와서 세팅 
    
    
  // }



}
