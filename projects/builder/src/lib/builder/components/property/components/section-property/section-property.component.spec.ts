import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPropertyComponent } from './section-property.component';

describe('SectionPropertyComponent', () => {
  let component: SectionPropertyComponent;
  let fixture: ComponentFixture<SectionPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
