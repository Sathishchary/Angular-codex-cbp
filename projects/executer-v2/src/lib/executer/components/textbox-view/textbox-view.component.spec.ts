import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxViewComponent } from './textbox-view.component';

describe('TextboxViewComponent', () => {
  let component: TextboxViewComponent;
  let fixture: ComponentFixture<TextboxViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextboxViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
