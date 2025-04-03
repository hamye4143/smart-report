import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoToastrComponent } from './info-toastr.component';

describe('InfoToastrComponent', () => {
  let component: InfoToastrComponent;
  let fixture: ComponentFixture<InfoToastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoToastrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
