import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageviewComponent } from './pageview.component';

describe('PageviewComponent', () => {
  let component: PageviewComponent;
  let fixture: ComponentFixture<PageviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
