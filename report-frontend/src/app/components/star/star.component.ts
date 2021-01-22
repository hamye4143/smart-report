import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogStarComponent } from 'src/app/shared/components/dialog-star/dialog-star.component';
import { StarService } from 'src/app/shared/services/star/star.service';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StarComponent implements OnInit {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  // blog_id:number;
  @Input() blog_id:number;
  @Input() isblogdetailsPage:boolean;
  star_avg_value:number;
  constructor(private star_service:StarService,private dialog:MatDialog) {
    
   }
  
  ngOnInit() {
    this.getStarValue();
  }

  setStar(setStar){
    console.log('set',setStar);
    this.selectedValue = setStar;
  }
  
  countStar(star) {
    this.selectedValue = star;
    console.log('Value of star', star);
  }

  getStarValue(){//getStarValue
    this.star_service.getStarValue(this.blog_id).subscribe(
      (response:any)=>{
        this.star_avg_value = response['star_average_value'];
        // console.log('this.star_avg_value',this.star_avg_value)
        const star_avg_value_round = Math.round(this.star_avg_value)
        this.setStar(star_avg_value_round);
      },
      (error) =>{

      });
  }

  showIcon(index:number) {
    console.log(index);

    if (index + 1 <= 5) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  open_dialog(){
    const blog_id = this.blog_id
    const dialogRef = this.dialog.open(DialogStarComponent,{
      data:{
        blog_id
      },
      width:'500px',
      height:'200px'
    });
    dialogRef.afterClosed().subscribe((confirm:boolean)=>{
      if(confirm){
        console.log('confirm')

        //app-star 새로고침
          // this.childC.getStarValue();
          this.ngOnInit();

        
      }
    })
  }
}