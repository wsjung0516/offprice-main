import { TestBed } from '@angular/core/testing';

import { SaleListService } from './sale-list.service';

describe('SaleListService', () => {
  let service: SaleListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
