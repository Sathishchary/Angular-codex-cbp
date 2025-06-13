import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, SimpleChanges } from '@angular/core';
import flatpickr from 'flatpickr';
declare var $: any;
@Component({
  selector: 'lib-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css']
})

export class DateTimeComponent implements OnInit, AfterViewInit {

  @Input() dataField: any;
  @Input() disabled = false;
  @Input() isColor = false;
  @Input() hidden = false;
  @Input() opacity = false;
  @Input() placeholder = '';
  @Input() readonly = false;
  @Input() isEnableTime = false;
  @Input() noCalender = false;
  @Input() position: any = 'auto';
  @Input() minDate: any = '';
  @Input() maxDate: any = '';
  @Input() time24hr = false;
  @Input() dateIimeId = 'valueEditor';
  @Input() refreshDateEvent = false;
  @Input() width = 100;
  @Input() inline = false;
  @Input() builder = false;
  @Input() executer = false;
  @Input() execution = false;
  @Input() customColor = '';

  @Output() dataFieldChange: EventEmitter<any> = new EventEmitter();
  @Input() dateFormat: any = 'm/j/Y';
  timeFormat = 'h:i K';
  dynamicId = new Date().getTime();
  dateFormats = [
    { 'value': "m/j/Y", 'date': 'mm/dd/yyyy' },
    { 'value': "j/m/Y", 'date': 'dd/mm/yyyy' },
    { 'value': "j/M/Y", 'date': 'dd/mon/yyyy' },
    { 'value': "Y/M/j", 'date': 'yyyy/mon/dd' },
    { 'value': "m-j-Y", 'date': 'mm-dd-yyyy' },
    { 'value': "j-m-Y", 'date': 'dd-mm-yyyy' },
    { 'value': "j-M-Y", 'date': 'dd-mon-yyyy' },
    { 'value': "Y-M-j", 'date': 'yyyy-mon-dd' }
  ];

  ngOnInit() {
    this.dateFormat = this.getDateValue(this.dateFormat);
    this.dateIimeId = this.dateIimeId + this.dynamicId + '-' + ((Math.random() + 1).toString(36).substring(7));
    if (this.isEnableTime) { this.dateFormat = this.noCalender ? this.timeFormat : this.dateFormat + ' ' + this.timeFormat; }
    if (this.builder) {
      $(".flatpickr-calendar.static.open").css("max-width", "100%");
    }
    if (this.executer) {
      $(".flatpickr-calendar.static.open").css({ "position": "absolute", "right": "0" });
    }
  }
  ngAfterViewInit() {
    this.refreshDate();
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];
      if (propName === 'width' && change.currentValue) {
        this.width = change.currentValue;
      }
    }
  }
  getDateValue(date: string) {
    if (!date) { date = 'mm/dd/yyyy'; }
    let find = this.dateFormats.find(item => item.date === date);
    if (!find) { find = this.dateFormats.find(item => item.value === date); }
    return find?.value;
  }
  refreshDate() {
    const self = this;
    flatpickr('.valueEditor' + self.dateIimeId, {
      dateFormat: self.dateFormat,
      time_24hr: self.time24hr,
      minDate: (self.minDate && !self.noCalender) ? self.minDate : '',
      maxDate: (self.maxDate && !self.noCalender) ? self.maxDate : '',
      position: self.position,
      defaultDate: new Date(),
      static: true,
      inline: self.inline,
      noCalendar: self.noCalender,
      enableTime: self.isEnableTime,
      minTime: (self.noCalender && self.isEnableTime && self.minDate && self.execution) ? self.minDate : '',
      maxTime: (self.noCalender && self.isEnableTime && self.maxDate && self.execution) ? self.maxDate : '',
      disableMobile: true,
      onChange: function (rawdate, altdate, FPOBJ) {
        self.dataField = altdate;
        FPOBJ.close(); // Close datepicker on date select
        FPOBJ._input.blur(); // Blur input field on date select
        self.change();
      }
    });
  }

  change() {
    this.dataFieldChange.emit(this.dataField);
  }


}
