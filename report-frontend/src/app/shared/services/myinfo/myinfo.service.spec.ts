import { TestBed } from '@angular/core/testing';

import { MyinfoService } from './myinfo.service';

describe('MyinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyinfoService = TestBed.get(MyinfoService);
    expect(service).toBeTruthy();
  });
});
