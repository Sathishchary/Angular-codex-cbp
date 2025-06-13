import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownItemsComponent } from './dropdown-items.component';

describe('DropdownItemsComponent', () => {
  let component: DropdownItemsComponent;
  let fixture: ComponentFixture<DropdownItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
