import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedPropertyComponent } from './embedded-property.component';

describe('EmbeddedPropertyComponent', () => {
  let component: EmbeddedPropertyComponent;
  let fixture: ComponentFixture<EmbeddedPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
