import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {


  myFiles:string [] = [];
  sMsg:string = '';


  constructor() { }

  ngOnInit() {
  }

  getFileDetails (e) {
    // console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  remove_file_all(): void {
    this.myFiles =[];
  }

  remove_file(file): void {
    this.myFiles.splice(this.myFiles.indexOf(file), 1);

    // const index = this.tags.indexOf(tag);

    // if (index >= 0) {
    //   this.tags.splice(index, 1);
    // }

  }


  uploadFiles () {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

  }
}
