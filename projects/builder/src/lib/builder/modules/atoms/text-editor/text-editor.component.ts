import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { DgTypes } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { StylesService } from '../../../shared/services/styles.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html'
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() input: any;
  @Input() item: any;
  @Input() index: any;
  @Input() readonlyV: any;
  @Input() editorStylObj: any;
  @Input() selectedElement: any = null;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() editorClose = new EventEmitter<any>();
  DgTypes: typeof DgTypes = DgTypes;
  originalInput: any;
  htmlContent = '';
  toolbarHiddenButtons = [
    ['heading'],
    [
      'customClasses',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'toggleEditorMode'
    ]
  ];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'montserrat', name: 'Montserrat' },
      { class: 'Light 400', name: 'Poppins' },
      { class: 'time-new-roman', name: 'Time New Roman' },
      { class: 'Courier New', name: 'Courier New' }
    ],
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: this.toolbarHiddenButtons,
    customClasses: [
      {
        name: "Custom1",
        class: "Custom1",
      },
    ]
  };
  updateView!: boolean;
  updatedValue = false
  configOld: any;
  @Input() styleUpdated = false;
  hyperLink: any;
  constructor(public cbpService: CbpService, private cdr: ChangeDetectorRef, public controlService: ControlService,
    private styleService: StylesService, private hLService: HyperLinkService, public notifier: NotifierService
    , public auditService: AuditService, public _buildUtil: BuilderUtil) { }

  ngOnInit() {
    this.configOld = JSON.stringify(this.config);
    this.setStyles();
  }
  ngDoCheck(): void {
    if (this.cbpService.styleTextEditorUpdated) {
      this.setStyles();
      this.cbpService.styleTextEditorUpdated = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes['input'] && changes['input'].firstChange) {
        this.originalInput = changes['input'].currentValue;  // Store the first received value
      }
    }
  }

  ngAfterViewInit(): void {
    this.config = JSON.parse(JSON.stringify(this.config));
    if (this.input?.trim() != '') {
      this.originalInput = this.input;
    }
    if (this.input && !this.controlService.isHTMLText(this.input)) {
      this.input = `<font size="${this.config.defaultFontSize}" face="${this.config.defaultFontName}">${this.input}</font>`;
    }
    this.updateView = true;
    this.cdr.detectChanges();
  }
  setStyles() {
    let styles: any;
    if (this.cbpService.checkDataEntryDgTypes(this.item) || this.item.dgType == DgTypes.Para ||
      this.item.dgType == DgTypes.LabelDataEntry) {
      styles = this.styleService.setStyles(this.cbpService.styleModel['levelNormal']);
    } else if (this.item.dgType == 'Warning' || this.item.dgType == 'Caution' || this.item.dgType == 'Note' || this.item.dgType == 'Alara') {
      styles = this.styleService.setStyles(this.cbpService.styleModel['level' + this.item.dgType]);
    }
    if (styles) {
      if (styles['font-family']) {
        this.config.defaultFontName = styles['font-family'] == "TimeNewRoman" ? 'Time New Roman' : styles['font-family'];
      } else {
        this.config.defaultFontName = 'Poppins';
      }
      if (styles['font-size']) {
        let styleFont = this.styleService.getSizeStyles(styles['font-size']);
        this.config.defaultFontSize = styleFont;
      }
    } else if (this.editorStylObj) {
      this.config.defaultFontSize = this.editorStylObj['fontsize'];
      this.config.defaultFontName = this.editorStylObj['fontfamily'];
    } else {
      this.config.defaultFontSize = '2';
      this.config.defaultFontName = 'Poppins';
    }
    this.config.foreColor = '#000000';
    this.updateView = false;
    setTimeout(() => { this.updateView = true; }, 1);
  }

  ngOnDestroy(): void {
    if (this.item) {
      if (this.item.dgType == DgTypes.Para) {
        this.newItemEvent.emit(this.input);
      } else if (this.item.dgType != DgTypes.Caution && this.item.dgType != DgTypes.Warning) {
        this.item['editorOpened'] = false;
      } else {
        this.item['editorCauseOpened'] = false;
        this.item['editorEffectOpened'] = false;
      }
    }
  }

  createHyperLink(event: any) {
    if (this.hLService.hlData) {
      this.hyperLink = {
        dgc_reference_object_key: this.hLService.hlData.data.DGC_REFERENCE_OBJECT_KEY,
        reference_object_code: this.hLService.hlData.data.DGC_REFERENCE_OBJECT_CODE,
        title: this.hLService.hlData.title,
      }
      // if(!this.item['robj']){
      //   this.item['robj'] = []
      // }
      // this.item['robj'].push(
      //    {
      //       dgc_reference_object_key:this.hLService.hlData.data.DGC_REFERENCE_OBJECT_KEY,
      //       reference_object_code: this.hLService.hlData.data.DGC_REFERENCE_OBJECT_CODE,
      //       title: this.hLService.hlData.title,
      //     })
    }
    this.cdr.detectChanges();
    return;
    // const position = event.position;
    // if(!this.input){
    //   this.input = '';
    // }
    // this.input = this.input.replace(/&#160;/g, ' ');
    // if(this.hLService.hlData){
    //   const hyperLink = this.getHyperLinkString(this.hLService.hlData)
    //   if(!event.isFocused && position == 0) {
    //     this.input =   this.input + hyperLink ;
    //   } else {
    //     this.input = this.input.substring(0, position+1) + hyperLink + this.input.substring(position+1);
    //   }
    //   if(!this.item['robj']){
    //     this.item['robj'] = []
    //   }
    //   this.item['robj'].push(
    //      {
    //         dgc_reference_object_key:this.hLService.hlData.data.DGC_REFERENCE_OBJECT_KEY,
    //         reference_object_code: this.hLService.hlData.data.DGC_REFERENCE_OBJECT_CODE,
    //         title: this.hLService.hlData.title,
    //       }
    //   )
    //   setTimeout(() => {}, 1);
    // }
    // this.input = this.input.replace(/&#160;/g, ' ').replace(/nbsp;/g, ' ').replace(/&/g, ' ');
    // console.log(this.input)
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
    this.hLService.hlData.data?.dgc_reference_object_detail?.equipmentid
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
  checkChange(event: any) {

  }

  emithtml(evnt: any) {
    this.updatedValue = true;
    //this.newItemEvent.emit(this.input);
    //this.close.emit(event.target.innerHTML);
  }

  closeEvent(event: any) {
    if (this.config != JSON.parse(this.configOld) || this.updatedValue) {
      let value: any;
      if (!this._buildUtil.isHTMLText(this.originalInput)) {
        value = `<font size="${this.config.defaultFontSize}" face="${this.config.defaultFontName}">${this.originalInput}</font>`;
        if (JSON.parse(JSON.stringify(value)) !== event) {
          this.close.emit(event);
        }
      } else if (JSON.parse(JSON.stringify(this.originalInput)) != event) {
        this.close.emit(event);
      }
    }
    if (this.selectedElement && this.selectedElement?.dgType == DgTypes.Para) {
      this.close.emit(event);
    }

  }

  setField(event: any) {
    //this.cbpService.selectedElement= event;
    // console.log(event);
    let element;
    let propName = '';
    if (event.dgUniqueID != 0) {
      element = this._buildUtil.getElementByDgUniqueID(event.dgUniqueID, this.cbpService.cbpJson.section);
    }
    if (element && (element.dgType === DgTypes.StepAction ||
      element.dgType === DgTypes.DelayStep ||
      element.dgType === DgTypes.Timed ||
      element.dgType === DgTypes.Repeat)
    ) {
      propName = 'action'
    } else if (element) {
      propName = 'prompt'
    }
    let text = event[propName] ? event[propName].slice(0, 25) : '';
    element.title = event[propName];
    element.text = element.number + ' ' + text + (text.length > 25 ? '...' : '');
    element[propName] = event[propName];
    let newText = this._buildUtil.setIconAndText(element);
    let obj = { text: newText.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
    this.cbpService.headerItem = obj;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.PROMPT);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  setValue(event: any) {
    //this.field.prompt = event.target.value;
  }
  closeEditor(event: any) {
    this.editorClose.emit(event);
    // console.log(event);
  }

}
