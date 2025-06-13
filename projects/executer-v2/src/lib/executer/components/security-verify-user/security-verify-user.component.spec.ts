import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityVerifyUserComponent } from './security-verify-user.component';

describe('SecurityVerifyUserComponent', () => {
  let component: SecurityVerifyUserComponent;
  let fixture: ComponentFixture<SecurityVerifyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityVerifyUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityVerifyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
