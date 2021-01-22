import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/api-calls/blog.service';
import { StatisticsService } from 'src/app/shared/services/api-calls/statistics.service';
import { CategoryService } from 'src/app/shared/services/category/category.service';

interface Blog{
  title:string,
  feature_image:string,
  created_at:string,
  content:string
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  private all_blogs: Blog[] = [];
  private all_categories = [];
  private blogs: Array<Blog> = [];
  private search_:string;
  item = 0;
  data = [];
  show_spinner:boolean = false;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  imageSources: (string)[] = [
    'https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg',
    'https://cdn.vox-cdn.com/uploads/chorus_asset/file/9278671/jbareham_170917_2000_0124.jpg' ,
    'https://cdn.vox-cdn.com/uploads/chorus_image/image/56789263/akrales_170919_1976_0104.0.jpg' ,
    'https://cdn.vox-cdn.com/uploads/chorus_image/image/56674755/mr_pb_is_the_best.0.jpg',
    'assets/kitties.jpg']
  
  constructor(private categoryService: CategoryService, private blog_service:BlogService, private router: Router,private service: StatisticsService) { }

  ngOnInit() {
    //this.load_all_blogs();
    this.loadAllMain();
  }


  search() {
    
    this.blogs = []
    let search_ = "";
    search_ = this.search_.trim();


    if(!search_){ 
      return false;
    }

    this.show_spinner = true;


    this.blog_service.search_blogs(search_).subscribe(
      (response: any) =>{
        this.show_spinner = false;
        response.search_blogs.forEach((element:any) => {
          this.blogs.push(element);
        });
        this.router.navigate(['/search-list']);
      },
      error =>{
        this.show_spinner = false;
        console.log(error);
      }
    );
    
  }

  loadAllMain() { 
    this.categoryService.loadAllMain().subscribe(
      (response:any)=>{
        console.log('response',response)
        this.all_categories = response.all_categories
  
      },
      error =>{
        console.error('[BlogService.get_all_blogs]',error)
      }
      )
  }

  load_all_blogs(){
    this.blog_service.get_all_categories().subscribe(
    (response:any)=>{
      console.log('response',response)
      this.all_categories = response.all_categories
    },
    error =>{
      console.error('[BlogService.get_all_blogs]',error)
    }
    )
  }

  searchEvent(event) { 
    console.log(event);
    const kw = event.search_;
    const i = event.i_; 
    //search 
    // this.router.navigate(['/search-list'+ +event]);
    this.router.navigate(['/search-list'], { queryParams: { kw: kw, page: 1, sortBy :1, row:10, i: i } });


  }

}
