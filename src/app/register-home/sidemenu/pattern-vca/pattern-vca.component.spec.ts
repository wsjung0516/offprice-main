import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternVcaComponent } from './pattern-vca.component';

describe('PatternVcaComponent', () => {
  let component: PatternVcaComponent;
  let fixture: ComponentFixture<PatternVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PatternVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
