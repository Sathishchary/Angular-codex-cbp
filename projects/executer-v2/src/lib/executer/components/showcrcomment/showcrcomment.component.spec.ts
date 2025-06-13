import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcrcommentComponent } from './showcrcomment.component';

describe('ShowcrcommentComponent', () => {
  let component: ShowcrcommentComponent;
  let fixture: ComponentFixture<ShowcrcommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowcrcommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcrcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
