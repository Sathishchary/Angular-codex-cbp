import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackChangeComponent } from './track-change.component';

describe('TrackChangeComponent', () => {
  let component: TrackChangeComponent;
  let fixture: ComponentFixture<TrackChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
