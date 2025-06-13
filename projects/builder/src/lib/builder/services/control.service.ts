import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DgTypes, ImagePath } from 'cbp-shared';
import { BehaviorSubject } from 'rxjs';
import { Control } from '../models';
import { CbpService } from './cbp.service';
import { SequenceTypes } from 'cbp-shared';
@Injectable({ providedIn: 'root' })
export class ControlService {
  constructor(public http: HttpClient, public cbpService: CbpService) {

  }
  dropdownClass = "dropdown-item pointer";
  dragCss = "btn btn-primary btn-sm btn-block formcomponent drag-copy";
  iconClass = "fa fa-arrows rightflower";
  collapseCss = "btn btn-block builder-group-button collapsed";
  navigationCss = "btn btn-icon btn-outline-secondary btn-sm buttns";
  controlCss = "card-header form-builder-group-header";
  cbp_track_changes: any;
  sequenceTypesNew = SequenceTypes;
  basicEntries: Control[] = [
    { type: DgTypes.Section, name: 'Section', icon: 'font', showDropDown: true },
    { type: DgTypes.Section, name: 'Sub Section', icon: 'font', showDropDown: true },
    { type: DgTypes.StepAction, name: 'Step Action', icon: 'hand-o-down', showDropDown: true },
    { type: DgTypes.StepInfo, name: 'StepInfo', icon: 'info', showDropDown: true },
    { type: DgTypes.DelayStep, name: 'Delay Step', icon: 'clock-o', showDropDown: false },
    { type: DgTypes.Timed, name: 'Timed Step', icon: 'hourglass-o', showDropDown: false },
    { type: DgTypes.Repeat, name: 'Repeat Step', icon: 'repeat', showDropDown: false },
    { type: DgTypes.DualAction, name: 'Dual Step', icon: 'hand-o-down', showDropDown: true },
    { type: DgTypes.Procedure, name: 'Procedure Snippet', icon: 'paste', showDropDown: false },
  ];
  attributesList: Control[] = [

  ]

  dataEntries: Control[] = [
    { type: DgTypes.TextDataEntry, name: 'Text', icon: 'font', image: ImagePath.topText },
    { type: DgTypes.TextAreaDataEntry, name: 'TextArea', icon: 'text-width' },
    { type: DgTypes.NumericDataEntry, name: 'Number', icon: 'sort-numeric-desc', image: ImagePath.topNumber },
    { type: DgTypes.DateDataEntry, name: 'Date', icon: 'calendar', image: ImagePath.topDate },
    { type: DgTypes.BooleanDataEntry, name: 'Boolean', icon: 'toggle-on' },
    { type: DgTypes.CheckboxDataEntry, name: 'Check Box', icon: 'check-square' },
    { type: DgTypes.DropDataEntry, name: 'Drop Down', icon: 'caret-square-o-down' },
    { type: DgTypes.Table, name: 'Table', icon: 'table' }
  ];

  basicDataEntries: Control[] = [
    { type: DgTypes.Warning, name: 'Warning', icon: 'alert', image: ImagePath.topIconWarning },
    { type: DgTypes.Caution, name: 'Caution', icon: 'alert', image: ImagePath.topIconCaution },
    { type: DgTypes.Note, name: 'Note', icon: 'alert', image: ImagePath.topIconNote },
    { type: DgTypes.Alara, name: 'Alara', icon: 'alert', image: ImagePath.topIconAlara },
    { type: DgTypes.LabelDataEntry, name: 'Label', icon: 'tag' },
    { type: DgTypes.Para, name: 'Paragraph', icon: 'paragraph', image: ImagePath.topIconPara },
    { type: DgTypes.FormulaDataEntry, name: 'Formula', icon: 'text-width' }
  ];
  bulletLists: Control[] = [
    { type: this.sequenceTypesNew.BULLETS, name: 'BULLETS', icon: '&#9679;' },
    { type: this.sequenceTypesNew.STAR, name: 'STAR', icon: '&#10038;' },
    { type: this.sequenceTypesNew.CIRCLE, name: 'CIRCLE', icon: '&#9675;' },
    { type: this.sequenceTypesNew.SQUARE, name: 'SQUARE', icon: '&#11035;' },
    { type: this.sequenceTypesNew.CHECKMARK, name: 'CHECKMARK', icon: '&#10003;' },
    { type: this.sequenceTypesNew.ARROW, name: 'ARROW', icon: '&#10148;' },
  ];

  basicDataEntriesBackPara: Control[] = [
    { type: DgTypes.Para, name: 'Paragraph', icon: 'paragraph', image: ImagePath.topIconPara }
  ];
  referenceList: Control[] = [
    { type: DgTypes.Figures, name: 'Media Gallery', icon: 'medium' },
    { type: DgTypes.SingleFigure, name: 'Media Single', icon: 'medium' },
    { type: DgTypes.Link, name: 'Link', icon: 'link' }
  ];
  verificationList: Control[] = [
    { type: DgTypes.Independent, name: 'Independent', icon: 'flag' },
    { type: DgTypes.Concurrent, name: 'Concurrent', icon: 'copy' },
    { type: DgTypes.QA, name: 'QA', icon: 'pie-chart' },
    { type: DgTypes.Peer, name: 'Peer', icon: 'exchange' },
    { type: DgTypes.SignatureDataEntry, name: 'Signature', icon: 'pencil' },
    { type: DgTypes.InitialDataEntry, name: 'Initial', icon: 'dot-circle-o' }
  ];
  advanceList: Control[] = [
    // { type: DgTypes.ButtonIconDataEntry, name: 'Button', icon: 'stop' },
    // { type: DgTypes.RadioDataEntry, name: 'Radio', icon: 'dot-circle-o' },
    { type: DgTypes.LabelDataEntry, name: 'QRCode', icon: 'qrcode' },
    // { type: DgTypes.EmailDataEntry, name: 'Email', icon: 'at' },
    // { type: DgTypes.phoneDataEntry, name: 'Phone Number', icon: 'phone-square' },
    // { type: DgTypes.Address, name: 'Address', icon: 'home' },
    // { type: DgTypes.Location, name: 'Location', icon: 'location-arrow' },
    // { type: DgTypes.CurrencyDataEntry, name: 'Currency', icon: 'usd' },
    // { type: DgTypes.Toggle, name: 'Toggle', icon: 'toggle-on' }
  ];

  docProperties: Control[] = [
    { type: 'showNavigation', name: 'Navigation', icon: '' },
    { type: 'showProperty', name: 'Property', icon: '' },
    { type: 'sectionHover', name: 'Section/Step Option', icon: '' },
    { type: 'fullscreen', name: 'Full Screen', icon: '' },
    { type: 'showUpdates', name: 'Show Updates', icon: '' }
  ];

  treeNavigationEntries: Control[] = [
    { type: DgTypes.Header, name: 'Header', icon: 'font' },
    { type: DgTypes.Footer, name: 'Footer', icon: 'font' },
    { type: DgTypes.WaterMark, name: 'WaterMark', icon: 'font' }
  ];

  rules: Control[] = [
    { type: 'isApplicabiltyOpen', name: 'Applicability', icon: 'font' },
    { type: 'isRulesOpen', name: 'Conditional', icon: 'font' },
    { type: 'isAlaramOpen', name: 'Alarm', icon: 'font' }
  ];

  bulletlist = [
    { type: 'isApplicabiltyOpen', name: 'Applicability', icon: 'font' }
  ];

  icons = [
    { dgType: DgTypes.StepAction, style: 'fa fa-hand-o-down' },
    { dgType: DgTypes.StepInfo, style: 'fa fa-info' },
    { dgType: DgTypes.DelayStep, style: 'fa fa-clock-o' },
    { dgType: DgTypes.Timed, style: 'fa fa-hourglass-o' },
    { dgType: DgTypes.Repeat, style: 'fa fa-repeat' }
  ];

  topIconsList = [this.basicDataEntries[5], this.dataEntries[0], this.dataEntries[2], this.dataEntries[3]]
  topIconsBackList = [this.basicDataEntriesBackPara[0]]

  private styleModelobj = new BehaviorSubject<any>({});
  styleModelobjValue = this.styleModelobj.asObservable();
  setStyleModelItem(obj: any) {
    this.styleModelobj.next(obj);
  }

  private selectedObj = new BehaviorSubject<any>({});
  selectedObjValue = this.selectedObj.asObservable();
  setSelectItem(obj: any) {
    this.selectedObj.next(obj);
  }
  private changetemp = new BehaviorSubject<any>({});
  changeTempObj = this.changetemp.asObservable();
  setTemplate(obj: any, obj1: any) {
    const objectsend = { value: obj, data: obj1 }
    this.changetemp.next(objectsend);
  }
  private coverPageView = new BehaviorSubject<any>({});
  coverPageViewVal = this.coverPageView.asObservable();
  setViewVal(val: boolean) {
    this.coverPageView.next(val);
  }
  private layoutupdate = new BehaviorSubject<any>({});
  layoutupdateValue = this.layoutupdate.asObservable();
  setlayoutItem(obj: any) {
    this.layoutupdate.next(obj);
  }
  private detectAllChange = new BehaviorSubject<any>({});
  detectAllChangeView$ = this.detectAllChange.asObservable();
  detectAllView(obj: any) {
    this.detectAllChange.next(obj);
  }

  private hideTrackUiChange = new BehaviorSubject<any>({});
  hideTrackUiChangeView$ = this.hideTrackUiChange.asObservable();
  hideTrackUi(obj: any) {
    this.hideTrackUiChange.next(obj);
  }

  private mediaUpdate = new BehaviorSubject<any>({});
  mediaUpdateValue = this.mediaUpdate.asObservable();
  setMediaItem(obj: any) {
    this.mediaUpdate.next(obj);
  }

  isEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
  }

  isHTMLText(text: any): boolean {
    if (text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }

  setStyles(styleValue: any) {
    return {
      'font-family': styleValue.fontName ? styleValue.fontName : '',
      'font-weight': styleValue.fontWeight ? styleValue.fontWeight : '500',
      'font-size': styleValue.fontSize ? styleValue.fontSize : '12px',
      'font-style': styleValue.fontStyle ? styleValue.fontStyle : 'unset',
      'line-height': styleValue.lineHeight ? styleValue.lineHeight : 'unset',
      'color': styleValue.color ? styleValue.color : '#555',
      'background-color': styleValue.backgroundColor ? styleValue.backgroundColor : 'transparent',
      'text-align': styleValue.textAlign ? styleValue.textAlign : 'unset',
      'text-decoration': styleValue.textDecoration ? styleValue.textDecoration : 'unset'
    };
  }

  isMessageField(dgType: any) {
    return (dgType === DgTypes.Warning || dgType === DgTypes.Caution || dgType === DgTypes.Note || dgType === DgTypes.Alara) ? true : false;
  }
  isDataEntry(obj: any) {
    if (obj.dgType === DgTypes.TextDataEntry || obj.dgType === DgTypes.TextAreaDataEntry || obj.dgType === DgTypes.FormulaDataEntry
      || obj.dgType === DgTypes.NumericDataEntry || obj.dgType === DgTypes.Table || obj.dgType === DgTypes.CheckboxDataEntry
      || obj.dgType === DgTypes.DateDataEntry || obj.dgType === DgTypes.BooleanDataEntry || obj.dgType === DgTypes.DropDataEntry) {
      return true;
    }
    return false;
  }
  isBulletSteps(obj:any){
    if(obj.originalSequenceType== SequenceTypes.BULLETS || obj.originalSequenceType== SequenceTypes.STAR || 
      obj.originalSequenceType== SequenceTypes.CIRCLE || obj.originalSequenceType== SequenceTypes.SQUARE ||
      obj.originalSequenceType== SequenceTypes.ARROW || obj.originalSequenceType== SequenceTypes.CHECKMARK) {
     return true;
    }else{
     return false;
    }
  }
  isLabelPara(dgType: any) {
    return (dgType === DgTypes.Para || dgType === DgTypes.LabelDataEntry) ? true : false;
  }
  isDataEntryAccept(obj: any) {
    return (obj.dgType === DgTypes.StepAction || obj.dgType === DgTypes.Repeat || obj.dgType === DgTypes.Timed);
  }
  isVerificationEntry(dgType: any) {
    return (dgType === DgTypes.VerificationDataEntry || dgType === DgTypes.SignatureDataEntry || dgType === DgTypes.InitialDataEntry ||
      dgType === DgTypes.Link || dgType === DgTypes.Figures || dgType === DgTypes.Figure) ? true : false;
  }
  checkStepSection(selectedElement: any) {
    if (selectedElement.dgType !== DgTypes.Section
      && selectedElement.dgType !== DgTypes.StepAction
      && selectedElement.dgType !== DgTypes.StepInfo
      && selectedElement.dgType !== DgTypes.DelayStep
      && selectedElement.dgType !== DgTypes.Timed
      && selectedElement.dgType !== DgTypes.Repeat) {
      return false
    }
    return true;
  }
  setDualStep(selectedObj: any, childObj: any) {
    if (selectedObj?.dualStep) {
      childObj['dualStep'] = true;
    }
    if (selectedObj?.rightdual || selectedObj['rightdualchild']) {
      childObj['rightdualchild'] = true;
    }
    if (selectedObj?.leftdual || selectedObj['leftdualchild']) {
      childObj['leftdualchild'] = true;
    }
    if (selectedObj?.dualStepType) {
      childObj['dualStepType'] = selectedObj.dualStepType;
    }
    childObj['parentDgUniqueID'] = selectedObj.dgUniqueID;
    return childObj;
  }
  getTrackChanges(documentId: any, dgUniqueID: any) {
    const url = this.cbpService.clientUrl + '/dg-common/getEditorTrackingChanges?companyID=' + this.cbpService.companyId +
      '&loggedInUserID=' + this.cbpService.loggedInUserId + '&documentID=' + documentId + '&dynamicObjectId=' + dgUniqueID + '&sort';
    return this.http.get(url, this.formData());
  }
  formData() {
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.cbpService.accessToken) };
  }

  checkDataValidation(stepObject: any) {
    return ((stepObject?.dgType == DgTypes.TextDataEntry) ||
      (stepObject?.dgType == DgTypes.TextAreaDataEntry) ||
      (stepObject?.dgType == DgTypes.NumericDataEntry) ||
      (stepObject?.dgType == DgTypes.DateDataEntry) ||
      (stepObject?.dgType == DgTypes.BooleanDataEntry) ||
      (stepObject?.dgType == DgTypes.CheckboxDataEntry) ||
      (stepObject?.dgType == DgTypes.DropDownDataEntry)
    ) ? true : false;
  }
}

