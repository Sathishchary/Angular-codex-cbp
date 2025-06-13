import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackUserComponent } from './track-user.component';

describe('TrackUserComponent', () => {
  let component: TrackUserComponent;
  let fixture: ComponentFixture<TrackUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
