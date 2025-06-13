import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaViewComponent } from './formula-view.component';

describe('FormulaViewComponent', () => {
  let component: FormulaViewComponent;
  let fixture: ComponentFixture<FormulaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
