import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgPaginationComponent } from './dg-pagination.component';

describe('DgPaginationComponent', () => {
  let component: DgPaginationComponent;
  let fixture: ComponentFixture<DgPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
