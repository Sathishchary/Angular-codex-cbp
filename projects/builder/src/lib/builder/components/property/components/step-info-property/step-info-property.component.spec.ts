import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepInfoPropertyComponent } from './step-info-property.component';

describe('StepInfoPropertyComponent', () => {
  let component: StepInfoPropertyComponent;
  let fixture: ComponentFixture<StepInfoPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepInfoPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepInfoPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
