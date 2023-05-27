import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCouponsComponent } from './buy-coupons.component';

describe('BuyCouponsComponent', () => {
  let component: BuyCouponsComponent;
  let fixture: ComponentFixture<BuyCouponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BuyCouponsComponent]
    });
    fixture = TestBed.createComponent(BuyCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
