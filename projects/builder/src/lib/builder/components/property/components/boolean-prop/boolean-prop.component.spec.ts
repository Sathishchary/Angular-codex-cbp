import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanPropComponent } from './boolean-prop.component';

describe('BooleanPropComponent', () => {
  let component: BooleanPropComponent;
  let fixture: ComponentFixture<BooleanPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooleanPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
