import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwpExecuterComponent } from './ewp-executer.component';

describe('EwpExecuterComponent', () => {
  let component: EwpExecuterComponent;
  let fixture: ComponentFixture<EwpExecuterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwpExecuterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EwpExecuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
