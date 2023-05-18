import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSizeVcaComponent } from './select-size-vca.component';

describe('SelectSizeVcaComponent', () => {
  let component: SelectSizeVcaComponent;
  let fixture: ComponentFixture<SelectSizeVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SelectSizeVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSizeVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
