import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMenuDialogComponent } from './show-menu-dialog-component';

describe('ShowMenuDialogComponentComponent', () => {
  let component: ShowMenuDialogComponent;
  let fixture: ComponentFixture<ShowMenuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMenuDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowMenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
