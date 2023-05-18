import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryVcaComponent } from './category-vca.component';

describe('CategoryVcaComponent', () => {
  let component: CategoryVcaComponent;
  let fixture: ComponentFixture<CategoryVcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CategoryVcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryVcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
