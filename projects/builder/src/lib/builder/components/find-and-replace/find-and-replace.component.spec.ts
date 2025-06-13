import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAndReplaceComponent } from './find-and-replace.component';

describe('FindAndReplaceComponent', () => {
  let component: FindAndReplaceComponent;
  let fixture: ComponentFixture<FindAndReplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAndReplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAndReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
