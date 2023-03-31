import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListHeaderComponent } from './sale-list-header.component';

describe('SaleListHeaderComponent', () => {
  let component: SaleListHeaderComponent;
  let fixture: ComponentFixture<SaleListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleListHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
