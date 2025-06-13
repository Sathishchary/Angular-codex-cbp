import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePropComponent } from './reference-prop.component';

describe('ReferencePropComponent', () => {
  let component: ReferencePropComponent;
  let fixture: ComponentFixture<ReferencePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencePropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
