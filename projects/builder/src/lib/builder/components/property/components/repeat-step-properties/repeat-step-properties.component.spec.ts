import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatStepPropertiesComponent } from './repeat-step-properties.component';

describe('RepeatStepPropertiesComponent', () => {
  let component: RepeatStepPropertiesComponent;
  let fixture: ComponentFixture<RepeatStepPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatStepPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatStepPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
