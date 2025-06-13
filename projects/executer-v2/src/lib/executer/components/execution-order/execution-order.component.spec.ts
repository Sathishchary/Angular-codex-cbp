import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionOrderComponent } from './execution-order.component';

describe('ExecutionOrderComponent', () => {
  let component: ExecutionOrderComponent;
  let fixture: ComponentFixture<ExecutionOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
