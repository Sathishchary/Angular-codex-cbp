import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupURLComponent } from './setup-url.component';

describe('SetupURLComponent', () => {
  let component: SetupURLComponent;
  let fixture: ComponentFixture<SetupURLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupURLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupURLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
