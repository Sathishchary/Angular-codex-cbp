import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpEditorComponent } from './cbp-editor.component';

describe('CbpEditorComponent', () => {
  let component: CbpEditorComponent;
  let fixture: ComponentFixture<CbpEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbpEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
