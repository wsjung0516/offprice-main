import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Category1MenuComponent } from './category1-menu.component';

describe('Category1MenuComponent', () => {
  let component: Category1MenuComponent;
  let fixture: ComponentFixture<Category1MenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Category1MenuComponent]
    });
    fixture = TestBed.createComponent(Category1MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
