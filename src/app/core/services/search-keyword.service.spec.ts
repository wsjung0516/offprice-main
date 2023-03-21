import { TestBed } from '@angular/core/testing';

import { SearchKeywordService } from './search-keyword.service';

fdescribe('SearchKeywordService', () => {
  let service: SearchKeywordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchKeywordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('add keyword for chips', () => {
    service.addSearchKeyword({key:'aaa', value:'test1'});
    service.addSearchKeyword({key:'bbb', value:'test2'});
    service.addSearchKeyword({key:'ccc', value:'test3'});
    service.currentSearchKeyword$.subscribe((keyword) => {
      expect(keyword).toEqual([{key:'aaa', value:'test1'},{key:'bbb', value:'test2'},{key:'ccc', value:'test3'}]);
    });
  });
  it('remove keyword from chips', () => {
    service.keywords = [{key:'aaa', value:'test1'},{key:'bbb', value:'test2'},{key:'ccc', value:'test3'}];
    service.removeSearchKeyword({key:'bbb', value:'test2'});
    service.currentSearchKeyword$.subscribe((keyword) => {
      console.log('keyword',keyword, keyword.length);
      expect(keyword).toEqual([{key:'aaa', value:'test1'},{key:'ccc', value:'test3'}]);
    });
  });
});
