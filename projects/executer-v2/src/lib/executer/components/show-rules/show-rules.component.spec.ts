import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRulesComponent } from './show-rules.component';

describe('ShowRulesComponent', () => {
  let component: ShowRulesComponent;
  let fixture: ComponentFixture<ShowRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
