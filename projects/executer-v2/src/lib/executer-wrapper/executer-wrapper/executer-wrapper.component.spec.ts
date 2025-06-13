import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuterWrapperComponent } from './executer-wrapper.component';

describe('ExecuterWrapperComponent', () => {
  let component: ExecuterWrapperComponent;
  let fixture: ComponentFixture<ExecuterWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuterWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
