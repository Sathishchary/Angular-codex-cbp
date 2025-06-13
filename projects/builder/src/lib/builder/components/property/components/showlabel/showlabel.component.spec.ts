import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlabelComponent } from './showlabel.component';

describe('ShowlabelComponent', () => {
  let component: ShowlabelComponent;
  let fixture: ComponentFixture<ShowlabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowlabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
