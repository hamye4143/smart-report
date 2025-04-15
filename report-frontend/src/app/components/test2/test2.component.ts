import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
export interface TreeType {
  Id: number,
  Name: string,
  Description: string
  isUse: boolean,
}
@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})

export class Test2Component {
  counterValue;
  form: FormGroup;


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      surgeries: this.fb.array([])
    });
  }

  @Output() counterChange = new EventEmitter();

  @Input()
  get counter() {
    // this.counterValue.children[0]= 'this.form.value';
    // console.log('this.counterValue',this.counterValue);

    // this.counterValue =this.form.value;

    return this.counterValue;
  }

  set counter(val) {
    this.form.reset();

    this.counterValue = val;
    this.counterChange.emit(this.counterValue);
  }

  onAddSurgeries() {
    const control = new FormGroup({
      'Name': new FormControl(null),
      'Description': new FormControl(null),
      'isUse': new FormControl(null)

    });
    (<FormArray>this.form.get('surgeries')).push(control);

  }

  onItemChange(event) {
  }



}

