import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaLabelViewComponent } from './para-label-view.component';

describe('ParaLabelViewComponent', () => {
  let component: ParaLabelViewComponent;
  let fixture: ComponentFixture<ParaLabelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaLabelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParaLabelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
