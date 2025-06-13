import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlabelpromptComponent } from './showlabelprompt.component';

describe('ShowlabelpromptComponent', () => {
  let component: ShowlabelpromptComponent;
  let fixture: ComponentFixture<ShowlabelpromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowlabelpromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowlabelpromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
