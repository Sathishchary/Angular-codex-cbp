import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOptionComponent } from './step-option.component';

describe('StepOptionComponent', () => {
  let component: StepOptionComponent;
  let fixture: ComponentFixture<StepOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
