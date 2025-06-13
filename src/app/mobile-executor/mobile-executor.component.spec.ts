import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileExecutorComponent } from './mobile-executor.component';

describe('MobileExecutorComponent', () => {
  let component: MobileExecutorComponent;
  let fixture: ComponentFixture<MobileExecutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileExecutorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileExecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
