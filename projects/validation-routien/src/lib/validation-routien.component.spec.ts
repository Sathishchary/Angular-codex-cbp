import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRoutienComponent } from './validation-routien.component';

describe('ValidationRoutienComponent', () => {
  let component: ValidationRoutienComponent;
  let fixture: ComponentFixture<ValidationRoutienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRoutienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRoutienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
