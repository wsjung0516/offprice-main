import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorVcaComponent } from './color-vca.component';

describe('ColorVcaComponent', () => {
  let component: ColorVcaComponent;
  let fixture: ComponentFixture<ColorVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ColorVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
