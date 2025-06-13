import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedStepPropertiesComponent } from './timed-step-properties.component';

describe('TimedStepPropertiesComponent', () => {
  let component: TimedStepPropertiesComponent;
  let fixture: ComponentFixture<TimedStepPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimedStepPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedStepPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
