import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageOptionComponent } from './usage-option.component';

describe('UsageOptionComponent', () => {
  let component: UsageOptionComponent;
  let fixture: ComponentFixture<UsageOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
