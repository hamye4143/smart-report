import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListOptionComponent } from './search-list-option.component';

describe('SearchListOptionComponent', () => {
  let component: SearchListOptionComponent;
  let fixture: ComponentFixture<SearchListOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchListOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
