import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationDataEntryPropComponent } from './verification-data-entry-prop.component';

describe('VerificationDataEntryPropComponent', () => {
  let component: VerificationDataEntryPropComponent;
  let fixture: ComponentFixture<VerificationDataEntryPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationDataEntryPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationDataEntryPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
