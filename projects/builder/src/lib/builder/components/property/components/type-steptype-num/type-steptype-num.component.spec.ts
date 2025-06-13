import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSteptypeNumComponent } from './type-steptype-num.component';

describe('TypeSteptypeNumComponent', () => {
  let component: TypeSteptypeNumComponent;
  let fixture: ComponentFixture<TypeSteptypeNumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeSteptypeNumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeSteptypeNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
