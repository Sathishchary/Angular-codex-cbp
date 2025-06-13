import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocExeComponent } from './doc.component';

describe('DocExeComponent', () => {
  let component: DocExeComponent;
  let fixture: ComponentFixture<DocExeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocExeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocExeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
