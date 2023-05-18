import { TestBed } from '@angular/core/testing';

import { NoAuthInterceptorService } from './no-auth-interceptor.service';

describe('NoAuthInterceptorService', () => {
  let service: NoAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
