import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormbuildComponent } from './formbuild.component';

describe('FormbuildComponent', () => {
  let component: FormbuildComponent;
  let fixture: ComponentFixture<FormbuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormbuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormbuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
