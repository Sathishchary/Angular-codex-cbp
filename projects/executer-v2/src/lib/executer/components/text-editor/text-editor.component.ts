import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularEditorConfig } from 'dg-shared';
import { ExecutionService } from '../../services/execution.service';
declare const $: any;
@Component({
  selector: 'lib-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextEditorComponent implements OnChanges, OnInit {

  @Input() input: any = '';
  @Input() selectedFieldEntry!: any;
  @Input() stepObject: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateTitle: EventEmitter<any> = new EventEmitter<any>();
  @Output() fouseOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepObjectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEventCheck: EventEmitter<any> = new EventEmitter<any>();
  footerList = [{ type: 'Save' }, { type: 'Cancel' }]
  updateView!: boolean;
  updatedValue = false
  configOld: any;
  @Input() config!: AngularEditorConfig;
  showError = false;
  @Input() hidePopup = false;
  @Input() foreColor!: any;
  @Input() signatureType: any;
  @Input() signatureConfig: any;
  hyperLink: any;
  triggerHyperLink = false;
  @Input() isDisabled = false;
  @Output() mouseOutEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef, public executionService: ExecutionService) { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'config' && !changes.config.firstChange) {
        this.config = changes.config.currentValue;
      }
      if (propName === 'stepObject' && !changes.stepObject.firstChange) {
        this.stepObject = changes.stepObject.currentValue;
      }
    }
  }

  ngOnInit() {
    this.stepObject = this.stepObject ?? this.selectedFieldEntry;
    this.configOld = JSON.stringify(this.config);
    this.config.defaultFontName = this.config.defaultFontName ?? 'Poppins';
    this.config.defaultFontSize = this.config.defaultFontSize ?? '2';
    this.config.foreColor = this.foreColor;
    if (this.signatureType) {
      this.config.maxHeight = 'none';
      this.config.overFlow = 'auto';
    }
    this.config = JSON.parse(JSON.stringify(this.config));
    const self = this;
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    });
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    })
    this.cdr.detectChanges();
  }
  ngAfterViewInit(): void {
    this.config = JSON.parse(JSON.stringify(this.config));
    this.updateView = false;
    setTimeout(() => {
      this.updateView = true;
      this.cdr.detectChanges();
    }, 1);
    setTimeout(() => {
      this.foreColor = this.config.foreColor;
      this.foreColor = this.foreColor ?? '#000000';
      this.foreColor = JSON.parse(JSON.stringify(this.foreColor));
      // console.log(this.foreColor);
    }, 1);
  }

  emithtml(evnt: any) {
    //  this.stepObject.storeValue = evnt?.target?.innerHTML;
    this.updatedValue = true;
    this.blur.emit();
  }

  closeEventCheck(event: any) {
    if (this.config != JSON.parse(this.configOld) || this.updatedValue) {
      this.close.emit(event);
    }
  }

  cancel() {
    this.closeEvent.emit(false);
  }
  save() {
    if (this.selectedFieldEntry?.protect && this.selectedFieldEntry?.comments === '') {
      this.showError = true;
    } else {
      this.closeEvent.emit(this.input);
    }
  }
  createHyperLink(event: any) {
    if (event && event.data) {
      this.hyperLink = {
        dgc_reference_object_key: event.data.DGC_REFERENCE_OBJECT_KEY,
        reference_object_code: event.data.DGC_REFERENCE_OBJECT_CODE,
        title: event.title,
      }
    }
    return;
  }

  createHyperLinkWithPosition(event: any) {
    if (event.type == 'focus' && !event.isFocused) {
      // this.notifier.hideAll();
      // this.notifier.notify('warning', 'Please select the position');
    }
    if (event.type == 'refresh') {
      this.input = event.html;
      this.hyperLink = null;
    }
    this.cdr.detectChanges();
    // console.log(this.input)
  }
  alignRefObj(html: any): any {
    let obj = [];
    let currentIndex = 0;
    let string = '';
    while (currentIndex <= html.length) {
      let foundIndex = html.indexOf('hyperlink popup', currentIndex);
      let idIndex = html.indexOf('id="', currentIndex);
      let Id = html.substring(idIndex, idIndex + 8);
      string = string + html.substring(currentIndex, foundIndex);
      let startIndex = html.indexOf('</a>', currentIndex);
    }
    return "";
  }
  getHyperLinkString(hlData: any): any {
    let hyperLink = '<a href="javascript:void(0);" class="hyperlink" data="refObj" (click)="fetchRefObj(refObj)">' + hlData.title + '</a>'
    this.hlData.data?.dgc_reference_object_detail?.equipmentid
    const data = {
      //  equipmentid:hlData.data.DGC_REFERENCE_OBJECT_DETAIL?.equipmentId,
      dgc_reference_object_key: hlData.data.DGC_REFERENCE_OBJECT_KEY,
      reference_object_code: hlData.data.DGC_REFERENCE_OBJECT_CODE
      // title: hlData.title,
      // link: hlData.link
    };
    hyperLink = hyperLink.replace(/refObj/g, JSON.stringify(data));
    //hyperLink = hyperLink.split(',').join(JSON.stringify(data))

    return hyperLink;
  }
  hlData: any;
  onLinkDrop(e: any, item: any, i: any) {
    this.hyperLink = null;
    this.createHyperLink(e ? e.dragData : null);
    this.cdr.detectChanges();
  }

  setObjectValue(stepObject: any) {
    this.stepObjectChange.emit(stepObject)
  }

  focusEvent() {
    this.focusEventCheck.emit();
  }
}
