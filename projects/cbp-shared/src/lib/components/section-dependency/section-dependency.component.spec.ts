import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDependencyComponent } from './section-dependency.component';

describe('SectionDependencyComponent', () => {
  let component: SectionDependencyComponent;
  let fixture: ComponentFixture<SectionDependencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDependencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
