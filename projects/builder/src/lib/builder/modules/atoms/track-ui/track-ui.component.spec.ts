import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackUiComponent } from './track-ui.component';

describe('TrackUiComponent', () => {
  let component: TrackUiComponent;
  let fixture: ComponentFixture<TrackUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
