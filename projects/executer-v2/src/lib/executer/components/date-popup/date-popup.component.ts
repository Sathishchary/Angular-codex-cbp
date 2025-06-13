import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { DgTypes } from 'cbp-shared';

@Component({
  selector: 'lib-date-popup',
  templateUrl: './date-popup.component.html',
  styleUrls: ['./date-popup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePopupComponent implements OnInit, AfterViewInit {
  footerList = [{ type: 'Clear', disabled: true }, { type: 'Save', disabled: true }, { type: 'Cancel' }];
  @Output() closeEvent = new EventEmitter<any>();
  @Input() stepObject: any;
  currentDate: any;
  @Input() dateFormat: any;
  @Input() dateFieldValue: any;
  @Input() signatureView = false;
  @Input() placeholder: any;
  @Input() execution = false;
  @Input() dateTitle = 'Update Date';
  stepObjectDate: any;
  constructor(public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.signatureView) {
      this.stepObjectDate = this.stepObject?.signatureDate ? JSON.parse(JSON.stringify(this.stepObject?.signatureDate)) : '';
    } else {
      this.stepObjectDate = this.stepObject?.storeValue ? JSON.parse(JSON.stringify(this.stepObject?.storeValue)) : '';
    }
    if (this.stepObject.dgType === DgTypes.DateDataEntry && !this.stepObject?.minimum) {
      this.stepObject.minimum = new Date();
    }
    if (this.isHTMLText(this.stepObject?.storeValue)) {
      this.stepObject.storeValue = this.removeHTMLTags(this.stepObject.storeValue);
    }
    if ((this.stepObject.storeValue !== "" || this.stepObject.storeValue !== undefined) && this.stepObject.signatureDate === "mm/dd/yyyy") {
      this.footerList = [{ type: 'Clear', disabled: true }, { type: 'Save', disabled: true }, { type: 'Cancel' }];
    }
    else if (this.stepObject.signatureDate !== undefined && this.stepObject.signatureDate !== "mm/dd/yyyy") {
      this.footerList = [{ type: 'Clear', disabled: false }, { type: 'Save', disabled: true }, { type: 'Cancel' }];
    }
    else if (this.stepObject.storeValue !== "" && this.stepObject.signatureDate === undefined) {
      this.footerList = [{ type: 'Clear', disabled: false }, { type: 'Save', disabled: true }, { type: 'Cancel' }];
    }

  }
  removeHTMLTags(str: any) {
    if ((str === null) || (str === undefined) || (str === ''))
      return '';
    else
      str = str.toString();
    let finalString = str.replace(/(<([^>]+)>)/ig, '');
    finalString = finalString.replace(/&nbsp;/g, ' ');
    return finalString;
  }
  isHTMLText(text: any): boolean {
    if (text === undefined) { text = ''; }
    if (text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }
  changeDate(event: any) {
    this.currentDate = event;
    this.footerList = [{ type: 'Clear', disabled: false }, { type: 'Save', disabled: false }, { type: 'Cancel' }];
  }
  cancel() {
    if (this.signatureView) {
      this.stepObject.signatureDate = this.stepObjectDate;
    } else {
      this.stepObject['storeValue'] = this.stepObjectDate;
    }
    this.closeEvent.emit(false);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  save() {
    this.closeEvent.emit(this.currentDate);
  }
  clearDate() {
    if (this.signatureView) {
      this.stepObject.signatureDate = '';
    } else {
      this.stepObject['storeValue'] = '';
    }
    this.currentDate = '';
  }
}
