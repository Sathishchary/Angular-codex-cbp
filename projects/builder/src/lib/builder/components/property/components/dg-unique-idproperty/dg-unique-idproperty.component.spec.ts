import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgUniqueIdpropertyComponent } from './dg-unique-idproperty.component';

describe('DgUniqueIdpropertyComponent', () => {
  let component: DgUniqueIdpropertyComponent;
  let fixture: ComponentFixture<DgUniqueIdpropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgUniqueIdpropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgUniqueIdpropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
