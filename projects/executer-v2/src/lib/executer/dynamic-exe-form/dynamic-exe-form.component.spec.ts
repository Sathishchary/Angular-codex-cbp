import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExeFormComponent } from './dynamic-exe-form.component';

describe('DynamicExeFormComponent', () => {
  let component: DynamicExeFormComponent;
  let fixture: ComponentFixture<DynamicExeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
