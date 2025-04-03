import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  // @Input() items: NavItem[];
  @Input() items;
  @ViewChild('childMenu',{ static: true }) public childMenu;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  navigate(name){
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/category-list'], { queryParams: { cn: name, page: 1, sortBy :1, row:10 } });
  });


    // this.router.navigate(['/category-list'], { queryParams: { cn: name, page: 1, sortBy :1, row:10 } });
  }

}
