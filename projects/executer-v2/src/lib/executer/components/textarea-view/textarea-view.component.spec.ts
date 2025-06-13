import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaViewComponent } from './textarea-view.component';

describe('TextareaViewComponent', () => {
  let component: TextareaViewComponent;
  let fixture: ComponentFixture<TextareaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextareaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
