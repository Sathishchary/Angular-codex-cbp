import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePropComponent } from './date-prop.component';

describe('DatePropComponent', () => {
  let component: DatePropComponent;
  let fixture: ComponentFixture<DatePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
