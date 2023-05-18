import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeScaleVcaComponent } from './size-scale-vca.component';

describe('SizeScaleVcaComponent', () => {
  let component: SizeScaleVcaComponent;
  let fixture: ComponentFixture<SizeScaleVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SizeScaleVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeScaleVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
