import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFormBuilderComponent } from './table-form-builder.component';

describe('TableFormBuilderComponent', () => {
  let component: TableFormBuilderComponent;
  let fixture: ComponentFixture<TableFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFormBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
