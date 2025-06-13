import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExecutionComponent } from './detail-execution.component';

describe('DetailExecutionComponent', () => {
  let component: DetailExecutionComponent;
  let fixture: ComponentFixture<DetailExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
