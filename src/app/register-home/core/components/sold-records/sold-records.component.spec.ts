import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldRecordsComponent } from './sold-records.component';

describe('SoldRecordsComponent', () => {
  let component: SoldRecordsComponent;
  let fixture: ComponentFixture<SoldRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoldRecordsComponent]
    });
    fixture = TestBed.createComponent(SoldRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
