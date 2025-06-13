import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCbpComponent } from './download-cbp.component';

describe('DownloadCbpComponent', () => {
  let component: DownloadCbpComponent;
  let fixture: ComponentFixture<DownloadCbpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadCbpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
