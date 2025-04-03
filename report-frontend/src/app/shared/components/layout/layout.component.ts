import { MediaMatcher } from '@angular/cdk/layout';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';

import { TreeData } from '../../models/Category';
import { AuthService } from '../../services/guards/auth.service';
import { SortService } from '../../services/sort/sort.service';
import { TreeDataService } from '../../services/tree/tree-data.service';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { of as observableOf } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
    selector: 'app-layout', templateUrl: './layout.component.html', styleUrls: ['./layout.component.css'],
    // providers:[SortComponent]
})
export class LayoutComponent implements OnInit {
    private isAdmin;
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    private menuData: any;
    private sortMenu = [];
    nestedTreeControl: NestedTreeControl<TreeData>;
    nestedDataSource: MatTreeNestedDataSource<TreeData>;
    private data;
    private userName;
    private _getChildren = (node: TreeData) => observableOf(node.Children);
    hasNestedChild = (_: number, nodeData: TreeData) => nodeData.Children.length > 0;
    private finalData;

    constructor(
        private dialog: MatDialog,
        private auth_service: AuthService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private dataService: TreeDataService,
        private router: Router,
    ) {
        this.isAdmin = localStorage.getItem('isAdmin');
        console.log('this.admin', this.isAdmin)

        this.userName = JSON.parse(localStorage.getItem('user_info'))['name'];
        this.mobileQuery = this
            .media
            .matchMedia('(max-width: 600px)'); //1000px
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this
            .mobileQuery
            .addListener(this._mobileQueryListener);

    }
    ngOnInit(): void {
        this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();

        this
            .dataService
            .getAllSorts()
            .subscribe((response: any) => {

                if (response.serialized_data[0]) {
                    this.data = response.serialized_data;
                    const o = this.object(this.data);
                    this.finalData = o[1].Children;

                    let results = []
                    results = this.findAllChildren(2, results, 0) //id 가 2 인 것들의 자식들 찾기

                } else {
                    console.log('초기값 없음')
                }
            });
    }

    findAllChildren(id, results, depth) {
        for (const d in this.data) {
            if (this.data[d].parent_id == id) {
                this
                    .data[d]
                    .depth = depth
                results.push(this.data[d])
                this.findAllChildren(this.data[d].I, results, depth + 1)
            }
        }
        return results
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
    setMenu() {
        this
            .dataService
            .getAllSorts()
            .subscribe((response: any) => {
                this.menuData = response['serialized_data'];
                console.log(this.menuData);
                this
                    .menuData
                    .forEach(element => {
                        if (element.group_code_id === 1) {
                            this
                                .sortMenu
                                .push(element);
                        }

                    });

            });

    }

    open_dialog(message: string) {
        const dialogRef = this
            .dialog
            .open(DialogBodyComponent, {
                data: {
                    message
                },
                // width: '500px',
                // height: '200px'
            });
        dialogRef
            .afterClosed()
            .subscribe((confirm: boolean) => {
                if (confirm) {
                    this.sign_out();
                }
            })
    }

    sign_out() {
        this
            .auth_service
            .logout('');
    }

    searchEvent(event) {
        console.log('event',event);
        //search 
        this.router.navigate(['/search-list'], { queryParams: { kw: event, page: 1, sortBy: 1, row: 10, i:'all' } });
        // this.router.navigate(['/search-list'], { queryParams: { kw: this.keyword, page: this.page, sortBy :this.sortBy, row:this.row, i:this.i } });


    }

    navigate(name) {

        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/category-list'], { queryParams: { cn: name, page: 1, sortBy :1, row:10, i:'all'} });
        });

    }

}
