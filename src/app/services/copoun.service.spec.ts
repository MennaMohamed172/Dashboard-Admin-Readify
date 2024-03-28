import { TestBed } from '@angular/core/testing';

import { CopounService } from './copoun.service';

describe('CopounService', () => {
  let service: CopounService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopounService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
