import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericPropComponent } from './numeric-prop.component';

describe('NumericPropComponent', () => {
  let component: NumericPropComponent;
  let fixture: ComponentFixture<NumericPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
