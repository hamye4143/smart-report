import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessToastrComponent } from './success-toastr.component';

describe('SuccessToastrComponent', () => {
  let component: SuccessToastrComponent;
  let fixture: ComponentFixture<SuccessToastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessToastrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
