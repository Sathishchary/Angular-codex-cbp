import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockiconComponent } from './lockicon.component';

describe('LockiconComponent', () => {
  let component: LockiconComponent;
  let fixture: ComponentFixture<LockiconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockiconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockiconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
