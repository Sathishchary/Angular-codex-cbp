import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationViewComponent } from './verification-view.component';

describe('VerificationViewComponent', () => {
  let component: VerificationViewComponent;
  let fixture: ComponentFixture<VerificationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
