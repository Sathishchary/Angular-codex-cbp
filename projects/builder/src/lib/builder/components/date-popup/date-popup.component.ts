import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'lib-date-popup',
  templateUrl: './date-popup.component.html',
  styleUrls: ['./date-popup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateEditorPopupComponent implements OnInit {
  footerList = [{ type: 'Clear' }, { type: 'Save' }, { type: 'Cancel' }];
  @Output() closeEvent = new EventEmitter<any>();
  @Input() stepObject: any;
  currentDate: any;
  @Input() dateFormat: any;
  @Input() dateFieldValue: any;
  @Input() signatureView = false;
  @Input() dateTitle = 'Update Date';
  constructor(public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.stepObject?.dateFieldValue) {
      this.stepObject['dateFieldValue'] = '';
    }
  }
  changeDate(event: any) {
    this.currentDate = event;
  }
  cancel() {
    this.closeEvent.emit(false);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  save() {
    this.closeEvent.emit(this.currentDate);
  }
  clearDate() {
    this.stepObject['dateFieldValue'] = '';
    this.currentDate = '';
    // this.closeEvent.emit('');
  }
}
