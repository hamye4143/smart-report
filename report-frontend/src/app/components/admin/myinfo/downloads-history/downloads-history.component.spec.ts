import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadsHistoryComponent } from './downloads-history.component';

describe('DownloadsHistoryComponent', () => {
  let component: DownloadsHistoryComponent;
  let fixture: ComponentFixture<DownloadsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
