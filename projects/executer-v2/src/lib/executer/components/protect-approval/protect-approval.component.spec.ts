import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectApprovalComponent } from './protect-approval.component';

describe('ProtectApprovalComponent', () => {
  let component: ProtectApprovalComponent;
  let fixture: ComponentFixture<ProtectApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
