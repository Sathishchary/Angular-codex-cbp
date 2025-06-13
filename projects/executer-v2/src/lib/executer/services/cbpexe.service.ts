import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { CbpSharedService, DgTypes, SequenceTypes } from 'cbp-shared';
import { BehaviorSubject } from 'rxjs';
import { ActionId, Initial, StepTypes } from '../models';
import { DynamicSectionInfo } from '../models/dynamicSectionInfo';
import { ProtectJson } from '../models/protectJson';
import { ProtectObject } from '../models/protectObject';
import { SharedviewService } from './sharedview.service';
declare var swal: any;

export class Utills {
  static isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }
}

@Injectable()
export class CbpExeService {
  executionClicked = false;
  isSelectUpdateNode = false;
  refreshTreeNav = false;
  isBuild = true;
  documentSelected = true;
  nodes: any = [];
  dgUniqueIDNode = 1;
  currentSelectedNumber: any;
  isDocumentUploaded = false;
  isBackFromRead = false;
  loading = false;
  isFromBuild = false;
  map: any;
  selectedChildNode: any;
  parentModule = '';
  loggedInUserId: any = '';
  isEdocument = false;
  documentFile: any;
  documentInfotitle: any;
  docInfo: any;
  isReadOnlyFromEdocument = false;
  defaultStylesJson: any;
  reloadTheWaterMark = false;
  emailId!: string;
  defaultStyleImageStyle: any;
  mediaFile: any;
  imageUrlShow = false;
  cbpupdated = false;
  mediaViewLoader = false;
  styleUpdated = false;
  documentID!: string | null;
  styleModel: any;
  mediaBuilderObjects: any = [];
  mediaExecutorObjects: any[] = [];

  maxDgUniqueId: number = 0;
  //Mobile Changes
  activeComponent: string = '';
  selectedElement: any;
  selectedUniqueId: any;

  paginateIndex = 1;
  selectedElementObj: any;
  // cbpJson: any;
  cbpJsonZip: any;
  media: any[] = [];
  stepActionArray: any[] = [];
  stepSequentialArray: any = [];
  styleImageJson: any;
  currentStep: any;
  selectedTable: any;
  selectedRowObj: any;
  copiedElement: any = [];
  updateInnerHtml: boolean = false;
  loadedCurrentStep = false;
  notiferShow: boolean = false;
  messageObj!: { type: string; mesg: string; };
  selectedStepObject: any;
  updatedDateTime: any;
  commentsEnabled = true;
  defaultSection!: any;
  documentInfo: any;
  lastSessionUniqueId: number = 0;
  monitorExecution = false;
  errorDgType!: DgTypes;
  displayMsg = '';
  showErrorPopup = false;
  stepTypes = StepTypes;
  selectedFieldID: any;
  forFooterHeight = false;
  sideMenuInfo = [
    { type: this.stepTypes.InProgressStep },
    { type: this.stepTypes.NotApplicableStep },
    { type: this.stepTypes.HoldStep },
    { type: this.stepTypes.SkipStep },
    { type: this.stepTypes.CompleteStep }
  ];
  sectionSideMenuInfo = [
    { type: this.stepTypes.NotApplicableStep },
    { type: this.stepTypes.SkipStep },
    { type: this.stepTypes.Option },
    { type: this.stepTypes.ProtectData },
    { type: this.stepTypes.UnProtectData },
  ];
  dualSteps: any[] = [];
  windowWidth: any;
  dynmaicDocument: boolean = false;
  dataJson: any = { dataObjects: [] };
  protectJson: any = new ProtectJson().init();
  dataJsonTxnIDS: [{ dataJsonTxnId: any, signatureJsonTxnId: any }] = [{ dataJsonTxnId: 0, signatureJsonTxnId: 0 }];
  copySelectedDataEntry: any;
  refTabOpen = false;
  refresh: boolean = true;
  selectCellEnabled = false;
  checkedFirst: any = false;
  checkedDefault: any = false;
  checkedLast: any = true;
  tabletCheck = false;
  uniqueIdIndex = 1;
  showUpdates: any;
  primaryDocument = false;
  isBackGroundDocument = false;
  reverseTempMapUniqueID = new Map();
  tempMapUniqueID = new Map();
  @Output() stickyNoteChange: EventEmitter<any> = new EventEmitter();
  @Output() mediaEditChange: EventEmitter<any> = new EventEmitter();
  @Output() protectAllFields: EventEmitter<any> = new EventEmitter();

  annotationObj: { obj: any, text: string, type: string } = { obj: {}, text: '', type: '' };

  //PAGINATION
  startIndex: number = 1;
  pageSize: number = 30;
  activePage: number = 1;
  maxPage: number = 1;
  scrollState: number = 1;
  mainFontFamily = 'Poppins';
  enableAnnotation = false;
  coverPageSelected = false;

  isChanged = false;
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  storeColors: any[] = [];
  codeValues: any[] = [];
  clearSignObject: any[] = [];
  dynamicSectionInfo = new DynamicSectionInfo();

  paraList: any[] = [];
  signatureFieldItem: string = '';
  isDisabledAllInputEntries = false;
  disableAutoStep: any = false;
  selectedTimerRepeatStep: any;
  constructor(public http: HttpClient, public sanitizer: DomSanitizer, public notifier: NotifierService,
    private sharedviewService: SharedviewService, public cbpSharedService: CbpSharedService) {
  }

  setStickyChange(event: any) {
    this.stickyNoteChange.emit(event);
  }

  mediaEditChangeUpdate(event: any) {
    this.mediaEditChange.emit(event);
  }
  private enableAnnotationValid = new BehaviorSubject<any>({});
  enableAnnotationSubscription = this.enableAnnotationValid.asObservable();
  setAnnotation(obj: any) {
    this.enableAnnotationValid.next(obj);
  }
  public showSwal(title: any, type: any, confirmBtntxt: any): Promise<any> {
    return swal.fire({
      title: title,
      type: type,
      customClass: 'swal-wide swal-height',
      showCancelButton: true,
      confirmButtonText: confirmBtntxt,
    });
  }
  public showCustomSwal(title: any, type: any, cancelButtonText: any, confirmBtntxt: any): Promise<any> {
    return swal.fire({
      title: title,
      type: type,
      customClass: 'swal-wide swal-height',
      showCancelButton: true,
      cancelButtonText: cancelButtonText,
      confirmButtonText: confirmBtntxt,
    });
  }

  public showMoreButtonsSwal(title: any, type: any, confirmBtntxt: any, notConfirmText: any, cancelButtonText: any): Promise<any> {
    return swal.fire({
      title: title,
      type: type,
      customClass: 'swal-wide swal-height',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: cancelButtonText,
      confirmButtonText: confirmBtntxt,
      denyButtonText: notConfirmText,
    });
  }

  public showSwalDeactive(title: any, type: any, confirmBtntxt: any): Promise<any> {
    return swal.fire({
      title: title,
      type: type,
      customClass: 'swal-wide swal-height',
      showCancelButton: false,
      confirmButtonText: confirmBtntxt,
    });
  }

  errorHandler(event: any) {
    event.target.src = 'assets/images/cbp-logo.png';
  }

  refreshNodes(cbpJson: any, disabledNumber: any, isDynamicSteNodes: any = null) {
    cbpJson.section.forEach((item: any) => { this.setNodes(item, null, 0, disabledNumber, null, isDynamicSteNodes); });
    this.refreshTreeNav = !this.refreshTreeNav;
    return cbpJson;
  }
  refreshCurrentNodes(cbpJson: any, disabledNumber: any) {
    cbpJson.section.forEach((item: any) => { this.setNodes(item, null, 0, disabledNumber); });
    this.refreshTreeNav = !this.refreshTreeNav;
    return cbpJson;
  }

  setNodes(data: any, parentID: any = null, level = 0, disabledNumber: any, parentDgUniqueID = null, isDynamicSteNodes: any = null) {
    data['level'] = level;
    if (data?.number) {
      if (data.dgType === DgTypes.Section) {
        if (data['hide_section'] && this.dynmaicDocument == true) { data['state'] = { hidden: true }; } else {
          data['state'] = { hidden: false };
        }
      } else if (data.dgType === DgTypes.StepInfo) {
      } else {
        if (data.dgType === DgTypes.StepAction) {
          if (!data.properties) {
            data['properties'] = {
              type: 'step',
              stepType: 'Simple Action'
            };
          }
        }
      }
      if (data.dgType === DgTypes.DualAction) {
        this.dualSteps.push({ id: data.dgUniqueID, added: false });
        data['isEmbededObject'] = false;
        data['id'] = data.dgUniqueID;
        data['parentID'] = parentID;
        if (data.originalSequenceType !== SequenceTypes.DGSEQUENCES) {
          data['state'] = { hidden: true };
        }
        data.children.forEach((item: any) => this.setNodes(item, data.dgSequenceNumber, level + 1, disabledNumber, null, isDynamicSteNodes));
        if (data.rightDualChildren.length > 0) {
          data.rightDualChildren.forEach((item: any) => this.setNodes(item, data.dgSequenceNumber, level + 1, disabledNumber, null, isDynamicSteNodes));
        }
      }
      if (this.checkAllSteps(data)) {
        if (data?.stickyNote) {
          if (!data?.stickyNote['selectedStepDgUniqueID']) {
            data.stickyNote['selectedStepDgUniqueID'] = data?.stickyNote['dgUniqueID'] ? data?.stickyNote['dgUniqueID'] : data.dgUniqueID;
            delete data?.stickyNote['dgUniqueID'];
          }
        }
      }
      this.buildSequenceType(data);
      this.setIndexDisplayState(data, disabledNumber);
      data['id'] = data.dgUniqueID;
      data['parentID'] = parentID;
      data['parentDgUniqueID'] = parentDgUniqueID;
      data['ctrlKey'] = false;
      if (data.embeddedSection) {
        data.dyTpe = DgTypes.Section;
        data['isEmbededObject'] = true;
        this.setEmbededData(data.children, data, 0, false);
      } else if (data.children && Array.isArray(data.children)) {
        data['isEmbededObject'] = false;
        data.children.forEach((item: any) => this.setNodes(item, data.dgSequenceNumber, level + 1, disabledNumber, data.dgUniqueID, isDynamicSteNodes));
      }
    } else {
      data['parentID'] = parentID;
      if (this.isDataEtry(data)) {
        this.storeTempMapID(data?.fieldName, data);
        if (data?.valueType == 'Derived' && isDynamicSteNodes == null) {
          if (this.reverseTempMapUniqueID?.size !== this.tempMapUniqueID?.size) {
            this.tempMapUniqueID.forEach((value, key) => this.reverseTempMapUniqueID.set(value?.toString(), key));
          }
          data['ParsedValue'] = this.validateDerivedRuleWithDgUniqueIDs(data, this.reverseTempMapUniqueID);
        }
      }
      if (data.dgType === DgTypes.TextDataEntry) {
        if (data.choice) {
          if (data.choice.length > 0) {
            data['dataType'] = 'Dropdown';
          } else {
            data['dataType'] = 'Text';
          }
        }
      }
      data['state'] = { hidden: true }
      data['isEmbededObject'] = false;
    }
    if (this.maxDgUniqueId < Number(data?.dgUniqueID)) {
      this.maxDgUniqueId = Number(data?.dgUniqueID);
    }
  }
  setIndexDisplayState(obj: any, disabledNumber: any) {
    let isHideStep = false;
    if (obj?.number && !(Array.isArray(obj?.number))) {
      if (!obj?.number.endsWith('.') && Utills.isNumber(obj?.number.replace(/\./g, ''))) {
        obj['state'] = { hidden: false };
      } else if (obj?.number.endsWith('.') && Utills.isNumber(obj?.number.replace(/\./g, ''))) {
        obj['number'] = obj.number.slice(0, -1);
        if (!obj['number'].includes('.')) {
          obj['number'] = obj['number'] + '.0';
        }
        obj['state'] = { hidden: false };
      } else if (obj?.dataType === SequenceTypes.Attachment || obj?.childSequenceType === SequenceTypes.Attachment ||
        obj?.aType === SequenceTypes.Attachment) {
        if (obj?.originalSequenceType == SequenceTypes.BULLETS || obj?.originalSequenceType == SequenceTypes.STAR ||
          obj?.originalSequenceType == SequenceTypes.CIRCLE || obj?.originalSequenceType == SequenceTypes.SQUARE ||
          obj?.originalSequenceType == SequenceTypes.ARROW || obj?.originalSequenceType == SequenceTypes.CHECKMARK
        ) {
          obj['state'] = { hidden: true };
          isHideStep = true;
        } else {
          obj['state'] = { hidden: false };
        }
      } else if (obj?.originalSequenceType === SequenceTypes.NUMERIC ||
        obj?.originalSequenceType === SequenceTypes.ALPHABETICAL ||
        obj?.originalSequenceType === SequenceTypes.CAPITALALPHABETICAL
        || obj?.originalSequenceType === SequenceTypes.ROMAN ||
        obj?.originalSequenceType === SequenceTypes.ROMAN ||
        obj?.originalSequenceType === SequenceTypes.CAPITALROMAN
      ) {
        obj['state'] = { hidden: false };
      } else {
        obj['state'] = { hidden: true };
        isHideStep = true;
      }
      if (obj['hide_section'] && (obj.dgType === DgTypes.Section || obj.dgType === DgTypes.StepAction || obj.dgType === DgTypes.Timed || obj.dgType === DgTypes.Repeat) && this.dynmaicDocument === true) {
        obj['state'] = { hidden: true };
      } else {
        if (!isHideStep) {
          obj['state'] = { hidden: false };
        }
      }
    }
    this.setIconAndText(obj, disabledNumber)
  }
  setIconAndText(obj: any, disabledNumber: any) {
    let text = obj?.action !== undefined ? obj.action : obj.title;
    text = this.removeHTMLTags(text);
    //   const value:number = this.getWindowWidthChanges();
    obj['text'] = obj?.number + ' ' + ((text !== undefined && text !== null) ? text.slice(0, 40) + (text.length > 40 ? '...' : '') : '');
    if (obj?.dataType === SequenceTypes.Attachment || obj?.childSequenceType === SequenceTypes.Attachment || obj?.aType === SequenceTypes.Attachment) {
      const maxLength = 40;
      obj['text'] = obj['text'].slice(0, obj.number.length + maxLength) + '...';
    }
    if (obj.isCritical) {
      obj["text"] = [obj["text"].slice(0, obj?.number.length), ' <i class="fa fa-exclamation iscritical"></i>', obj["text"].slice(obj?.number.length)].join('');
    }
    if ((obj.applicabilityRule && obj.applicabilityRule.length > 0) || (obj.rule && obj.rule.length > 0)) {
      obj["text"] = [obj["text"].slice(0, obj?.number.length), ' <i class="fa fa-cog rule-css"></i>', obj["text"].slice(obj?.number.length)].join('');
    }
    if (Array.isArray(disabledNumber)) {
      if (disabledNumber[0].disableNumber) {
        obj['text'] = obj['text'].slice(obj.number.length);
      }
    }
    return obj["text"];
  }
  //   getWindowWidthChanges(){
  //     this.windowWidth = this.windowWidth ?? window.innerWidth;
  //     if(this.windowWidth>1130 && this.windowWidth< 1430){ return 25; } //110%
  //     if(this.windowWidth>1430 && this.windowWidth< 1700){ return 30;} // 100%
  //     if(this.windowWidth>1700 && this.windowWidth<1800){ return 40; } //90
  //     if(this.windowWidth>1800 && this.windowWidth<2000){ return 45; } //80
  //     if(this.windowWidth>2000 && this.windowWidth<2220){ return 47; } // 75%
  //     if(this.windowWidth>2220 && this.windowWidth<2600){ return 50; } // 67%
  //     if(this.windowWidth>2600 && this.windowWidth<3072){ return 55;} //50% to 
  //     if(this.windowWidth>3072 && this.windowWidth<4700){ return 70;} // 33 to 50 %
  //     if(this.windowWidth>4700){return 70;}
  //     return 75;
  // }
  removeHTMLTags(str: any) {
    try {
      if ((str === null) || (str === undefined) || (str === ''))
        return '';
      else {
        str = str.toString();
        let finalString = str.replace(/(<([^>]+)>)/ig, '');
        finalString = finalString.replace(/&nbsp;/g, ' ');
        return finalString;
      }
    } catch (error: any) {
      console.log(error);
    }

  }

  setEmbededData(data: any, parent: any, maxUniqueId: any, changeDgUniqueID = true) {
    if (changeDgUniqueID) {
      this.maxDgUniqueId = maxUniqueId;
    }
    if (!data.property) {
      data['property'] = {};
    }
    data.forEach((item: any) => this.setEmbededNodes(item, parent?.number, changeDgUniqueID, data.property.type));

  }
  setEmbededNodes(data: any, parentID: any = null, changeDgUniqueID = true, procedureType = 'Static') {
    if (data?.number) {

      if (data.dgType === DgTypes.TextDataEntry) {
        if (data.choice) {
          if (data.choice.length > 0) {
            data['dataType'] = 'Dropdown';
          } else {
            data['dataType'] = 'Text';
          }
        }
      }
      if (parentID) {
        let parentNumber = parentID.indexOf('.0') > -1 ? parentID.split('.')[0] : parentID;
        const text = data.dgType === DgTypes.StepAction ? data.action : data.title;

        if (data.originalSequenceType == SequenceTypes.DGSEQUENCES) {
          data.number = parentNumber + '.' + (data.number.indexOf('.0') > -1 ? data.number.split('.')[0] : data.number.slice(data.number.lastIndexOf('.') + 1, data.number.length));
        }
        data.dgSequenceNumber = parentNumber + '.' + (data.dgSequenceNumber.indexOf('.0') > -1 ? data.dgSequenceNumber.split('.')[0] : data.dgSequenceNumber.slice(data.dgSequenceNumber.lastIndexOf('.') + 1, data.dgSequenceNumber.length));

        if (text) {
          data['text'] = data?.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
        } else {
          data['text'] = data?.number;
        }
        data['state'] = { hidden: false };
        data['parentID'] = parentID;
      }
      if (!data.property) {
        data['property'] = {};
      }
      data['property']['type'] = procedureType;
      if (changeDgUniqueID) {
        data['dgUniqueID'] = ++this.maxDgUniqueId;
      }
      data['id'] = data['dgUniqueID'];
      if (data.children && Array.isArray(data.children)) {
        data.children.forEach((item: any) => this.setEmbededNodes(item, data.dgSequenceNumber, changeDgUniqueID));
      }
    } else {
      if (changeDgUniqueID) {
        data['dgUniqueID'] = ++this.maxDgUniqueId;
      }
      data['id'] = data['dgUniqueID'];
      data['state'] = { hidden: true };
    }
    data['isEmbededObject'] = true;
  }
  setLevel(data: any, level: any = 0, indentLevel: any = null) {
    data['level'] = level;
    if (indentLevel) {
      data['indentLevel'] = indentLevel;
    }
    if (data.dgType === DgTypes.DualAction) {
      data.children.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevel(item, level + 1));

      });
      data.rightDualChildren.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevel(item, level + 1));
      });
    }

    if (data.children && Array.isArray(data.children) && data.dgType !== DgTypes.DualAction) {
      if (data['childSequenceType'] != SequenceTypes.DGSEQUENCES) {
        data['isIndent'] = true;
        if (!indentLevel) {
          data.children.forEach((item: any) => this.setLevel(item, level + 1, 1));
        } else {
          data.children.forEach((item: any) => this.setLevel(item, level + 1, indentLevel + 1));
        }

      } else {
        data.children.forEach((item: any) => this.setLevel(item, level + 1));
      }
    }
  }
  setSequenceType(element: any, sequenceType: SequenceTypes) {
    element['childSequenceType'] = sequenceType;
    element['originalSequenceType'] = this.getSequenceType(element);
    if (sequenceType === SequenceTypes.DGSEQUENCES) {
      element.numberedChildren = true;
    } else {
      element.numberedChildren = false;
    }

  }
  buildSequenceType(element: any) {
    if (element?.number && !(Array.isArray(element?.number))) {
      if (element?.number == '.') {
        this.setSequenceType(element, SequenceTypes.BULLETS);
      } else if (element.originalSequenceType == SequenceTypes.ROMAN && element?.number?.startsWith('i')) {
        this.setSequenceType(element, SequenceTypes.ROMAN);
      } else if ((element.originalSequenceType == SequenceTypes.CAPITALROMAN) && element?.number?.startsWith('I')) {
        this.setSequenceType(element, SequenceTypes.CAPITALROMAN);
      } else if (element?.number?.match(/[A-Z]/)) {
        this.setSequenceType(element, SequenceTypes.CAPITALALPHABETICAL);
      } else if (element?.number?.match(/[a-z]/)) {
        this.setSequenceType(element, SequenceTypes.ALPHABETICAL);
      } else if (element?.number?.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        this.setSequenceType(element, SequenceTypes.NUMERIC);
      } else if (!element?.number?.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        this.setSequenceType(element, SequenceTypes.DGSEQUENCES);
      }
    }
  }

  getSequenceType(element: any) {
    if (element?.number) {
      if (element?.number == '.') {
        return SequenceTypes.BULLETS;
      } else if (element?.number?.startsWith('i')) {
        return SequenceTypes.ROMAN
      } else if (element?.number?.startsWith('I')) {
        return SequenceTypes.CAPITALROMAN
      } else if (element?.number.match(/[a-z]/)) {
        return SequenceTypes.ALPHABETICAL
      } else if (element?.number.match(/[A-Z]/)) {
        return SequenceTypes.CAPITALALPHABETICAL
      } else if (element?.number.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        return SequenceTypes.NUMERIC;
      } else if (!element?.number.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        return SequenceTypes.DGSEQUENCES;
      }
    } else {
      throw new Error('can\'t  buildSequenceType');
    }
  }

  getNode(obj: any) {
    if (obj?.number) {
      const text = obj.dgType === DgTypes.StepAction ? obj.action : obj.title;
      return {
        text: obj?.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : ''),
        children: [],
        id: obj.dgUniqueID,
        data: obj
      };
    } else {
      console.error('Object number can\'t be null');
    }
  }

  getUrlByFile(fileObject: any) {
    const objectURL = fileObject && fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
    const url = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    return url;
  }
  notiferMessage(arg0: string, arg1: string) {
    this.notiferShow = true;
    this.messageObj = { type: arg0, mesg: arg1 };
  }

  removeDuplicates(originalArray: any, prop: any) {
    const newArray = [];
    const lookupObject: any = {};
    for (var i in originalArray) { lookupObject[originalArray[i][prop]] = originalArray[i]; }
    for (i in lookupObject) { newArray.push(lookupObject[i]); }
    return newArray;
  }

  setInnerHTML(html: any) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  isHTMLText(text: any): boolean {
    if (text === undefined) { text = ''; }
    if (isNaN(text) && text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }
  pasteEvent(stepObject: any) {
    if (stepObject.color !== '#000000' && !stepObject.storeValue.includes('font')) {
      stepObject.storeValue = '<font color="' + stepObject.color + '">' + stepObject.storeValue + '</font>'
    }
    return stepObject;
  }


  setStyleEditor(stepObject: any, config: any) {
    if (stepObject['styleSet']) {
      if (stepObject['styleSet']['fontsize']) {
        config['defaultFontSize'] = stepObject['styleSet']['fontsize'];
      }
      if (stepObject['styleSet']['fontfamily']) {
        config['defaultFontName'] = stepObject['styleSet']['fontfamily'];
      }
      if (stepObject['styleSet']['fontcolor']) {
        config['color'] = stepObject['styleSet']['fontcolor'];
      }
    }
    return config;
  }

  checkInnerHtml(stepObject: any) {
    if (!stepObject?.storeValue) { stepObject['storeValue'] = '' }
    stepObject['innerHtmlView'] = this.isHTMLText(stepObject?.storeValue) || stepObject.color !== '#000000' ? true : false;
    return stepObject;
  }
  setImageUpdate(result: any) {
    const fileIndex = this.media.findIndex((x: any) => x.name.includes(result.file.name));
    this.media.splice(fileIndex, 1);
    this.media.push(result.file);
    this.refresh = false;
    setTimeout(() => { this.refresh = true; }, 5);
  }
  clearDataVariables() {
    this.documentInfo = undefined;
    this.documentFile = undefined;
    this.styleModel = null;
    this.mediaBuilderObjects = [];
    this.mediaExecutorObjects = [];
    this.activeComponent = '';
    this.selectedElement = null;
    this.stepSequentialArray = [];
    this.stepActionArray = [];
    this.media = [];
    this.styleImageJson = undefined;
    this.currentStep = undefined;
    this.loadedCurrentStep = false;
  }

  handleSelection(event: any, selectedItem: any, type: any) {
    if (type == 'disable') {
      this.setAnnotation({ type: 'annotation', value: false });
      return;
    }
    this.annotationObj = { obj: selectedItem, text: '', type: type };
    let value = this.getSelectionText();
    this.annotationObj.text = value;
    // console.log('annotation obj:', this.annotationObj);
    this.enableAnnotation = /^\s*$/.test(value) ? false : true;
    this.enableAnnotation = this.annotationObj.text !== '' ? true : false;
    if (Object.keys(this.annotationObj.obj).length === 0) {
      this.enableAnnotation = false;
    } else {
      let type = this.annotationObj.type;
      let totaltitle = (type == 'alaraNotes' || type == 'notes') ? this.annotationObj.obj[type][0] : this.annotationObj.obj[type];
      if (/\s{2,}/.test(totaltitle)) { totaltitle = this.removeMiddleSpaces(totaltitle) }
      this.enableAnnotation = totaltitle.includes(this.annotationObj.text.trim()) ? true : false;
      if (this.annotationObj.text == '') {
        this.enableAnnotation = false;
      }
    }
    if (this.selectedElement['isEdited'] || selectedItem?.options?.notApplicable) {
      this.enableAnnotation = false;
    }
    this.setAnnotation({ type: 'annotation', value: this.enableAnnotation });
  }
  removeMiddleSpaces(text: any) {
    text = this.removeHTMLTags(text);
    let splittedText = text.split(' ');
    let newText = '';
    splittedText.forEach((word: any) => { if (word != '' || word != "") { newText += word.trim() + ' '; } })
    return newText.trim();
  }
  setDefaultColor(stepObject: any, propertyDoc: any) {
    if (stepObject.storeValue) {
      let item = { color: '', size: '', family: '' };
      item = this.sharedviewService.getStyles(stepObject.storeValue, item);
      if (!stepObject['styleSet']) { stepObject['styleSet'] = {} }
      item.family = this.sharedviewService.getFontFamily(item.family, this.sharedviewService.fontNames);
      if (item['size']) { stepObject['styleSet']['fontsize'] = item['size']; }
      if (item['family']) { stepObject['styleSet']['fontfamily'] = item['family']; }
      if (item['color']) { stepObject['styleSet']['fontcolor'] = item['color']; }
    }
    if (!stepObject['styleSet']) {
      stepObject['styleSet']['fontfamily'] = propertyDoc['fontfamily'] ?? 'Poppins';
      stepObject['styleSet']['fontsize'] = propertyDoc['fontsize'] ?? 2;
      stepObject['styleSet']['fontcolor'] = propertyDoc['color'] ?? '#000000';
    }
    if (!stepObject['styleSet']['fontfamily']) {
      stepObject['styleSet']['fontfamily'] = propertyDoc['fontfamily'] ?? 'Poppins';
    }
    if (!stepObject['styleSet']['fontsize']) {
      stepObject['styleSet']['fontsize'] = propertyDoc['fontsize'] ?? 2;
    }
    if (!stepObject['styleSet']['fontcolor']) {
      stepObject['styleSet']['fontcolor'] = propertyDoc['color'] ?? '#000000';
    }
    return stepObject;
  }
  checkFileNameExist(name: string, main: string) {
    let title = main.includes('media/') ? main.substring(6, main.length) : main;
    return name === title ? true : false;
  }
  checkAttachNameExist(name: string, main: string) {
    let title = main.replace('attachment/', '');
    name = name.replace('attachment/', '');
    return name === title ? true : false;
  }
  getUniqueID() {
    return Math.round(+new Date() / 1000);
  }

  setDefaultCBPTableChanges(obj: any, typeInfo: any, row: any = null, protectJsonObject = new ProtectObject().init()) {
    try {
      const tableObj = obj?.calstable[0]?.table?.tgroup?.tbody[0]?.row;
      if (tableObj) {
        for (let k = 0; k < tableObj.length; k++) {
          if (tableObj[k]) {
            const entryObj = tableObj[k].entry;
            for (let l = 0; l < entryObj.length; l++) {
              if (entryObj[l]) {
                const object = entryObj[l].children;
                for (let m = 0; m < object.length; m++) {
                  if (typeInfo.type === 'protect') {
                    if (this.checkTableDataEntries(object[m])) {
                      let item = object[m];
                      if (object[m].storeValue === '<br>') { object[m].storeValue = ''; }
                      let text = this.removeHTMLTags(object[m].storeValue);
                      text = text.replace(/\s\s+/g, '');
                      if (object[m].storeValue !== '' && object[m]?.storeValue && text !== '' && text !== ' ') {
                        object[m]['protect'] = (text !== '' && text !== ' ') ? typeInfo.protect : false;
                        object[m]['oldValue'] = item['storeValue'];
                        object[m]['protectOldValue'] = item['storeValue'];
                      } else {
                        object[m]['protect'] = (text !== '' && text !== ' ') ? typeInfo.protect : false;
                      }
                      if (!typeInfo.protect) { object[m]['protect'] = false; }
                    }
                    if (object[m].dgType === DgTypes.SignatureDataEntry) {
                      object[m]['protect'] = object[m]['signatureValue'] ? typeInfo.protect : false;
                      object[m] = this.signatureFieldsPro(object[m]);
                    }
                    if (object[m].dgType === DgTypes.InitialDataEntry) {
                      object[m]['protect'] = object[m]['initialStore'] ? typeInfo.protect : false;
                      object[m] = this.signatureFieldsPro(object[m]);
                    }
                    if (object[m].dgType === DgTypes.CheckboxDataEntry) {
                      object[m]['protect'] = object[m]['storeValue'] !== false ? typeInfo.protect : false;
                    }
                    if (object[m].dgType == DgTypes.TextAreaDataEntry || object[m].dgType == DgTypes.TextDataEntry ||
                      object[m].dgType == DgTypes.NumericDataEntry) {
                      if (object[m].comments === '' || object[m].comments === undefined || object[m].comments == null) {
                        object[m]['isCommentUpdated'] = false;
                        object[m]['commentsEnabled'] = false;
                      }
                    }
                    //  if(object[m]['storeValue'] && object[m].storeValue !== '' && object[m]?.storeValue){
                    if (object[m].dgType !== DgTypes.Form)
                      this.saveDatJson(object[m], protectJsonObject)
                    //  }
                  }
                  if (typeInfo.type === 'protectDataEntries') {
                    if (this.checkTableDataEntries(object[m]) || object[m].dgType === DgTypes.CheckboxDataEntry
                      || object[m].dgType === DgTypes.SignatureDataEntry || object[m].dgType === DgTypes.InitialDataEntry) {
                      object[m]['disableField'] = typeInfo?.value;
                      object[m]['protect'] = typeInfo?.value;
                    }
                  }
                  if (typeInfo.type === 'fontfamily') {
                    object[m] = this.setStyleForElement(object[m], typeInfo);
                    this.saveDatJson(object[m], protectJsonObject);
                  }
                  if (typeInfo.type === 'BuilderImages' && object[m].dgType === DgTypes.Figures) {
                    this.mediaBuilderObjects = [...this.mediaBuilderObjects, ...object[m].images];
                    this.mediaBuilderObjects = this.sharedviewService.removeDuplicates(this.mediaBuilderObjects, 'fileName');
                  }
                  if (typeInfo.type === 'BuilderImages' && (obj?.isParentRepeatStep || obj?.isParentTimedStep)) {
                    object[m]['isContentEditable'] = false;
                  }
                  if (object[m].dgType == DgTypes.Form) {
                    object[m]['subTabe'] = true;
                    this.setDefaultCBPTableChanges(object[m], typeInfo, null, protectJsonObject);
                  }
                }
              }
            }
          }
        }
      }
      if (protectJsonObject && typeInfo?.headerProtect && obj?.calstable)
        this.pushProtectObject(protectJsonObject);
      return obj;
    } catch (err) { console.error('table' + err); }
  }
  // all below methods are duplicate, need to refactor
  saveDatJson(object: any, protectObject: ProtectObject) {
    let storeValue = object?.signatureValue ? object.signatureValue : object.storeValue;
    if (storeValue == '<br>') { storeValue = ''; }
    this.storeDataInfoObj(object, storeValue, protectObject);
  }
  checkTableDataEntries(object: { dgType: DgTypes; }) {
    if (object.dgType === DgTypes.TextDataEntry || object.dgType === DgTypes.DateDataEntry || object.dgType === DgTypes.DropDataEntry ||
      object.dgType === DgTypes.TextAreaDataEntry || object.dgType === DgTypes.NumericDataEntry || object.dgType == DgTypes.SignatureDataEntry ||
      this.checkBoolean(object) || object.dgType === DgTypes.InitialDataEntry) {
      return true;
    }
    return false;
  }
  checkBoolean(object: { dgType: DgTypes; }) {
    return object.dgType === DgTypes.BooleanDataEntry || object.dgType === DgTypes.CheckboxDataEntry ? true : false;
  }
  setStyleForElement(element: any, typeInfo: any) {
    element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    element['innerHtmlView'] = true;
    if (typeInfo.type === 'fontColor') {
      element['color'] = typeInfo?.color;
      element = this.setStoreValue(element, 'color', typeInfo?.color);
    }
    if (typeInfo.type === 'fontSize') {
      element['defaultFontSize'] = element['styleSet']['fontsize'];
      element = this.setStoreValue(element, 'size', typeInfo?.size);
    }
    if (typeInfo.type === 'fontFamily') {
      element['defaultFontName'] = element['styleSet']['fontfamily'];
      element = this.setStoreValue(element, 'face', typeInfo?.font);
    }
    return element;
  }
  setStoreValue(element: any, type1: string, value: string) {
    if (element?.storeValue) {
      element.storeValue = this.replaceRemoveStyle(element.storeValue, type1, value);
    }
    return element;
  }

  replaceRemoveStyle(text: any, type: string, selectedValue: string) {
    let item = { color: '', size: '', family: '', align: 'left' };
    item = this.getStyles(text, item);
    item.family = this.getFontFamily(item.family, this.fontNames);
    text = this.clearFontStyles(text, type)
    this.storeColors = [];
    if (type === 'face') item.family = selectedValue;
    if (type === 'size') item.size = selectedValue;
    if (type === 'color') item.color = selectedValue;
    let colorhtml = ''; let closeColor = '';
    let familyhtml = ''; let closeFamily = '';
    let sizehtml = ''; let closeSize = '';
    if (item.color !== '') {
      colorhtml = `<font color="${item.color}">`; closeColor = '</font>';
    }
    if (item.family !== '') {
      familyhtml = `<font face="${item.family}">`; closeFamily = '</font>';
    }
    if (item.size !== '') {
      sizehtml = `<font size="${item.size}">`; closeSize = '</font>';
    }
    text = this.removeHTMLTags(text);
    return `<span style="textalign:${item.align}">${colorhtml}${familyhtml}${sizehtml}${text}${closeSize}${closeFamily}${closeColor}</span>`;
  }
  getFontFamily(type: string, list: any) {
    let family = '';
    for (let i = 0; i < list.length; i++) {
      if (list[i].includes(type)) { family = list[i]; break; }
    }
    return family;
  }
  getStyleObject(typeInfo: any) {
    if (typeInfo.type === 'center' || typeInfo.type === 'left' || typeInfo.type === 'right') {
      return { 'textalign': typeInfo.type };
    }
    if (typeInfo.type === 'fontSize') {
      return { 'fontsize': typeInfo?.size };
    }
    if (typeInfo.type === 'fontFamily') {
      return { 'fontfamily': typeInfo?.font };
    }
    if (typeInfo.type === 'fontColor') {
      return { 'fontcolor': typeInfo?.color };
    }
  }
  getStyles(text: string, item: any) {
    if (text?.includes('color=')) {
      let colorText = text.split('color=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let color = colorString.substring(0, 7);
          item.color = color.includes('#') ? color : '';
          if (item.color !== '')
            this.storeColors.push(item.color);
        }
      }
    }
    if (text?.includes('size=')) {
      let colorText = text.split('size=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.size = colorString.substring(0, 1);
        }
      }
    }
    if (text?.includes('face=')) {
      let colorText = text.split('face=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.family = colorString.substring(0, 4);
        }
      }
    }
    if (text?.includes('textalign:')) {
      let colorText = text.split('textalign:');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let value = colorString.substring(0, 4);
          if ('center'.includes(value)) { item.align = 'center'; }
          if ('left'.includes(value)) { item.align = 'left'; }
          if ('right'.includes(value)) { item.align = 'right'; }
        }
      }
    }
    return item;
  }

  checkStyles(text: string) {
    return text.includes(`color`) || text.includes(`size}"`) || text.includes(`family`)
  }
  clearFontStyles(text: string, removeStyle: string) {
    let colors: string[] = [...this.colors, ...this.storeColors]
    for (let i = 0; i < this.fontNames.length; i++) {
      text = text.replace(`face="${this.fontNames[i]}"`, '');
    }
    for (let j = 0; j < this.fontSizes.length; j++) {
      text = text.replace(`size="${this.fontSizes[j]}"`, '');
    }
    for (let k = 0; k < colors.length; k++) {
      text = text.replace(`color="${colors[k]}"`, '');
    }
    if (text.includes('style='))
      text = this.finalReplaceString(text, removeStyle);
    return text;
  }

  finalReplaceString(text: string, remove: string) {
    let styles = this.stringToStyleArray(text, true);
    for (let i = 0; i < styles.length; i++) {
      let style = styles[i].trim();
      if (style !== '' && style.includes(remove)) {
        text = text.replace(style, '');
      }
    }
    return text;
  }
  stringToStyleArray(string: string, split = true) {
    let styles: string[] = [];
    let dom = (new DOMParser()).parseFromString(string, "text/html");
    dom.querySelectorAll('[style]').forEach((el) => {
      let elm: any = el.getAttribute("style");
      if (split && elm) {
        let elm: any = el.getAttribute("style");
        styles = [...styles, ...elm.split(';')];
      } else {
        styles.push(elm);
      }
    });
    return styles;
  }
  checkDataEntryDgTypes(object: { dgType: DgTypes; }) {
    if (object?.dgType === DgTypes.TextDataEntry || object?.dgType === DgTypes.TextAreaDataEntry ||
      object?.dgType === DgTypes.NumericDataEntry || object?.dgType === DgTypes.DateDataEntry ||
      object?.dgType === DgTypes.BooleanDataEntry || object?.dgType === DgTypes.CheckboxDataEntry ||
      object?.dgType === DgTypes.VerificationDataEntry) {
      return true;
    }
    return false;
  }
  protectOrUnProtectData(obj: any, protect: boolean) {
    obj['protect'] = protect;
    if (obj.length > 0) {
      const protectJsonObject = new ProtectObject().init();
      protectJsonObject.by = this.sharedviewService.executionService.selectedUserId;
      protectJsonObject.Action = ActionId.Update;
      protectJsonObject.device = this.sharedviewService.getDeviceInfo();
      for (let i = 0; i < obj.length; i++) {
        if (this.stepActionCondition(obj[i])) {
          obj[i]['protect'] = protect;
          obj[i]['disableField'] = protect;
        }
        if (this.checkDataEntryDgTypes(obj[i])) {
          if (obj[i].storeValue !== '' && obj[i]?.storeValue && protect) {
            obj[i]['protect'] = protect;
            obj[i]['protectOldValue'] = obj[i]['storeValue'];
            obj[i]['oldValue'] = obj[i]['storeValue'];
            obj[i]['disableField'] = protect;
          }
          if (!protect) {
            obj[i]['protect'] = false;
            obj[i]['disableField'] = false;
          }
          // if(obj[i]['storeValue'] !=null && obj[i]['storeValue'] != undefined && obj[i]['storeValue'] != ''){
          this.storeDataInfoObj(obj[i], obj[i]['storeValue'], protectJsonObject);
          // }
        }
        if (obj[i].dgType == DgTypes.SignatureDataEntry) {
          obj[i]['protect'] = protect;
          obj[i]['protectOldValue'] = obj[i]['signatureValue'];
          obj[i]['oldValue'] = obj[i]['signatureValue'];
          obj[i] = this.signatureFieldsPro(obj[i]);

        }
        if (obj[i].dgType == DgTypes.InitialDataEntry) {
          obj[i]['protect'] = protect;
          obj[i]['protectOldValue'] = obj[i]['initialStore'];
          obj[i]['oldValue'] = obj[i]['initialStore'];
          obj[i] = this.signatureFieldsPro(obj[i]);
        }
        if (!protect) { obj[i]['protect'] = false; }

        if (obj[i].dgType == DgTypes.SignatureDataEntry && obj[i]['signature']) {
          let dataInfo: any = this.sharedviewService.storeDataObj(obj[i], obj[i]['signature']);
          dataInfo['initialStore'] = obj[i]['initialStore'];
          //this.cbpService.dataJson.dataObjects.push(dataInfo);
          if (protect) {
            protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
          } else {
            protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
          }

        }
        if (obj[i].dgType == DgTypes.InitialDataEntry && obj[i]['initialStore']) {
          let dataInfo = this.sharedviewService.storeDataObj(obj[i], obj[i]['initialStore']);
          //this.cbpService.dataJson.dataObjects.push(dataInfo);
          if (protect) {
            protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
          } else {
            protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
          }
        }
        if (obj[i].dgType === DgTypes.Form) {
          // changed setDefaultTableChanges from table to cbpservice
          obj[i] = this.setDefaultCBPTableChanges(obj[i], { type: 'protect', protect: protect, dataObject: [] }, null, protectJsonObject);
        }
        if (obj[i]?.children && Array.isArray(obj[i]?.children) && obj[i]?.children?.length > 0 && typeof obj[i]?.children === "object") {
          this.protectOrUnProtectData(obj[i].children, protect);
        }
      }
      this.pushProtectObject(protectJsonObject);
    }
  }
  signatureFieldsPro(obj: any) {
    if (obj.dgType == DgTypes.SignatureDataEntry && obj['protect']) {
      let storeSignName = this.removeHTMLTags(obj.signatureName);
      if (storeSignName && storeSignName?.trim() != '') {
        obj['signatureNameProtect'] = true;
      } else {
        obj['signatureNameProtect'] = false;
      }
      if (obj.initial) {
        obj['initialProtect'] = true;
      } else {
        obj['initialProtect'] = false;
      }
      let storeSignUserId = this.removeHTMLTags(obj.signatureUserId);
      if (storeSignUserId && storeSignUserId?.trim() != '') {
        obj['signatureUserIdProtect'] = true;
      } else {
        obj['signatureUserIdProtect'] = false;
      }
      let storeSignNotes = this.removeHTMLTags(obj.signatureNotes);
      if (storeSignNotes && storeSignNotes?.trim() != '') {
        obj['signatureNotesProtect'] = true;
      } else {
        obj['signatureNotesProtect'] = false;
      }
      const dateRegex = /^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-]\d{4}$/;
      const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;
      const dateTimeRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}\s+(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;

      if (dateRegex.test(obj.signatureDate) || timeRegex.test(obj.signatureDate) || dateTimeRegex.test(obj.signatureDate)) {
        obj.dateTimeProtect = true;
      } else {
        obj.dateTimeProtect = false;
      }
      return obj;
    } else {
      let storeInitialName = this.removeHTMLTags(obj.initialName);
      if (storeInitialName && storeInitialName?.trim() != '') {
        obj['initialNameProtect'] = true;
      } else {
        obj['initialNameProtect'] = false;
      }
      let storeInitialNotes = this.removeHTMLTags(obj.initialNotes);
      if (storeInitialNotes && storeInitialNotes?.trim() != '') {
        obj['initialNotesProtect'] = true;
      } else {
        obj['initialNotesProtect'] = false;
      }
      return obj;
    }
  }
  clearSelectedRowFields(list: any) {
    for (let i = 0; i < list.length; i++) {
      const object = this.selectedTable.calstable[0].table.tgroup.tbody[0].row[list[i].row].entry[list[i].col].children;
      if (object.length > 0) {
        this.clearDataEntries(object);
      }
    }
  }

  clearTBPTableFields(obj: any) {
    try {
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row;
      for (let k = 0; k < tableObj.length; k++) {
        if (tableObj[k]) {
          const entryObj = tableObj[k].entry;
          for (let l = 0; l < entryObj.length; l++) {
            if (entryObj[l]) {
              const object = entryObj[l].children;
              this.clearDataEntries(object);
            }
          }
        }
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }

  clearDataEntries(object: any) {
    const protectJsonObject = new ProtectObject().init();
    protectJsonObject.by = this.sharedviewService.executionService.selectedUserId;
    protectJsonObject.Action = ActionId.Update;
    protectJsonObject.device = this.sharedviewService.getDeviceInfo();

    for (let m = 0; m < object.length; m++) {
      if (this.checkDataEntryDgTypes(object[m]) && !object[m]?.protect) {
        object[m].storeValue = '';
        object[m].protect = false;
        object[m]['disableField'] = false;
        this.storeDataInfoObj(object[m], '', protectJsonObject);
      }
      if (object[m].dgType === DgTypes.InitialDataEntry && !object[m]?.protect) {
        const obj = new Initial('', '', '', '', object[m].dgUniqueID);
        object[m].dgUniqueID = obj.dgUniqueID;
        object[m].initial = '';
        object[m].initialStore = '';
        object[m].initialName = '';
        object[m].protect = false;
        object[m]['disableField'] = false;
        // this.storeDataInfoObj( object[m], '');
        this.clearSignObject.push({ dgType: object.dgType, dgUniqueID: object.dgUniqueID })
      }
      if (object[m].dgType === DgTypes.SignatureDataEntry && !object[m]?.protect) {
        object[m].signatureValue = '';
        object[m].signatureName = '';
        object[m].initial = '';
        object[m].protect = false;
        object[m]['disableField'] = false;
        this.clearSignObject.push({ dgType: object.dgType, dgUniqueID: object.dgUniqueID })
        // this.storeDataInfoObj(object[m], '');
      }
      if (object[m].dgType == DgTypes.Form) {
        this.clearTBPTableFields(object[m]);
      }
    }
    this.pushProtectObject(protectJsonObject);

  }
  pushProtectObject(protectJsonObject: ProtectObject) {
    if (!this.protectJson || this.protectJson?.length === 0 || this.protectJson?.protectObjects === undefined) {
      this.protectJson = new ProtectJson().init();
    }
    if (protectJsonObject.dgUniqueIDProtectList.length > 0 ||
      protectJsonObject.dgUniqueIDUnProtectList.length > 0) {
      let find = this.protectJson.protectObjects.filter((item: any) => item.TxnId == protectJsonObject.TxnId);
      if (find && find?.length > 0) {
        protectJsonObject.TxnId = protectJsonObject.TxnId + this.protectJson.protectObjects.length;
      }
      this.protectJson.protectObjects.push(protectJsonObject);
    }
  }

  storeDataInfoObj(obj: any, value: any, protectObject: ProtectObject) {
    if (obj?.dgUniqueID) {
      if (obj?.protect) {
        protectObject.dgUniqueIDProtectList.push(obj.dgUniqueID.toString());
      } else {
        protectObject.dgUniqueIDUnProtectList.push(obj.dgUniqueID.toString());
      }
    }
    // let dataInfo = this.sharedviewService.storeDataObj(obj, value);
    // this.dataJson.dataObjects.push(dataInfo);
  }

  stepActionCondition(obj: any) {
    if (obj !== undefined) {
      if (obj?.dgType === DgTypes.StepAction || obj?.dgType === DgTypes.DelayStep || obj?.dgType === DgTypes.Timed || obj?.dgType === DgTypes.Repeat) {
        return true;
      }
    }
    return false;
  }
  sectionAndStep(obj: any) {
    return this.stepActionCondition(obj) || obj?.dgType === DgTypes.Section ? true : false;
  }
  checkAllSteps(obj: { dgType: DgTypes; }) {
    return (this.sectionAndStep(obj) || obj?.dgType === DgTypes.StepInfo) ? true : false;
  }

  isInputClicked() {
    this.annotationObj = { obj: {}, text: '', type: '' };
  }
  getSelectionText() {
    let text: any = "";
    if (window.getSelection) {
      if (window.getSelection() !== null) {
        let item = window.getSelection();
        text = item?.toString();
      }
    } else if ((document as any)['selection'] && (document as any)['selection'].type != "Control") {
      text = (document as any)['selection'].createRange().text;
    }
    console.log('handle selection for tablet', text);
    return text;
  }
  findDuplicates(str: string, selected: string) {
    str = this.removeHTMLTags(str);
    let words = str.split(/\W+/);
    let wordCount: any = {};
    words.forEach(word => {
      word = word
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });

    let duplicates = Object.keys(wordCount).filter(word => wordCount[word] > 1);
    let res: any = [];
    if (duplicates?.length > 0) {
      duplicates.filter((item: any) => { if (item == selected?.trim()) { res.push(item) } });
    }
    return res;

    // const strArr = str.split(" ");
    //  let res:any = [];
    //  if(str.includes(selected)){res.push(selected)};
    //  for(let i = 0; i < strArr.length; i++){
    //     if(strArr.indexOf(strArr[i]) !== strArr.lastIndexOf(strArr[i])){
    //        if(!res.includes(strArr[i])){
    //           res.push(strArr[i]);
    //        };
    //     };
    //  };
    //  if(res?.length>0){
    //   res = res.filter((item:any)=>item == selected?.trim());
    //  }
    //  return res;
  }
  getParaObjects(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.Para || object[i].dgType === DgTypes.LabelDataEntry ||
        object[i].dgType === DgTypes.Table || object[i].dgType === DgTypes.Figures ||
        object[i].dgType === DgTypes.SingleFigure
      ) {
        let find = object[i].dgUniqueID.toString().includes('b') ? true : false;
        if (find) {
          let dup = this.paraList.filter(it => it.dgUniqueID == object[i].dgUniqueID);
          if (dup.length == 0)
            this.paraList.push(object[i]);
        }
      }
      if (object[i]?.children && object[i]?.children?.length > 0) {
        this.getParaObjects(object[i]?.children)
      }
    }
  }

  getArrayObjectsImages(dataObject: any, type: any, delImgType: any) {
    return dataObject.filter((item: any) => item.dgType === type || item.dgType === delImgType);
  }
  getArrayObjectsCR(dataObject: any, crtype: any, delCrType: any) {
    let newobj: any = dataObject.filter((item: any) => item.dgType === crtype || item.dgType === delCrType);
    return newobj;
  }
  getArrayObjectsCm(dataObject: any, cmtype: any, delCmType: any) {
    let newobj: any = dataObject.filter((item: any) => item.dgType === cmtype || item.dgType === delCmType || item.dgType === "deleteComment");
    return newobj;
  }
  getArrayObjects(dataObject: any, type: any) {
    return dataObject.filter((item: any) => item.dgType === type);
  }
  roundOffValue(value: any, decimal: any = null, dgType: string) {
    value = Number(value);
    if (decimal != null && decimal != undefined && decimal != '') {
      return parseFloat(value.toFixed(Number(decimal)));
    } else if (dgType == DgTypes.NumericDataEntry) {
      return parseInt(value.toString(), 10)
    } else {
      return parseFloat(value.toFixed(2));
    }
  }
  isValidNumber(input: any) {
    let num = Number(input);
    return typeof num === "number" && !isNaN(num) && isFinite(num);
  }
  isDgUniqueIdPresentInAntlr(parsedRule: any, antlrObj: any) {
    const dgIds = this.extractNumbers(parsedRule);
    let isIdsPresent = dgIds?.length > 0 && dgIds.every((id: any) => antlrObj.arr[id] !== undefined);
    return isIdsPresent ? isIdsPresent : ((dgIds === undefined || dgIds?.length === 0) && parsedRule ? true : false);
  }
  extractNumbers(text: string): string[] {
    const matches = text.match(/&([\w\d_]+)/g); // Matches & followed by word characters
    return matches ? matches.map(match => match.slice(1)) : [];
  }
  clearInternalVersionForTable(data: any, isDownload: boolean) {
    try {
      if ('internalRevision' in data && isDownload) {
        delete data['internalRevision'];
      }
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        tr.entry?.forEach((entry: any) => {
          if (entry.children && entry.children.length > 0) {
            entry.children.forEach((child: any) => {
              if (child.dgType === DgTypes.Form) {
                this.clearInternalVersionForTable(child, isDownload);
              }
            });
          }
        });
      });
    } catch (error) {
      console.log(error)
    }
  }
  updateRepeatStepEntriesForTable(obj: any, type: any, key: any) {
    if (obj && !Array.isArray(obj) && obj?.hasOwnProperty('isTableDataEntry') && (obj?.dgType === DgTypes.TextAreaDataEntry || obj.dgType === DgTypes.TextDataEntry || obj.dgType === DgTypes.NumericDataEntry)) {
      obj[type] = true;
      obj[key] = key;
    }
    if (obj?.entry) {
      obj.entry.forEach((child: any) => this.updateRepeatStepEntriesForTable(child, type, key));
    }
    if (obj?.children) {
      obj.children.forEach((child: any) => this.updateRepeatStepEntriesForTable(child, type, key));
    }
    if (obj && Array.isArray(obj)) {
      obj.forEach((column: any) => {
        this.updateRepeatStepEntriesForTable(column, type, key);
      });
    }
    if (obj?.dgType == DgTypes.Form) {
      let castable: any = obj.calstable[0].table.tgroup.tbody[0].row
      this.updateRepeatStepEntriesForTable(castable, type, key);
    }
  }
  notifyRepeatOrTimedStepChilds(type: any, stepObject: any) {
    if (!Array.isArray(stepObject.children) || stepObject.children.length === 0) {
      return stepObject;
    }
    stepObject?.children?.forEach((child: any) => {
      if (this.stepActionCondition(child) || child.dgType === DgTypes.StepInfo) {
        child[type] = true;
      }
      if (child?.dgType === DgTypes.TextAreaDataEntry || child.dgType === DgTypes.TextDataEntry || child.dgType === DgTypes.NumericDataEntry) {
        child[type] = true;
        child['isContentEditable'] = true;
      }
      if (child?.dgType === DgTypes.Form) {
        let castable: any = child.calstable[0].table.tgroup.tbody[0].row
        child[type] = true;
        this.updateRepeatStepEntriesForTable(castable, type, 'isContentEditable')
      }
      if (Array.isArray(child?.children) && child?.children?.length > 0) {
        this.notifyRepeatOrTimedStepChilds(type, child);
      }
    });
    return stepObject;
  }
  dataJsonStoreChange(dataInfoObj: any, stepObject: any = null) {
    const lastElement = this.dataJson.dataObjects?.[this.dataJson.dataObjects.length - 1];
    const isEntry = this.isDataEtry({ dgType: dataInfoObj?.dgType });
    const isSameUniqueId = lastElement?.dgUniqueID == dataInfoObj?.dgUniqueID;
    const isSameTxnId = lastElement?.TxnId == dataInfoObj?.TxnId;
    const isDifferentTxnId = !isSameTxnId;
    if (isEntry) {
      if (this.isTextOrNumericInput(dataInfoObj?.dgType)) {
        if (dataInfoObj.value == '') {
          let previousObj = this.dataJson.dataObjects.findLast((item: any) => item.dgUniqueID?.toString() === dataInfoObj.dgUniqueID?.toString());
          if (!previousObj) {
            return;
          }
        }
      }
      if (!isSameUniqueId && isDifferentTxnId) {
        this.storeDataJsonEntries(stepObject, dataInfoObj, lastElement);
      }
      if (isSameUniqueId && isDifferentTxnId) {
        const needsHtmlProcessing = stepObject?.innerHtmlView || this.isHTMLText(dataInfoObj.value);
        if (needsHtmlProcessing) {
          const lastValue = this.removeHTMLTags(lastElement.value);
          const newValue = this.removeHTMLTags(dataInfoObj.value);
          if (lastValue !== newValue || lastElement?.value !== dataInfoObj.value) {
            this.storeDataJsonEntries(stepObject, dataInfoObj, lastElement);
          }
        } else if (lastElement?.value !== dataInfoObj?.value) {
          this.storeDataJsonEntries(stepObject, dataInfoObj, lastElement);
        }
      }
      if (isSameTxnId) {
        dataInfoObj.TxnId = this.getUniqueTimestamp(lastElement?.TxnId);
        dataInfoObj = this.validateDataObjTxnId(dataInfoObj);
        this.dataJson.dataObjects.push(dataInfoObj);
      }
    } else {
      if (isSameTxnId) {
        dataInfoObj.TxnId = this.getUniqueTimestamp(lastElement?.TxnId);
      }
      dataInfoObj = this.validateDataObjTxnId(dataInfoObj);
      this.dataJson.dataObjects.push(dataInfoObj);
    }
  }
  storeDataJsonEntries(stepObject: any, dataInfoObj: any, lastElement: any) {
    if (this.dataJson.dataObjects?.length > 1) {
      lastElement = this.dataJson.dataObjects.findLast((item: any) => item.dgUniqueID?.toString() === dataInfoObj.dgUniqueID?.toString());
    }
    if ((stepObject?.innerHtmlView || this.isHTMLText(dataInfoObj.value))) {
      if (dataInfoObj?.dgType == DgTypes.TextAreaDataEntry || dataInfoObj?.dgType == DgTypes.NumericDataEntry || dataInfoObj?.dgType == DgTypes.TextDataEntry) {
        // dataInfoObj.value = this.ensureValidFontAttributes(dataInfoObj.value);
      }
      if (this.normalizeHtml(lastElement?.value || '') !== this.normalizeHtml(dataInfoObj.value || '')) {
        dataInfoObj = this.validateDataObjTxnId(dataInfoObj);
        this.dataJson.dataObjects.push(dataInfoObj);
      }
    } else {
      let foundItem = this.dataJson.dataObjects.findLast((item: any) => item.dgUniqueID?.toString() === dataInfoObj.dgUniqueID?.toString());
      if (foundItem) { if (foundItem?.value?.toString() !== dataInfoObj?.value?.toString()) { foundItem = false; } }
      if (!foundItem) {
        dataInfoObj = this.validateDataObjTxnId(dataInfoObj);
        this.dataJson.dataObjects.push(dataInfoObj);
      }
    }
  }

  ensureValidFontAttributes(inputText: string) {
    const defaultFace = 'Poppins';
    const defaultSize = '2';
    const defaultColor = '#000000';
    if (!this.containsFontAttributes(inputText)) {
      return inputText.replace(/<font([^>]*)>/gi, (match, attributes) => {
        let faceMatch = /face\s*=\s*["']([^"']*)["']/i.exec(attributes);
        let sizeMatch = /size\s*=\s*["']([^"']*)["']/i.exec(attributes);
        let colorMatch = /color\s*=\s*["']([^"']*)["']/i.exec(attributes);
        let face = faceMatch && faceMatch[1] && (faceMatch[1].toLowerCase() !== 'undefined' && faceMatch[1] !== '') ? faceMatch[1] : defaultFace;
        let size = sizeMatch && sizeMatch[1] && (sizeMatch[1].toLowerCase() !== 'undefined' && sizeMatch[1] !== '') ? sizeMatch[1] : defaultSize;
        let color = colorMatch && colorMatch[1] && (colorMatch[1].toLowerCase() !== 'undefined' && colorMatch[1] !== '') ? colorMatch[1] : defaultColor;
        return `<font face="${face}" size="${size}" color="${color}">`;
      });
    } else {
      return inputText
    }
  }
  getUniqueTimestamp(lastTimestamp: any) {
    let now = Date.now();
    if (now <= lastTimestamp) {
      now = lastTimestamp + 1; // increment by 1 ms
    }
    lastTimestamp = now;
    return now;
  }
  isDataEtry(object: { dgType: DgTypes; }) {
    if (object?.dgType === DgTypes.TextDataEntry || object?.dgType === DgTypes.TextAreaDataEntry ||
      object?.dgType === DgTypes.NumericDataEntry || object?.dgType === DgTypes.DateDataEntry ||
      object?.dgType === DgTypes.BooleanDataEntry || object?.dgType === DgTypes.CheckboxDataEntry) {
      return true;
    }
    return false;
  }
  storeTempMapID(parsedName: string, object: any) {
    if (/^\d+$/.test(object.dgUniqueID)) {
      this.tempMapUniqueID.set(parsedName, object.dgUniqueID);
    }
  }
  generateDerivedObj(rowcolInfo: any, stepObject: any) {
    if (rowcolInfo) {
      try {
        const parsedInfo = typeof rowcolInfo === "string" ? JSON.parse(rowcolInfo) : rowcolInfo;
        const { row, col, attr, table } = parsedInfo;
        if (Number(row) > 0 && Number(col) > 0 && Number(attr) > 0 && table) {
          this.setDerivedObject(Number(row), Number(col), Number(attr), stepObject, table);
        }
      } catch (error) {
        console.error("Error parsing rowcolInfo:", error);
      }
    }
  }
  setDerivedObject(l: any, m: any, k: any, object: any, table: any) {
    let derivedObj: any = {};
    derivedObj['fieldName'] = `${table?.tableName}.Column[${m}].Row[${l}].Attr[${k}]`;
    derivedObj['fieldParsedName'] = `${table?.tableName}.Column${m}.Row${l}.Attr${k}`;
    derivedObj['dgUniqueID'] = object?.dgUniqueID;
    derivedObj['object'] = object;
    derivedObj['parentDgUniqueID'] = table?.dgUniqueID
    this.storeTempMapID(derivedObj['fieldParsedName'], object);
    this.storeTempMapID(derivedObj['fieldName'], object);
  }

  validateDerivedRuleWithDgUniqueIDs(data: any, tempIds: any, isAlarmRule: any = false) {
    if (!this.validateParsedRule(data.ParsedValue, tempIds)) {
      if (isAlarmRule) {
        const startIndex = data?.ParsedValue.indexOf(")") + 1;
        let extracted = data?.ParsedValue.substring(startIndex).trim();
        const ifCondition = this.extractIfCondition(data.DisplayValue);
        let displayValue = ifCondition + extracted;
        return this.replaceDisplayRuleWithIds(displayValue, this.tempMapUniqueID);
      } else {
        return this.replaceDisplayRuleWithIds(data.DisplayValue, this.tempMapUniqueID);
      }
    }
    return data?.ParsedValue;
  }
  extractIfCondition(input: string): string {
    const ifIndex = input.indexOf("IF");
    const thenIndex = input.indexOf("THEN");
    if (ifIndex !== -1 && thenIndex !== -1) {
      return input.substring(ifIndex, thenIndex).trim()?.replace('IF', 'if');;
    }
    return "";
  }
  validateParsedRule(parsedRule: any, tempMapUniqueID: any) {
    const dgIds = this.extractNumbers(parsedRule);
    let isIdsPresent = dgIds?.length > 0 && dgIds.every((id: any) => tempMapUniqueID.has(id));
    return isIdsPresent ? isIdsPresent : ((dgIds === undefined || dgIds?.length === 0) && parsedRule ? true : false);
  }
  replaceDisplayRuleWithIds(displayrule: string, tempMap: Map<string, string>): string {
    return displayrule.replace(/&(\w+)/g, (match, key) => {
      return tempMap.has(key) ? '&' + tempMap.get(key) : match;
    });
  }
  replaceAmpNumbers(input: string, uniqueId: any): string {
    return input.replace(/&(\d+)/g, (match, num) => `${uniqueId}${num}`);
  }
  updateSelectedElement(selectedElement: any, sections: any) {
    if (this.selectedElement?.dgUniqueID == selectedElement?.dgUniqueID) {
      let parentObj = this.cbpSharedService.getElementByNumber(selectedElement.parentID, sections);
      this.selectedElement = (parentObj && parentObj['hide_section'] != false) ? parentObj : sections[0];
    }
  }
  validateDataObjTxnId(dataObj: any) {

    let currentTxnId = dataObj?.TxnId;
    const txnId = this.dataJsonTxnIDS[this.dataJsonTxnIDS.length - 1].dataJsonTxnId;

    if (!this.sharedviewService.checkInt(currentTxnId, txnId)) {
      currentTxnId = new Date().getTime();
      if (!this.sharedviewService.checkInt(currentTxnId, txnId)) {
        let difference = Number(currentTxnId?.toString()) - Number(txnId?.toString())
        if (difference < 0) {
          currentTxnId = Number(currentTxnId?.toString()) + Math.abs(difference)
          dataObj['TxnId'] = (currentTxnId + 1);
        }
      } else {
        dataObj['TxnId'] = currentTxnId;
      }
    }
    return dataObj;
  }

  normalizeHtml(html: string): string {
    return html
      .replace(/\s+/g, ' ')             // Collapse whitespace
      .replace(/>\s+</g, '><')          // Remove spaces between tags
      .trim();                          // Trim leading/trailing whitespace
  }
  containsFontAttributes(html: string): boolean {
    const hasFace = /<font[^>]\sface\s=\s*["'][^"']+["']/i.test(html);
    const hasSize = /<font[^>]\ssize\s=\s*["'][^"']+["']/i.test(html);
    const hasColor = /<font[^>]\scolor\s=\s*["'][^"']+["']/i.test(html);
    return hasFace && hasSize && hasColor;
  }
  isTextOrNumericInput(dgType: any) {
    if (dgType && dgType === DgTypes.TextDataEntry || dgType === DgTypes.TextAreaDataEntry ||
      dgType === DgTypes.NumericDataEntry) {
      return true
    }
    return false;
  }
  isStrictlyNumeric(value: any): boolean {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'string') {
      return /^-?\d+(\.\d+)?$/.test(value);
    }
    return false;
  }
}
