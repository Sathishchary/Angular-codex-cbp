import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialSignViewComponent } from './initial-sign-view.component';

describe('InitialSignViewComponent', () => {
  let component: InitialSignViewComponent;
  let fixture: ComponentFixture<InitialSignViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialSignViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialSignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
