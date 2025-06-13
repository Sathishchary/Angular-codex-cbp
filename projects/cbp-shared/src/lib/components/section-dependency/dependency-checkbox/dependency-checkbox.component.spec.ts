import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyCheckboxComponent } from './dependency-checkbox.component';

describe('DependencyCheckboxComponent', () => {
  let component: DependencyCheckboxComponent;
  let fixture: ComponentFixture<DependencyCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependencyCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
