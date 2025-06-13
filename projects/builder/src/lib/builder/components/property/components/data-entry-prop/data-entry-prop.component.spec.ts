import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryPropComponent } from './data-entry-prop.component';

describe('DataEntryPropComponent', () => {
  let component: DataEntryPropComponent;
  let fixture: ComponentFixture<DataEntryPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataEntryPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
