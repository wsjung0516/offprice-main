import { TestBed } from '@angular/core/testing';

import { FindFirstRowService } from './find-first-row.service';

fdescribe('FindFirstRowService', () => {
  let service: FindFirstRowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindFirstRowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be printed the first row', () => {
    service.printFirstRows();
    expect(service).toBeTruthy();
  });
});
