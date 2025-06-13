import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionMenuBarComponent } from './execution-menu-bar.component';

describe('ExecutionMenuBarComponent', () => {
  let component: ExecutionMenuBarComponent;
  let fixture: ComponentFixture<ExecutionMenuBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionMenuBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
