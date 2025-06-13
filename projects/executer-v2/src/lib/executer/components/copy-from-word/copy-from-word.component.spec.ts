import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyFromWordComponent } from './copy-from-word.component';

describe('CopyFromWordComponent', () => {
  let component: CopyFromWordComponent;
  let fixture: ComponentFixture<CopyFromWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyFromWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyFromWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
