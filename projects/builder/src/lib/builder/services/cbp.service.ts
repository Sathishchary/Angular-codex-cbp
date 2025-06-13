import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, Cbpzip, Dependency, DgTypes, Footer, Header, PropertyDocument, SequenceTypes, styleModel, waterMarkOptions } from 'cbp-shared';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Section } from '../models';
import { BuilderUtil } from '../util/builder-util';
declare var swal: any, $: any;

@Injectable()
export class CbpService {
  docID: any;
  showErrorPopup = false;
  showWarnPopup = false;
  showErrorProperty = false;
  selectedReset = false;
  eDocumentApiUrl: any;
  apiUrl: any;
  companyId: any;
  accessToken: any;
  currentStep: any;
  formObect: any;
  currentStepArrayIndex: any;
  selectedIndex: any;
  selectedElement: any;
  backSelctedItem: any;
  selectedDragElement: any;
  selectedDragUniqueId = 0;
  propertyType = 'section';
  executionClicked = false;
  dataJson: any;
  protectJson: any;
  defaulJson: any;
  cbpJson: any;
  numberShow = false;
  dateId = false;
  areaId = false;
  textData = false;
  dropId = false;
  //coverpage
  docFileStatus: any;
  listAttributes: any[] = [];
  coverPageSelected = false;
  editCoverPage = false;
  hideButtonsImg = false;
  hideCoverPageButton = false;
  coverPageDataAfterSave = false;
  coverPageViewEnable = false;
  showviewCoverPage = false;
  coverPageSinglerow = false;
  numericUnit: any[] = [];
  // uniqueIdIndex = 1;
  selectedElementStep: any;
  selectedUniqueId = 1;
  sectionHover = false;
  multipleFilesList: any;
  mediaSelectedFile: any;
  showProperty = true;
  showNavigation = true;
  refreshTreeNav = false;
  isBuild = true;
  documentSelected = false;
  nodes = [];
  dgUniqueIDNode = 1;
  isDocumentUploaded = false;
  isApplicabiltyOpen = false;
  documentUploading!: boolean;
  isRulesOpen = false;
  rulesStep: any;
  isAlaramOpen = false;
  istemplateOpen = false;
  isActionOpen = false;
  isEmbedOpen = false;
  isStylesOpen = false;
  isSetup = false;
  isRoleQualOpen = false;
  isLinkAssetsOpen = false; //for Link aSSETS
  isEdocLink = false;
  iscomponentInfo = false;
  dropItems = false;
  issetupURLOpen = false;
  currentParent: any;
  foundStatus = false;
  isBackFromRead = false;
  loading = false;
  isFromBuild = false;
  map: any;
  refreshToken: any;
  dataJsonUniqueId: any;
  currentUser: any;
  loggedInUserId: any;
  apiSecurity: any;
  oauthURL: any;
  selectedChildNode: any;

  userInfo: any;
  instanceid: any;
  packagefileid: any;
  locationid: any;
  eTimeApiURL: any;
  isCbpProject!: boolean;
  loggedInUserName = '';
  styleJson: any;
  annotateJson: any;
  styleHelpJson: any;
  styleImageJson: any;
  styleHelpImageJson: any;
  defaultStyleImage: any;
  sectionFontSize: any;
  sectionFontName: any;
  dataFieldNumber = 0;
  styles: any;
  mediaUrls: any[] = [];

  rowSelectedEntry: any;
  colSelectedEntry: any;
  prevTab = 'CBP';
  documentInfotitle: any;
  docInfo: any;
  mediaUrl!: string;
  selecteDocumentId!: string;
  section = false;
  step = false;
  setpinfo = false;
  headerItem!: { text: string; number: any; dgUniqueId: any; dgType: any; };
  ctrlSelectedItems: any[] = [];
  fileCount = 0;
  docfirst = true;
  elementForCopyOrCut: any;
  elementForCut: any;
  fileproperties: any;

  //BUILDER PAGINATION
  paginateIndex = 1;
  startIndex = 1;
  pageSize = 20;
  showEditor: boolean = true;
  documentType = 'New';
  fieldsMaps = new Map();
  //Indent variables
  disableRightIndent = false;
  disableLeftIndent = false;
  isDisabledCBP = false;
  waterMarkValue: any;
  isReadOnlyFromEdocument = false;
  defaultStylesJson: any;
  reloadTheWaterMark = false;
  cutSelectItem = false;
  selectedType = '';
  embeddedType: boolean = false;
  userCbpInfo: any;
  selectedDgType = DgTypes.Section;
  isDuplicateValues: any[] = [];
  islayoutOpen = false;
  copyCutType = '';
  copyCutMessage = '';
  isCutcopyElement = false;
  layOutJson: any;
  backContentJson: any;
  layOutHelpJson: any;
  defaultLayOutJson: any;
  defaultLayOutHelpJson: any;
  popupDocumentSave = true;
  emailId!: string;
  selectedText: any;
  defaultStyleImageStyle: any;
  newElement_Added = false;
  tableDataEntrySelected: any;
  mediaFile: any;
  imageUrlShow = false;
  configureDependency = false;
  docUsage = Dependency.Continuous;
  //COPY, CUT & PASTE BRADCOST
  copyAudit = new Subject<any>();
  copyAudit_reso = this.copyAudit.asObservable();
  detectWholePage = false;

  //Search Template
  searchTemplate = false;
  searchString: any = null;
  replaceString = '';
  searchObj: any = {
    totalOccurance: 0,
    currentElement: 0,
    currentIndex: 0,
    currentActivePosition: 0,
    searchResult: []
  };
  //Search Broadcaster
  refreshSearch = new Subject<any>();
  replaceSearch = new Subject<any>();

  //Search Broadcaster
  searchNavigate = new Subject<any>();
  searchNavigate_reso = this.searchNavigate.asObservable();

  triggerReplace = true;
  triggerReplaceAll = true;
  replaceState = false;
  hyperLink = new Subject<any>();
  hyperLink_reso = this.hyperLink.asObservable();
  triggerHyperLink = false;
  executionOrderJson: any;
  // updated cbp file
  cbpupdated = false;
  mediaViewLoader = false;
  mediaBlobs: any[] = [];
  styleUpdated = false;
  styleUpdatedHelpJson = false;
  maxDgUniqueId!: number;
  styleModel: any = new styleModel()
  mediaBuilderObjects: any = [];
  propertyDocument!: PropertyDocument;
  layoutUpdated = false;
  coverPage: boolean = true;
  headerSelected = false;
  footerSelected = false;
  selectedHeaderElement: any;
  selectedFooterElement: any;
  isTreeEvent = false;
  styleTextEditorUpdated = false;
  dynamicSectionInfo!: any[];
  styleLevelObj: any;
  isViewUpdated: any;
  clientUrl: any;
  eWorkURL: any;
  media: any = [];
  cbpZip = new Cbpzip();
  attachment: any = [];
  fullscreen: boolean = false;
  stepClicked = false;
  isChangeUpdates: boolean = false;
  displayMsg: any;
  errorDgType: any;
  backgroundJson: any;
  refreshView = true;
  storeFileName: any;
  dupUniqueIDs: any[] = [];
  previousHeaderItem!: { text: string; number: any; dgUniqueId: any; dgType: any; };
  updateProperty: boolean = false;
  notifierMesg = { mesg: '', type: '', enable: false };
  duplicateIds: any[] = [];
  isTableEditorOpen: boolean = false;
  isSearchTemplate = false;
  currentPage = 1;
  setUpStyle: boolean = false;
  listProperties: any[] = [];
  selectedColTitle = '';
  signatureJson: any[] = [];
  selectedTableCol = false;
  isDisabledControl = false;
  columnRuleEnabled = false;
  tableDetectChange = false;
  tableRuleOpen = false;
  scrollId: string = '';
  maximum: any;
  minimum: any;
  defaultValue: any
  editorType: any;
  primaryDocument = false;
  isBackGroundDocument = false;
  styleChangeBarSession: string[] = [];
  styleHeadings: any[] = [];
  tableDataEntrySnapChat: any;
  coverPagedataEmpty: any = false;
  maxProcedureSnippetIndex: number = 0;
  dynamicDocumentUnChecked: boolean = false;
  constructor(public sanitizer: DomSanitizer, private _buildUtil: BuilderUtil,
    public notifier: NotifierService) {

  }

  imagefromcbp_reso = new BehaviorSubject<any>('');
  imagefromCBP = this.imagefromcbp_reso.asObservable();
  chnageImagesFromCBP(iscbpImage: any) {
    this.imagefromcbp_reso.next(iscbpImage);
  }

  fileProperties = new BehaviorSubject<any>({});
  filePropertiesValue = this.fileProperties.asObservable();
  setFilePropertiesValue(obj: any) {
    this.fileProperties.next(obj);
  }

  getChildEmbededNode(nodes: string | any[], stepNo: any) {
    if (Array.isArray(nodes)) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].stepNo == stepNo) {
          this.selectedChildNode = nodes[i];
          return;
        } else {
          if (nodes[i].children.length > 0) {
            this.getChildEmbededNode(nodes[i].children, stepNo);
          }

        }
      }
    }
  }
  //for date field format
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
  getDateValue(date: string) {
    let find = this.dateFormats.find(item => item.date === date);
    if (!find) { find = this.dateFormats.find(item => item.value === date); }
    return find?.value;
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
  public showMoreButtonsSwal(title: any, type: any, confirmBtntxt: any, notConfirmText: any, cancelButtonText: string): Promise<any> {
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

  setCbpUserInfo(element: any) {
    element['createdBy'] = element['createdBy'] ? element['createdBy'] : this.loggedInUserName;
    element['createdDate'] = element['createdDate'] ? element['createdDate'] : new Date();
    element['updatedBy'] = element['updatedBy'] ? element['updatedBy'] : this.loggedInUserName;
    element['updatedDate'] = element['updatedDate'] ? element['updatedDate'] : new Date();
    // element = this.setRevision(element);
    return element;
  }
  setUserUpdateInfo(item: any) {
    item['updatedBy'] = this.loggedInUserName;
    item['updatedDate'] = new Date();
    item = this.setRevision(item);
    return item;
  }
  setNewUserInfo(item: any) {
    item['createdBy'] = this.loggedInUserName;
    item['createdDate'] = new Date();
    item['updatedBy'] = this.loggedInUserName;
    item['updatedDate'] = new Date();
    item = this.setRevision(item);
    return item;
  }
  setRevision(item: any) {
    if (!this.editorType?.cbpStandalone) {
      let internalRevision: any = 0;
      internalRevision = this._buildUtil.validateTrackChange(internalRevision, this.cbpJson.documentInfo[0]);
      if (!isNaN(internalRevision)) {
        item['internalRevision'] = internalRevision;
      }
    }
    return item;
  }
  setViewUpdateTrack() {
    if (this.selectedElement?.dgType == DgTypes.Table) {
      this.setTableTrackChange(this.selectedElement);
    }
    this.selectedElement = this.setUserUpdateInfo(this.selectedElement);
  }
  setTableTrackChange(table: any) {
    if (table['superParentTableID']) {
      table = this._buildUtil.getElementByDgUniqueID(table['superParentTableID'], this.cbpJson);
      if (!table) {
        table = this._buildUtil.getElementByDgUniqueID(Number(table['superParentTableID']), this.cbpJson);
      }
    }
    table = this.setUserUpdateInfo(table);
    return table;
  }
  setBgDgUniqueID(obj: any) {
    if (this.isBackGroundDocument) {
      obj.dgUniqueID = 'b' + obj.dgUniqueID;
    }
    return obj;
  }
  refreshNodes(cbpJson: any) {
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.dualSteps = [];
    cbpJson.section.forEach((item: any) => { this._buildUtil.setNodes(item, null, 0, false, null, this.isBackGroundDocument); });
    this.selectedElement = cbpJson.section[0];
    if (!this.selectedElement && !cbpJson.section[0]) {
      cbpJson.section = [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')];
    }
    // this._buildUtil.uniqueIdIndex = this._buildUtil.maxDgUniqueId;
    this.refreshTreeNav = !this.refreshTreeNav;
    return cbpJson;
  }
  deleteListAlert(item: any) {
    if (item.parentID) {
      if (this.selectedElement['subTabe'] === true || item['subTable'] === true) {
        this.subtabledeleteDataEelement(item, this.cbpJson.section);
        if (this.selectedElement['dgUniqueID']) { this.selectedUniqueId = this.selectedElement['dgUniqueID'] }
      }
      else {
        // if (this.backgroundJson?.section) {
        //   this.selectedElement = this._buildUtil.deleteDataEelement(item, this.backgroundJson?.section);
        // }
        this.selectedElement = this._buildUtil.deleteDataEelement(item, this.cbpJson.section);
        if (this.selectedElement?.length > 1) {
          this.selectedElement = item?.rightdualchild ? this.selectedElement[1] : this.selectedElement[0];
        }
        if (this.selectedElement['dgUniqueID']) { this.selectedUniqueId = this.selectedElement['dgUniqueID'] }
      }
      this.updateProperty = true;
      this.isViewUpdated = true;
      this.detectWholePage = true;
    }
  }
  deleteHeaderListAlert(item: any, audit: any) {
    if (audit.AuditType == "TABLE_ENTRY_HEADER_ADD" || audit.AuditType == "TABLE_DELETE_HEADER") {
      this.selectedElement = this._buildUtil.deleteHeaderDataEelement(item, this.cbpJson.documentInfo[0].header, audit);
    } else {
      this.selectedElement = this._buildUtil.deleteHeaderDataEelement(item, this.cbpJson.documentInfo[0].footer, audit);
    }

    if (this.selectedElement?.length > 1) {
      this.selectedElement = item?.rightdualchild ? this.selectedElement[1] : this.selectedElement[0];
    }
    if (this.selectedElement['dgUniqueID']) { this.selectedUniqueId = this.selectedElement['dgUniqueID'] }
    this.updateProperty = true;
    this.isViewUpdated = true;
    this.detectWholePage = true;

  }
  tabledeleteListAlert(item: any) {
    if (item.parentID) {
      this._buildUtil.tabledeleteDataEelement(item, this.cbpJson.section);
    }
  }
  subtabledeleteDataEelement(item: any, section: { children: string | any[]; }) {
    const element = this._buildUtil.getElementByNumber(item.parentID, section);
    if (element) {
      for (let j = 0; j < element.children.length; j++) {
        let childata = element.children[j];
        this.deleteSubTableUndo(childata, item);
      }
    }
  }
  deleteSubTableUndo(childata: any, item: any) {
    if (childata.calstable) {
      let rowdata = childata.calstable[0].table.tgroup.tbody[0].row;
      for (let l = 0; l < rowdata.length; l++) {
        let entryObj = rowdata[l].entry;
        for (let m = 0; m < entryObj.length; m++) {
          if (entryObj[m]) {
            const object = childata.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
            object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != item.dgUniqueID);
            for (let k = 0; k < object.children.length; k++) {
              if (object.children[k].dgType === DgTypes.Table) {
                this.deleteSubTableUndo(object.children[k], item);
              }
            }
          }
        }
      }
    }
  }
  getUniqueIdInSection(section: any, element: any) {
    return section.sectionObjects[section.sectionObjects.length - 1].dgUniqueID;
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

  // intializeDataKeys(section: any) {
  //   const secObj = section;
  //   for (let i = 0; i < secObj.length; i++) {
  //     let allData = this.cbpJson.section[i].children;
  //     this.nestedChild(allData);
  //   }
  // }
  // nestedChild(childrenData: any) {
  //   childrenData.forEach((data: any) => {
  //     if (data.dgType !== DgTypes.StepAction) {
  //       this.isDuplicateValues.push(data.dgUniqueID, data.fieldName);
  //       this.fieldsMaps.set(data.dgUniqueID, data.fieldName);
  //     }
  //     if (data.children) {
  //       this.nestedChild(data.children);
  //     }
  //   });
  // }
  setLevelForSteps(sections: any) {
    try {
      let json = JSON.parse(JSON.stringify(sections));
      json.forEach((item: any) => this.setLevelForDual(item));
      return json;
    } catch (error) {
      console.error(error)
    }
  }
  removeDuplicatesFromFieldsMap(fieldsMaps: Map<any, any>) {
    const uniqueValues = new Set();
    return new Map([...fieldsMaps].filter(([key, value]) => !uniqueValues.has(value) && uniqueValues.add(value)));
  }
  setLevelForDual(data: any, level: any = 0, indentLevel: any = null) {
    data['level'] = level;
    if (indentLevel) {
      data['indentLevel'] = indentLevel;
    }
    if (data.dgType === DgTypes.TextDataEntry || data.dgType === DgTypes.TextAreaDataEntry || data.dgType === DgTypes.FormulaDataEntry
      || data.dgType === DgTypes.NumericDataEntry || data.dgType === DgTypes.CheckboxDataEntry
      || data.dgType === DgTypes.DateDataEntry || data.dgType === DgTypes.BooleanDataEntry || data.dgType === DgTypes.DropDataEntry
    ) {
      this.isDuplicateValues.push(data.dgUniqueID, data.fieldName);
      this.fieldsMaps.set(data.dgUniqueID, data.fieldName);
      this.removeDuplicatesFromFieldsMap(this.fieldsMaps);
    }
    if (data.dgType === DgTypes.Table) {
      this.isDuplicateValues.push(data.dgUniqueID, data.fieldName);
      this.fieldsMaps.set(data.dgUniqueID, data.tableName);
      this.removeDuplicatesFromFieldsMap(this.fieldsMaps);
    }
    if (data.dgType === DgTypes.DualAction) {
      data.children.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevelForDual(item, level + 1));
      });
      data.rightDualChildren.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevelForDual(item, level + 1));
      });
    }
    if (data.children && Array.isArray(data.children) && data.dgType !== DgTypes.DualAction) {
      if (data['childSequenceType'] != SequenceTypes.DGSEQUENCES) {
        data['isIndent'] = true;
        if (!indentLevel) {
          data.children.forEach((item: any) => this.setLevelForDual(item, level + 1, 1));
        } else {
          data.children.forEach((item: any) => this.setLevelForDual(item, level + 1, indentLevel + 1));
        }
      } else {
        data.children.forEach((item: any) => this.setLevelForDual(item, level + 1));
      }
    }
  }
  attachmentObjts() {
    const attachmentObjets = this.cbpJson.section.filter((i: any) => i.dataType === DgTypes.Attachment);
    if (attachmentObjets.length !== 0) {
      attachmentObjets.forEach((item: any) => {
        item['childSequenceType'] = DgTypes.Attachment;
        item['originalSequenceType'] = DgTypes.Attachment;
      });
      let lastElement = attachmentObjets[attachmentObjets.length - 1];
      const arr = lastElement.number.split(' ');
      let alpha = arr[1];
      this._buildUtil.alphaParam = alpha;
      this._buildUtil.attachmentId = true;
    }
  }
  setHeaderFooterWaterMark(cbpJson: any) {
    if (!cbpJson.documentInfo || cbpJson.documentInfo.length === 0) {
      cbpJson.documentInfo[0] = new PropertyDocument();
    }
    if (!cbpJson.documentInfo[0]['waterMarkOptions']) {
      cbpJson.documentInfo[0]['waterMarkOptions'] = new waterMarkOptions();
    }
    if (!cbpJson.documentInfo[0]['header']) {
      cbpJson.documentInfo[0]['header'] = new Header();
    }
    if (!cbpJson.documentInfo[0]['footer']) {
      cbpJson.documentInfo[0]['footer'] = new Footer();
    }
    if (cbpJson.documentInfo[0].waterMarkOptions) {
      this.waterMarkValue = cbpJson.documentInfo[0].waterMarkOptions.text;
    }
    return cbpJson;
  }

  errorHandler(event: any) {
    event.target.src = 'assets/images/cbp-logo.png';
  }


  clear() {
    this._buildUtil.paginateIndex = 1;
    this.startIndex = 1;
    this.cbpJson = {
      documentInfo: [new PropertyDocument()],
      section: [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')]
    };
    this.selectedUniqueId = 0;
    this.documentSelected = false;
    this.formObect = undefined;
    this.selectedElement = this.cbpJson.section[0];
  }
  setPaginationIndexs(paginateIndex: any) {
    if (!paginateIndex) {
      this.startIndex = 1;
      return;
    }
    // if(paginateIndex > this.startIndex && paginateIndex < (this.startIndex+20)){
    //   return;
    // }
    if (paginateIndex <= 12) {
      this.startIndex = 1;
    } else {

      this.startIndex = (paginateIndex % 12 == 0) ? ((Math.floor(paginateIndex / 12) - 1) * 12) : (Math.floor(paginateIndex / 12) * 12) + 1;

    }
    if (this.startIndex <= 1) { this.startIndex = 1; }
  }
  setUserInfo() {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.accessToken = JSON.parse(currentUser)['access_token'];
        this.loggedInUserId = JSON.parse(currentUser)['loggedInUserID'];
        this.loggedInUserName = JSON.parse(currentUser)['username'];
        this.emailId = JSON.parse(currentUser)['emailId'];
      }
    } catch (error) { console.error(error); }
  }

  //If Section Or StepAction Contains Images Deleting all Images
  removeAllImages(item: any) {
    if (item.dgType == DgTypes.Section || item.dgType == DgTypes.StepAction) {
      item.children.forEach((pelement: any) => {
        if (pelement.dgType == DgTypes.Figures) {
          if (pelement.images.length > 0) {
            pelement.images.forEach((simg: any) => {
              this.media.forEach((image: any, mindex: any) => {
                if (image.name.includes(simg.fileName)) {
                  this.media.splice(mindex, 1);
                }
              });
            });
          }
        }
        if (pelement.children) {
          this.removeAllImages(pelement);
        }
      });
    } else if (item.dgType == DgTypes.Figures) {
      if (item.images.length > 0) {
        item.images.forEach((simg: any) => {
          this.media.forEach((image: any, mindex: any) => {
            if (image.name.includes(simg.fileName)) {
              this.media.splice(mindex, 1);
            }
          });
        });
      }
    }

  }

  resetData() {
    this.nodes = [];
    this.dataJson = { dataObjects: [], lastSessionUniqueId: 0 }
    this.layOutJson = [];
    this.cbpZip = new Cbpzip();
    this.executionOrderJson = {
      orderObjects: []
    };
    this.clearMediaFiles();
    this.clear();
    this.nodes = [];
    this.ctrlSelectedItems = [];
    this.fieldsMaps = new Map();
    this.dataFieldNumber = 0;
    this._buildUtil.uniqueIdIndex = 1;
    this.dgUniqueIDNode = 1;
    this.formObect = {
      documentInfo: [new PropertyDocument()],
      section: [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')]
    };
    this.cbpJson = {
      documentInfo: [new PropertyDocument()],
      section: [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')]
    };
    this.documentType = 'New';
    this.tableDataEntrySelected = null;
    this.documentSelected = false;
    this.elementForCopyOrCut = null;
  }


  clearBuilderJsonItems() {
    this.popupDocumentSave = true;
    this.executionOrderJson = [];
    this.dynamicSectionInfo = [];
    this.dataJson = [];
    this.cbpJson = []
    this.media = [];
    this.styleImageJson = [];
    this.styleJson = [];
    this.styleModel = new styleModel();
    this.attachment = [];
    this.defaultStyleImageStyle = []
  }


  checkDataEntryDgTypes(object: any) {
    if (object.dgType === DgTypes.TextDataEntry || object.dgType === DgTypes.TextAreaDataEntry ||
      object.dgType === DgTypes.NumericDataEntry || object.dgType === DgTypes.DateDataEntry ||
      object.dgType === DgTypes.BooleanDataEntry || object.dgType === DgTypes.CheckboxDataEntry ||
      object.dgType === DgTypes.VerificationDataEntry) {
      return true;
    }
    return false;
  }

  // deleteMediaBlobs(fileName:any){
  //   const indexUrl = this.mediaBlobs.findIndex((item: any) => item.fileName === fileName);
  //   this.mediaBlobs.splice(indexUrl, 1);
  // }
  clearMediaFiles() {
    this.media = [];
    this.attachment = [];
    this.media = [];
    this.mediaUrls = [];
    // this.mediaBlobs = [];
  }
  upArrowData(id: any) {
    if (this.selectedElement.children !== undefined) {
      this.upArrowReUseCode(this.selectedElement.children, id);
    }
    const element = this._buildUtil.getElementByNumber(this.selectedElement.parentID, this.cbpJson.section);
    if (element && element.children) {
      this.upArrowReUseCode(element.children, id);
    };
    // if (this.backgroundJson?.section) {
    //   const blackElement = this._buildUtil.getElementByNumber(this.selectedElement.parentID, this.backgroundJson.section);
    //   if (blackElement && blackElement.children) {
    //     this.upArrowReUseCode(blackElement.children, id);
    //   };
    // }
  }
  downArrowData(id: any) {
    if (this.selectedElement.children !== undefined) {
      this.downArrowReUseCode(this.selectedElement.children, id);
    }
    const element = this._buildUtil.getElementByNumber(this.selectedElement.parentID, this.cbpJson.section);
    if (element && element.children) {
      this.downArrowReUseCode(element.children, id);
    };
    // if (this.backgroundJson?.section) {
    //   const blackElement = this._buildUtil.getElementByNumber(this.selectedElement.parentID, this.backgroundJson.section);
    //   if (blackElement && blackElement.children) {
    //     this.upArrowReUseCode(blackElement.children, id);
    //   };
    // }
  }
  upArrowReUseCode(selecteddata: any, id: any) {
    const i = selecteddata.findIndex((i: any) => i.dgUniqueID === id);
    if (i != 0) {
      let temp = selecteddata[i - 1];
      selecteddata[i - 1] = selecteddata[i];
      selecteddata[i] = temp;
    }
  }
  downArrowReUseCode(selectedElement: any, id: any) {
    const i = selectedElement.findIndex((i: any) => i.dgUniqueID === id);
    if (selectedElement.length - 1 != i) {
      let temp = selectedElement[i + 1];
      selectedElement[i + 1] = selectedElement[i];
      selectedElement[i] = temp;
    }
  }
  setMediaFiles() {
    if (this.media.length > 0) {
      this.media.forEach((item: any) => {
        this.mediaUrls.push({ fileName: item.name, url: this.getUrlByFile(item) });
      });
      this.mediaUrls = this.removeDuplicates(this.mediaUrls, 'fileName');
    }
  }

  getUrlByFile(fileObject: any) {
    const objectURL = fileObject && fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
    const url = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    return url;
  }
  removeDuplicates(originalArray: any, prop: any) {
    const newArray = [];
    const lookupObject: any = {};
    for (var i in originalArray) { lookupObject[originalArray[i][prop]] = originalArray[i]; }
    for (i in lookupObject) { newArray.push(lookupObject[i]); }
    return newArray;
  }

  repeatValid() {
    if (this.selectedElement.repeatTimes === '' || this.selectedElement.repeatTimes === undefined) {
      this.selectedElement.repeatTimes = 1;
      this.showSwalDeactive('Please Enter Repeat in times', 'warning', 'OK');
      return false;
    }
    if (this.selectedElement.repeatTimes < 1 || this.selectedElement.repeatTimes == 0) {
      this.selectedElement.repeatTimes = 1;
      this.showSwalDeactive('Min limit for Repeat step is 1', 'warning', 'OK');
    }
    if (this.selectedElement.repeatTimes > 1000) {
      this.selectedElement.repeatTimes = 1000;
      this.showSwalDeactive('Max limit for Repeat step is 1000', 'warning', 'OK');
    }
  }
  timedValid() {
    if (this.selectedElement.timeInMinutes === '' || this.selectedElement.timeInMinutes === undefined) {
      this.selectedElement.timeInMinutes = 1;
      this.showSwalDeactive('Please Enter Time in minutes', 'warning', 'OK');
      return false;
    }
    if (this.selectedElement.timeInMinutes > 60) {
      this.selectedElement.timeInMinutes = 60;
      this.showSwalDeactive('Max limit for Timer step is 60', 'warning', 'OK');
    }
    if (this.selectedElement.timeInMinutes < 1) {
      this.selectedElement.timeInMinutes = 1;
      this.showSwalDeactive('Min limit for Timer step is 1', 'warning', 'OK');
    }
  }
  delayValid() {
    if (this.selectedElement.delayTime === '' || this.selectedElement.delayTime === undefined) {
      this.selectedElement.delayTime = 1;
      this.showSwalDeactive('Please Enter Delay Time in minutes', 'warning', 'OK');
      return false;
    }
    if (this.selectedElement.delayTime > 480) {
      this.selectedElement.delayTime = 480;
      this.showSwalDeactive('Max limit for delay step is 480', 'warning', 'OK');
    }
    if (this.selectedElement.delayTime < 1) {
      this.selectedElement.delayTime = 1;
      this.showSwalDeactive('Min limit for delays step is 1', 'warning', 'OK');
    }
  }
  copyElement() {
    if (this.selectedElement.dgType == DgTypes.Form && !this.getSelection()) {
      if (this.tableDataEntrySelected === undefined || this.tableDataEntrySelected === null || this.tableDataEntrySelected == '') {
        this.elementForCopyOrCut = {
          element: JSON.parse(JSON.stringify(this.selectedElement)),
          action: 'copy'
        };
        this.setCutCopyMethodType('success', 'Copy Successful', true);
        this.copyAuditAdded({
          source: this.elementForCopyOrCut, target: {
            actionCause: null,
            action: this.elementForCopyOrCut.action,
            element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
          }
        });
      }
      else if (this.rowSelectedEntry && !this.getSelection()) {
        this.elementForCopyOrCut = {
          element: JSON.parse(JSON.stringify(this.rowSelectedEntry)),
          action: 'copy'
        };
        this.setCutCopyMethodType('success', 'Copy Successful', true);
        this.copyAuditAdded({
          source: this.elementForCopyOrCut, target: {
            actionCause: null,
            action: this.elementForCopyOrCut.action,
            element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
          }
        });
      }
      else if (this.colSelectedEntry && !this.getSelection()) {
        this.elementForCopyOrCut = {
          element: JSON.parse(JSON.stringify(this.colSelectedEntry)),
          action: 'copy'
        };
        this.setCutCopyMethodType('success', 'Copy Successful', true);
        this.copyAuditAdded({
          source: this.elementForCopyOrCut, target: {
            actionCause: null,
            action: this.elementForCopyOrCut.action,
            element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
          }
        });
      }

      else if (this.tableDataEntrySelected && !this.getSelection()) {
        this.elementForCopyOrCut = {
          element: JSON.parse(JSON.stringify(this.tableDataEntrySelected)),
          action: 'copy'
        };
        this.setCutCopyMethodType('success', 'Copy Successful', true);
        this.copyAuditAdded({
          source: this.elementForCopyOrCut, target: {
            actionCause: null,
            action: this.elementForCopyOrCut.action,
            element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
          }
        });
      }
      else {
        this.loading = false;
      }
    }
    else if (this.selectedElement && !this.getSelection()) {
      this.elementForCopyOrCut = {
        element: JSON.parse(JSON.stringify(this.selectedElement)),
        action: 'copy'
      };
      this.setCutCopyMethodType('success', 'Copy Successful', true);
      this.copyAuditAdded({
        source: this.elementForCopyOrCut, target: {
          actionCause: null,
          action: this.elementForCopyOrCut.action,
          element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
        }
      });
    } else {
      this.loading = false;
    }
  }

  cutElement() {
    if (this.selectedElement.number == '1.0') {
      this.setCutCopyMethodType('error', 'can\'t perform ', true);
    } else {
      if (this.selectedElement && !this.getSelection()) {
        this.elementForCopyOrCut = {
          element: JSON.parse(JSON.stringify(this.selectedElement)),
          action: 'cut'
        };
        this.setCutCopyMethodType('success', 'Cut Successful', true);
        this.copyAuditAdded({
          source: this.elementForCopyOrCut, target: {
            actionCause: null,
            action: this.elementForCopyOrCut.action,
            element: JSON.parse(JSON.stringify(this.elementForCopyOrCut.element))
          }
        });
      } else {
        this.loading = false;
      }
    }
  }
  async deleteElement(element = this.selectedElement, audit: any, perform: any, showAlert = true) {
    if (element) {
      if (element?.dgSequenceNumber) {
        if (audit?.Action == '1000') {
          const { value: userConfirms, dismiss } = await this.showSwal('Are you sure you want to undo?', 'warning', 'Ok');
          if (!dismiss && userConfirms) {
            if (audit?.ActionCause == 'cut') {
              // let elementP = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpJson.section);
              // this.selectedElement = elementP;
              this.elementForCopyOrCut = {
                action: 'cut',
                element: JSON.parse(JSON.stringify(element))
              }
              this.deleteItem(element);
              let elementP = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpJson.section);
              this.selectedElement = elementP;
              this.undoPaste(audit);
              this.clearSelectionCutOrCopy();
              this.refreshTree();
              this.updateProperty = true;
              this.isViewUpdated = true;
              this.detectWholePage = true;
            } else {
              this.deleteItem(element);
            }
          } else {
            return false;
          }
        }
        else if (perform?.action == 'cut') {
          // const { value: userConfirms, dismiss } = await this.showSwal('Are you sure you want to cut?', 'warning', 'Ok');
          // if (!dismiss && userConfirms) {
          this.deleteItem(element);
          // } else {
          //   return false;
          // }
        }
        else if (showAlert) {
          const { value: userConfirms, dismiss } = await this.showSwal('Are you sure You want to Delete?', 'warning', 'Delete');
          if (!dismiss && userConfirms) {
            this.removeAllImages(element);
            this.deleteItem(element);
          } else {
            return false;
          }
        } else {
          this.deleteItem(element);
        }
      } else {
        if (audit?.Action == '1000') {
          const { value: userConfirms, dismiss } = await this.showSwal('Are you sure you want to undo?', 'warning', 'Ok');
          if (!dismiss && userConfirms) {
            if (audit?.ActionCause == 'cut') {
              let elementP = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpJson.section);
              this.selectedElement = elementP;
              this.elementForCopyOrCut = {
                action: 'cut',
                element: JSON.parse(JSON.stringify(element))
              }
              this.undoPaste(audit);
            }
            if (audit?.headerTab) {
              this.deleteHeaderListAlert(element, audit)
            } else {
              this.deleteListAlert(element);
            }

          } else {
            return false;
          }
        }
        else {
          if (audit?.headerTab) {
            this.deleteHeaderListAlert(element, audit)
          } else {
            this.deleteListAlert(element);
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
  deleteItem(element: any) {
    try {
      this.loading = true;
      this.showEditor = false;
      let deleteElementPosition: any;
      let parentObj = this._buildUtil.getElementByNumber(element.parentID, this.cbpJson.section);
      if (element?.leftdual || element?.rightdual) {
        const parent: any = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqueID, this.cbpJson.section);
        if (parent.dgType === DgTypes.DualAction) {
          const sectionParent: any = this._buildUtil.getElementByDgUniqueID(parent.parentDgUniqueID, this.cbpJson.section);
          let index = sectionParent.children.findIndex((i: any) => i.dgUniqueID == parent.dgUniqueID);
          sectionParent.children = sectionParent.children.filter((i: any) => i.dgUniqueID != parent.dgUniqueID);
          if (index === -1) { index = 0; }
          this._buildUtil.renameCurrentLevelSteps(sectionParent.children, index);
        }
      } else if (element?.dualStep) {
        const parent: any = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqueID, this.cbpJson.section);
        if (parent?.dgUniqueID !== element.dgUniqueID) {
          const parent: any = this._buildUtil.getElementByNumber(element.parentID, this.cbpJson.section);
          if (parent?.length === 3) {
            let left = element?.leftdualchild ? true : false;
            let index = parent.findIndex((item: any) => item.dgType !== DgTypes.DualAction && item.leftdual === left);
            if (Array.isArray(parent[index].children)) {
              let ind = parent[index].children.findIndex((i: any) => i.dgUniqueID == element.dgUniqueID);
              if (ind !== -1)
                parent[index].children.splice(ind, 1)
            }
            if (Array.isArray(parent[index].rightDualChildren)) {
              let inde = parent[index].rightDualChildren.findIndex((i: any) => i.dgUniqueID == element.dgUniqueID);
              if (inde !== -1)
                parent[index].rightDualChildren.slice(inde, 1)
            }
          }
        } else if (parent?.dgType === DgTypes.DualAction) {
          let leftvalue = parent.children.findIndex((i: any) => i.dgUniqueID == element.dgUniqueID);
          let rightvalue = parent.rightDualChildren.findIndex((i: any) => i.dgUniqueID == element.dgUniqueID);
          if (leftvalue != -1 && parent) {
            parent.children = parent.children.filter((i: any) => i.dgUniqueID != element.dgUniqueID);
          }
          if (rightvalue != -1 && parent) {
            parent.rightDualChildren = parent.rightDualChildren.children.filter((i: any) => i.dgUniqueID != element.dgUniqueID);
          }
        } else {
          if (parent) {
            let index = parent.children.findIndex((i: any) => i.dgUniqueID == element.dgUniqueID);
            parent.children = parent.children.filter((i: any) => i.dgUniqueID != element.dgUniqueID);
            console.log(parent.children);
            this._buildUtil.renameCurrentLevelSteps(parent.children, index);
            if (element?.dualStepType === 'DualStepAlignment') {
              const parentDual: any = this._buildUtil.getElementByNumber(element.number, this.cbpJson.section);
              let index = parentDual.children.findIndex((i: any) => i.number == element.number);
              parentDual.children = parentDual.children.filter((i: any) => i.number != element.number);
              this._buildUtil.renameCurrentLevelSteps(parentDual.children, index);
            }
          }
        }
      } else {
        if (element?.parentID) {
          if (parentObj) {
            deleteElementPosition = parentObj?.children.findIndex((child: any) => child.number == element.number && child.dgUniqueID == element.dgUniqueID);
          }
        }
        this.cbpJson.section = this._buildUtil.deleteStep(element, this.cbpJson.section);
      }
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpJson.section);
      if (element?.paginateIndex === 1) { element.paginateIndex = 2; }
      let item =
        this._buildUtil.getElementBypaginationIndex(element.paginateIndex - 1, this.cbpJson.section);
      if (item == undefined && element?.parentID) {
        if (parentObj) {
          if (deleteElementPosition != parentObj?.children?.length - 1 && (deleteElementPosition - 1) != -1 && (deleteElementPosition - 1) <= parentObj?.children?.length - 1)
            item = parentObj?.children[deleteElementPosition - 1];
          if (item?.children?.length > 0) {
            item = item?.children[item?.children?.length - 1];
          }
        }
      }
      if (element?.dgSequenceNumber && item?.length > 0) {
        item = item?.filter((selecteElement: any) => selecteElement?.dgSequenceNumber)
      }
      this.selectedElement = item?.length > 0 ? item[0] : (item ? item : this.cbpJson.section[0]);
      if (this.selectedElement?.dualStepType == "DualStepFreeForm" && this.selectedElement?.rightdual) {
        const dualObjs: any = this._buildUtil.getElementByNumber(this.selectedElement?.number, this.cbpJson.section);
        dualObjs.forEach((obj: any) => {
          if (obj?.leftdual == true) {
            this.selectedElement = obj;
          }
        })
      }
      this.selectedUniqueId = this.selectedElement.dgUniqueID;
      this.gotoCurrentDiv(this.selectedElement.dgUniqueID);
      this.updateProperty = true;
      this.isViewUpdated = true;
      this.detectWholePage = true;
      this.refreshTreeNav = !this.refreshTreeNav;
      this.showEditor = true;
      this.loading = false;
    } catch (error) {
      console.error('deleteItem cbp service file:' + error)
      this.loading = false;
    }
  }
  // undo cut-paste start
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.displayMsg = dgTypeMsg;
    this.errorDgType = dgType;
    this.showErrorPopup = true;
  }
  isDataEntry(obj: any) {
    if (obj.dgType === DgTypes.TextDataEntry || obj.dgType === DgTypes.TextAreaDataEntry || obj.dgType === DgTypes.FormulaDataEntry
      || obj.dgType === DgTypes.NumericDataEntry || obj.dgType === DgTypes.Table || obj.dgType === DgTypes.CheckboxDataEntry
      || obj.dgType === DgTypes.DateDataEntry || obj.dgType === DgTypes.BooleanDataEntry || obj.dgType === DgTypes.DropDataEntry) {
      return true;
    }
    return false;
  }
  isDataEntryAccept(obj: any) {
    return (obj.dgType === DgTypes.StepAction || obj.dgType === DgTypes.Repeat || obj.dgType === DgTypes.Timed);
  }
  changeObj(audit: any) {
    if (audit?.Index < 0 || audit?.Index > this.selectedElement?.children?.length) {
      console.error("Something Went Wrong");
      return;
    }
    let oldId = JSON.parse(JSON.stringify(this.elementForCopyOrCut.element?.dgUniqueID));
    this.elementForCopyOrCut.element.number = audit.number;
    this.elementForCopyOrCut.element.level = audit.level;
    this.elementForCopyOrCut.element.originalSequenceType = audit.originalSequenceType;
    this.elementForCopyOrCut.element.childSequenceType = audit.childSequenceType;
    let firstObj = JSON.parse(JSON.stringify(this.selectedElement));
    firstObj.children = JSON.parse(JSON.stringify(this.selectedElement.children.slice(0, audit.Index)));
    let seconObj: any;
    if (this.selectedElement?.children.length > audit.Index) {
      seconObj = JSON.parse(JSON.stringify(this.selectedElement));
      seconObj.children = JSON.parse(JSON.stringify(this.selectedElement.children.slice(audit.Index)));
    }
    let obj: any = this._buildUtil.changeChildProps(firstObj, JSON.parse(JSON.stringify(this.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex());
    obj['state'] = { hidden: false };
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    let newId = JSON.parse(JSON.stringify(obj?.dgUniqueID));
    this._buildUtil.updateDgUniqueID(oldId, newId);
    obj['parentID'] = this.selectedElement.number;
    obj['level'] = this.selectedElement['level'] + 1;
    // this.selectedElement.children.push(obj);
    // this.selectedElement.children.splice(audit.Index, 0, obj);  // Insert at the specified index
    this.selectedElement.children = firstObj.children;
    this.selectedElement.children.push(obj);

    if (seconObj?.children.length > 0) {
      seconObj.children.forEach((child: any) => {
        let obj2: any = this._buildUtil.changeChildProps(this.selectedElement, JSON.parse(JSON.stringify(child)), this._buildUtil.getUniqueIdIndex());
        this.selectedElement.children.push(obj2);
      });
    }
    // this.selectedUniqueId = obj.dgUniqueID;
    // this.selectedElement  = obj;
  }
  noChange(audit: any) {
    this.elementForCut = JSON.parse(JSON.stringify(this.elementForCopyOrCut.element));
    this.elementForCut.parentID = JSON.parse(JSON.stringify(this.selectedElement.dgSequenceNumber));
    // this.selectedElement.children.push(this.elementForCut);
  }
  sameObj(audit: any) {
    let obj: any = JSON.parse(JSON.stringify(this.elementForCopyOrCut.element));
    obj['state'] = { hidden: true };
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    obj['parentID'] = this.selectedElement.number;
    obj['level'] = this.selectedElement['level'] + 1;
    obj['parentDgUniqId'] = this.selectedElement.dgUniqueID;
    obj.images.forEach((element: any) => {
      element.parentID = JSON.parse(JSON.stringify(this.selectedElement.dgSequenceNumber));
    })
    // this.selectedElement.children.push(obj);
    this.selectedElement.children.splice(audit.Index, 0, obj);  // Insert at the specified index
  }
  clearSelectionCutOrCopy() {
    this.elementForCopyOrCut = null;
    this.elementForCut = null;
  }
  SelectionCutOrCopy() {
    this.selectedElement = this.elementForCopyOrCut.element;
    this.selectedUniqueId = this.elementForCopyOrCut.element.dgUniqueID;
  }
  refreshTree() {
    this.cbpJson = this.refreshNodes(this.cbpJson);
    this.refreshTreeNav = !this.refreshTreeNav;
  }
  undoPaste(audit: any) {
    // if (!this.elementForCopyOrCut.element.numberedSubSteps || this.elementForCopyOrCut.element.isDataEntry !== undefined) {
    if (!audit.ParentID && audit.level == 0 && audit.number?.endsWith('.0')) {
      this.elementForCut = JSON.parse(JSON.stringify(this.elementForCopyOrCut.element));
      this.elementForCut.number = audit.number;
      this.elementForCut.dgSequenceNumber = audit.number;
      this.elementForCut.level = audit.level;
      this.elementForCut.originalSequenceType = audit.originalSequenceType;
      this.elementForCut.childSequenceType = audit.childSequenceType;
      this.elementForCut.parentID = null;
      this.elementForCut.parentDgUniqueID = null;
      delete this.elementForCut.refresh;
      delete this.elementForCut.styleNumber;
      delete this.elementForCut.itemFontSize;
      delete this.elementForCut.componentInformation;
      if (this.elementForCut?.aType) {
        delete this.elementForCut.aType;
      }
      let seconObj: any;
      if (this.cbpJson.section.length > audit.Index) {
        seconObj = JSON.parse(JSON.stringify(this.cbpJson.section.slice(audit.Index)));
      }
      this._buildUtil.renameChildLevelSteps(this.elementForCut)
      this.cbpJson.section.splice(audit.Index, 0, this.elementForCut);
      this._buildUtil.renameMasterSteps(this.cbpJson.section, audit.Index + 1, null, +1, true, true);
      this.clearSelectionCutOrCopy();
      return;
    }
    if (this.elementForCopyOrCut.element.dgType === DgTypes.Figures) {
      if (this.elementForCopyOrCut && this.elementForCopyOrCut.action == 'cut') {
        this.elementForCut = JSON.parse(JSON.stringify(this.elementForCopyOrCut.element));
        this.elementForCut.parentID = JSON.parse(JSON.stringify(this.selectedElement.dgSequenceNumber));
        this.elementForCut.images.forEach((element: any) => {
          element.parentID = JSON.parse(JSON.stringify(this.selectedElement.dgSequenceNumber));
        })
        // this.selectedElement.children.push(this.elementForCut);
        this.selectedElement.children.splice(audit.Index, 0, this.elementForCut);
        this.selectedElement = this.elementForCopyOrCut.element ? this.elementForCopyOrCut.element : this.selectedElement.children.slice(-1)[0];
        this.clearSelectionCutOrCopy()
      }
    }
    else {
      if (this.elementForCopyOrCut && this.elementForCopyOrCut.action == 'cut') {
        if ((this.elementForCopyOrCut.element.dgType == DgTypes.Table && this.selectedElement.dgType != DgTypes.Section) || (this.isDataEntry(this.elementForCopyOrCut.element) && !this.isDataEntryAccept(this.selectedElement)
          && !(this.selectedElement.dgType === DgTypes.Section && this.elementForCopyOrCut.element.dgType === DgTypes.FormulaDataEntry))) {
          this.showErrorMsg(DgTypes.Warning, this.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.elementForCopyOrCut.element.dgType);
        } else if (this.selectedElement.dgType == DgTypes.Section && (this.elementForCopyOrCut.element.dgType == DgTypes.VerificationDataEntry
          || this.elementForCopyOrCut.element.dgType == DgTypes.SignatureDataEntry || this.elementForCopyOrCut.element.dgType == DgTypes.InitialDataEntry)) {
          this.showErrorMsg(DgTypes.Warning, this.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.elementForCopyOrCut.element.dgType);
        } else if (this.selectedElement.dgType === DgTypes.Section &&
          this.elementForCopyOrCut.element.dgType !== DgTypes.Link &&
          this.elementForCopyOrCut.element.dgType !== DgTypes.Warning && this.elementForCopyOrCut.element.dgType !== DgTypes.Caution
          && this.elementForCopyOrCut.element.dgType !== DgTypes.Note && this.elementForCopyOrCut.element.dgType !== DgTypes.Alara && this.elementForCopyOrCut.element.dgType !== DgTypes.LabelDataEntry
          && this.elementForCopyOrCut.element.dgType !== DgTypes.Para && this.elementForCopyOrCut.element.dgType !== DgTypes.FormulaDataEntry) {
          this.changeObj(audit);
          // this.SelectionCutOrCopy();
        } else if (this.elementForCopyOrCut.element.dgType == DgTypes.Link ||
          this.elementForCopyOrCut.element.dgType == DgTypes.Warning || this.elementForCopyOrCut.element.dgType == DgTypes.Caution
          || this.elementForCopyOrCut.element.dgType == DgTypes.Note || this.elementForCopyOrCut.element.dgType == DgTypes.Alara
          || this.elementForCopyOrCut.element.dgType == DgTypes.LabelDataEntry || this.elementForCopyOrCut.element.dgType == DgTypes.Para
          || this.elementForCopyOrCut.element.dgType == DgTypes.FormulaDataEntry) {
          this.noChange(audit);
          this.selectedElement.children.splice(audit.Index, 0, this.elementForCut);
          // this.SelectionCutOrCopy();
          this.clearSelectionCutOrCopy();

        } else if ((this.isDataEntryAccept(this.selectedElement) && this.isDataEntry(this.elementForCopyOrCut.element))
          || (this.elementForCopyOrCut.element.dgType == DgTypes.VerificationDataEntry
            || this.elementForCopyOrCut.element.dgType == DgTypes.SignatureDataEntry || this.elementForCopyOrCut.element.dgType == DgTypes.InitialDataEntry)) {
          this.noChange(audit);
          this.selectedElement.children.splice(audit.Index, 0, this.elementForCut);
          this.clearSelectionCutOrCopy();
        } else {
          this.changeObj(audit);
          // this.SelectionCutOrCopy();
        }
      } else {
        console.log("Undo Paste else called");
      }
    }
  }
  gotoCurrentDiv(number: any) {
    if ($("#" + number).length !== 0) {
      $('#' + number)[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }
  setCutCopyMethodType(type: any, message: any, iselement: any) {
    this.copyCutType = type;
    this.copyCutMessage = message;
    this.isCutcopyElement = iselement;
  }
  getSelection() {
    if (window.getSelection) {  // all browsers, except IE before version 9
      let selectionRange: any = window.getSelection();
      return selectionRange.toString();
    }
  }
  setNotifier(type: any, mesgValue: any) {
    this.setAndResetNotifier(true, mesgValue, type);
  }
  clearNotifier() {
    this.setAndResetNotifier(false, '', '');
  }
  setAndResetNotifier(enable: boolean, mesg: string, type: string) {
    this.notifierMesg.enable = enable;
    this.notifierMesg.mesg = mesg;
    this.notifierMesg.type = type;
  }

  copyAuditAdded(element: any) {
    this.copyAudit.next(element);
  }

  // Find & Replace data share
  setSearchObj(searchObj: any) {
    this.searchObj = searchObj;
    this.searchNavigate.next(true);
  }
  getSearchObj() {
    return this.searchObj;
  }
  //RE ORDER SECTIONS
  moveUpNumberedElements(item: any, id: any) {
    let secObj = this.cbpJson.section;
    const selectedSection = this._buildUtil.getElementByNumber(item.parentID, secObj)
    let i = secObj.findIndex((i: any) => i.dgUniqueID === id);
    let k = i - 1;
    if (!selectedSection) {
    } else {
      secObj = selectedSection.children;
      i = secObj.indexOf(item); // 1
      k = i - 1;
    }
    secObj.forEach((e: any, n: any) => {
      if (n == i && i != 0) {
        let prevObject: any;
        let prevPosition: any = 1;
        if (secObj[i]?.dgSequenceNumber) {
          for (let m = i - prevPosition; m >= 0; m--) {
            if (secObj[m]?.dgSequenceNumber) {
              prevObject = secObj[m];
              prevPosition = i - m;
              break;
            }
          }
        } else {
          prevObject = secObj[i - prevPosition];
        }
        let currentObjectPosition = secObj[i].position;
        let currentIsLastChild = secObj[i].isLastChild;
        secObj[i - prevPosition] = secObj[i];
        secObj[i - prevPosition].position = prevObject.position;
        secObj[i - prevPosition].isLastChild = prevObject.isLastChild;
        secObj[i] = prevObject;
        secObj[i].isLastChild = currentIsLastChild;
        console.log(currentObjectPosition);
        secObj[i].position = currentObjectPosition;

        // const currentObj = secObj[i];
        // secObj[i - prevPosition] = currentObj;
        // secObj[i] = prevObject;
        // [currentObj.position, prevObject.position] = [prevObject.position, currentObj.position];
        // [currentObj.isLastChild, prevObject.isLastChild] = [prevObject.isLastChild, currentObj.isLastChild];

        // i == secObj.length - 1 ? secObj[i].isLastChild = true : secObj[i].isLastChild = false;
        let fistElement = JSON.parse(JSON.stringify(secObj[i - prevPosition]));
        let secondElement = JSON.parse(JSON.stringify(secObj[i]));
        secObj[i] = this.setSectionObject(secObj[i], fistElement, secondElement);
        secObj[i - prevPosition] = this.setSectionObject(secObj[i - prevPosition], secondElement, fistElement);
        fistElement.children.forEach((item: any) => {
          item.parentID = fistElement.parentID;
        })
        fistElement.children = this._buildUtil.reUpdateTrackChanges(fistElement.children);
        secondElement.children.forEach((item: any) => {
          item.parentID = secondElement.parentID;
        })
        secondElement.children = this._buildUtil.reUpdateTrackChanges(secondElement.children);
        this._buildUtil.renameChildLevelSteps(secObj[i - prevPosition], true, true);
        this._buildUtil.renameChildLevelSteps(secObj[i], true, true);
        this.refreshTreeNav = !this.refreshTreeNav;
      }
    });
  }
  backSetUp(item: any, id: any) {
    let backsecObj = this.backgroundJson.section;
    const selectedSection = this._buildUtil.getElementByNumber(item.parentID, backsecObj)
    let i = backsecObj.findIndex((i: any) => i.dgUniqueID === id);
    let k = i - 1;
    if (!selectedSection) {
    } else {
      backsecObj = selectedSection.children;
      i = backsecObj.findIndex((i: any) => i.dgUniqueID === item.dgUniqueID); // 1
      k = i - 1;
    }
    backsecObj.forEach((e: any, n: any) => {
      if (n == i && i != 0) {
        let temp = backsecObj[i - 1];
        backsecObj[i - 1] = backsecObj[i];
        backsecObj[i] = temp;
        let fistElement = JSON.parse(JSON.stringify(backsecObj[i - 1]));
        let secondElement = JSON.parse(JSON.stringify(backsecObj[i]));
        backsecObj[i] = this.setSectionObject(backsecObj[i], fistElement, secondElement);
        backsecObj[i - 1] = this.setSectionObject(backsecObj[i - 1], secondElement, fistElement);
        fistElement.children.forEach((item: any) => {
          item.parentID = fistElement.parentID;
        })
        fistElement.children = this._buildUtil.reUpdateTrackChanges(fistElement.children);
        secondElement.children.forEach((item: any) => {
          item.parentID = secondElement.parentID;
        });
        secondElement.children = this._buildUtil.reUpdateTrackChanges(secondElement.children);
        this._buildUtil.renameChildLevelSteps(backsecObj[i - 1], true, true);
        this._buildUtil.renameChildLevelSteps(backsecObj[i], true, true);
        //  this.refreshTreeNav = !this.refreshTreeNav;
      }
    });
  }
  setSectionObject(secObj: any, fistElement: any, secondElement: any) {
    secObj.number = fistElement.number;
    secObj.dgSequenceNumber = fistElement.dgSequenceNumber;
    const title = secObj.dgType === DgTypes.StepAction ? secObj.action : secObj.title;
    if (title) {
      secObj.text = secObj.number + ' ' + title.slice(0, 25) + (title.length > 25 ? '...' : '');
    } else {
      secObj.text = secObj.number + ' '
    }
    secObj = this.setUserUpdateInfo(secObj);
    const parsedData = secondElement?.children ? JSON.parse(JSON.stringify(secondElement.children)) : null;
    if (parsedData) {
      secObj.children = parsedData;
    }
    return secObj;
  }
  moveDownNumberedElements(item: any, id: any) {
    let secObj = this.cbpJson.section;
    const selectedSection = this._buildUtil.getElementByNumber(item.parentID, secObj);
    let i = secObj.findIndex((i: any) => i.dgUniqueID === id);
    let k = i - 1;
    if (!selectedSection) {
    } else {
      secObj = selectedSection.children;
      i = secObj.indexOf(item); // 1
      k = i - 1;
    }
    secObj.forEach((e: any, n: any) => {
      if (n == i && secObj.length - 1 != i) {
        let nextObject: any;
        let nextPosition: any = 1;
        if (secObj[i]?.dgSequenceNumber) {
          for (let m = i + nextPosition; m < secObj?.length; m++) {
            if (secObj[m]?.dgSequenceNumber) {
              nextObject = secObj[m];
              nextPosition = m - i;
              break;
            }
          }
        } else {
          nextObject = secObj[i + nextPosition];
        }
        let currentObjectPosition = secObj[i].position;
        let currentIsLastChild = secObj[i].isLastChild;
        secObj[i + nextPosition] = secObj[i];
        secObj[i + nextPosition].position = nextObject.position;
        secObj[i + nextPosition].isLastChild = nextObject.isLastChild;
        secObj[i] = nextObject;
        secObj[i].position = currentObjectPosition;
        secObj[i].isLastChild = currentIsLastChild;

        // const currentObj = secObj[i];
        // secObj[i + nextPosition] = currentObj;
        // secObj[i] = nextObject;
        // [currentObj.position, nextObject.position] = [nextObject.position, currentObj.position];
        // [currentObj.isLastChild, nextObject.isLastChild] = [nextObject.isLastChild, currentObj.isLastChild];

        // (i) == secObj.length - 1 ? secObj[i].isLastChild = true : secObj[i].isLastChild = false;
        let fistElement = JSON.parse(JSON.stringify(secObj[i + nextPosition]));
        let secondElement = JSON.parse(JSON.stringify(secObj[i]));
        secObj[i] = this.setSectionObject(secObj[i], fistElement, secondElement);
        secObj[i + nextPosition] = this.setSectionObject(secObj[i + nextPosition], secondElement, fistElement);
        fistElement.children.forEach((item: any) => {
          item.parentID = fistElement.parentID;
        })
        fistElement.children = this._buildUtil.reUpdateTrackChanges(fistElement.children);
        secondElement.children.forEach((item: any) => {
          item.parentID = secondElement.parentID;
        })
        secondElement.children = this._buildUtil.reUpdateTrackChanges(secondElement.children);
        this._buildUtil.renameChildLevelSteps(secObj[i + nextPosition], true, true);
        this._buildUtil.renameChildLevelSteps(secObj[i], true, true);
        this.refreshTreeNav = !this.refreshTreeNav;
      }
    });
  }

  backSetDown(item: any, id: any) {
    let backsecObj = this.backgroundJson.section;
    const selectedBackSection = this._buildUtil.getElementByNumber(item.parentID, backsecObj);
    let i = backsecObj.findIndex((i: any) => i.dgUniqueID === id);
    let k = i - 1;
    if (!selectedBackSection) {
    } else {
      backsecObj = selectedBackSection.children;
      // i = backsecObj.indexOf(item); // 1
      i = backsecObj.findIndex((i: any) => i.dgUniqueID === item.dgUniqueID);
      k = i - 1;
    }
    backsecObj.forEach((e: any, n: any) => {
      if (n == i && backsecObj.length - 1 != i) {
        let temp = backsecObj[i + 1];
        backsecObj[i + 1] = backsecObj[i];
        backsecObj[i] = temp;
        let fistElement = JSON.parse(JSON.stringify(backsecObj[i + 1]));
        let secondElement = JSON.parse(JSON.stringify(backsecObj[i]));
        backsecObj[i] = this.setSectionObject(backsecObj[i], fistElement, secondElement);
        backsecObj[i + 1] = this.setSectionObject(backsecObj[i + 1], secondElement, fistElement);

        fistElement.children.forEach((item: any) => {
          item.parentID = fistElement.parentID;
        })
        secondElement.children.forEach((item: any) => {
          item.parentID = secondElement.parentID;
        })
        this._buildUtil.renameChildLevelSteps(backsecObj[i + 1], true, true);
        this._buildUtil.renameChildLevelSteps(backsecObj[i], true, true);
        //  this.refreshTreeNav = !this.refreshTreeNav;
      }
    });
  }
  setFieldNumber() {
    if (this.dataFieldNumber < this.fieldsMaps.size) {
      this.dataFieldNumber = this.fieldsMaps.size;
    }
  }
  setDataEntryFieldName(field: any, dgType: DgTypes) {
    this.setFieldNumber();
    if (!field.fieldNameUpdated) {
      field.fieldName = dgType + (++this.dataFieldNumber);
      field.fieldNameUpdated = true;
    }
    let result = [...this.fieldsMaps.values()].includes(field.fieldName);
    if (!this.isDuplicateValues.includes(field.fieldName)) {
      if (result && field.fieldName && !field.fieldNameUpdated) {
        field.fieldName = field.fieldName + "-A";
        this.fieldsMaps.set(field.dgUniqueID, field.fieldName);
      }
    } else {
      if (result && field.fieldName && !field.fieldNameUpdated) {
        field.fieldName = field.fieldName + field.dgUniqueID;
      }
      this.isDuplicateValues = this.isDuplicateValues.filter(res => res !== field.fieldName);
    }
    this.fieldsMaps.set(field.dgUniqueID, field.fieldName);
    return field;
  }
  getImageDimension(image: any): Observable<any> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = function (event) {
        const loadedImage: any = event.currentTarget;
        image.width = loadedImage.width;
        image.height = loadedImage.height;
        observer.next(image);
        observer.complete();
      }
      img.src = image.url;
    });
  }

  messageCondition(obj: any) {
    return (obj?.dgType === DgTypes.Warning || obj?.dgType === DgTypes.Caution) ? true : false;
  }

  checkEditorOpenInTable(bol: boolean, field: any) {
    if (field.isTableDataEntry) this.isTableEditorOpen = bol;
  }
  getTitleLength(size: number, text: string) {
    if (size < 60) {
      if (size == 33.33) {
        return text.substring(0, 7);
      }
      if (size == 25 || size == 15) {
        return text.substring(0, 4);
      }
      if (size < 15) {
        return text.substring(0, 2);
      }
    }
    return text;
  }

  checkDualSteps(object: any) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.DualAction) {
          this._buildUtil.dualSteps.push({ id: object[i].dgUniqueID, added: false, obj: object[i] });
        }
        if (object[i].children && object[i]?.children?.length > 0) {
          this.checkDualSteps(object[i].children);
        }
      }
    }
  }
  setCover() {
    if (this.selectedElement?.coverPageTable) {
      this.selectedUniqueId = 0;
      this.documentSelected = true;
    }
  }

  splitLastOccurrence(str: string, substring: string) {
    const lastIndex = str.lastIndexOf(substring);
    let array = [];
    array.push(str.slice(0, lastIndex), str.slice(lastIndex + 1));
    return array;
  }

  updaterParaWithBackgroundCBPFile() {
    for (let i = 0; i < this._buildUtil.paraList.length; i++) {
      let obj = this._buildUtil.paraList[i];
      if (obj.dgType === DgTypes.Table && obj?.parentDgUniqueId) {
        obj.parentDgUniqueID = obj.parentDgUniqueId;
      }
      const step = this._buildUtil.getElementByDgUniqueID(obj.parentDgUniqueID, this.cbpJson.section)
      if (step) {
        let findDup = step.children.find((item: any) => item.dgUniqueID == obj.dgUniqueID)
        if (!findDup)
          step.children.push(obj);
      }
    }
  }
  validateNumberField(event: any, inputData: any) {
    const key = event.key;
    const currentValue = inputData?.toString() || '';
    const isNumber = this.containsOnlyNumbers(key);
    if (!isNumber || key === 'e' || key === '-' || key === '+') {
      event.preventDefault();
      return false;
    }
    const newValueNumber = parseInt((currentValue + key), 10);
    if (newValueNumber > event?.target?.max || newValueNumber < event?.target?.min) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  validatePasteContentForNumberField(event: any, eventFrom: any): boolean {
    const clipboardData: any = event?.clipboardData;
    const pastedData = clipboardData?.getData('text/plain') || '';
    const isValidNumber = this.containsOnlyNumbers(pastedData)
    const pastedNumber = parseInt(pastedData, 10);
    if (!isValidNumber || pastedNumber < event?.target?.min || pastedNumber > event?.target?.max) {
      event.preventDefault();
      this.elementForCopyOrCut = null;
      this.notifier.notify('error', 'Pasted value exceeding the ' + eventFrom + ' size ' + event?.target?.max + ' Please enter lesser value');
      return false;
    }
    return true;
  }
  containsOnlyNumbers(str: string) {
    return /^\d+$/.test(str);
  }
  validateTrackChange(internalRevision: any, documentInfo: any) {
    if (documentInfo?.internalRevision && documentInfo?.internalRevision != "" && documentInfo?.internalRevision != undefined) {
      internalRevision = documentInfo?.internalRevision;
    }
    return internalRevision;
  }
  setParentStepInfo(obj: any, selectedElement: any) {
    obj = this._buildUtil.setParentStepInfo(obj, selectedElement);
    return obj;
  }
  setDynamicFalseToSteps(object: any) {
    if (object?.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section || object[i].dgType === DgTypes.StepAction || object[i].dgType === DgTypes.Repeat
          || object[i].dgType === DgTypes.Timed
        ) {
          object[i].dynamic_section = false;
          object[i].hide_section = false;
          object[i].dynamic = false;
          object[i].dynamic_number = 1;
          object[i]['protectDynamic'] = false;
        }
        if (object[i].children && object[i]?.children?.length > 0) {
          this.setDynamicFalseToSteps(object[i].children);
        }
      }
    }
  }
  validateNumericInput(event: ClipboardEvent | KeyboardEvent, currentValue: any, decimalLimit: number, allowNegative: boolean = true): void {
    const isPaste = event.type === 'paste';
    const input = isPaste ? (event as ClipboardEvent).clipboardData?.getData('text') || '' : String.fromCharCode((event as any).keyCode || (event as any).which);
    const value = (currentValue || '').toString().trim();
    decimalLimit = Number(decimalLimit);
    const isNegativeAllowed = allowNegative && input === '-' && value.length === 0;
    const isDigit = /^[0-9]$/.test(input);
    const isDot = input == '.' && !value.includes('.') && value.length > 0 && decimalLimit > 0 && value != '-';
    let isDecimalValid = true;
    if (value.includes('.') && decimalLimit > 0) {
      const [, decimals = ''] = value.split('.');
      if (decimals.length >= decimalLimit) {
        isDecimalValid = false;
      }
    }
    const isValid = ((isNegativeAllowed || isDigit || isDot) && (isDecimalValid));
    if (!isValid) {
      event.preventDefault?.();
      (event as any).returnValue = false;
    }
  }

  updateCoverPageTableValues(colsObj: any, item: any) {
    if (!Array.isArray(colsObj)) return;
    let element = this._buildUtil.getElementByProperty(colsObj, item)
    if (element) {
      const itemProp = item.property;
      const itemValue = item[itemProp];
      if (item?.isEditable === 1) {
        element[itemProp] = itemValue;
      } else {
        item[itemProp] = element[itemProp];
      }
    }
  }
}
