import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySortListComponent } from './category-sort-list.component';

describe('CategorySortListComponent', () => {
  let component: CategorySortListComponent;
  let fixture: ComponentFixture<CategorySortListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySortListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
