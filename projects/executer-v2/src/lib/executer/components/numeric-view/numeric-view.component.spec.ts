import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericViewComponent } from './numeric-view.component';

describe('NumericViewComponent', () => {
  let component: NumericViewComponent;
  let fixture: ComponentFixture<NumericViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
