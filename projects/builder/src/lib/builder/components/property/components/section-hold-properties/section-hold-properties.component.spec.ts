import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHoldPropertiesComponent } from './section-hold-properties.component';

describe('SectionHoldPropertiesComponent', () => {
  let component: SectionHoldPropertiesComponent;
  let fixture: ComponentFixture<SectionHoldPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionHoldPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionHoldPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
