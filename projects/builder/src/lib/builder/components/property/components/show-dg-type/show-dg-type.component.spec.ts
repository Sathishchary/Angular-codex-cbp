import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDgTypeComponent } from './show-dg-type.component';

describe('ShowDgTypeComponent', () => {
  let component: ShowDgTypeComponent;
  let fixture: ComponentFixture<ShowDgTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDgTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
