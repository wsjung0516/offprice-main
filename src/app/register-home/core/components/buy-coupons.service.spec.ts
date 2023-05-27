import { TestBed } from '@angular/core/testing';

import { BuyCouponsService } from './buy-coupons.service';

describe('BuyCouponsService', () => {
  let service: BuyCouponsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyCouponsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
