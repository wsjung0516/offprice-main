import { TestBed } from '@angular/core/testing';

import { MakeObservableService } from './make-observable.service';

describe('MakeObservableService', () => {
  let service: MakeObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
