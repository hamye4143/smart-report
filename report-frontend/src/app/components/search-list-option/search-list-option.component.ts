import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Options } from 'ng5-slider';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';


@Component({
  selector: 'app-search-list-option',
  providers: [DatePipe],
  templateUrl: './search-list-option.component.html',
  styleUrls: ['./search-list-option.component.css']
})
export class SearchListOptionComponent implements OnInit {

  @Input() keyword: string;
  @Input() page: number;
  @Input() sortBy: number;
  @Input() row: number;
  @Input() i: string;
  @Output() result = new EventEmitter;
  private date: string = '';
  private op_starValue: number;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  value: number = -1; //이거 양방향으로 만들기

  counterValue = 0;
  testValue = {
    value: -1,
    value3: -1,
    value4: -1,
    value5: -1
  };

  @Output() counterChange2 = new EventEmitter();
  @Input()
  get test() {
    console.log('get-counter', this.testValue) //여기 컴포넌트에서 변경되면 계속 감지 
    return this.testValue;
  }

  set test(val) {

    console.log('val', val);
    this.testValue = val;

    this.value = this.testValue.value;
    this.value3 = this.testValue.value3;
    this.value4 = this.testValue.value4;
    this.value5 = this.testValue.value5;
    console.log('set-counter', this.testValue);
    this.counterChange2.emit(this.testValue);
  }

  // @Output() counterChange = new EventEmitter();
  // @Input()
  // get counter() {
  //   //console.log('get-counter') //여기 컴포넌트에서 변경되면 계속 감지 
  //   //return this.value;
  //   return this.counterValue; 
  // }

  // set counter(val) {
  //   this.value = val; // 부모 컴포넌트에서 가져온 값 세팅  (부모에서 변경됐으면 계속 감지)
  //   this.counterValue = val;
  //   //console.log('set-counter',this.counterValue)
  //   this.counterChange.emit(this.counterValue);
  // }

  // valueChange(value: number,type:string ): void {
  //   //this.counter= value; // ng5-slider의 값을 counter 함수에 넣기    
  //   //console.log('this.counter',this.counter)
  //   //this.counter = value;
  //   // this.test['value'] = value;
  // }

  valueChange(value: number, type: string): void {
    console.log('valueChange', value);
    console.log('type,', type);
    this.test[type] = value;
  }

  options: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: 2, legend: '2개↑' },
      { value: 3, legend: '3개↑' },
      { value: 4, legend: '4개↑' },
      { value: 5, legend: '5개↑' },
      { value: -1, legend: '전체' },
    ]
  };
  value2: number = -1;
  options2: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: '1개↑' },
      { value: 5, legend: '5개↑' },
      { value: 10, legend: '10개↑' },
      { value: 20, legend: '20개↑' },
      { value: -1, legend: '전체' },
    ]
  };
  value3: number = -1;
  options3: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: '1개↑' },
      { value: 10, legend: '10개↑' },
      { value: 20, legend: '20개↑' },
      { value: 30, legend: '30개↑' },
      { value: -1, legend: '전체' },
    ]
  };
  value4: number = -1;
  options4: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: '1개↑' },
      { value: 10, legend: '10개↑' },
      { value: 20, legend: '20개↑' },
      { value: 30, legend: '30개↑' },
      { value: -1, legend: '전체' },
    ]
  };
  value5: number = -1;
  options5: Options = {
    animate:false,
    draggableRange: true,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: '1개↑' },
      { value: 2, legend: '2개↑' },
      { value: 5, legend: '5개↑' },
      { value: 10, legend: '10개↑' },
      { value: -1, legend: '전체' },
    ]
  };
  constructor(
    private blogService: BlogService,
    public datepipe: DatePipe,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  addEvent(filterValue: string, event) {
    console.log('addEvent')
    if (event.value != undefined) {
      filterValue = this.datepipe.transform(filterValue, 'yyyy-M-dd');
      console.log(filterValue)
      this.date = filterValue
    }
    console.log('filterValue', filterValue);

  }
  dateCheck() {
    //날짜값이 둘 다 null이면 날짜 검색을 안하고 싶은것이므로 ok 
    if (this.range.value.start == null && this.range.value.end == null) {
      return true;
    } else if (this.range.value.start != null && this.range.value.end != null) {
      return true;
    } else {
      this.notificationService.openSnackBar('날짜가 빈값이 있습니다.');
      return false;
    }
  }

  apply() {
    if (this.dateCheck()) {
      console.log('op_starValue', this.value)
      const date = JSON.stringify(this.range.value);

      // const options = {
      //   value: this.value, 
      //   value2: this.value2,
      //   value3: this.value3,
      //   value4: this.value4,
      //   value5: this.value5,
      //   date: date
      // }

      const options = {
        value: this.testValue.value, 
        value2: this.value2,
        value3: this.testValue.value3,
        value4: this.testValue.value4,
        value5: this.testValue.value5,
        date: date
      }

      console.log('options', options);
      this.blogService.search_files_options(this.keyword, this.page, this.sortBy, this.row, this.i, options).subscribe(
        (response: any) => {
          console.log('response', response);
          this.result.emit(response)

          //다시 로딩
        }
      );
    }
  }

  test_() {
    alert('test!');
  }
}
