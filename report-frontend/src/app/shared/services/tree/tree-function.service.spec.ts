import { TestBed } from '@angular/core/testing';

import { TreeFunctionService } from './tree-function.service';

describe('TreeFunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreeFunctionService = TestBed.get(TreeFunctionService);
    expect(service).toBeTruthy();
  });
});
