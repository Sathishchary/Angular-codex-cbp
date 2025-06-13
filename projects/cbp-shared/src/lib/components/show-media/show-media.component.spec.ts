import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMediaComponent } from './show-media.component';

describe('ShowMediaComponent', () => {
  let component: ShowMediaComponent;
  let fixture: ComponentFixture<ShowMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
