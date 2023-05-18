import { TestBed } from '@angular/core/testing';

import { MakeWhereConditionService } from './make-where-condition.service';

describe('MakeWhereConditionService', () => {
  let service: MakeWhereConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeWhereConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
