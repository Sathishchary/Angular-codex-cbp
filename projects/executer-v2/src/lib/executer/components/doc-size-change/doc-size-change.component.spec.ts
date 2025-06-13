import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSizeChangeComponent } from './doc-size-change.component';

describe('DocSizeChangeComponent', () => {
  let component: DocSizeChangeComponent;
  let fixture: ComponentFixture<DocSizeChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSizeChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSizeChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
