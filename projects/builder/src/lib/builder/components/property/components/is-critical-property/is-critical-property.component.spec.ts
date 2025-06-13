import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsCriticalPropertyComponent } from './is-critical-property.component';

describe('IsCriticalPropertyComponent', () => {
  let component: IsCriticalPropertyComponent;
  let fixture: ComponentFixture<IsCriticalPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsCriticalPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsCriticalPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
