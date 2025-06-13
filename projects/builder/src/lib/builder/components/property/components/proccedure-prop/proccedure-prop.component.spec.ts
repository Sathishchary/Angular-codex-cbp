import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccedurePropComponent } from './proccedure-prop.component';

describe('ProccedurePropComponent', () => {
  let component: ProccedurePropComponent;
  let fixture: ComponentFixture<ProccedurePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProccedurePropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProccedurePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
