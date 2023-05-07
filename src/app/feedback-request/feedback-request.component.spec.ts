import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRequestComponent } from './feedback-request.component';

describe('FeedbackRequestComponent', () => {
  let component: FeedbackRequestComponent;
  let fixture: ComponentFixture<FeedbackRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeedbackRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
