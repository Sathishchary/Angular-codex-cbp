import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPropComponent } from './link-prop.component';

describe('LinkPropComponent', () => {
  let component: LinkPropComponent;
  let fixture: ComponentFixture<LinkPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkPropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
