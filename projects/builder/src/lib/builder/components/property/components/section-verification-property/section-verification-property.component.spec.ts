import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionVerificationPropertyComponent } from './section-verification-property.component';

describe('SectionVerificationPropertyComponent', () => {
  let component: SectionVerificationPropertyComponent;
  let fixture: ComponentFixture<SectionVerificationPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionVerificationPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionVerificationPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
