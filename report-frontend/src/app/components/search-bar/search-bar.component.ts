import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import {File} from 'src/app/shared/models/File';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AutoCompleteService } from 'src/app/shared/services/autocomplete/auto-complete.service';
import {FormBuilder, FormGroup} from '@angular/forms';

interface Blog{
  title:string,
  feature_image:string,
  created_at:string,
  content:string
}
export class User {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {
  selectedOption: string;
  options = [
    { name: "모든", value: 'all' },
    { name: "제목", value: 'title' },
    { name: "본문", value: 'content' },
    { name: "글쓴이", value: 'writer' },
    { name: "파일이름", value: 'fileName' },
  ]

  selected = 'option1';
  selectedValue = this.options[0].value;

  value = '찾을 내용을 검색해주세요';
  private searchedFiles: Array<File> = [];
  private search_:string ="";
  show_spinner:boolean = false;
  @Output() searchEvent = new EventEmitter(); //child- > parent 
  @Input() keyword: string;
  @Input() i: string;


  keyword2 = 'name';
  states = [  //starts : fileName이 모든일때는 모든 것에서 , 제목일때는 제목ㄴ에서만, 글쓴이할때는 사람이미지, 파일이미지는 파일이미지  
    
    {
      name: 'Arkansas',
      population: '2.978M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
    
  ];

  /*예시2*/
  filteredUsers: User[] = [];
  usersForm: FormGroup;
  isLoading = false;
  
  constructor(
    private blog_service:BlogService,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder, private appService: AutoCompleteService
    ) { }

  ngOnInit() {

    /*추가*/
    /*
    this.usersForm = this.fb.group({
      userInput: null
    })

      this.usersForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300), //300이하 시간에 방출된 모든 값들을 버린다.
        tap(() => this.isLoading = true),
        switchMap(value => this.appService.search({name: value}, 1)
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => this.filteredUsers = users.results);

    */
    /*추가 끝 */


    this.search_ = this.keyword;
    this.selectedValue = this.i;
  }

  displayFn(user: User) {
    if (user) { return user.name; }
  }
  
  ChangingValue(event) {
    console.log(event)
  }
  searchFunc() {
    this.search_ =  this.search_ ? this.search_.trim() : ""
    const data = {
      search_ : this.search_,
      i_ : this.selectedValue
    }
    
    if (this.search_ != "") {
      this.searchEvent.emit(data);

    }else{
      this.notificationService.openSnackBar('검색 창이 빈 값 입니다.');
    }
  }

  search2() {
    
    console.log('this.search_',this.search_)
    if(this.search_ !=""){ 

        this.router.navigate(['/search-list/'+this.search_]);

        this.search_ = this.search_.trim();
  

        this.show_spinner = true;



    }
    
  }


}

