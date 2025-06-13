import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureEditorComponent } from './signature-editor.component';

describe('SignatureEditorComponent', () => {
  let component: SignatureEditorComponent;
  let fixture: ComponentFixture<SignatureEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
