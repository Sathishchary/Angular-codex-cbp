import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigurePropComponent } from './figure-prop.component';

describe('FigurePropComponent', () => {
  let component: FigurePropComponent;
  let fixture: ComponentFixture<FigurePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigurePropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FigurePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
