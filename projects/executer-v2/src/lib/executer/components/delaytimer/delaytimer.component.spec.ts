import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaytimerComponent } from './delaytimer.component';

describe('DelaytimerComponent', () => {
  let component: DelaytimerComponent;
  let fixture: ComponentFixture<DelaytimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelaytimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaytimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
