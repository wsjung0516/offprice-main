import { TestBed } from '@angular/core/testing';

import { UserSaleListService } from './user-sale-list.service';

describe('UserSaleListService', () => {
  let service: UserSaleListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSaleListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
