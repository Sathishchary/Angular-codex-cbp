import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaPropComponent } from './formula-prop.component';

describe('FormulaPropComponent', () => {
  let component: FormulaPropComponent;
  let fixture: ComponentFixture<FormulaPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
