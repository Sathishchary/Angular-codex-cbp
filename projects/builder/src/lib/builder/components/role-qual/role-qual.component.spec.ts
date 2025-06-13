import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleQualComponent } from './role-qual.component';

describe('RoleQualComponent', () => {
  let component: RoleQualComponent;
  let fixture: ComponentFixture<RoleQualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleQualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleQualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
