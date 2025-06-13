import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSectionPropComponent } from './basic-section-prop.component';

describe('BasicSectionPropComponent', () => {
  let component: BasicSectionPropComponent;
  let fixture: ComponentFixture<BasicSectionPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicSectionPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSectionPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
