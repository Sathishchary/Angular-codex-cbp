import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-doc-size-change',
  templateUrl: './doc-size-change.component.html',
  styleUrls: ['./doc-size-change.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocSizeChangeComponent implements OnInit, OnChanges {

  @Input() multipleCbpTab:any;
  cssClass = 'btn btn-icon btn-outline btn-sm set-index';

  @Input() checkedFirst:any = false;
  @Input() checkedDefault: any = true;
  @Input() checkedLast: any = false;
  @Input() tabletCheck: any = false;
  @Input() executionType:any;

  @Output() changeSize: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.executionType && this.executionType) {
      this.executionType = changes.executionType.currentValue;
    }
  }

  ngOnInit() {
  }

  changeSizeView(first:boolean, defalt:boolean, last:boolean, tablet:boolean){
    this.checkedFirst = first;
    this.checkedDefault = defalt;
    this.checkedLast = last;
    this.tabletCheck = tablet;
    this.changeSize.emit({'first': first, defalt: defalt,last: last, tablet:tablet});
  }

}
