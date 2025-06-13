import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePropComponent } from './signature-prop.component';

describe('SignaturePropComponent', () => {
  let component: SignaturePropComponent;
  let fixture: ComponentFixture<SignaturePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturePropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
