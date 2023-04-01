import { TestBed } from '@angular/core/testing';

import { ChipsKeywordService } from './chips-keyword.service';

describe('ChipsKeywordService', () => {
  let service: ChipsKeywordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChipsKeywordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('add keyword for chips', () => {
    service.addChipKeyword({ key: 'aaa', value: 'test1' });
    service.addChipKeyword({ key: 'bbb', value: 'test2' });
    service.addChipKeyword({ key: 'ccc', value: 'test3' });
    service.searchKeyword$.subscribe((keyword) => {
      expect(keyword).toEqual([
        { key: 'aaa', value: 'test1' },
        { key: 'bbb', value: 'test2' },
        { key: 'ccc', value: 'test3' },
      ]);
    });
  });
  it('remove keyword from chips', () => {
    service.keywords = [
      { key: 'aaa', value: 'test1' },
      { key: 'bbb', value: 'test2' },
      { key: 'ccc', value: 'test3' },
    ];
    service.removeChipKeyword({ key: 'bbb', value: 'test2' });
    service.searchKeyword$.subscribe((keyword) => {
      console.log('keyword', keyword, keyword.length);
      expect(keyword).toEqual([
        { key: 'aaa', value: 'test1' },
        { key: 'ccc', value: 'test3' },
      ]);
    });
  });
});
