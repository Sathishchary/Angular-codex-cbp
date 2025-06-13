import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableaddComponent } from './tableadd.component';

describe('TableaddComponent', () => {
  let component: TableaddComponent;
  let fixture: ComponentFixture<TableaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
