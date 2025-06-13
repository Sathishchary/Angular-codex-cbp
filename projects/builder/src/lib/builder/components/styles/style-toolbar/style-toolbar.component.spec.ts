import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleToolbarComponent } from './style-toolbar.component';

describe('StyleToolbarComponent', () => {
  let component: StyleToolbarComponent;
  let fixture: ComponentFixture<StyleToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyleToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
