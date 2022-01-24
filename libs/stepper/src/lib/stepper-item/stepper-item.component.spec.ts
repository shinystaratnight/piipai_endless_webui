import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperItemComponent } from './stepper-item.component';

describe('StepperItemComponent', () => {
  let component: StepperItemComponent;
  let fixture: ComponentFixture<StepperItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
