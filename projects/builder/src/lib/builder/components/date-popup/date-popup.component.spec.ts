import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePopupComponent } from './date-popup.component';

describe('DatePopupComponent', () => {
  let component: DatePopupComponent;
  let fixture: ComponentFixture<DatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
