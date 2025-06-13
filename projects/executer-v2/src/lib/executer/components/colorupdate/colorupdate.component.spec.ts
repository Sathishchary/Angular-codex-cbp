import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorupdateComponent } from './colorupdate.component';

describe('ColorupdateComponent', () => {
  let component: ColorupdateComponent;
  let fixture: ComponentFixture<ColorupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorupdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
