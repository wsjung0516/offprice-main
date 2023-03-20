import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRangeComponent } from './price-range.component';

describe('PriceComponent', () => {
  let component: PriceRangeComponent;
  let fixture: ComponentFixture<PriceRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceRangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
