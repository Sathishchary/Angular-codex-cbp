import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablepropertiesComponent } from './tableproperties.component';

describe('TablepropertiesComponent', () => {
  let component: TablepropertiesComponent;
  let fixture: ComponentFixture<TablepropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablepropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablepropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
