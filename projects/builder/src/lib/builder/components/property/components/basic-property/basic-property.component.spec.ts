import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicPropertyComponent } from './basic-property.component';

describe('BasicPropertyComponent', () => {
  let component: BasicPropertyComponent;
  let fixture: ComponentFixture<BasicPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
