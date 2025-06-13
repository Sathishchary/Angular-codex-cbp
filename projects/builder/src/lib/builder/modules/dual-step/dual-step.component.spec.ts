import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualStepComponent } from './dual-step.component';

describe('DualStepComponent', () => {
  let component: DualStepComponent;
  let fixture: ComponentFixture<DualStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
