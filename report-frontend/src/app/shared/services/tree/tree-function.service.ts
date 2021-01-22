import { Injectable } from '@angular/core';
import { TreeData } from '../../models/Category';

@Injectable({
  providedIn: 'root'
})
export class TreeFunctionService {

  flatJsonArray(flattenedAray: Array<TreeData>, node: TreeData[]) {
    const array: Array<TreeData> = flattenedAray;
    node.forEach(element => {
      if (element.Children) {
        array.push(element);
        this.flatJsonArray(array, element.Children);
      }
    });
    return array;
  }

  findNodeMaxId(node: TreeData[]) {
    console.log('node',node)
    if(node[0]){
      const flatArray = this.flatJsonArray([], node);
      const flatArrayWithoutChildren = [];
      flatArray.forEach(element => {
        flatArrayWithoutChildren.push(element.Id);
      });
        return Math.max(...flatArrayWithoutChildren);
 
    }else{ 
        return 0;
    }
  }

  // findGroupId(node: TreeData[]){ // 대, 중, 소 (뎁스)
  //   return 1
  // }

  findPosition(id: number, data: TreeData[]) {
    for (let i = 0; i < data.length; i += 1) {
      if (id === data[i].Id) {
        return i;
      }
    }
  }

  findFatherNode(id: number, data: TreeData[]) {
    for (let i = 0; i < data.length; i += 1) {
      const currentFather = data[i];
      for (let z = 0; z < currentFather.Children.length; z += 1) {
        if (id === currentFather.Children[z]['Id']) {
          return [currentFather, z];
        }
      }
      for (let z = 0; z < currentFather.Children.length; z += 1) {
        if (id !== currentFather.Children[z]['Id']) {
          const result = this.findFatherNode(id, currentFather.Children);
          if (result !== false) {
            return result;
          }
        }
      }
    }
    return false;
  }

}
