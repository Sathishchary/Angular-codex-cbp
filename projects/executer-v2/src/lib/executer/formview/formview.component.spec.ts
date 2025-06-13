import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormviewComponent } from './formview.component';

describe('FormviewComponent', () => {
  let component: FormviewComponent;
  let fixture: ComponentFixture<FormviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
