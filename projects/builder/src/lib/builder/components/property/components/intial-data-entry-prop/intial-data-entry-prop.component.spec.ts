import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntialDataEntryPropComponent } from './intial-data-entry-prop.component';

describe('IntialDataEntryPropComponent', () => {
  let component: IntialDataEntryPropComponent;
  let fixture: ComponentFixture<IntialDataEntryPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntialDataEntryPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntialDataEntryPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
