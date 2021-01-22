import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MylikeListComponent } from './mylike-list.component';

describe('MylikeListComponent', () => {
  let component: MylikeListComponent;
  let fixture: ComponentFixture<MylikeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MylikeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MylikeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
