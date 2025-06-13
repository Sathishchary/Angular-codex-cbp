import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanViewComponent } from './boolean-view.component';

describe('BooleanViewComponent', () => {
  let component: BooleanViewComponent;
  let fixture: ComponentFixture<BooleanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooleanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
