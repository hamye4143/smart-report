export interface TreeData {

    Id: number;
    Name: string;
    Description: string;
    code:string;
    group_code_id:number;
    is_use:string;
    order:number;
    parent_group_code_id:string ;
    parent_id:number;
    Children: TreeData[];
}

export interface SortData{
    id: number;
    code_name: string;
    detail: string;
    children: SortData[];
}

export interface DialogData {
    Name: string;
    Description: string;
    Component: string;
}
