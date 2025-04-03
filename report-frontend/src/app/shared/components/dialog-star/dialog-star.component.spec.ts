import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStarComponent } from './dialog-star.component';

describe('DialogStarComponent', () => {
  let component: DialogStarComponent;
  let fixture: ComponentFixture<DialogStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
