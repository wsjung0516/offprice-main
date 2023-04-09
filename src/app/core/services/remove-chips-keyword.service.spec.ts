import { TestBed } from '@angular/core/testing';

import { RemoveChipsKeywordService } from './remove-chips-keyword.service';

describe('RemoveChipsKeywordService', () => {
  let service: RemoveChipsKeywordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveChipsKeywordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
