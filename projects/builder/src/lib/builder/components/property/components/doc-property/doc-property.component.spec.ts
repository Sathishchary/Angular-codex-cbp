import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPropertyComponent } from './doc-property.component';

describe('DocPropertyComponent', () => {
  let component: DocPropertyComponent;
  let fixture: ComponentFixture<DocPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
