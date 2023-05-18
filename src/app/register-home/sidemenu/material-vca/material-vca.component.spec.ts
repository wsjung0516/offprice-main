import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialVcaComponent } from './material-vca.component';

describe('MaterialVcaComponent', () => {
  let component: MaterialVcaComponent;
  let fixture: ComponentFixture<MaterialVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MaterialVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
