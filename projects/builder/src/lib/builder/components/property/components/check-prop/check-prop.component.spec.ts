import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPropComponent } from './check-prop.component';

describe('CheckPropComponent', () => {
  let component: CheckPropComponent;
  let fixture: ComponentFixture<CheckPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
