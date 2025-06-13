import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  isDevMode,
  OnDestroy, OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import JSZip from 'jszip';
import { fromEvent, merge, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, debounce, map } from 'rxjs/operators';
import { PropertyComponent } from '../components/property/property.component';
import {
  Actions,
  AuditTypes,
  DelayStep,
  EmbededSection, Paragraph,
  Repeat,
  Section, StepAction, StepInfo,
  StyleLevel,
  Timed
} from '../models';
import { BuilderService } from '../services/builder.service';
import { CbpService } from '../services/cbp.service';
import { DataSharingService, Request_Msg } from '../services/data-sharing.service';
import { BuilderUtil } from '../util/builder-util';
const stylesJson = require('src/assets/cbp/json/default-styles.json');
const styleImageJson = require('src/assets/cbp/json/style-image.json');
const defaultImageJson = require('src/assets/cbp/json/default-style-image.json');
const defaultLayoutJson = require('src/assets/cbp/json/default-layout.json');
const defaultContentJson = require('src/assets/cbp/json/default-content.json');
const templatesJson = require('src/assets/cbp/json/templates.json');

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import AlphanumericEncoder from 'alphanumeric-encoder';
import {
  AlertMessages,
  CbpSharedService,
  CoverPageFrom,
  Dependency,
  DgTypes,
  DownloadCbpComponent,
  Heading,
  ImagePath,
  MathJaxService, PropertyDocument,
  SequenceTypes,
  StickyNote,
  styleModel,
  waterMarkOptions
} from 'cbp-shared';
import { TreeStructureComponent } from 'dg-shared';
import { CBP_Indv_File } from '../externalAccess/cbp_indv_files';
import { DocConfig } from '../externalAccess/doc-config';
import { EventType } from '../externalAccess/eventSource';
import { EditorComponent } from '../modules/editor/editor.component';
import { HyperLinkService } from '../modules/services/hyper-link.service';
import { AuditService } from '../services/audit.service';
import { ControlService } from '../services/control.service';
import { AntlrService } from '../shared/services/antlr.service';
import { LayoutService } from '../shared/services/layout.service';
import { SharedService } from '../shared/services/shared.service';
import { StylesService } from '../shared/services/styles.service';
import { TableService } from '../shared/services/table.service';
declare var $: any;
@Component({
  selector: 'lib-app-formbuild',
  templateUrl: './formbuild.component.html',
  styleUrls: ['./formbuild.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ],
  providers: [AuditService, BuilderService, CbpService, ControlService, MathJaxService, SharedService,
    AntlrService, LayoutService, StylesService, TableService, HyperLinkService, CbpSharedService, BuilderUtil]
})
export class FormbuildComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(PropertyComponent, { static: false }) propertyComponent!: PropertyComponent;
  @ViewChild(TreeStructureComponent, { static: false }) treeView!: TreeStructureComponent;
  control = 0;
  propertyDocument: any = new PropertyDocument();
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  coverForm = new CoverPageFrom();
  isRightsidePopupClosed = true;
  isTree = false;
  isIndexConctrolClosed = false;
  isPropertyOpen = false;
  saveModalopen = false;
  headerItem: any;
  createNode: any;
  defaultDoc = false;
  fileList: any;
  documentUploading!: boolean;
  selectedTreeNode: any;
  CoverPageView!: boolean;
  windowWidthChanged = false;
  findParaObject: any;
  //PAGINATION
  isButtonGroupShow: boolean = false;
  isReachingTop = false;
  scrollCountForUp = 0;
  isScrollBottom = false;
  //CUT COPY PASTE
  fullscreen = false;
  ESCAPE_KEYCODE: number = 27;
  elem!: any;
  //Search

  //Rename node with icon
  renameNode: any;
  isPropertyUpdated = true;
  isFreshPage = true;
  showDataEntry = false;
  showExportdrop = false;
  alpha: any = 'A';
  documentSelected: any = false;
  isTreeEvent: boolean = true;
  selectedNodeUpdate: any;
  styleLevelObj!: any;
  treeUpdated = false;
  laodingSectionTree = false;
  public windowWidth: any;
  public windowHeight: any;
  _subscriptionData: any = Subscription;
  currentEvent: any;
  @ViewChild('editor', { static: false }) editorView!: EditorComponent;
  @Input() envFiles: any;
  @Input() userConfigInfo: any;
  @Input() editorType!: any;
  @Input() cbp_Indv_File!: CBP_Indv_File;
  @Input() closeEventClick: any;
  @Input() cbpJsonZip: any;
  @Input() cbpBackJsonZip: any;
  @Output() closeBuilder: EventEmitter<any> = new EventEmitter<any>();
  @Output() getCbpFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() showExecuterPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataJsonChange: EventEmitter<any> = new EventEmitter();
  @Output() exportDoc: EventEmitter<any> = new EventEmitter();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() propertyDoc: EventEmitter<any> = new EventEmitter();
  @Output() openBackground: EventEmitter<any> = new EventEmitter();
  @Output() notifyBackgroundCbpFile: EventEmitter<any> = new EventEmitter();

  @Input() cbp_track_change: any;
  @Input() stickyUiCss = false;
  @Input() docConfig: DocConfig = new DocConfig();
  @Input() showRefferenceObject = false
  receiveMessage!: Subscription;
  loadedFiles: boolean = false;
  isBuilderRouter = false;
  setItemSubscription!: Subscription;
  sequenceTypesNew = SequenceTypes;
  setDataEntrySubscription!: Subscription;
  referenceListItems: any[] = [];
  localhost = false;
  scrollEvent: any[] = [];
  scrollStarted = false;
  countOfindex: any[] = [];
  selectedCurrentElement: any;
  newitemCreated = false;
  treeEventCount = 0;
  deleteFirstElement = false;
  fullTreeloaded = false;
  isPreviewClicked = false;
  loaded: boolean = false;
  listAttributes: any;
  @Input() attributesArray: any[] = [];
  @Input() cbpChanges: boolean = false;
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  default = "col-xs-12 col-md-12 col-lg-12";
  defaultFontFamily = 'Poppins';
  defaultFontSize = 2;
  selectedColor = '#000000'
  isAutoSaveEnable = false;
  @Input()
  isAutoSaveMessage: any = { msg: 'Auto save' };
  cpPropResponse: any;
  autoSaveEvent: any;
  autoSaveTimeInterval?: number = 1000 * 60 * 10;
  autoSaveFileName = '';
  isInit = true;
  closeCbpWindow = false;
  showCoverPage = false
  coverPageResize = false;
  nodeTreeClicked: any;
  docFileStatusNum: any;
  @Input() updatedBackground: any;
  @Input() cbpFileTabInfo: any;
  @Input() activeTab: any = 0;
  controlTabs = { basic: true, dataEntry: false, reference: false, verification: false };
  hideStyleIcons: boolean = false;
  isParentStepAction: any = false;
  isParentStepDAT: any = false;

  constructor(private cdref: ChangeDetectorRef, public cbpService: CbpService, public router: Router,
    public _buildUtil: BuilderUtil, public builderService: BuilderService, public controlService: ControlService,
    private datasharing: DataSharingService, public stylesService: StylesService, public notifier: NotifierService,
    @Inject(DOCUMENT) private document: any, public layoutService: LayoutService, private modalService: NgbModal,
    public auditService: AuditService, public tableService: TableService, public sharedService: SharedService,
    public cbpSharedService: CbpSharedService) {
    this.cbpService.isBuild = true;
    this.cbpService.ctrlSelectedItems = [];
    this._buildUtil.paginateIndex = 1;
    this.cbpService.startIndex = 1;
    this.cbpService.isDisabledControl = false;
    this.isTreeEvent = false;
    this.isBuilderRouter = this.router.url.includes('/cbp');
    this.localhost = isDevMode() ? true : false;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.cbpService.elementForCopyOrCut = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.windowWidth = window.innerWidth;
    this._buildUtil.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (this.windowWidth < 1000) {
      this.windowWidthChanged = true
    }
    this.cbpService.showNavigation = this.windowWidth < 1000 ? false : this.cbpService.cbpJson.documentInfo[0]['showNavigation'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cbp_Indv_File && this.cbp_Indv_File && !this.editorType.cbpZipMode) {
      const cbpIndividualFile = changes.cbp_Indv_File.currentValue;
      this.cbpService.dataJson = cbpIndividualFile.dataJson ? cbpIndividualFile.dataJson : [];
      this.cbpService.cbpJson = cbpIndividualFile.cbpJson;
      this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
      this.cbpService.executionOrderJson = cbpIndividualFile.executionOrderJson ? cbpIndividualFile.executionOrderJson : [];
      this.cbpService.dynamicSectionInfo = cbpIndividualFile.dynamicSectionInfo ? cbpIndividualFile.dynamicSectionInfo : [];
      this.cbpService.styleImageJson = cbpIndividualFile.styleImageJson ? cbpIndividualFile.styleImageJson : styleImageJson;
      this.cbpService.styleJson = cbpIndividualFile.styleJson ? cbpIndividualFile.styleJson : (stylesJson);
      this.cbpService.layOutJson = cbpIndividualFile.layOutJson ? cbpIndividualFile.layOutJson : (defaultLayoutJson);
      this.cbpService.attachment = cbpIndividualFile.attachment ? cbpIndividualFile.attachment : [];
      this.cbpService.media = cbpIndividualFile.media ? cbpIndividualFile.media : [];
      this.auditService.auditJson = cbpIndividualFile.auditJson ? JSON.parse(JSON.stringify(cbpIndividualFile.auditJson)) : [];
      this.auditService.undoJson = this.auditService.undoJson ? JSON.parse(JSON.stringify(cbpIndividualFile.undoJson)) : [];
      this.auditService.elementsRestoreSnapChats = this.auditService.elementsRestoreSnapChats ? JSON.parse(JSON.stringify(cbpIndividualFile.elementsRestoreSnapChats)) : [];

      this.setProperty();
      //commented due to new implementation.
      //  this.checkDynamicSection();
      this.refreshMaxDgUniqueID();
      this.cbpService.checkDualSteps(this.cbpService.cbpJson.section);
      // if (isDevMode()) {
      //   // console.log(this.cbpService.cbpJson.section);
      //   // console.log(this.cbpService.isBackGroundDocument);
      // }
      //  this.hideObject();
      if (this.cbpService.media?.length > 0)
        this.controlService.setMediaItem(this.cbpService.media);
      this.loadedFiles = true;
    }
    if (this.cbp_track_change && changes.cbp_track_change) {
      this.docFileStatusNum = changes.cbp_track_change?.currentValue?.DGC_DOCUMENT_FILE_STATUS
      // this.controlService.cbp_track_changes = this.cbp_track_change;
      // if (this.cbp_track_change['DGC_IS_BACKGROUND_DOCUMENT']) {
      //   this.cbpService.isBackGroundDocument = true;
      // }
      // if (this.cbp_track_change['DGC_BACKGROUND_DOCUMENT'] || this.cbp_track_change['DGC_BACKGROUND_DOCUMENT_FILE_ID']) {
      //   this.cbpService.primaryDocument = true;
      // }
      // if (this.cbp_track_change['DGC_IS_BACKGROUND_DOCUMENT']) {
      //   if(this.cbpService.cbpJson && this.cbpService?.cbpJson?.documentInfo)
      //   this.cbpService.cbpJson['documentInfo'][0]['isBackgroundDoc'] = true;
      // }

    }
    if (changes.cbpFileTabInfo && this.cbpFileTabInfo) {
      this.cbpFileTabInfo = changes.cbpFileTabInfo.currentValue;
      if (this.cbpFileTabInfo?.isBackgroundDocument ||
        this.cbpFileTabInfo?.documentFileData?.['DGC_IS_BACKGROUND_DOCUMENT']
      ) {
        this.cbpService.isBackGroundDocument = true;
        this.controlService.dataEntries = [{ type: DgTypes.Table, name: 'Table', icon: 'table' }];
        this.controlService.referenceList.length = 2;
      }
      if (this.cbpFileTabInfo?.documentFileData?.DGC_BACKGROUND_DOCUMENT_ID) {
        this.cbpService.primaryDocument = true;
      }
    }
    if (changes.cbpJsonZip && this.cbpJsonZip) {
      this.editorType.cbpZipMode = true;
      this.editorType.cbpZipObj = changes.cbpJsonZip.currentValue;
    }
    if (changes.editorType && this.editorType) {
      let editorType = changes.editorType.currentValue;
      this.editorType.editorMode = editorType.editorMode;
      this.editorType.viewMode = editorType.viewMode;
      if (!editorType.editorMode) {
        this.control = 0
      }
      if (!this.editorType.editorMode) {
        this.isAutoSaveEnable = false;
      }
      const autoSave = localStorage.getItem("isAutoSaveEnable")
      if (this.editorType.editorMode && autoSave == 'true') {
        this.isAutoSaveEnable = true;
      }
      this.cbpService.editorType = editorType;
      this._buildUtil.cbpStandalone = editorType?.cbpStandalone;
      if (this.editorType?.typeOfDoc == 'background') {
        this.cbpService.isBackGroundDocument = true;
      }
      if (this.cbpService.isBackGroundDocument && this.editorType?.typeOfDoc != 'background') {
        this.editorType['typeOfDoc'] = 'background';
      }

      this.changeIsAutoSaveEnable(this.isAutoSaveEnable);
      // console.log(this.editorType);
    }
    if (this.cbpBackJsonZip && changes.cbpBackJsonZip) {
      this.cbpBackJsonZip = changes.cbpBackJsonZip.currentValue;
    }
    if (changes.envFiles && this.envFiles) {
      this.envFiles = changes.envFiles.currentValue;
      this.setEdocUrls();
    }
    if (changes.userConfigInfo && this.userConfigInfo) {
      this.userConfigInfo = changes.userConfigInfo.currentValue;
      // this.cbpService.docID = this.userConfigInfo.documentFileId ? this.userConfigInfo.documentFileId : '';
      this.cbpService.docID = this.userConfigInfo?.fileInfo?.documentFileData?.DGC_DOCUMENT_ID ? this.userConfigInfo?.fileInfo?.documentFileData?.DGC_DOCUMENT_ID : '';
      this.setUserApiInfo();
    }
    if (changes.attributesArray && this.attributesArray) {
      this.controlService.attributesList = this.attributesArray;
      this.tableService.attributesList = this.attributesArray;
    }
    if (this.cbpService.listAttributes.length == 0) {
      this.getPropertiesData()
    }
    if (changes.cbpChanges && this.cbpChanges) {
      this.userConformationEvents('Close', { source: 'ework' });
    }
    if (changes.updatedBackground && changes.updatedBackground?.currentValue &&
      'cbpJson' in changes.updatedBackground?.currentValue
      && (this.cbpService.isBackGroundDocument || this.cbpFileTabInfo?.isBackGroundDocument)) {
      let backgroundCbpFile = changes.updatedBackground?.currentValue;
      this.updatedBackground = changes.updatedBackground?.currentValue;
      // console.log(backgroundCbpFile);
      if (this.cbpService.cbpJson)
        this.reUpdateCbpWithBackground(backgroundCbpFile);
    }

    if (changes.closeEventClick) {
      let value = changes.closeEventClick.currentValue;
      if (value?.update) {
        this.closeCbpWindow = true;
        this.userConformationEvents('Close');
      }
    }
    if (changes.activeTab && this.cbpService?.cbpJson) {
      let findId = this.cbpService.cbpJson?.section[0]?.id;
      if (!findId) {
        this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
        this.cbpService.cbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
      }
    }
  }
  refreshMaxDgUniqueID() {
    const self = this;
    if (self.cbpService?.cbpJson?.documentInfo[0]['maxDgUniqueID']) {
      if (self.cbpService?.cbpJson?.documentInfo[0]['maxDgUniqueID'] < Number.MAX_SAFE_INTEGER) {
        self._buildUtil.uniqueIdIndex = Number(self.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID']);
      } else {
        this.setDgUniqueID();
      }
    } else {
      this.setDgUniqueID();
    }
    self._buildUtil.maxDgUniqueId = this._buildUtil.uniqueIdIndex;
    this.setNullDgUniqueIds();
    this.setMaxDgUniqueIdToString();
  }
  setDgUniqueID() {
    const self = this;
    self.cbpService.cbpJson.section.forEach((item: any) => self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(item, self._buildUtil.uniqueIdIndex));
    self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0].header, self._buildUtil.uniqueIdIndex);
    self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0].footer, self._buildUtil.uniqueIdIndex);
    if (self.cbpService.cbpJson.documentInfo[0]?.newCoverPageeEnabled) {
      if (!self.cbpService.cbpJson.documentInfo[0]?.coverPageData) {
        self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0]?.coverPageData, self._buildUtil.uniqueIdIndex);
      }
    }
    self.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    this.setMaxDgUniqueIdToString();
  }
  setNullDgUniqueIds() {
    let nullObjs = this._buildUtil.getElementByDgUniqueID("null", this.cbpService.cbpJson);
    let nullObjs2 = this._buildUtil.getElementByDgUniqueID(null, this.cbpService.cbpJson);
    if (nullObjs) {
      if (Array.isArray(nullObjs)) {
        this.reAssignDgUniqueids(nullObjs, null);
      } else {
        nullObjs.dgUniqueID = this._buildUtil.getUniqueIdIndex();
        nullObjs.dgUniqueID = nullObjs.dgUniqueID.toString();
      }
    }
    if (nullObjs2) {
      if (Array.isArray(nullObjs2)) {
        this.reAssignDgUniqueids(nullObjs2, null);
      } else {
        nullObjs2.dgUniqueID = this._buildUtil.getUniqueIdIndex();
        nullObjs2.dgUniqueID = nullObjs2.dgUniqueID.toString();
      }
    }
  }
  setMaxDgUniqueIdToString() {
    let maxId = this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'];
    this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = maxId.toString();
    this.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = maxId.toString();
  }
  reAssignDgUniqueids(list: any, parentId: any) {
    list?.forEach((element: any) => {
      element.dgUniqueID = this._buildUtil.getUniqueIdIndex();
      element.dgUniqueID = element.dgUniqueID.toString();
      element['id'] = element.dgUniqueID;
      if (!element?.parentID && parentId) {
        element.parentID = parentId.toString();
      }
      if (element?.children?.length > 0) {
        this.reAssignDgUniqueids(element?.children, element.dgUniqueID);
      }
    });
  }

  reUpdateCbpWithBackground(backgroundCbpFile: any) {
    try {
      if (backgroundCbpFile?.cbpJson) {
        if (this.cbpService?.cbpJson?.section?.length > 0) {
          this._buildUtil.paraList = [];
          this._buildUtil.getParaObjects(this.cbpService.cbpJson.section);
          this._buildUtil.paraList = this.cbpService.removeDuplicates(this._buildUtil.paraList, 'dgUniqueID');
          this.cbpService.cbpJson.section = backgroundCbpFile.cbpJson.section;
          if (this._buildUtil.paraList.length > 0) {
            this.cbpService.updaterParaWithBackgroundCBPFile();
          }
        } else {
          this.cbpService.cbpJson.section = backgroundCbpFile.cbpJson.section;
        }
        this.cbpService.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
        this.cbpService.styleJson = backgroundCbpFile.styleJson;
        this.cbpService.layOutJson = backgroundCbpFile.layoutJson;
        this.cbpService.styleImageJson = backgroundCbpFile.styleImageJson;
        this.cbpService.defaultStylesJson = stylesJson;
        this.cbpService.defaultStyleImageStyle = JSON.parse(JSON.stringify(defaultImageJson));
        this.setStyleLayoutCbp();
        // this.refreshTreeUpdate();
        this.isTree = false;
        this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
        // console.log(this.cbpService.cbpJson.section);
        setTimeout(() => {
          this.isTree = true;
        }, 5);
        let backCbpFile = {
          cbpJson: this.cbpService.cbpJson,
          styleJson: this.cbpService.styleJson,
          media: this.cbpService.media,
          layoutJson: this.cbpService.layOutJson,
          styleImageJson: this.cbpService.styleImageJson,
          attachment: this.cbpService.attachment,
        }
        this.notifyBackgroundCbpFile.emit(backCbpFile);
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  setEdocUrls() {
    this.cbpService.apiUrl = this.envFiles?.apiUrl;
    this.cbpService.apiSecurity = this.envFiles?.apiSecurity;
    this.cbpService.oauthURL = this.envFiles?.oauthURL;
    this.cbpService.eDocumentApiUrl = this.envFiles?.eDocumentApiUrl;
    this.cbpService.eTimeApiURL = this.envFiles?.eTimeApiURL;
    this.cbpService.clientUrl = this.envFiles?.clientUrl;
    this.cbpService.eWorkURL = this.envFiles?.eWorkURL;
  }
  setUserApiInfo() {
    this.cbpService.accessToken = this.userConfigInfo.accessToken;
    this.cbpService.userInfo = {
      accessToken: this.userConfigInfo.accessToken,
      userId: this.userConfigInfo.loggedInUserID,
      companyId: this.userConfigInfo['companyID']
    }
    this.cbpService.loggedInUserId = this.userConfigInfo.loggedInUserId;
    this.cbpService.loggedInUserName = this.userConfigInfo['loggedInUserName'];
    this._buildUtil.loggedInUserName = this.userConfigInfo['loggedInUserName'];
    this.cbpService.emailId = this.userConfigInfo['emailId'];
    this.cbpService.companyId = this.userConfigInfo['companyID'];
  }

  newDoc() {
    this.cbpService.resetData();
    this.auditService.resetData();
    this.auditService.createEntry({}, this.cbpService.selectedElement, Actions.Insert);
    this.cbpService.styleJson = JSON.parse(JSON.stringify(stylesJson));
    this.cbpService.styleImageJson = JSON.parse(JSON.stringify(defaultImageJson));
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = new waterMarkOptions();
    this.cbpService.waterMarkValue = '';
    this.cbpService.isSearchTemplate = false;
    this.cbpService.styleModel = new styleModel();
    this.cbpService.styleModel.level2 = new Heading();
    this.cbpService.styleModel.level3 = new Heading();
    this.cbpService.styleModel.level4 = new Heading();
    this.cbpService.styleModel.level5 = new Heading();
    this.cbpService.coverPage = true;
    this.cbpService.styleJson = this.cbpService.styleJson ?? stylesJson;
    this.cbpService.styleModel = this.stylesService.applyStyles(this.cbpService.styleModel, stylesJson);
    this.styleLevelObj = undefined;
    this.isTree = false;
    setTimeout(() => { this.isTree = true; }, 1);
    this.cbpService.cbpJson = {
      documentInfo: [new PropertyDocument()],
      section: [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')]
    };
    this.cbpService.cbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
    this.setDefaultStyles(this.cbpService.styleModel);
    this.cbpService.layOutJson = JSON.parse(JSON.stringify(defaultLayoutJson));
    this.updateLayoutInfo();
    //  this.layoutService.applyLayOutChanges(this.cbpService.layOutJson.layout);
    this.cbpService.coverPage = this.layoutService.coverPage[0].coverPage;
    this.layoutService.setLayoutDefault();
    this.cbpService.isBackFromRead = false;
    this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    this.cbpService.selectedUniqueId = this.cbpService.cbpJson.section[0].dgUniqueID;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.cbpService.selectedDgType = this.cbpService.selectedElement.dgType;
    this.controlService.setSelectItem(this.cbpService.selectedElement);
    this.cbpService.popupDocumentSave = true;
    this.setProperty();
    if (this.cbpService.selectedType == 'New') { this.cbpService.istemplateOpen = true; }
  }
  newTemplate() {
    this.cbpService.istemplateOpen = true;
    this.tableService.isAttributeDisable = []
    // console.log(this.control)
    if (this.control == 3) {
      this.control = 0
      if (this.cbpService.cbpJson.documentInfo[0].coverPageData?.listAttributeProperty?.length) {
        this.tableService.setRightAttributes("", "")
      }
    }
    this.newDoc();
  }
  setProperty() {
    this.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    this.cbpService.showNavigation = this.propertyDocument['showNavigation'] == false ? false : true;
    this.propertyDocument['showNavigation'] = this.cbpService.showNavigation;
    this.cbpService.showProperty = this.propertyDocument['showProperty'] ? this.propertyDocument['showProperty'] : true;
    this.setDefaultProperty();
    this.cbpService.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    this.propertyDoc.emit({ 'event': this.propertyDocument });
  }
  clearBuilderItems() {
    this.cbpService.resetData();
    this.auditService.resetData();
    this.cbpService.styleLevelObj = undefined;
    this.cbpService.attachmentObjts();
    this.auditService.createEntry({}, this.cbpService.selectedElement, Actions.Insert);
    this.cbpService.isBackFromRead = false;
    // this.cbpService.isEdocument = false;
  }
  hideCover() {
    this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    this.cbpService.selectedUniqueId = this.cbpService.cbpJson.section[0].dgUniqueID;
  }
  onCbpFileChange(event: any) {
    this.cbpService.styleJson = this.cbpService.styleJson ?? JSON.parse(JSON.stringify(stylesJson));
    this.cbpService.styleModel = this.stylesService.applyStyles(new styleModel(), this.cbpService.styleJson);
    this.styleLevelObj = undefined;
    this.setDefaultStyles(this.cbpService.styleModel);
    this.cdref.detectChanges();
  }
  updateHelpJsonFile() {
    let sections = JSON.parse(JSON.stringify(this.cbpService.cbpJson.section));
    let newSections = this.reupdateBackgroundJson(sections);
    let docInfo = JSON.parse(JSON.stringify(this.cbpService.cbpJson.documentInfo));
    let background = { section: newSections, documentInfo: docInfo }
    return background;
  }
  reupdateBackgroundJson(object: any) {
    if (object?.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section && object[i].children?.length > 0) {
          object[i].children = object[i].children.filter((item: any) => item.dgType !== DgTypes.Figures &&
            item.dgType !== DgTypes.Table && item.dgType !== DgTypes.DualAction && item.dgType !== DgTypes.Para &&
            item.dgType !== DgTypes.Link);
        }
        if (object[i].children?.length > 0 && (object[i].dgType === DgTypes.StepAction || object[i].dgType === DgTypes.Section
          || object[i].dgType === DgTypes.Repeat || object[i].dgType === DgTypes.Timed || object[i].dgType === DgTypes.StepInfo)) {
          object[i].children = this.removeDataEntries(object[i].children);
        }
        if (object[i]?.children && object[i]?.children?.length > 0) {
          this.reupdateBackgroundJson(object[i].children);
        }
      }
    }
    return object;
  }

  removeDataEntries(list: any) {
    let items = list.filter((item: any) => !this.checkValidation(item) &&
      !item?.leftdualchild && !item?.rightdualchild && !item?.dualStep);
    return items;
  }

  checkValidation(item: any) {
    return (item.dgType == DgTypes.TextAreaDataEntry || item.dgType == DgTypes.TextDataEntry ||
      item.dgType == DgTypes.NumericDataEntry || item.dgType == DgTypes.BooleanDataEntry ||
      item.dgType == DgTypes.CheckboxDataEntry || item.dgType == DgTypes.Figures ||
      item.dgType == DgTypes.Table || item.dgType == DgTypes.VerificationDataEntry ||
      item.dgType == DgTypes.Link ||
      item.dgType == DgTypes.FormulaDataEntry || item.dgType == DgTypes.InitialDataEntry ||
      item.dgType == DgTypes.SignatureDataEntry || item.dgType == DgTypes.DateDataEntry ||
      item.dgType == DgTypes.LabelDataEntry || item.dgType == DgTypes.Para) ? true : false;
  }

  onOpenFileCbpJsonData(fileData: any) {
    try {
      let self = this;
      let cbpJsonStringify = JSON.stringify(fileData);
      let parsedCBP = JSON.parse(cbpJsonStringify);
      try {
        self.cbpService.cbpJson = JSON.parse(parsedCBP);
      } catch (err: any) {
        console.error(err);
      }
      self.cbpService.cbpJson = self.cbpService.setHeaderFooterWaterMark(self.cbpService.cbpJson);
      if (!self.cbpService.cbpJson?.section) {
        self.cbpService.cbpJson.section = [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')];
      }
      // self.cbpService.intializeDataKeys(self.cbpService.cbpJson.section);//moved this method into setLevelForSteps
      self.propertyDocument = self.cbpService.cbpJson.documentInfo[0];
      self.cbpService.propertyDocument = self.cbpService.cbpJson.documentInfo[0];
      self.cbpService.sectionHover = false;
      this.cbpService.maxProcedureSnippetIndex = this.cbpService.cbpJson.documentInfo[0]['maxProcedureSnippetIndex'] ? this.cbpService.cbpJson.documentInfo[0]['maxProcedureSnippetIndex'] : 0;
      // self.cbpService.isBackGroundDocument = self.cbpService.cbpJson['documentInfo'][0]['isBackGroundDoc'];
      if (self.cbp_track_change !== undefined) {
        // if (self.cbp_track_change['DGC_IS_BACKGROUND_DOCUMENT']) {
        //   self.cbpService.isBackGroundDocument = true;
        //   if (!self.cbpService.cbpJson['documentInfo'][0]['isBackGroundDoc']) {
        //     self.cbpService.cbpJson.section = this.reupdateBackgroundJson(self.cbpService.cbpJson.section);
        //     self.propertyDocument['isBackGroundDoc'] = true;
        //     self.cbpService.cbpJson['documentInfo'][0]['isBackGroundDoc'] = true;
        //   }
        // }
      }
      self.cbpService.documentType = 'LOCAL';
      if (!self.cbpService.cbpJson.section || !self.cbpService.cbpJson.section[0]) {
        self.cbpService.cbpJson['section'] = [self._buildUtil.build(new Section(), '1.0', self._buildUtil.uniqueIdIndex = 1, '1.0')];
      }
      this.refreshMaxDgUniqueID();
      if (self.cbpService.cbpJson.documentInfo[0]?.newCoverPageeEnabled) {
        if (!self.cbpService.cbpJson.documentInfo[0]?.coverPageData) {
          let templateObj = JSON.parse(JSON.stringify(templatesJson));
          self.cbpService.cbpJson.documentInfo[0]['coverPageData'] = templateObj['template-cp']
        }
        // self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0].coverPageData, self._buildUtil.uniqueIdIndex);
      } else {
        this.setDefaultProperty();
      }
      if (self.cbpService.cbpJson.documentInfo[0]['dynamicDocumnet']) {
        self.cbpService.cbpJson.documentInfo[0]['dynamicDocument'] =
          self.cbpService.cbpJson.documentInfo[0]['dynamicDocumnet'];
        delete self.cbpService.cbpJson.documentInfo[0]['dynamicDocumnet'];
      }
      self._buildUtil.maxDgUniqueId = self._buildUtil.uniqueIdIndex;
      self._buildUtil.documentInfo = self.cbpService.cbpJson.documentInfo[0];
      // self.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = self._buildUtil.uniqueIdIndex;
      self.cbpService.cbpJson.section = self._buildUtil.formatForSave(self.cbpService.cbpJson.section, 'None', self.cbpService.maxDgUniqueId);
      self._buildUtil.disableDuplicateCall = true;
      self.cbpService.selectedElement = self.cbpService.cbpJson.section[0];
      self.controlService.setSelectItem(self.cbpService.selectedElement);
      self.cbpService.loading = false;
      self.cbpService.cbpJson = self.cbpService.refreshNodes(self.cbpService.cbpJson);
      self.cbpService.cbpJson.section = self.cbpService.setLevelForSteps(self.cbpService.cbpJson.section); //moved this method from builder_util to cbp service to merger fieldsMaps.set methods
      self.cbpService.cbpJson.section.forEach((element: any) => {
        element['iconStyle'] = self.stylesService.getIconStyles(element, self.cbpService.styleModel);
        element = self.cbpService.setCbpUserInfo(element);
      });
      self._buildUtil.paginateIndex = 1;
      self.changeControl(0);
      self._buildUtil.setPaginationIndex(self.cbpService.cbpJson.section);
      self.setProperty();
      self.cbpService.attachmentObjts();
      if (this.cbpService.isBackGroundDocument && this.updatedBackground && this.updatedBackground?.cbpJson) {
        this.reUpdateCbpWithBackground(this.updatedBackground);
        this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
      }
    } catch (err: any) {
      console.error(err)
    }
  }
  async cbpBackgroungdUnzipCode(filesEvent: any | HTMLInputElement) {
    let file = filesEvent?.target ? filesEvent?.target?.files[0] : filesEvent[0];
    if (file.name.includes('.cbp') || file.name.includes('.zip') || file.name.indexOf('.CBP') > -1) {
      const self = this;
      const zip = new JSZip();
      zip.loadAsync(file).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
          zip.files[filename].async('string').then(function (fileData) {
            if (filename.indexOf('cbp.json') > -1) {
              self.cbpService.backgroundJson = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
            }
          });
        });
      });
    }
  }
  async onOpenFileChange(filesEvent: any | HTMLInputElement) {
    this.cbpService.isBackFromRead = false;
    let file = filesEvent?.target ? filesEvent?.target?.files[0] : filesEvent[0];
    if (file.name.includes('.cbp') || file.name.includes('.zip')) {
      this.autoSaveFileName = file.name.split('.')[0];
      this.cbpService.loading = true;
      this.cbpService.isDocumentUploaded = true;
      this.clearDocumentSelectFields();
      this.cbpService.resetData();
      const self = this;
      const zip = new JSZip();
      let names: string[] = [];
      zip.loadAsync(file).then(function (zip) {
        let files = Object.keys(zip.files);
        files = files.filter((it: any) => it.includes('.json') || (it.includes('media/') && it?.length > 7) || (it.includes('attachment/') && it?.length > 12))
        Object.keys(zip.files).forEach(function (filename) {
          zip.files[filename].async('string').then(function (fileData) {
            if (filename.indexOf('cbp.json') > -1) {
              self.onOpenFileCbpJsonData(fileData);
            }
            if (filename.indexOf('default.json') > -1) {
              self.cbpService.defaulJson = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('style.json') > -1) {
              self.cbpService.styleJson = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
              self.cbpService.styleUpdated = true;
            }
            if (filename.indexOf('style-image.json') > -1) {
              self.cbpService.styleImageJson = self.isFileUndefined(fileData) ? styleImageJson : JSON.parse(fileData);
            }
            if (filename.indexOf('layout.json') > -1) {
              self.cbpService.layOutJson = self.isFileUndefined(fileData) ? self.cbpService.defaultLayOutJson : JSON.parse(fileData);
              self.cbpService.layoutUpdated = true;
            }
            if (filename.indexOf('data.json') > -1) {
              self.cbpService.dataJson = self.isFileUndefined(fileData) ? { dataObjects: [], lastSessionUniqueId: 0 } : JSON.parse(fileData);
            }
            if (filename.indexOf('protect.json') > -1) {
              self.cbpService.protectJson = self.isFileUndefined(fileData) ? { protectObjects: [] } : JSON.parse(fileData);
            }
            if (filename.indexOf('signature.json') > -1) {
              self.cbpService.signatureJson = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('execution-order.json') > -1) {
              self.cbpService.executionOrderJson = self.isFileUndefined(fileData) ? { orderObjects: [] } : JSON.parse(fileData);
            }
            if (filename.indexOf('dynamic-section.json') > -1) {
              self.cbpService.dynamicSectionInfo = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('annotation.json') > -1) {
              self.cbpService.annotateJson = self.isFileUndefined(fileData) ? [] : JSON.parse(fileData);
            }
            if (filename.includes('.json')) {
              names.push(filename);
            }
            names = [...new Set(names)];
            self.gotoExecuter(names, files);
          });
          zip.files[filename].async('blob').then(function (fileData) {
            if (filename.indexOf('media/') > -1 && filename.length > 6) {
              self.cbpService.media.push(new File([fileData], filename));
              // self.cbpService.mediaBlobs.push({ fileName: filename, showFile: true });
              self.controlService.setMediaItem(self.cbpService.media);
              names.push(filename);
              // console.log(filename);
            }
            if (filename.includes('attachment/') && filename.length > 12) {
              names.push(filename);
              if (fileData.size > 0) {
                const blob = new File([fileData], filename);
                self.cbpService.attachment.push(blob);
              }
            }
            if (filename.includes('audit/') && filename.length > 6) {
              const blob = new File([fileData], filename);
              self.cbpService.cbpZip.audits.push(blob);
            }
            names = [...new Set(names)];
            self.gotoExecuter(names, files);
          });
        });
      });
    }
    else {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.cbpValid);
      return false;
    }
  }
  setDefaultProperty() {
    let PropValues = new PropertyDocument()
    if (!this.cbpService.cbpJson.documentInfo[0].usage) {
      this.cbpService.cbpJson.documentInfo[0].usage = PropValues.usage
    }
    if (!this.cbpService.cbpJson.documentInfo[0].dateFormat) {
      this.cbpService.cbpJson.documentInfo[0].dateFormat = PropValues.dateFormat
    }
    if (!this.cbpService.cbpJson.documentInfo[0].dynamicDocument) {
      this.cbpService.cbpJson.documentInfo[0].dynamicDocument = PropValues.dynamicDocument
    }
  }

  gotoExecuter(names: string[], files: string[]) {
    if (names?.length == files?.length && this.cbpService.selectedType === 'Open') {
      if (this.cbpService.dataJson?.dataObjects?.length > 1 && !this.loaded) {
        this.loaded = true;
        this.showExecuter('read', 'dynamicSection');
      } else {
        this.clearDocumentSelectFields();
        this.controlService.setSelectItem(this.cbpService.cbpJson.section[0]);
      }

    }
  }

  isFileUndefined(fileData: any) {
    return (fileData?.includes('\u0000') || fileData === undefined || fileData === '') ? true : false;
  }

  ngOnInit() {
    // localStorage.setItem("isAutoSaveEnable", "false");
    if (this.cbpFileTabInfo) {
      if (this.cbpFileTabInfo.isBackgroundDocument ||
        this.cbpFileTabInfo?.documentFileData?.['DGC_IS_BACKGROUND_DOCUMENT']) {
        this.cbpService.isBackGroundDocument = true;
      }
    }
    if (!this.windowWidthChanged) {
      this.cbpService.documentSelected = false;
    }
    this.cbpService.selectedUniqueId = 1;
    if (this.editorType.cbpZipMode) {
      this.cbpService.loading = true;
      const file = new File([this.editorType.cbpZipObj], 'test.cbp');
      this.cbpService.documentType = '';
      this.onOpenFileChange([file]);
      this.isTree = true;
    }
    if (this.cbpBackJsonZip) {
      this.cbpService.loading = true;
      const file = new File([this.cbpBackJsonZip], 'background.cbp');
      this.cbpBackgroungdUnzipCode([file]);
    } else {
      this.cbpService.isBuild = true;
      if (!this.cbpService.cbpJson || (this.cbpService.cbpJson && this.cbpService.cbpJson.length == 0)) {
        this.cbpService.clear();
      }
      if (!this.cbpService.isBackFromRead) {
        if (this.cbpService.selectedElement === undefined || this.cbpService.selectedElement === null) {
          this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
        }
        if (this.auditService.auditJson.length == 0) {
          this.auditService.createEntry({}, this.cbpService.selectedElement, Actions.Insert);
        }
      }
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      this.isTree = true;
      this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    }
    this.resizeWindow();
    this.cbpService.selectedElement = this.cbpService.selectedElement ?? this.cbpService?.cbpJson?.section[0];
    // this.cbpService.isBackGroundDocument = this.cbpService.cbpJson['documentInfo'][0]['isBackGroundDoc'];
    this.elem = document.documentElement;
    this.changeControl(0);
    if (!this.cbpService.clientUrl) {
      this.setEdocUrls();
      this.setUserApiInfo();
    }
    if (!this.cbpService.loggedInUserId) {
      this.setUserApiInfo();
    }
     if (this.cbpService.listAttributes.length == 0) {
      this.getPropertiesData()
    }
    this.cbpService.styleImageJson = styleImageJson;
    this.cbpService.defaultStylesJson = stylesJson;
    this.cbpService.defaultStyleImageStyle = JSON.parse(JSON.stringify(defaultImageJson));
    this.setStyleLayoutCbp();
    this.controlService.setSelectItem(this.cbpService.selectedElement);
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        // this.cbpService.documentSelected ? 0 : result.dgUniqueID
        this.cbpService.selectedElement = result;
        if (!this.controlService.isDataEntry(result) && !this.controlService.isLabelPara(result?.dgType) &&
          !this.controlService.isMessageField(result?.dgType) && !this.controlService.isVerificationEntry(result?.dgType)) {//&& !this.controlService.isBulletSteps(this.cbpService.selectedElement)
          this.selectedCurrentElement = result;
          this.deleteFirstElement = this.checkCount(result);
          this.cbpService.setCover();
        }
        //Wrote the code to fix DG9DOT3-177, due o performance issue which is DG9DOT3-226 commented the code
        // else if (this.cbpService.selectedElement.dgType == DgTypes.StepAction || this.cbpService.selectedElement.dgType == DgTypes.StepInfo ||
        //   this.cbpService.selectedElement.dgType == DgTypes.DelayStep || this.cbpService.selectedElement.dgType == DgTypes.Timed || this.cbpService.selectedElement.dgType == DgTypes.Repeat) {
        //   if (this.controlService.isBulletSteps(this.cbpService.selectedElement)) {
        //     this.selectedCurrentElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.parentDgUniqueID, this.cbpService.cbpJson.section);
        //   }
        //   this.cdref.detectChanges();
        // }
        else {
          if (this.cbpService.selectedElement?.parentDgUniqueID &&
            (this.controlService.isDataEntry(result) || this.controlService.isLabelPara(result?.dgType) ||
              this.controlService.isMessageField(result?.dgType) ||
              this.controlService.isVerificationEntry(result?.dgType))) {
            if (this.cbpService.sectionHover) {
              this.auditService.settingStepOptionButns(this.cbpService.selectedElement);
            }
            let id = result?.subTabe ? result.parentStepID : this.cbpService.selectedElement.parentDgUniqueID
            let element = this._buildUtil.getElementByDgUniqueID(id, this.cbpService.cbpJson.section);
            this.isParentStepAction = false;
            if (this.cbpService.selectedElement.dgType == DgTypes.Link || this.cbpService.selectedElement.dgType == DgTypes.SingleFigure || this.cbpService.selectedElement.dgType == DgTypes.Figures) {
              if (element?.dgType == DgTypes.StepAction) {
                this.isParentStepAction = true
              }
            }
            this.isParentStepDAT = false;
            if (this.cbpService.selectedElement.dgType == DgTypes.LabelDataEntry || this.cbpService.selectedElement.dgType == DgTypes.Para ||
              this.cbpService.selectedElement.dgType == DgTypes.FormulaDataEntry) {
              if (element?.dgType == DgTypes.StepAction || element?.dgType == DgTypes.Timed || element?.dgType == DgTypes.Repeat) {
                this.isParentStepDAT = true;
              }
            }
            if (typeof element === 'object') {
              this.selectedCurrentElement = element;
            }
          }
        }
        this.deleteFirstElement = this.checkCount(result);
      }
    });
    this.receiveMessage = this.datasharing.receivedMessage.subscribe((data: Request_Msg) => {
      if (data.eventType === EventType.getCbpFile || data.eventType === EventType.getBackgroundCbpFile) {
        if (!this.isInit) {
          if (this.cbpService.isBackGroundDocument) {
            this.saveCBPFileToServer(data);
          }
          if (!this.cbpService.isBackGroundDocument) {
            this.saveCBPFileToServer(data);
          }
        }
      }
      if (data.eventType === EventType.editorInitialized) {
        this.userConformationEvents('Close', data);
      }
    })
    this.setDataEntrySubscription = this.tableService.selectedDataEntry.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        this.setStyleObject(result);
        this.hideStyleIcons = this.controlService.checkDataValidation(result);
      }
    });
    this._subscriptionData = this._buildUtil.data_reso.subscribe((object: any) => {
      this.postProcessData(object);
    });
    if (this.cbpService.selectedUniqueId === 0) {
      this.cbpService.selectedUniqueId = this.cbpService.selectedElement.dgUniqueID;
      this.cbpService.documentSelected = false;
    }
    if (localStorage.getItem("tableRow") !== null) {
      localStorage.removeItem("tableRow");
    }
    this.cbpService.searchNavigate.subscribe((i) => {
      this.selectElemenetForSearch(i)
    })
    this.auditService.cbpChange.subscribe((response: any) => {
      this.userConformationEvents('Close', { source: 'ework' });
    })
    this.isTree = true;
  }
  saveCBPFileToServer(data: any) {
    this.converCoverPageDgUniqueId();
    let cbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
    cbpJson.section = this._buildUtil.formatForSave(cbpJson.section, 'build', this.cbpService.maxDgUniqueId);
    this._buildUtil.disableDuplicateCall = true;
    this.setMaxDgUniqueId();
    this.setCbpZipDownload(cbpJson, false,
      this.cbpService.styleJson, this.cbpService.media,
      this.cbpService.attachment, this.cbpService.dataJson,
      'cbpfile', this.cbpService.cbpZip.audits = [], 'not',
      data
    );
  }
  setStyleLayoutCbp() {
    this.cbpService.styleJson = this.cbpService.styleJson ?? JSON.parse(JSON.stringify(stylesJson))
    this.cbpService.styleModel = this.stylesService.applyStyles(new styleModel(), this.cbpService.styleJson);
    this.setDefaultStyles(this.cbpService.styleModel);
    this.controlService.setStyleModelItem(this.cbpService.styleModel)
    if (this.cbpService.layOutJson?.length === 0 || this.cbpService.layOutJson === undefined) {
      this.cbpService.layOutJson = JSON.parse(JSON.stringify(defaultLayoutJson));
    }
    this.layoutService.applyLayOutChanges(this.cbpService.layOutJson.layout);
    this.cbpService.coverPage = this.layoutService.coverPage[0].coverPage;
  }

  setStyleObject(stepObject: any) {
    if (stepObject['styleSet'] && !this.controlService.isEmpty(stepObject['styleSet'])) {
      if (stepObject['styleSet']['fontsize'] || stepObject['styleSet']['fontSize']) {
        this.defaultFontSize = stepObject['styleSet']['fontsize'];
        if (stepObject['styleSet']['fontSize']) {
          this.defaultFontSize = this.stylesService.getSizeStyles(stepObject['styleSet']['fontSize']);
        }
      } else {
        this.defaultFontSize = 2;
      }
      if (stepObject['styleSet']['fontfamily'] || stepObject['styleSet']['fontName']) {
        this.defaultFontFamily = stepObject['styleSet']['fontfamily'];
        if (stepObject['styleSet']['fontName']) {
          this.defaultFontFamily = stepObject['styleSet']['fontName'];
        }
      } else {
        this.defaultFontFamily = 'Poppins';
      }
      if (stepObject['styleSet']['fontcolor'] || stepObject['styleSet']['color']) {
        this.selectedColor = stepObject['styleSet']['fontcolor'];
        if (stepObject['styleSet']['color']) {
          this.selectedColor = stepObject['styleSet']['color'];
        }
      } else {
        this.selectedColor = '#000000';
      }
    } else {
      this.defaultFontFamily = 'Poppins';
      this.defaultFontSize = 2;
      this.selectedColor = '#000000';
    }
  }

  getPropertiesData() {
     if (!this.cbpService.loggedInUserId) {
      return;
    }
    if (!this.cbpService.companyId) {
      return;
    }
    if (this.cbpService.listAttributes?.length === 0) {
      if (!this.cbpService.clientUrl) {
        this.setEdocUrls();
      }
      this.builderService.getPropertiesData().pipe(
        catchError((error) => {
          console.log('API error while fetching properties data:', error);
          return [];
        })
      ).subscribe((res: any) => {
        try {
          if (this.cbpService.listProperties.length === 0) {
            res.forEach((obj: any) => {
              this.cbpService.listProperties.push(obj);
              if (obj.displayAttr === 1) {
                obj['coverType'] = true;
                this.cbpService.listAttributes.push(obj);
              }
              if (obj.property === "dynamicDocument") {
                const docInfo = this.cbpService.cbpJson.documentInfo?.[0];
                obj[obj['property']] = docInfo?.[obj['property']];
              }
            });
            if (res) {
              this.getDocumentInfoDataCP(res);
            }
          }
          if (!this.tableService.viewMode) {
            const items = this.cbpService.listAttributes.map((item: any) => item.property);
            this.tableService.newDragElements = [...new Set(items)];
          }
        } catch (err) {
          console.log('Error during post-response processing:', err);
        }
      });
    }
  }

  getDocumentInfoDataCP(data: any) {
    let docId = this.userConfigInfo.documentFileId ? this.userConfigInfo.documentFileId : '';
    // console.log("doc status",this.userConfigInfo?.fileInfo?.documentFileData?.DGC_DOCUMENT_FILE_STATUS)
    this.cbpService.docFileStatus = this.userConfigInfo?.fileInfo?.documentFileData?.DGC_DOCUMENT_FILE_STATUS;
    if (this.docFileStatusNum != '10000') {
      this.builderService.getDocumentInfoDataCP(data, docId).pipe(catchError((error) => {
        console.error('Error fetching document info:', error);
        return of([]);
      })
      ).subscribe((res: any) => {
        try {
          let docInfo = this.cbpService.cbpJson.documentInfo?.[0];
          let listAttrProps = docInfo?.coverPageData?.listAttributeProperty;
          if (!Array.isArray(this.cbpService.listProperties) || !this.cbpService.listProperties.length) return;
          res.forEach((item: any) => {
            if (!item.property) return;
            const matchedItemWithApi = this.cbpService.listProperties.find((attr: any) => attr?.property === item.property);
            if (!matchedItemWithApi) return;
            // Check if listAttrProps exists once
            if (!listAttrProps) {
              this.cbpService.coverPagedataEmpty = true;
            }
            const property = matchedItemWithApi.property;
            matchedItemWithApi[property] = item.value
            if (matchedItemWithApi?.isEditable === 1) {
              // Editable logic
              docInfo[property] = item.value;
              const matchingAttr = listAttrProps?.find((prop: any) => prop?.property === property);
              this.cbpService.updateCoverPageTableValues(this.cbpService.cbpJson.documentInfo?.[0]?.coverPageData?.calstable?.[0]?.table?.tgroup?.tbody, { property: item?.property, [item?.property]: item.value, isEditable: 1 })
              if (matchingAttr) {
                matchingAttr.propertyValue = matchedItemWithApi[property];
              }
            } else {
              // Not editable
              let matched = false;
              if (Array.isArray(listAttrProps)) {
                for (const obj of listAttrProps) {
                  if (obj.property === property) {
                    const value = obj.propertyValue;
                    matchedItemWithApi[property] = value;
                    docInfo[property] = value;
                    matched = true;
                    break;
                  }
                }
              }
              // Fallback if no match found in listAttrProps
              if (!matched) {
                if (property === 'dynamicDocument') {
                  matchedItemWithApi[property] = docInfo[property];
                } else {
                  docInfo[property] = item.value;
                }
              }
            }
          });
          this.cbpService.cbpJson.documentInfo[0] = JSON.parse(JSON.stringify(this.cbpService.cbpJson.documentInfo[0]));
          if (!this.cbpService.cbpJson.documentInfo[0]?.internalRevision && this.cbpService.cbpJson.documentInfo[0]?.internalVersion) {
            this.cbpService.cbpJson.documentInfo[0].internalRevision = this.cbpService.cbpJson.documentInfo[0]?.internalVersion;
          }
          this._buildUtil.documentInfo = this.cbpService.cbpJson.documentInfo[0];
          console.log('Document Info:', this.cbpService.cbpJson.documentInfo[0], docInfo);
        } catch (err) {
          console.log('Runtime error processing document info:', err);
        }
      });
    }
  }

  postProcessData(result: any) {
    if (result.dgType === DgTypes.TextDataEntry || result.dgType === DgTypes.TextAreaDataEntry || result.dgType === DgTypes.NumericDataEntry
      || result.dgType === DgTypes.DateDataEntry || result.dgType === DgTypes.BooleanDataEntry || result.dgType === DgTypes.CheckboxDataEntry
      || result.dgType === DgTypes.DropDataEntry || result.dgType === DgTypes.Table) {
      if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo || this.cbpService.selectedElement.dgType === DgTypes.DelayStep) {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCannotacceptDataEntry);
      }
      else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionCannotAccept);
      }
    } else if (result.dgType === DgTypes.VerificationDataEntry || result.dgType === DgTypes.InitialDataEntry || result.dgType === DgTypes.SignatureDataEntry
      || result.dgType === DgTypes.Figures || result.dgType === DgTypes.Link || result.dgType === DgTypes.Warning || result.dgType === DgTypes.Caution || result.dgType === DgTypes.Note || result.dgType === DgTypes.Alara) {
      if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo || this.cbpService.selectedElement.dgType === DgTypes.DelayStep) {
        if (result.dgType === DgTypes.Link || result.dgType === DgTypes.Figures) {
          this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCannotacceptLink);
        }
        else if (result.dgType === DgTypes.VerificationDataEntry || result.dgType === DgTypes.InitialDataEntry || result.dgType === DgTypes.SignatureDataEntry) {
          this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCannotacceptVerifi);
        }
        else if (result.dgType === DgTypes.Warning || result.dgType === DgTypes.Caution || result.dgType === DgTypes.Note || result.dgType === DgTypes.Alara) {
          this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCantAccept);
        }
      }
      else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.VerficationCannotAccept);
      }
    }
  }
  onInputClick = (event: any) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  changeNavigation(type: any) {
    this.changeCoverpage();
    if (type === DgTypes.Header) {
      this.changeHeader();
    }
    if (type === DgTypes.Footer) {
      this.changeFooter();
    }
    if (type === DgTypes.WaterMark) {
      this.changeWaterMark();
    }
  }
  changeCoverpage() {
    if (this.cbpService.documentSelected) {
      this.cbpService.coverPageViewEnable = false;
      this.cbpService.showviewCoverPage = false;
      this.nodeTreeClicked = false;
      this.showCoverPage = false
      this.cbpService.documentSelected = false;
      //this.cbpService.coverPage = false;
    }
  }

  onPropertyChange(event: any, name: any) {
    if (name === 'Navigation') {
      this.navigationChange(event)
    }
    if (name === 'Property') {
      this.openRightSideNavingation(event)
    }
    if (name === 'Section/Step Option') {
      this.sectionHoverIcons(event)
    }
    if (name === 'Full Screen') {
      this.openFullscreen(event)
    }
    if (name === 'Show Updates') {
      this.cbpService.isChangeUpdates = event.target.checked ? true : false;
      this.controlService.detectAllView(true);
    }
  }

  selectEntries(item: any, type: string) {
    if (this._buildUtil.uniqueIdIndex < Number(this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'])) {
      this._buildUtil.uniqueIdIndex = Number(this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID']);
    }
    if (item.name === 'Section') {
      this.addStepContainer();
      this.dataJsonChange.emit({ 'dataJsonChnage': item });
      this.cdref.detectChanges();
      this.treeUpdateOption();
      return;
    }
    if (item.name === 'Sub Section') {
      this.createStepNode(this.cbpService.selectedElement);
      this.dataJsonChange.emit({ 'dataJsonChnage': item });
      this.treeUpdateOption();
      return;
    }
    if (item.name === 'StepInfo' || item.name === 'Delay Step') {
      this.informationStep(this.cbpService.selectedElement, item.type);
      this.dataJsonChange.emit({ 'dataJsonChnage': item });
      this.cdref.detectChanges();
      this.treeUpdateOption();
      return;
    }
    if (item.name === 'Step Action' || item.name === 'Timed Step' || item.name === 'Repeat Step') {
      if (type === 'dropDown') {
        this.addNumberedElement(item.type)
      } else {
        this.addStepNew(this.cbpService.selectedElement, item.type)
      }
      this.cdref.detectChanges();
      this.dataJsonChange.emit({ 'dataJsonChnage': item });
      this.treeUpdateOption();
      return;
    }
    if (item.name === 'Procedure Snippet') {
      this.procedureSnippet();
      this.treeUpdateOption();
      return;
    }
    if (item.name === 'Dual Step') {
      let dualStep: any = new StepAction();
      dualStep.dgType = DgTypes.DualAction;
      dualStep['dualStep'] = true;
      dualStep['children'] = [];
      dualStep['rightDualChildren'] = [];
      dualStep.text = 'Dual Step';
      dualStep['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
      dualStep['id'] = dualStep['dgUniqueID'];
      dualStep = this.controlService.setDualStep(this.cbpService.selectedElement, dualStep);
      let setpObjects: any = this.addStepNewSplitStep(this.cbpService.selectedElement, DgTypes.StepAction);
      dualStep['childSequenceType'] = setpObjects.stepObject['childSequenceType'];
      dualStep['originalSequenceType'] = setpObjects.stepObject['originalSequenceType'];
      let childObj = setpObjects.stepObject;
      childObj = this.setDualInfo(childObj, dualStep, setpObjects, false);
      childObj = this.updateTimedOrRepeat(this.cbpService.selectedElement, childObj);
      dualStep['children'].push(childObj);
      let newRightObj = JSON.parse(JSON.stringify(childObj));
      newRightObj = this.setDualInfo(newRightObj, dualStep, setpObjects, true);
      newRightObj = this.updateTimedOrRepeat(this.cbpService.selectedElement, newRightObj);
      dualStep['rightDualChildren'].push(newRightObj);
      dualStep['parentID'] = this.cbpService.selectedElement.dgSequenceNumber;
      dualStep['dgSequenceNumber'] = setpObjects.dgSequenceNumber;
      dualStep['number'] = setpObjects.number;
      dualStep['level'] = this.cbpService.selectedElement['level'] + 1;
      dualStep.stepType = 'DualStepFreeForm';
      dualStep['dualStepType'] = 'DualStepFreeForm';
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      this._buildUtil.dualSteps.push({ id: dualStep['dgUniqueID'], added: false, obj: dualStep });
      if (this.cbpService.selectedElement['childSequenceType'] !== SequenceTypes.DGSEQUENCES) {
        dualStep['state'] = { hidden: true };
      }
      // this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
      this.cbpService.selectedElement.children.push(dualStep);
      this.auditService.createEntry({}, dualStep, Actions.Insert);
      let dualitem = dualStep.children[0];
      this.isSelectedElement(dualitem);
      this.cbpService.isViewUpdated = true;
      this.cdref.detectChanges();
      this.dataJsonChange.emit({ 'dataJsonChnage': item });
      this.treeUpdateOption();
      // console.log(this.cbpService.cbpJson.section);
      return;
    }
  }
  treeUpdateOption() {
    if (this.treeView) { this.treeView.refreshTree(); }
    this.createNewItem();
  }
  setDualInfo(item: any, dualStep: any, setpObjects: any, isRight: any) {
    item['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    item['number'] = setpObjects.number;
    item['dgSequenceNumber'] = setpObjects.dgSequenceNumber;
    item['rightdual'] = isRight;
    item['leftdual'] = !isRight;
    item['dualStep'] = true;
    item['firstDualStep'] = true;
    item['stepType'] = 'DualStepFreeForm';
    item['dualStepType'] = 'DualStepFreeForm';
    item['position'] = 1;
    item['id'] = item['dgUniqueID'];
    item['level'] = this.cbpService.selectedElement['level'] + 1;
    item = this.controlService.setDualStep(dualStep, item);
    return item;
  }

  addStepNewSplitStep(element: any, dgType: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    if (element) {
      // New Element Added
      this.createNewItem();
      this.datasharing.newElementAdded(true);
      let step: any;
      let dgSequenceNumber: any;
      element = this.addSequenceInfo(element);
      let number: any = this._buildUtil.getNumberForChild(element);
      if (element.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(element);
      }
      if (dgType === DgTypes.StepAction) {
        step = this._buildUtil.build(new StepAction(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      } else if (dgType === DgTypes.Timed) {
        step = this._buildUtil.build(new Timed(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      } else if (dgType === DgTypes.Repeat) {
        step = this._buildUtil.build(new Repeat(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      }
      if (element['childSequenceType'] === SequenceTypes.Attachment) {
        step['childSequenceType'] = SequenceTypes.Attachment;
        step['originalSequenceType'] = SequenceTypes.Attachment;
      }
      if (element.dataType === SequenceTypes.Attachment || element.aType === SequenceTypes.Attachment) {
        step['aType'] = SequenceTypes.Attachment;
        // step['duplicateValue'] = step.number;
        step['duplicateValue'] = this._buildUtil.getAttachmentDuplicateValue(element);
      }
      if (element['childSequenceType'] === SequenceTypes.Attachment) {
        step['childSequenceType'] = element['childSequenceType'];
      }
      this._buildUtil.setIndexDisplayState(step);
      element = this.cbpService.setNewUserInfo(element);
      return { stepObject: step, number: number, dgSequenceNumber: dgSequenceNumber };
    } else {
      this.showErrorMsg(DgTypes.Warning, 'Please select element');
    }
    this.cbpService.popupDocumentSave = false;
  }
  dataUpdate(item: any) {
    this.dataJsonChange.emit({ 'dataJsonChnage': item });
  }

  openFullscreen(event: any) {
    if (event.target.checked) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem?.mozRequestFullScreen) {
        this.elem.mozRequestFullScreen();
      } else if (this.elem?.webkitRequestFullscreen) {
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        this.elem.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmode(event: any) {
    this.cbpService.fullscreen = !window.screenTop && !window.screenY ? false : true;
    this.cbpService.elementForCopyOrCut = null;
  }

  openFile() {
    $('#fileUpload').trigger('click');
    this.layoutService.setLayoutDefault();
    this.cbpService.popupDocumentSave = true;
  }
  openMedia() {
    if (this.selectedCurrentElement.dgType == DgTypes.Section || this.selectedCurrentElement.dgType == DgTypes.StepAction ||
      this.selectedCurrentElement.dgType == DgTypes.Repeat || this.selectedCurrentElement.dgType == DgTypes.Timed) {
      if (this.cbpService.selectedElement.dgType !== DgTypes.Table) {
        this.cbpService.selectedElement = this.selectedCurrentElement;
      }
    }
    if (this.cbpService.selectedElement.dgType === DgTypes.StepAction || this.cbpService.selectedElement.dgType === DgTypes.Repeat
      || this.cbpService.selectedElement.dgType === DgTypes.Timed ||
      this.cbpService.selectedElement.dgType === DgTypes.Section || this.cbpService.selectedElement.dgType === DgTypes.Table) {
      if (this.cbpService.selectedElement.dgType === DgTypes.Table) {
        if ((this.tableService.selectedRow.length === 1)) {
          this.openMediaPopup();
        } else {
          this.showErrorMsg(DgTypes.Warning, 'Select only one cell to add Media in Table');
        }
      } else {
        this.openMediaPopup();
      }
    } else {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionOrStepSelection);
    }
  }
  openMediaPopup() {
    if (this.cbpService.isBackGroundDocument) {
      $('#fileUploadMediaBg').trigger('click');
    } else {
      $('#fileUploadMedia').trigger('click');
    }
  }
  // refactor this method
  async singleMedia(event: any) {
    let files: any = (<HTMLInputElement>event.target).files;
    let field: any;
    let type = this.cbpService.splitLastOccurrence(files[0].name, '.');
    if (files[0].type === 'video/x-ms-wmv' || files[0].name.substring(files[0].name.lastIndexOf('.'), files[0].name.length) === 'wmv') {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'WMV files are not supported by browser');
      return;
    }
    if (this.sharedService.singleMediaAccept.includes(type[1])) {
      if (this.cbpService.selectedElement.dgType === DgTypes.Table) {
        let obj = this._buildUtil.createElement(DgTypes.Figures);
        obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
        obj = this.cbpService.setBgDgUniqueID(obj);
        this.cbpService.selectedUniqueId = obj['dgUniqueID'];
        obj['parentID'] = this.cbpService.selectedElement.parentID;
        obj['parentDgUniqID'] = this.cbpService.selectedElement.dgUniqueID;
        for (let i = 0; i < this.tableService.selectedRow.length; i++) {
          obj['row'] = this.tableService.selectedRow[i].row + 1;
          obj['column'] = this.tableService.selectedRow[i].col + 1;
        }
        obj['level'] = this.cbpService.selectedElement['level'] + 1;
        obj['state'] = { hidden: true };
        obj['mediaType'] = 'single';
        obj['isTableDataEntry'] = true;
        obj = this.cbpService.setNewUserInfo(obj);
        if (this.cbpService.selectedElement['subTabe']) {
          obj['subTable'] = true;
        }
        field = obj;
        this.auditService.createEntry({}, obj, Actions.Insert, AuditTypes.TABLE_ENTRY_ADD);
        this.cbpService.isViewUpdated = true;
      } else {
        this.addStepActionElement(DgTypes.Figures, 'single');
        field = this.cbpService.selectedElement;
      }
      if (files !== null) {
        for (let i = 0; i < files.length; i++) {
          let fileBlob = files[i];
          let filetype: any;
          if (files[i].type.indexOf('video') > -1) {
            filetype = 'Video';
          } else if (files[i].type.indexOf('audio') > -1) {
            filetype = 'Audio';
          } else {
            filetype = 'Image';
          }
          let fileValue = this.cbpService.splitLastOccurrence(files[i].name, '.');
          fileBlob = new File([files[i]], fileValue[0] + field['dgUniqueID'] + new Date().getTime().toString().substring(8, 12) + '.' + fileValue[1], { type: files[i].type });
          const singleImage: any = {
            fileName: fileBlob.name,
            dgUniqueID: String(this._buildUtil.getUniqueIdIndex()),
            dgType: DgTypes.Figure,
            name: fileBlob.name,
            source: 'Local',
            caption: '',
            fileType: filetype,
            action: 8100,
            type: 'builder'
          };
          const imageLoad = { url: URL.createObjectURL(files[i]), context: files[i].name }
          try {
            this.getHeightWidth(imageLoad, this.cbpService.selectedElement.dgType);
          } catch (error: any) {
            console.log(error);
          }
          this.cbpService.getImageDimension(imageLoad).subscribe(
            (response: any) => {
              singleImage['height'] = response.height;
              singleImage['width'] = response.width;
            });
          if (this.cbpService.selectedElement.dgType === DgTypes.Table) {
            singleImage['typeImage'] = this.cbpService.selectedElement['headerTable'] ? 'header' : 'section';
            singleImage['align'] = 'left';
            singleImage['isTableDataEntry'] = true;
            singleImage['mediaType'] = 'single';
            singleImage['resolution'] = 'true';
            field['isTableDataEntry'] = true;
            field.images.push(singleImage);
            this.cbpService.tableDataEntrySelected = singleImage;
            if (this.cbpService.documentSelected) {
              field['coverType'] = true;
            }
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col].children.push(field);
            this.controlService.setSelectItem(this.cbpService.selectedElement);
            this.cbpService.isViewUpdated = true;
          } else {
            singleImage['mediaType'] = 'single';
            singleImage['typeImage'] = 'section/step';
            singleImage['align'] = 'left';
            singleImage['resolution'] = 'true';
            this.cbpService.selectedElement.images.push(singleImage);
            singleImage.index = this.cbpService.selectedElement.images.length - 1;
          }
          this.viewTrackChange(this.cbpService.selectedElement);
          this.cbpService.mediaBlobs.push({ 'fileName': fileBlob.name, 'showFile': true });
          this.cbpService.media.push(fileBlob);
          this.datasharing.changeImageProperties(singleImage);
          this.auditService.elementsRestoreSnapChats.push(field);
          let images = [];
          images.push(singleImage);
          this.controlService.setMediaItem(this.cbpService.media);
          this.sharedService.mediaFilesStorageItem(images);
          // this.updateProperty();
          if (this.cbpService.selectedElement.dgType !== DgTypes.Table) {
            this.cbpService.selectedElement = field;
            this.controlService.setSelectItem(field);
          }
          this.cbpService.isViewUpdated = true;
          //  this.createAuditEntry(AuditTypes.MEDIA_FILE, { propName: 'fileName', index: (this.field.images.length -1) })
        }
      }
      this.cbpService.detectWholePage = true;
      this.cbpService.isViewUpdated = true;
      this.cdref.detectChanges();
    } else {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Unable to support the format');
    }
  }
  mediaUpdateInCbp(mediaObj: any) {

  }
  sectionHoverIcons(event: any) {
    this.cbpService.sectionHover = true;
    this.openRightSideNavingation(event);
  }
  getHeightWidth(imageLoad: any, type: string) {
    // this.cbpService.getImageDimension(imageLoad).subscribe(
    // return new Observable(observer => {
    // console.log(imageLoad);
    const img = new Image();
    img.onload = function (event) {
      const loadedImage: any = event.currentTarget;
      imageLoad.width = loadedImage.width;
      imageLoad.height = loadedImage.height;
      // observer.next(imageLoad);
      // observer.complete();
    }
    img.src = imageLoad.url;
    // });
    // (response: any) => {
    // console.log(imageLoad);
    if (type === DgTypes.Table) {
      if (imageLoad.height) {
        this.cbpService.tableDataEntrySelected['height'] = imageLoad.height;
      }
      if (imageLoad.width) {
        this.cbpService.tableDataEntrySelected['width'] = imageLoad.width;
      }
    } else {
      if (this.cbpService.selectedElement.dgType == DgTypes.Figures)
        if (this.cbpService.selectedElement?.images?.length > 0) {
          let item = this.cbpService.selectedElement.images[this.cbpService.selectedElement.images?.length - 1];
          this.cbpService.selectedElement = item;
          this.cbpService.selectedElement['height'] = imageLoad.height;
          this.cbpService.selectedElement['width'] = imageLoad.width;
        }
    }
    // console.log(this.cbpService.selectedElement);        
    //   this.controlService.setSelectItem(this.cbpService.selectedElement)
    //   this.updateProperty();
    //   this.cbpService.detectWholePage = true;
    //   this.cbpService.isViewUpdated = true;
    //   this.cdref.detectChanges();
    // }
    // );

  }


  openRightSideNavingation(event: any) {
    if (event.toElement !== null) {
      this.isPropertyOpen = event.toElement.checked;
      this.isRightsidePopupClosed = !event.toElement.checked;
    }
  }
  changeControl(type: any) {
    this.control = type;
    if (type === 2) {
      this.getReferenceAPIInfo({}, '', '');
    } else {
      this.referenceListItems = [];
    }
  }

  getpropcheck() {
    if (this.cbpService.listAttributes.length == 0) {
      this.getPropertiesData()
    }
  }
  navigationChange(event: any) {
    if (event.target?.checked !== null) {
      this.isIndexConctrolClosed = !event.target.checked;
      this.cbpService.showNavigation = event.target.checked;
      this.propertyDocument['showNavigation'] = this.cbpService.showNavigation;
      this.cbpService.cbpJson.documentInfo[0]['showNavigation'] = this.cbpService.showNavigation;
      this.cbpService.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    }
  }
  getReferenceAPIInfo(item: any, refid: string = '', childRefid: string = '') {
    this.builderService.getReferenceInfo(refid, childRefid).subscribe((result: any) => {
      if (refid === '' && childRefid === '') {
        result.body.forEach((v: any) => {
          v['level'] = 0;
          v['show'] = false;
        });
        this.referenceListItems = result.body;

      } else {
        this.setRef(result, item, refid);
      }
      item['children'] = result.body;
      item.show = true
      this.cdref.detectChanges();
    }, (error) => {
      console.log(error);
    })
  }

  dragReferenceObj(item: any) {
    if (item.DGC_HAS_CHILD == 0) {

    }
  }
  collapse(item: any) {
    item['children'] = []
    item.show = false;
  }

  setRef(result: any, item: any, refid: string = '',) {
    result.body.forEach((v: any) => {
      v['level'] = item.level + 1;
      v['refid'] = refid;
      if (v.DGC_REFERENCE_OBJECT_DETAIL) {
        v.DGC_REFERENCE_OBJECT_DETAIL = JSON.parse(v.DGC_REFERENCE_OBJECT_DETAIL);
      }
      v.dragLinks = [];
      if (v.DGC_REFERENCE_DISPLAY_OPTION && v.DGC_REFERENCE_OBJECT_DETAIL) {
        v.DGC_REFERENCE_DISPLAY_OPTION = v.DGC_REFERENCE_DISPLAY_OPTION.replace(/\</g, "").replace(/\>/g, "").split(';');
        v.DGC_REFERENCE_DISPLAY_OPTION.forEach((i: any) => {
          i = i.indexOf(',') > -1 ? i.split(',') : i.split(" ");
          let link = '';
          i.forEach((k: any) => {
            if (v.DGC_REFERENCE_OBJECT_DETAIL[k.trim()]) {
              link = link + v.DGC_REFERENCE_OBJECT_DETAIL[k.trim()] + " ";
            }
          });
          if (link) {
            v.dragLinks.push(link);
          }

        });
      }
    });
  }

  callRefMethod(item: any, index: any) {
    if (item.DGC_REFERENCE_OBJECT_DETAIL) {
      item.show = true
      return;
    }
    if (item.DGC_ID && item.level === 0) {
      this.getReferenceAPIInfo(item, item.DGC_ID, '')
    }
    if (item.DGC_ID && item.level > 0 && item.DGC_HAS_CHILD > 0) {
      this.getReferenceAPIInfo(item, item.refid, item.DGC_ID);
      return;
    }
  }
  openItem(item: any) {
    item.show = !item.show;
  }

  ngAfterViewInit() {
    this.isTreeEvent = true;
    this.cbpService.loading = false;
    $(window).keydown(function (e: any) {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) { e.preventDefault(); }
    })
    this.bindKeypressEvent().subscribe(($event: KeyboardEvent) => this.onKeyPress($event));
    this.cdref.detectChanges();
    this.isInit = false;
    if (!this.cbpService.clientUrl) {
      this.setEdocUrls();
    }
    if (this.cbpService.isBackGroundDocument) {
      const self = this;
      this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
      self.cbpService.cbpJson.section.forEach((item: any) => self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(item, self._buildUtil.uniqueIdIndex));
      self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0].header, self._buildUtil.uniqueIdIndex);
      self._buildUtil.uniqueIdIndex = this._buildUtil.getMaxDgUniqueID(self.cbpService.cbpJson.documentInfo[0].footer, self._buildUtil.uniqueIdIndex);
      self._buildUtil.maxDgUniqueId = this._buildUtil.uniqueIdIndex;
      // console.log(this._buildUtil.uniqueIdIndex);
      this.cbpService.cbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
    }
  }
  hideObject() {
    if (this._buildUtil.dualSteps?.length > 0) {
      for (let i = 0; i < this._buildUtil.dualSteps.length; i++) {
        let styleIsthere = ($('#' + this._buildUtil.dualSteps[i].id).css('display') == 'none')
        if ((!this._buildUtil.dualSteps[i].added || !styleIsthere) && this._buildUtil.dualSteps[i].obj?.dualStep) {
          this._buildUtil.dualSteps[i] = this.hideStepInTree(this._buildUtil.dualSteps[i]);
        }
      }
    }
  }

  hideStepInTree(item: any) {
    try {
      if ($('#' + item.id)) {
        $('#' + item.id + ' > div').css('display', 'none');
        $('#' + item.id + ' > i').css('display', 'none');
        $('#' + item.id + ' > a').css('display', 'none');
        item.added = true;
      }
    } catch (err) { }
    return item;
  }
  treeLoaded() {
    this.hideObject();
    this.fullTreeloaded = true;
  }


  ngDoCheck() {
    // if(this.fullTreeloaded){
    this.hideObject();
    // }
    if (this._buildUtil.uniqueIdIndex == 0 && this.cbpService.cbpJson?.section?.length > 0) {
      this.refreshMaxDgUniqueID();
    }
    if (this.cbpService.selectedElement === undefined) {
      this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
      this.controlService.setSelectItem(this.cbpService.cbpJson.section[0]);
    }
    if (this.cbpService.styleUpdated && this.cbpService.styleJson) {
      this.cbpService.styleJson = this.cbpService.styleJson ?? JSON.parse(JSON.stringify(stylesJson));
      this.cbpService.styleModel = this.stylesService.applyStyles(new styleModel(), this.cbpService.styleJson);
      this.cbpService.cbpJson.section = this.cbpService.setLevelForSteps(this.cbpService.cbpJson.section);
      this.cbpService.styleTextEditorUpdated = true;
      this.cbpService.styleUpdated = false;
      this.setDefaultStyles(JSON.parse(JSON.stringify(this.cbpService.styleModel)));
    }
    if (this.tableService.selectedRow.length > 0 && this.cbpService.selectedElement && this.cbpService.selectedElement.dgType !== DgTypes.Table) {
      this.tableService.selectedRow = [];
    }
    if (this.cbpService.isCutcopyElement) {
      this.cbpService.isCutcopyElement = false;
      this.notifier.hideAll();
      this.notifier.notify(this.cbpService.copyCutType, this.cbpService.copyCutMessage);
      setTimeout(() => { this.cbpService.setCutCopyMethodType('', '', false); }, 1);
      this.cbpService.tableRuleOpen = false;
      this.cbpService.isRulesOpen = false;
    }
    if (this.cbpService.notifierMesg?.enable) {
      this.notifier.hideAll();
      this.notifier.notify(this.cbpService.notifierMesg.type, this.cbpService.notifierMesg.mesg);
      this.cbpService.clearNotifier();
    }
    if (this.builderService.singleMedia) {
      this.openMedia();
      this.builderService.singleMedia = false;
    }
    if (this.cbpService.layoutUpdated) {
      this.updateLayoutInfo();
      this.cbpService.layoutUpdated = false;
    }
    if (this.cbpService.updateProperty) {
      if (this.cbpService.selectedElement.length > 1) {
        this.cbpService.selectedElement = this.cbpService.selectedElement.filter((res: { dgType: DgTypes }) => res.dgType === DgTypes.Table);
        this.cbpService.selectedElement = this.cbpService.selectedElement[0];
        this.controlService.setSelectItem(this.cbpService.selectedElement);
        this.cbpService.updateProperty = false;
      }
    }
    if (!this._buildUtil?.documentInfo) {
      this._buildUtil.documentInfo = this.cbpService.cbpJson.documentInfo[0];
    }
    if (this.cbpService.dynamicDocumentUnChecked) {
      this.cbpService.dynamicDocumentUnChecked = false;
      this.cbpService.setDynamicFalseToSteps(this.cbpService.cbpJson.section)
    }

  }
  updateLayoutInfo() {
    if (!this.cbpService.layOutJson) {
      this.cbpService.layOutJson = defaultLayoutJson;
      this.cbpService.defaultLayOutJson = defaultLayoutJson;
    }
    this.layoutService.applyLayOutChanges(this.cbpService.layOutJson.layout);
    this._buildUtil.isNumberDisabled = this.layoutService.isDisableNumber;
    this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
    this.cbpService.coverPage = this.layoutService.coverPage[0].coverPage;
    this.controlService.setlayoutItem({ 'indendation': this.layoutService.indendation })
  }

  setDefaultStyles(styleModelObj: any) {
    if (!this.styleLevelObj) { this.styleLevelObj = new StyleLevel(); }
    this.styleLevelObj.levelNormal = this.stylesService.setStyles(styleModelObj['levelNormal']);
    this.styleLevelObj.level1 = this.stylesService.setStyles(styleModelObj['level1']);
    this.styleLevelObj.level2Section = this.stylesService.setStyles(styleModelObj['level2'].Section);
    this.styleLevelObj.level2Step = this.stylesService.setStyles(styleModelObj['level2'].Step);
    this.styleLevelObj.level3Section = this.stylesService.setStyles(styleModelObj['level3'].Section);
    this.styleLevelObj.level3Step = this.stylesService.setStyles(styleModelObj['level3'].Step);
    this.styleLevelObj.level4Section = this.stylesService.setStyles(styleModelObj['level4'].Section);
    this.styleLevelObj.level4Step = this.stylesService.setStyles(styleModelObj['level4'].Step);
    this.styleLevelObj.level5Section = this.stylesService.setStyles(styleModelObj['level5'].Section);
    this.styleLevelObj.level5Step = this.stylesService.setStyles(styleModelObj['level5'].Step);
    this.styleLevelObj.attachment = this.stylesService.setStyles(styleModelObj['levelAttachment']);
    this.styleLevelObj.attachmentTitle = this.stylesService.setStyles(styleModelObj['levelAttachmentTitle']);
    this.styleLevelObj = JSON.parse(JSON.stringify(this.styleLevelObj));
    this.cbpService.styleLevelObj = this.styleLevelObj;

    const attachmentTitleTextObj = this.cbpService?.styleJson?.style?.find((style: any) => style?.name === "AttachmentTitle");
    if (attachmentTitleTextObj && attachmentTitleTextObj?.titleText !== "Attachment") {
      this.stylesService.attachmentTitleText = attachmentTitleTextObj?.titleText;
    }
    this.controlService.setStyleModelItem(this.cbpService.styleModel)
  }

  addElement(dgType: DgTypes) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.createNewItem();
    if (!this.controlService.checkStepSection(this.cbpService.selectedElement)) {
      this.cbpService.selectedElement = this.selectedCurrentElement;
    }
    if (!this.controlService.checkStepSection(this.cbpService.selectedElement)
      && dgType !== DgTypes.LabelDataEntry
      && dgType !== DgTypes.Para) {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionOrStepSelection);
      return;
    }
    // console.log(this.cbpService.selectedElement.dgType);
    if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo || this.cbpService.selectedElement.dgType === DgTypes.DelayStep
      || this.cbpService.selectedElement.dgType === DgTypes.Section || this.cbpService.selectedElement.dgType === DgTypes.StepAction
      || this.cbpService.selectedElement.dgType === DgTypes.Repeat || this.cbpService.selectedElement.dgType === DgTypes.Timed) {
      let obj = this.storeObjectsToCbpJson(dgType);
      this.cbpService.selectedElement = obj;
      this.controlService.setSelectItem(obj);
      this.auditService.createEntry({}, obj, Actions.Insert);
      this.cbpService.isViewUpdated = true;
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      this.cdref.detectChanges();
    } else {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCantAccept + dgType);
      return;
    }
    this.cbpService.popupDocumentSave = false;

  }
  onChangeDataEntry(event: any) {
    if (event === DgTypes.Table) {
      this.addTableElement(DgTypes.Table)
    } else {
      this.addStepActionElement(event, '')
    }
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
    this.cdref.detectChanges();
  }

  addTableElement(dgType: DgTypes) {
    this.createNewItem();
    if (!this.controlService.checkStepSection(this.cbpService.selectedElement)) {
      this.cbpService.selectedElement = this.selectedCurrentElement;
    }
    if (this.cbpService.selectedElement.dgType === DgTypes.StepAction || this.cbpService.selectedElement.dgType === DgTypes.Section
      || this.cbpService.selectedElement.dgType === DgTypes.Repeat || this.cbpService.selectedElement.dgType === DgTypes.Timed || this.cbpService.selectedElement.dgType === DgTypes.Header
      || this.cbpService.selectedElement.dgType === DgTypes.Footer) {
      if (dgType === DgTypes.Table) {
        this.tableService.isTableAdded = true;
      }
    } else if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo) {
      this.tableService.isTableAdded = true;
      this.cbpService.selectedElement.referenceOnly = true;
    } else {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionOrStepSelection);
    }
    this.cbpService.popupDocumentSave = false;
  }
  addStepActionElement(dgType: DgTypes, imgType: any) {
    if (!this.validateSearchAlert()) {
      return;
    }

    if (!this.cbpService.selectedElement) {
      this.showErrorMsg(DgTypes.Warning, "please select atleast one section");
      return;
    }
    this.createNewItem();
    if (this.controlService.isDataEntryAccept(this.cbpService.selectedElement) ||
      this.controlService.isDataEntryAccept(this.selectedCurrentElement) ||
      dgType === DgTypes.Figures) {
      // New Element Added
      if (!this.controlService.isDataEntryAccept(this.cbpService.selectedElement)) {
        this.cbpService.selectedElement = this.selectedCurrentElement;
      }
      if (this.controlService.isDataEntryAccept(this.cbpService.selectedElement) ||
        this.controlService.isDataEntryAccept(this.selectedCurrentElement) ||
        this.cbpService.selectedElement.dgType === DgTypes.Section) {
        if (dgType === DgTypes.Para && this.cbpService.selectedElement.dgType !== DgTypes.StepAction) {
          let obj = this.storeObjectsToCbpJson(DgTypes.Para);
          this.cbpService.selectedElement = obj;
          this.controlService.setSelectItem(obj);
          this.cdref.detectChanges();
          this.auditService.createEntry({}, obj, Actions.Insert);
        } else {
          //this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionCannotAccept);

          this.datasharing.newElementAdded(true);
          let obj = this.storeObjectsToCbpJson(dgType, imgType);
          this.cbpService.selectedElement = obj;
          this.controlService.setSelectItem(obj);
          this.auditService.createEntry({}, obj, Actions.Insert);
        }
      } else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionOrStepSelection);
      }
    } else if (this.cbpService.selectedElement?.dgType === DgTypes.Section ||
      this.selectedCurrentElement?.dgType === DgTypes.Section) {
      if (dgType === DgTypes.Para) {
        let obj = this.storeObjectsToCbpJson(DgTypes.Para);
        // this.cbpService.selectedElement = obj;
        if (this.cbpService.selectedElement.dgType == "Para") {
          let findObj = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgSequenceNumber, this.cbpService.cbpJson.section);
          if (findObj.length > 1) {
            findObj.forEach((item: any) => {
              if (item.children.findIndex((element: any) => element.dgUniqueID === this.cbpService.selectedElement.parentID) < 0) {
                // console.log(findObj);
                item.children.push(obj);
              }
            });
          } else {
            if (findObj.children.findIndex((element: any) => element.dgUniqueID == this.cbpService.selectedElement.parentID) < 0) {
              //console.log(findObj);
              findObj.children.push(obj);
            }
          }
        }
        this.controlService.setSelectItem(obj);
        this.cdref.detectChanges();
        this.auditService.createEntry({}, obj, Actions.Insert);
      } else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionCannotAccept);
      }
    } else if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo ||
      this.cbpService.selectedElement.dgType === DgTypes.DelayStep) {
      if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo || this.cbpService.selectedElement.dgType === DgTypes.DelayStep && dgType === DgTypes.Para) {
        let obj = this.storeObjectsToCbpJson(DgTypes.Para);
        this.cbpService.selectedElement = obj;
        let index = this.cbpService.cbpJson.section.findIndex((sec: any) => sec.dgUniqueID == this.cbpService.selectedElement.dgUniqueID);
        let childIndex = this.cbpService.cbpJson.section[index]?.children.findIndex((child: any) => child.dgUniqueID == obj.dgUniqueID);
        if (childIndex < 0) {
          // console.log(childIndex);
          this.cbpService.cbpJson.section[index]?.children.push(obj);
          // console.log(this.cbpService.cbpJson.section[index]?.children);
        }
        this.controlService.setSelectItem(obj);
        this.cdref.detectChanges();
        this.auditService.createEntry({}, obj, Actions.Insert);
      } else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.stepCannotacceptDataEntry);
      }
    } else {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.sectionOrStepSelection);
    }
    this.cbpService.popupDocumentSave = false;
    this.cbpService.isViewUpdated = true;
  }
  storeObjectsToCbpJson(dgType: any, imgType?: any) {
    let obj = this._buildUtil.createElement(dgType);
    obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
    this.cbpService.selectedElement.children ? this.cbpService.selectedElement.children :
      this.cbpService.selectedElement.children = [];
    if (dgType === DgTypes.Figures) {
      obj['mediaType'] = dgType === DgTypes.Figures && imgType === 'multiple' ? 'multipleImages' : 'single';
    }
    obj = this.controlService.setDualStep(this.cbpService.selectedElement, obj);
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    obj = this.cbpService.setBgDgUniqueID(obj);
    if (dgType === DgTypes.Para) {
      if (this.cbpService.selectedElement.dgType == "Para" && this.cbpService.selectedElement.parentID) {
        obj['parentID'] = this.cbpService.selectedElement.parentID;
      }
      else if (!this.cbpService.selectedElement.dgSequenceNumber) {
        obj['parentID'] = this.cbpService.selectedElement.parentID;
      }
      else {
        obj['parentID'] = this.cbpService.selectedElement.dgSequenceNumber
      }

    } else {
      obj['parentID'] = this.cbpService.selectedElement.dgSequenceNumber;
    }
    obj['level'] = this.cbpService.selectedElement['level'] + 1;
    obj['state'] = { hidden: true };
    obj = this.cbpService.setNewUserInfo(obj);
    this.cbpService.selectedElement.children.push(obj);
    if (this.cbpService.selectedElement.dgType == "Para") {
      this.findParaObject = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    }
    else if (!this.cbpService.selectedElement.dgSequenceNumber) {
      this.findParaObject = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    }
    else {
      this.findParaObject = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.dgSequenceNumber, this.cbpService.cbpJson.section);
    }

    if (this.findParaObject.length > 1) {
      this.findParaObject.forEach((item: any) => {
        if (item.children.findIndex((element: any) => element.dgUniqueID === obj.dgUniqueID) < 0) {
          // console.log(this.findParaObject);
          item.children.push(obj);
        }
      });
    } else {
      if (this.findParaObject.children.findIndex((element: any) => element.dgUniqueID == obj.dgUniqueID) < 0) {
        //console.log(this.findParaObject);
        this.findParaObject.children.push(obj);
      }
    }
    if (this.cbpService.backgroundJson?.section) {
      let element = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpService.backgroundJson.section);
      element?.children.push(obj);
    }
    return obj;
  }
  handleTreeClicked(value: any) {
    this.nodeTreeClicked = value
  }
  selectStepNode(event: any, isNotFromSearch = true) {
    this.cbpService.propertyType = "section"
    this.cbpService.coverPageViewEnable = false;
    this.cbpService.editCoverPage = false;
    this.cbpService.isDisabledControl = false;
    this.tableService.isBorderRemove = false;
    this.treeEventCount += 1;
    this.tableService.isSelectProperty = false;
    if (!this.windowWidthChanged && this.nodeTreeClicked) {
      this.cbpService.documentSelected = false;
      this.showCoverPage = false
    }
    else if (this.windowWidthChanged) {
      this.cbpService.documentSelected = true;
      this.showCoverPage = true
    }
    if (this.nodeTreeClicked) {
      this.cbpService.documentSelected = false;
      this.showCoverPage = false
    }



    if (event?.original) {
      this.treeUpdated = true;
      this.laodingSectionTree = true;
      this.setHeaderFooter(false, false);
      if (this.isTreeEvent) {
        this.cbpService.selectedUniqueId = event.original.dgUniqueID;
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(event.original.dgUniqueID, this.cbpService.cbpJson.section);
        if (Array.isArray(this.cbpService.selectedElement) || this.cbpService.selectedElement === undefined) {
          this.cbpService.selectedElement = event.original;
        }
        if (this.cbpService.selectedElement && !this.cbpService.stepClicked) {
          if (!this.cbpService.newElement_Added) {
            this.cbpService.pageSize = 20;
          }
          this.setSelectedItem(event.original);
          let paginateIndex = this.cbpService.selectedElement.paginateIndex ? this.cbpService.selectedElement.paginateIndex : this._buildUtil.getPaginateIndex(this.cbpService.selectedElement, this.cbpService.cbpJson);
          this.cbpService.setPaginationIndexs(paginateIndex);
        }
        this.cbpService.newElement_Added = false;
        if (!event['headerChanged']) {
          this.cbpService.stepClicked = false;
        }
      }
      this.documentSelected = false;
      this.isTreeEvent = true;
      this.builderService.selectedItem = event.original;
      this.builderService.indexValue = this.builderService.stepChildren.findIndex((i: any) => i.dgUniqueID === this.builderService.selectedItem.dgUniqueID);
      if (this.cbpService?.cbpJson?.section) { this.builderService.toDisabledForUpDownArrrow(); }
      if (!this.cbpService.selectedElement) {
        this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
        this.controlService.setSelectItem(this.cbpService.selectedElement);
        this.cbpService.selectedUniqueId = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgUniqueID));
      } else {
        if (Array.isArray(this.cbpService.selectedElement) && this.cbpService.selectedElement?.length > 1) {
          this.cbpService.selectedElement = JSON.parse(JSON.stringify(this.cbpService.selectedElement[0]));
        }
        this.controlService.setSelectItem(this.cbpService.selectedElement);
        this.cbpService.selectedUniqueId = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgUniqueID));
      }
      if (isNotFromSearch) {
        if (!this.newitemCreated) {
          this.callScroll(event);
          this.treeEventCount = 0;
        } else {
          if (this.treeEventCount >= 2) {
            this.newitemCreated = false;
            this.treeEventCount = 0;
          }
        }
      } else {
        // $("#scrollableElement").animate({ scrollTop: 0 }, "fast");

        setTimeout(() => {
          //commented the code due to over scrolling in small CBP files, due to which auto scroll was called and DOM was changed
          // this.cbpService.selectedElement = selectedElement;
          // this.gotoSearchField({ dgUniqueID: event.event }, event.event);
          this.cbpService.scrollId = 'dataEntry' + event.event;
        }, 1000);
      }
    }
  }
  callScroll(event: any) {
    if (Number(this.cbpService.startIndex) === 1 && !this.cbpService.stepClicked && !event['headerChanged']) {
      if (this.cbpService.selectedElement?.dgUniqueID) {
        this.reustSetTime(700, 2000);
        this.cdref.detectChanges();
      }
    } else {
      let timeer = (this._buildUtil.paginateIndex - this.cbpService.startIndex) < this.cbpService.pageSize ? 2000 : 1500;
      this.reustSetTime(1000, timeer);
      this.cdref.detectChanges();
    }
  }

  reustSetTime(first: number, second: number) {
    setTimeout(() => {
      this.goto(this.cbpService.selectedElement?.dgUniqueID);
    }, first);
    setTimeout(() => {
      this.treeUpdated = false; this.laodingSectionTree = false;
    }, second);
  }

  selectStepNodeFromFind(dgUniqueID: any, searchResult = false) {
    if (dgUniqueID) {
      let element = this._buildUtil.getElementByDgUniqueID(dgUniqueID, this.cbpService.cbpJson.section);
      if (element) {
        if (element.dgType != DgTypes.Para) {
          this.cbpService.selectedUniqueId = dgUniqueID;
          this.cbpService.selectedElement = element;
        } else {
          element = this._buildUtil.getElementByNumber(element.parentID, this.cbpService.cbpJson.section);
          this.controlService.setSelectItem(element);
          this.cbpService.selectedUniqueId = JSON.parse(JSON.stringify(element.dgUniqueID));
          // this.cbpService.selectedUniqueId = element.dgUniqueID;
          // this.cbpService.selectedElement = element;
        }

        this.gotoCurrentDiv(this.cbpService.selectedUniqueId);

      }

    }
  }
  setSelectedItem(event: any) {
    let items = this._buildUtil.getElementByDgUniqueID(event.dgUniqueID, this.cbpService.cbpJson.section);
    if (items?.length > 0) {
      items.forEach((element: any) => {
        if (element.dgType === this.cbpService.selectedElement.dgType) {
        } else {
          element.dgUniqueID = ++this.cbpService.maxDgUniqueId;
        }
      });
    }
  }
  procedureSnippet() {
    if (this.cbpService.selectedElement.dgType == DgTypes.Section) {
      if (this.cbpService.selectedElement.number) {
        if (this.cbpService.selectedElement.number.indexOf('.0') > -1) {
          //  const index = this.cbpService.cbpJson.section.findIndex((i: any) => this.cbpService.selectedElement.number == i.number);
          //  const parent = this.cbpService.selectedElement;
          let number: any = this._buildUtil.getNumberForChild(this.cbpService.selectedElement);
          let dgSequenceNumber: any = this._buildUtil.getDgSequenceNumberForChild(this.cbpService.selectedElement);
          const obj = this._buildUtil.build(new EmbededSection(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, this.cbpService.selectedElement.number, this.cbpService.selectedElement['level'] + 1);
          obj.isEmbededObject = true;
          if (this.cbpService.selectedElement?.protectDynamic || this.cbpService.selectedElement.dynamic_section) {
            obj['protectDynamic'] = true;
            obj['dynamic_section'] = false;
          }
          this.cbpService.selectedElement.children.push(obj);
          this.auditService.createEntry({}, obj, Actions.Insert);
          this.setData(obj);
        } else {
          let parent = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
          //  const index = parent.children.findIndex((e: any) => this.cbpService.selectedElement.number == e.number);
          //  const dgIndex = parent.children.findIndex((e: any) => this.cbpService.selectedElement.dgSequenceNumber == e.dgSequenceNumber);
          //  let number: any = this._buildUtil.getNumberForChild(parent);
          //  let dgSequenceNumber: any = this._buildUtil.getDgSequenceNumberForChild(parent);
          //  const obj = this._buildUtil.build(new EmbededSection(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, this.cbpService.selectedElement.number, this.cbpService.selectedElement['level'] + 1);
          //  obj.parentID = this.cbpService.selectedElement.number;
          //  parent.children.push(obj);

          let number: any = this._buildUtil.getNumberForChild(this.cbpService.selectedElement);
          let dgSequenceNumber: any = this._buildUtil.getDgSequenceNumberForChild(this.cbpService.selectedElement);
          const obj = this._buildUtil.build(new EmbededSection(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, this.cbpService.selectedElement.number, this.cbpService.selectedElement['level'] + 1);
          obj.isEmbededObject = true;
          obj.parentID = this.cbpService.selectedElement.number;
          if (this.cbpService.selectedElement?.protectDynamic || this.cbpService.selectedElement.dynamic_section) {
            obj['protectDynamic'] = true;
            obj['dynamic_section'] = false;
          }
          this.cbpService.selectedElement.children.push(obj);
          this.auditService.createEntry({}, obj, Actions.Insert);
          this.setData(obj);
        }
        this._buildUtil.setNodes(this.cbpService.cbpJson.section);
        this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
        this.treeUpdated = true;
        setTimeout(() => { this.treeUpdated = false; }, 5000);
        this.cdref.detectChanges();
      }
    } else {
      this.showErrorMsg(DgTypes.Warning, "Embeded Procedure can't accept StepInfo/Step Action");
    }
  }
  getEmbeddedDoc(nbr: any) {
    if (this.cbpService.isEdocLink) {
      this.cbpService.selectedElement['eDocumentInfo'] = nbr.uri;
      this.cbpService.selectedElement['eDocumentObj'] = nbr.docObj;
    } else if (nbr.status === 1000 || nbr.status === 10000) {
      this.cbpService.loading = true;
      //  this.builderService.getEmbeddedDoc(nbr.uri).subscribe((result: any) => {
      this.builderService.documentCbpFileDown(nbr.versionId).subscribe((result: any) => {
        this.cbpService.cbpJson.documentInfo[0]['maxProcedureSnippetIndex'] = ++this.cbpService.maxProcedureSnippetIndex;
        let cbpFile = new File([result.body], 'test.cbp');
        this.onFileChange(cbpFile, {});
      },
        (error) => {
          this.cbpService.loading = false;
          console.log(error);
        });
    }
    else {
      this.cbpService.loading = false;
      this.notifier.notify('error', 'Can not open Documents under Progress/Pending state');
    }
  }
  onFileChange(fileList: any, event = {}): void {
    this.documentUploading = true;
    const self = this;
    const zip = new JSZip();
    zip.loadAsync(fileList).then(function (zip) {
      Object.keys(zip.files).forEach(function (filename) {
        zip.files[filename].async('string').then(function (fileData) {
          if (filename.includes('cbp.json')) {
            const obj = JSON.parse(fileData);
            if (!obj.section) {
              self.notifier.notify('error', 'File Not supported');
              self.cbpService.loading = false;
              return;
            } else {
              self._buildUtil.setEmbededData(obj.section, self.cbpService.selectedElement, ++self._buildUtil.uniqueIdIndex, self.cbpService.selectedElement?.property?.type,
                true, self.cbpService.maxProcedureSnippetIndex);
              if (!self.cbpService.selectedElement.children) { self.cbpService.selectedElement.children = [] }
              self.cbpService.selectedElement.children = JSON.parse(JSON.stringify(obj.section));
              self.addTrackChages(self.cbpService.selectedElement);
              self.cbpService.refreshTreeNav = !self.cbpService.refreshTreeNav;

              self.treeUpdated = true;
              setTimeout(() => { self.treeUpdated = false; }, 5000);
              self._buildUtil.paginateIndex = 1;
              self._buildUtil.setPaginationIndex(self.cbpService.cbpJson.section);
              self.cbpService.attachmentObjts();
              self.cbpService.loading = false;
            }
          }
          if (filename.includes('default.json')) {
          }
          if (filename.includes('style.json')) {
          }
          if (filename.includes('data.json')) {
          }
        });
        zip.files[filename].async('blob').then(function (fileData) {
          if (filename.includes('media/') && filename.length > 6) {
            self.cbpService.media.push(new File([fileData], filename));
          }
          if (filename.includes('attachment/') && filename.length > 6) {
            const blob = new File([fileData], filename);
            self.cbpService.attachment.push(new Blob([fileData], { type: 'application/pdf' }));
          }
        });
      });
    });
  }


  addEmbededProcedure(event: any) {
    this.getEmbeddedDoc(event);
    this.cbpService.selectedElement = this.viewTrackChange(this.cbpService.selectedElement);
    this.createNewItem();
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
  }
  viewTrackChange(selectedElement: any) {
    selectedElement = this.cbpService.setUserUpdateInfo(selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    return selectedElement;
  }
  addTrackChages(selectedElement: any) {
    selectedElement?.children.forEach((item: any) => {
      item = this.viewTrackChange(item);
      if (item.children && Array.isArray(item.children)) {
        this.addTrackChages(item);
      }
    })
  }


  buildJsonCreate(isSave = false, isSaveAs = false) {
    if (this.cbpService.numericUnit?.length > 0) {
      this.cbpService.setCutCopyMethodType('error', 'Please Enter Unit value', true);
      return false;
    }
    if (this.cbpService.fieldsMaps?.size > 0) {
      let stepNumber;
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === '' || value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          if (stepNumber) {
            if (stepNumber.parentID) {
              this.notifier.notify('error', "Field Name can't be Empty at " + stepNumber.parentID);
              return;
            } else if (stepNumber.number && !Array.isArray(stepNumber.number)) {
              this.notifier.notify('error', "Field Name can't be Empty at " + stepNumber.parentID);
              return;
            } else {
              if (stepNumber.isTableDataEntry) {
                let parentNumber = this._buildUtil.getElementByDgUniqueID(stepNumber.parentDgUniqueID, this.cbpService.cbpJson.section);
                this.notifier.notify('error', "Field Name can't be Empty at " + parentNumber.number);
                return;
              } else {
                this.notifier.notify('error', "Field Name can't be Empty ");
                return;
              }
            }
          }
        }
      }
    }
    this.changeControl(0)

    if (!isSaveAs) { this.isPreviewClicked = true; }
    if (this.cbpService.dataJson?.isSavedDataJson) {
      this.cbpService.dataJson.dataObjects = []
    }
    // this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    this.cbpService.loading = true;
    if (!isSave) {
      this.cbpService.isFromBuild = true;
      this._buildUtil.dupUniqueIDs = [];
      this.cbpService.cbpJson.section.forEach((item: any) => this._buildUtil.setLevel(item));
      this._buildUtil.disableDuplicateCall = true;
      this.setMaxDgUniqueId();
      this.cbpService.loading = false;
      this.showExecuter('read', '');
    } else {
      const sections = this._buildUtil.formatForSave(this.cbpService.cbpJson.section, 'build', this.cbpService.maxDgUniqueId);
      this._buildUtil.disableDuplicateCall = true;
      this.setMaxDgUniqueId();
      this.cbpService.formObect = {
        section: sections,
        documentInfo: this.cbpService.cbpJson.documentInfo
      };
      this.cbpService.loading = false;
      if (this.isAutoSaveEnable && !isSaveAs) {
        const attachments = this.cbpService.attachment.filter((item: any) => item.size > 0);
        this.setCbpZipDownload(this.cbpService.formObect, false, this.cbpService.styleJson,
          this.cbpService.media, attachments, this.cbpService.dataJson, this.autoSaveFileName, this.cbpService.cbpZip.audits, 'download', {});
      } else {
        this.saveFile();
      }
    }
  }

  setMaxDgUniqueId() {
    if (this._buildUtil.uniqueIdIndex > Number(this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'])) {
      this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    }
    if (!this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID']) {
      this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    }
    this.cbpService.maxDgUniqueId = this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'];
    this.cbpService.maxProcedureSnippetIndex = this.cbpService.cbpJson.documentInfo[0]['maxProcedureSnippetIndex'] ? this.cbpService.cbpJson.documentInfo[0]['maxProcedureSnippetIndex'] : 0;
    this.setMaxDgUniqueIdToString();
  }
  converCoverPageDgUniqueId() {
    if (this.cbpService.cbpJson.documentInfo[0]?.lastUpdatedSectionDgUniqueID) {
      let uniqueid = this._buildUtil.uniqueIdIndex;
      this.cbpService.cbpJson.documentInfo[0]['lastUpdatedSectionDgUniqueID'] = uniqueid?.toString();
    }
    if (this.cbpService.cbpJson.documentInfo[0]?.coverPageData) {
      this.cbpService.cbpJson.documentInfo[0]['coverPageData'].dgUniqueID = this.cbpService.cbpJson.documentInfo[0]['coverPageData'].dgUniqueID?.toString();
      this._buildUtil.setDefaultTableChanges(this.cbpService.cbpJson.documentInfo[0].coverPageData, 0,
        this.cbpService.cbpJson.documentInfo[0].coverPageData?.dgUniqueID);
    }
    for (let i = 0; i < this.cbpService.cbpJson.documentInfo[0].header.children.length; i++) {
      const tabelObj = this.cbpService.cbpJson.documentInfo[0].header.children[i];
      if (tabelObj?.dgUniqueID) {
        tabelObj.dgUniqueID = tabelObj?.dgUniqueID.toString();
      }
      this._buildUtil.setDefaultTableChanges(tabelObj, 0, tabelObj?.dgUniqueID);
    }
    for (let i = 0; i < this.cbpService.cbpJson.documentInfo[0].footer.children.length; i++) {
      const tabelObjFooter = this.cbpService.cbpJson.documentInfo[0].footer.children[i];
      if (tabelObjFooter?.dgUniqueID) {
        tabelObjFooter.dgUniqueID = tabelObjFooter?.dgUniqueID.toString();
      }
      this._buildUtil.setDefaultTableChanges(tabelObjFooter, 0, tabelObjFooter?.dgUniqueID);
    }
  }

  getSectionDependency(evet: any) {
    this.cbpSharedService.removeBackdrop();
    this.cbpService.configureDependency = false;
  }

  saveFile() {
    const modalRef = this.modalService.open(DownloadCbpComponent, { windowClass: 'modal-holder-test', centered: true });
    const attachments = this.cbpService.attachment.filter((item: any) => item.size > 0);
    this.setMaxDgUniqueIDForSave();
    const cbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
    const sections = this._buildUtil.formatForSave(cbpJson.section, 'build', this.cbpService.maxDgUniqueId, true);
    this._buildUtil.disableDuplicateCall = true;
    this.converCoverPageDgUniqueId();
    const documentInfo = JSON.parse(JSON.stringify(this.cbpService.cbpJson.documentInfo[0]));
    documentInfo['internalRevision'] = '';
    if (documentInfo?.internalVersion) {
      documentInfo['internalVersion'] = '';
    }
    if (documentInfo?.coverPageData) {
      documentInfo.coverPageData = this._buildUtil.clearInternalVersionForTable(documentInfo.coverPageData, true);
      if (documentInfo?.header?.children?.length > 0) {
        for (let i = 0; i < documentInfo.header?.children?.length; i++) {
          documentInfo.header.children[i] = this._buildUtil.clearInternalVersionForTable(documentInfo.header?.children[i], true);
        }
      }
      if (documentInfo?.footer?.children?.length > 0) {
        for (let i = 0; i < documentInfo.footer?.children?.length; i++) {
          documentInfo.footer.children[i] = this._buildUtil.clearInternalVersionForTable(documentInfo.footer?.children[i], true);
        }
      }
    }
    this.cbpService.formObect = {
      section: sections, documentInfo: [documentInfo]
    };
    modalRef.componentInstance.cbpJson = this.cbpService.formObect;
    modalRef.componentInstance.styleJson = this.cbpService.styleJson;
    modalRef.componentInstance.styleImageJson = this.cbpService.styleImageJson;
    modalRef.componentInstance.layoutJson = this.cbpService.layOutJson;
    modalRef.componentInstance.dataJson = this.cbpService.dataJson;
    modalRef.componentInstance.media = this.cbpService.media;
    modalRef.componentInstance.attachment = attachments;
    modalRef.componentInstance.audits = this.cbpService.cbpZip.audits
    modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
      if (receivedEntry === false) {
        if (this.cbpService.selectedType == 'New') {
          this.newDoc();
          this.cbpService.istemplateOpen = true
        }
        if (this.cbpService.selectedType == 'Open') {
          this.openFile();
        }
        if (this.cbpService.selectedType == 'docClose' || this.cbpService.selectedType == 'Exit') {
          this.exitCbp();
          //  let evt: Request_Msg = { eventType: EventType.editorsaved, msg: {type:this.cbpService.selectedType} };
          //  this.datasharing.sendMessageFromLibToOutside(evt);
        }
      }
      modalRef.close();
      //  let evt: Request_Msg = { eventType: EventType.editorclosed, msg: {type:this.cbpService.selectedType} };
      //  this.datasharing.sendMessageFromLibToOutside(evt);
    });
    modalRef.componentInstance.fileNameEvent.subscribe((fileName: any) => {
      this.autoSaveFileName = fileName
      this.cbpService.popupDocumentSave = modalRef.componentInstance?.saveCbp;

    });
  }
  getEventFromSaveCbp(event: any) {
    this.saveModalopen = false;
  }
  refreshTree(item: any) {
    this.headerItem = item;
  }
  getResponseFromLink(event: any) {
    this.updateProperty();
  }
  updateProperty() {
    this.isPropertyUpdated = false;
    setTimeout(() => { this.isPropertyUpdated = true; }, 1);
    this.cdref.detectChanges();
  }
  addStepContainer() {
    this.helpBackSectionReuseCode();
  }
  helpSectionBackCode(dgUniqueID: any) {
    this.datasharing.newElementAdded(true);
    const stepNumber = (this.cbpService.backgroundJson.section?.length + 1) + '.0';
    const section = new Section();
    let obj = this._buildUtil.build(section, stepNumber, dgUniqueID, stepNumber);
    obj['state'] = { hidden: false };
    obj['paginateIndex'] = this.cbpService.selectedElement.paginateIndex;
    obj['iconStyle'] = this.stylesService.getIconStyles(obj, this.cbpService.styleModel);
    obj['parentDgUniqID'] = this.cbpService.selectedElement.dgUniqueID;
    obj = this.cbpService.setNewUserInfo(obj);
    this.cbpService.backgroundJson.section.push(obj);
  }

  helpBackSectionReuseCode() {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.cbpService.loading = true;
    this.createNewItem();
    this.datasharing.newElementAdded(true);
    const attachObjs = this.cbpService.cbpJson.section.filter((i: any) => i.dataType === SequenceTypes.Attachment);
    this.cbpService.cbpJson.section = this.cbpService.cbpJson.section.filter((i: any) => i.dataType !== SequenceTypes.Attachment);
    const stepNumber = (this.cbpService.cbpJson.section?.length + 1) + '.0';
    const section = new Section();
    let documentInfoUsage = this.cbpService.cbpJson.documentInfo[0]?.usage;
    section.usage = documentInfoUsage ? documentInfoUsage : this.cbpService.docUsage;
    if (this.cbpService.docUsage === Dependency.Reference || this.cbpService.docUsage === Dependency.Continuous) {
      section.dependency = Dependency.Default;
    } else if (this.cbpService.docUsage === Dependency.Information) {
      section.dependency = Dependency.Independent;
    }
    let obj = this._buildUtil.build(section, stepNumber, this._buildUtil.getUniqueIdIndex(), stepNumber);
    obj['state'] = { hidden: false };
    obj['iconStyle'] = this.stylesService.getIconStyles(obj, this.cbpService.styleModel);
    obj = this.cbpService.setNewUserInfo(obj);
    // if (this.cbpService.backgroundJson?.section) {
    //   this.helpSectionBackCode(obj.dgUniqueID);
    // }
    this.cbpService.cbpJson.section.push(obj);
    this.cbpService.refreshTreeNav = true;
    if (attachObjs.length !== 0) {
      this.attachmentsObjets(attachObjs);
    }
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
    if (obj.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize)) {
      this.cbpService.newElement_Added = true;
      this.cbpService.pageSize = obj.paginateIndex - this.cbpService.startIndex;
    }
    this.cbpService.popupDocumentSave = false;
    this.setData(obj);
    this.auditService.createEntry({}, obj, Actions.Insert);
    this.cbpService.loading = false;
    this.cdref.detectChanges();
  }
  createNewItem() {
    this.newitemCreated = true;
  }
  attachmentsObjets(objts: any) {
    for (let i = 0; i < objts.length; i++) {
      objts[i].dgSequenceNumber = (this.cbpService.cbpJson.section?.length + 1) + '.0';
      if (objts[i].dataType === 'Attachment') {
        objts[i]['childSequenceType'] = SequenceTypes.Attachment;
      }
      this._buildUtil.renameChildLevelSteps(objts[i], true, true);
      this.cbpService.cbpJson.section.push(objts[i]);
    }
  }
  isSelectedElement(obj: any) {
    this.cbpService.selectedElement = obj;
    this.cbpService.selectedUniqueId = obj['dgUniqueID'];
    this.cbpService.selectedElement['selectedDgType'] = obj.dgType;
    this.cbpService.selectedDgType = obj.dgType;
    this.controlService.setSelectItem(this.cbpService.selectedElement);
  }
  nextCharacter(c: any) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  addAttachment() {
    const encoder = new AlphanumericEncoder();
    if (!this.validateSearchAlert()) {
      return;
    }
    this.datasharing.newElementAdded(true);
    const firstObj = this.cbpService.cbpJson.section.filter((i: any) => (i.number.split(' ')[1]) === "A");
    if (firstObj.length === 0) {
      this.alpha = encoder.encode(1)?.toString();
    }
    const items = this.cbpService.cbpJson.section.filter((i: any) => i.dataType === "Attachment");
    if (items.length > 0) {
      this.alpha = encoder.encode(items.length + 1)?.toString();
    }
    if (this._buildUtil.attachmentId) {
      this.alpha = encoder.encode(items.length + 1)?.toString();
      this._buildUtil.attachmentId = false;
    }
    const stepNumber = (this.cbpService.cbpJson.section?.length + 1) + '.0';
    const number = this.stylesService.attachmentTitleText + ' ' + this.alpha;
    const section: any = new Section();
    section.usage = Dependency.Continuous;
    section.dependency = Dependency.Independent;
    section['dataType'] = SequenceTypes.Attachment;
    let obj = this._buildUtil.build(section, number, this._buildUtil.getUniqueIdIndex(), stepNumber);
    obj['childSequenceType'] = SequenceTypes.Attachment;
    obj['originalSequenceType'] = SequenceTypes.Attachment;
    obj['numberedChildren'] = true;
    obj['state'] = { hidden: false };
    obj = this.cbpService.setUserUpdateInfo(obj);
    this.cbpService.cbpJson.section.push(obj);
    this.isSelectedElement(obj);
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
    if (obj.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize)) {
      this.cbpService.newElement_Added = true;
      this.cbpService.pageSize = obj.paginateIndex - this.cbpService.startIndex;
    }
    this.cbpService.popupDocumentSave = false;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.auditService.createEntry({}, obj, Actions.Insert);
    this.cdref.detectChanges();
  }
  createStepNode(step: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.createNewItem();
    this.addNumberedElement(step.dgType, this._buildUtil.getElementByNumber(step.parentStep ? step.parentStep : step.number, this.cbpService.cbpJson.section));
    this.cbpService.popupDocumentSave = false;
  }
  addNumberedElementBack(dgType: DgTypes = DgTypes.Section, backDguniqId: any, backlevel: any, selectedlement = JSON.parse(JSON.stringify(this.cbpService.selectedElement))) {
    if (selectedlement) {
      this.createNewItem();
      let dgSequenceNumber: any;
      selectedlement = this.addSequenceInfo(selectedlement);
      let number: any = this._buildUtil.getNumberForChild(selectedlement);
      if (selectedlement.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(selectedlement);
      }
      // New Element Added
      this.datasharing.newElementAdded(true);
      let obj = this._buildUtil.build(this._buildUtil.createElement(dgType), number, backDguniqId, dgSequenceNumber, selectedlement.dgSequenceNumber, backlevel);
      obj = this.setRomanSeq(obj, selectedlement);
      if (obj.parentID) {
        let parentElement = this._buildUtil.getElementByNumber(obj.parentID, this.cbpService.backgroundJson.section);
        obj.usage = parentElement.usage;
        obj.dependency = parentElement.dependency;
      } else {
        obj.usage = this.cbpService.docUsage;
        if (this.cbpService.docUsage === Dependency.Reference || this.cbpService.docUsage === Dependency.Continuous) {
          obj.dependency = Dependency.Default;
        } else if (this.cbpService.docUsage === Dependency.Information) {
          obj.dependency = Dependency.Independent;
        }
      }
      if (selectedlement['childSequenceType'] === SequenceTypes.Attachment) {
        obj['childSequenceType'] = SequenceTypes.Attachment;
        obj['originalSequenceType'] = SequenceTypes.Attachment;
      }
      if (selectedlement.dataType === SequenceTypes.Attachment || selectedlement.aType === SequenceTypes.Attachment) {
        obj['aType'] = SequenceTypes.Attachment;
        obj['duplicateValue'] = obj.number;
      }
      this._buildUtil.setIndexDisplayState(obj);
      obj = this.cbpService.setNewUserInfo(obj);
      if (selectedlement?.protectDynamic || selectedlement.dynamic_section) {
        obj['protectDynamic'] = true;
        obj['dynamic_section'] = false;
      }
      selectedlement.children.push(obj);
    }
  }

  setRomanSeq(obj: any, selectedlement: any) {
    if (selectedlement['childSequenceType'] === SequenceTypes.ROMAN || selectedlement['childSequenceType'] === SequenceTypes.CAPITALROMAN) {
      obj['childSequenceType'] = selectedlement['stepSequenceType'];
      obj['originalSequenceType'] = selectedlement['stepSequenceType'];
      obj['stepSequenceType'] = selectedlement['stepSequenceType'];
      obj['romanNumber'] = this._buildUtil.getRomanNumber(selectedlement);
    }
    return obj;
  }

  informationStep(element: any, type: any) {
    // New Element Added
    this.informationStepPrimary(element, type);
  }
  addStepInfoBackGround(element: any, type: any, backDguniqId: any, backlevel: any) {
    this.datasharing.newElementAdded(true);

    if (element) {
      this.createNewItem();
      let stepInfo: any;
      let dgSequenceNumber: any;
      if (element.dataType === 'Attachment') {
        element['childSequenceType'] = SequenceTypes.Attachment;
      }
      let number: any = this._buildUtil.getNumberForChild(element);
      if (element.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(element);
      }
      if (type === DgTypes.StepInfo) {
        stepInfo = this._buildUtil.build(new StepInfo(), number, backDguniqId, dgSequenceNumber, element.dgSequenceNumber, backlevel);
      } else if (type === DgTypes.DelayStep) {
        stepInfo = this._buildUtil.build(new DelayStep(), number, backDguniqId, dgSequenceNumber, element.dgSequenceNumber, backlevel);
      }
      this._buildUtil.setIndexDisplayState(stepInfo);
      stepInfo.para = [new Paragraph()];
      if (element.dataType === SequenceTypes.Attachment) {
        stepInfo['aType'] = SequenceTypes.Attachment;
        stepInfo['duplicateValue'] = stepInfo.number;
      }
      element.children.push(stepInfo);
    }
  }
  informationStepPrimary(element: any, type: any) {
    this.datasharing.newElementAdded(true);
    if (element) {
      this.createNewItem();
      let stepInfo: any;
      let dgSequenceNumber: any;
      if (element.dataType === 'Attachment') {
        element['childSequenceType'] = SequenceTypes.Attachment;
      }
      let number: any = this._buildUtil.getNumberForChild(element);
      if (element.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(element);
      }
      if (type === DgTypes.StepInfo) {
        stepInfo = this._buildUtil.build(new StepInfo(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      } else if (type === DgTypes.DelayStep) {
        stepInfo = this._buildUtil.build(new DelayStep(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      }
      this._buildUtil.setIndexDisplayState(stepInfo);
      if (element.dataType === SequenceTypes.Attachment) {
        stepInfo['aType'] = SequenceTypes.Attachment;
        // stepInfo['duplicateValue'] = stepInfo.number;
        stepInfo['duplicateValue'] = this._buildUtil.getAttachmentDuplicateValue(element);
      }
      stepInfo = this.controlService.setDualStep(this.cbpService.selectedElement, stepInfo);
      stepInfo = this.setRomanSeq(stepInfo, element);
      stepInfo = this.cbpService.setNewUserInfo(stepInfo);
      this.cbpService.selectedElement.children.push(stepInfo);
      this.addDualStep(stepInfo);
      stepInfo = this.updateTimedOrRepeat(this.cbpService.selectedElement, stepInfo);
      this.isSelectedElement(stepInfo);
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      if (stepInfo.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize)) {
        this.cbpService.newElement_Added = true;
        this.cbpService.pageSize = stepInfo.paginateIndex - this.cbpService.startIndex;
      }
      // this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
      this.auditService.createEntry({}, stepInfo, Actions.Insert);
      //this.cbpService.setPaginationIndexs(stepInfo.paginateIndex);
    } else {
      this.showErrorMsg(DgTypes.Warning, 'Please select element');
    }
    this.cbpService.popupDocumentSave = false;
  }
  updateTimedOrRepeat(stepObject: any, step: any) {
    return this.cbpService.setParentStepInfo(step, stepObject);
  }

  addStepNew(element: any, dgType: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.addStepNewReuse(element, dgType);
  }
  addStepNewBackGround(element: any, dgType: any, backDguniqId: any, backlevel: any) {
    if (element) {
      // New Element Added
      this.createNewItem();
      this.datasharing.newElementAdded(true);
      let stepBackValue: any;
      let dgSequenceNumber: any;
      element = this.addSequenceInfo(element);
      let number: any = this._buildUtil.getNumberForChild(element);
      if (element.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(element);
      }
      if (dgType === DgTypes.StepAction) {
        stepBackValue = this._buildUtil.build(new StepAction(), number, backDguniqId, dgSequenceNumber, element.dgSequenceNumber, backlevel);
      } else if (dgType === DgTypes.Timed) {
        stepBackValue = this._buildUtil.build(new Timed(), number, backDguniqId, dgSequenceNumber, element.dgSequenceNumber, backlevel);
      } else if (dgType === DgTypes.Repeat) {
        stepBackValue = this._buildUtil.build(new Repeat(), number, backDguniqId, dgSequenceNumber, element.dgSequenceNumber, backlevel);
      }
      if (element['childSequenceType'] === SequenceTypes.Attachment) {
        stepBackValue['childSequenceType'] = SequenceTypes.Attachment;
        stepBackValue['originalSequenceType'] = SequenceTypes.Attachment;
      }
      if (element.dataType === SequenceTypes.Attachment || element.aType === SequenceTypes.Attachment) {
        stepBackValue['aType'] = SequenceTypes.Attachment;
        // stepBackValue['duplicateValue'] = stepBackValue.number;
        stepBackValue['duplicateValue'] = this._buildUtil.getAttachmentDuplicateValue(element);
      }
      if (!element.numberedChildren) {
        stepBackValue['childSequenceType'] = element['childSequenceType'];
      }
      this._buildUtil.setIndexDisplayState(stepBackValue);
      element = this.cbpService.setNewUserInfo(element);
      this.cbpService.backContentJson = JSON.parse(JSON.stringify(defaultContentJson['content']));
      let obj = this._buildUtil.createElement(DgTypes.Para);
      obj = this.cbpService.setNewUserInfo(obj);
      obj['backcontent'] = this.cbpService.backContentJson;
      stepBackValue.children.push(obj);
      element.children.push(stepBackValue);

    }
  }
  addStepNewReuse(element: any, dgType: any) {
    if (element) {
      this.cbpService.loading = true;
      this.createNewItem();
      // New Element Added
      this.datasharing.newElementAdded(true);
      let step: any;
      let dgSequenceNumber: any;
      element = this.addSequenceInfo(element);
      let number: any = this._buildUtil.getNumberForChild(element);
      if (element.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(element);
      }
      if (dgType === DgTypes.StepAction) {
        step = this._buildUtil.build(new StepAction(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      } else if (dgType === DgTypes.Timed) {
        step = this._buildUtil.build(new Timed(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      } else if (dgType === DgTypes.Repeat) {
        step = this._buildUtil.build(new Repeat(), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, element.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      }
      if (element['childSequenceType'] === SequenceTypes.Attachment) {
        step['childSequenceType'] = SequenceTypes.Attachment;
        step['originalSequenceType'] = SequenceTypes.Attachment;
      }
      if (element.dataType === SequenceTypes.Attachment || element.aType === SequenceTypes.Attachment) {
        step['aType'] = SequenceTypes.Attachment;
        // step['duplicateValue'] = step.number;
        step['duplicateValue'] = this._buildUtil.getAttachmentDuplicateValue(element);
      }
      if (!element.numberedChildren) {
        step['childSequenceType'] = element['childSequenceType'];
      }
      step = this.setRomanSeq(step, element);
      this._buildUtil.setIndexDisplayState(step);
      step = this.controlService.setDualStep(this.cbpService.selectedElement, step);
      step = this.cbpService.setNewUserInfo(step);
      if (this.cbpService.selectedElement?.protectDynamic || this.cbpService.selectedElement.dynamic_section) {
        step['protectDynamic'] = true;
        step['dynamic_section'] = false;
      }
      this.cbpService.selectedElement.children.push(step);
      this.addDualStep(step);
      step = this.updateTimedOrRepeat(this.cbpService.selectedElement, step)
      this.cbpService.refreshTreeNav = true;
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      if (step.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize)) {
        this.cbpService.newElement_Added = true;
        this.cbpService.pageSize = step.paginateIndex - this.cbpService.startIndex;
      }
      this.cbpService.isViewUpdated = true;
      this.setData(step);
      this.cbpService.selectedDgType = this.cbpService.selectedElement.dgType;
      this.auditService.createEntry({}, step, Actions.Insert);
    } else {
      this.showErrorMsg(DgTypes.Warning, 'Please select element');
    }
    this.cbpService.popupDocumentSave = false;
    this.cbpService.loading = false;
    this.cdref.detectChanges();
  }
  setData(data: any) {
    setTimeout(() => {
      this.isSelectedElement(data);
      this.selectedCurrentElement = data;
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    }, 700);
  }
  addNumberedElement(dgType: DgTypes = DgTypes.Section, selectedlement = JSON.parse(JSON.stringify(this.cbpService.selectedElement))) {
    if (selectedlement) {
      this.cbpService.loading = true;
      this.createNewItem();
      let dgSequenceNumber: any;
      selectedlement = this.addSequenceInfo(selectedlement);
      let number: any = this._buildUtil.getNumberForChild(selectedlement);
      if (selectedlement.dgSequenceNumber) {
        dgSequenceNumber = this._buildUtil.getDgSequenceNumberForChild(selectedlement);
      }
      // New Element Added
      this.datasharing.newElementAdded(true);
      let obj = this._buildUtil.build(this._buildUtil.createElement(dgType), number, this._buildUtil.getUniqueIdIndex(), dgSequenceNumber, selectedlement.dgSequenceNumber, this.cbpService.selectedElement['level'] + 1);
      if (obj.parentID) {
        let parentElement = this._buildUtil.getElementByNumber(obj.parentID, this.cbpService.cbpJson.section);
        obj.usage = parentElement.usage;
        obj.dependency = parentElement.dependency;
      } else {
        obj.usage = this.cbpService.docUsage;
        if (this.cbpService.docUsage === Dependency.Reference || this.cbpService.docUsage === Dependency.Continuous) {
          obj.dependency = Dependency.Default;
        } else if (this.cbpService.docUsage === Dependency.Information) {
          obj.dependency = Dependency.Independent;
        }
      }
      if (selectedlement['childSequenceType'] === SequenceTypes.Attachment) {
        obj['childSequenceType'] = SequenceTypes.Attachment;
        obj['originalSequenceType'] = SequenceTypes.Attachment;
      }
      if (selectedlement.dataType === SequenceTypes.Attachment || selectedlement.aType === SequenceTypes.Attachment) {
        obj['aType'] = SequenceTypes.Attachment;
        // obj['duplicateValue'] = obj.number;
        obj['duplicateValue'] = this._buildUtil.getAttachmentDuplicateValue(selectedlement);

      }
      if (!selectedlement.numberedChildren) {
        obj['childSequenceType'] = selectedlement['childSequenceType'];
      }
      obj = this.setRomanSeq(obj, selectedlement);
      this._buildUtil.setIndexDisplayState(obj);
      obj = this.cbpService.setNewUserInfo(obj);
      obj = this.controlService.setDualStep(this.cbpService.selectedElement, obj);
      if (this.cbpService.selectedElement?.protectDynamic || this.cbpService.selectedElement.dynamic_section) {
        obj['protectDynamic'] = true;
        obj['dynamic_section'] = false;
      }
      obj = this.updateTimedOrRepeat(selectedlement, obj);
      this.cbpService?.selectedElement?.children?.push(obj);
      this.addDualStep(obj);
      this.cbpService.refreshTreeNav = true;
      this._buildUtil.paginateIndex = 1;
      this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
      if (obj.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize)) {
        this.cbpService.newElement_Added = true;
        this.cbpService.pageSize = obj.paginateIndex - this.cbpService.startIndex;
      }
      this.cbpService.isViewUpdated = true;
      this.setData(obj);
      this.auditService.createEntry({}, obj, Actions.Insert);
    } else {
      this.showErrorMsg(DgTypes.Warning, 'Please select element');
    }
    this.cbpService.popupDocumentSave = false;
    this.cbpService.loading = false;
    this.cdref.detectChanges();
  }

  addDualStep(step: any) {
    if (this.cbpService.selectedElement?.dualStep && this.cbpService.selectedElement?.dualStepType === 'DualStepAlignment') {
      this.createNewItem();
      step = JSON.parse(JSON.stringify(step));
      step.dgUniqueID = this._buildUtil.getUniqueIdIndex();
      let i = (this.cbpService.selectedElement['rightdualchild'] == true) ? 0 : 1;
      const parentElement = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.number, this.cbpService.cbpJson.section);
      i = (parentElement.length === 3) ? i + 1 : i;
      if (this.cbpService.selectedElement['rightdualchild'] == true) {
        step['leftdualchild'] = true;
        step['rightdualchild'] = false;
      }
      if (this.cbpService.selectedElement['rightdualchild'] == false) {
        step['leftdualchild'] = false;
        step['rightdualchild'] = true;
      }
      step = JSON.parse(JSON.stringify(step));
      step.dgUniqueID = this._buildUtil.getUniqueIdIndex();
      let findObj = parentElement[i].children.filter((item: any) => item.number == step.number)
      if (findObj === undefined || findObj?.length === 0) {
        parentElement[i].children.push(step);
      }
    }
  }
  ngOnDestroy(): void {
    $(window).unbind('keypress');
    $(window).unbind('keydown');
    this.cbpService.copyAudit.next(true);
    this.cbpService.copyAudit.complete();
    this.auditService.undoAudit.next();
    this.auditService.undoAudit.complete();
    this.cbpService.hyperLink.next(true)
    this.cbpService.hyperLink.complete();
    this.cbpService.searchNavigate.next(true)
    this.cbpService.searchNavigate.complete();
    this.cbpService.searchNavigate?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
    this._subscriptionData?.unsubscribe();
    this.setDataEntrySubscription?.unsubscribe();
    this._buildUtil.dualSteps = [];
    this._buildUtil.loadedMaxInteger = false;
    this._buildUtil.disableDuplicateCall = false;
    this.cbpService.ctrlSelectedItems = [];
    this.cbpService.selectedElement = null;
    this.cbpService.isDuplicateValues = [];
    this.tableService.selectedRow = [];
    this.cbpService.formObect = undefined;
    this.auditService.auditJson = [];
    this.auditService.undoJson = [];
    this.auditService.redoJson = [];
    this.auditService.selectedElementSnapchat = null;
    this.auditService.elementsRestoreSnapChats = [];
    // this.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = this._buildUtil.uniqueIdIndex;
    this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    this.setMaxDgUniqueIdToString();
    this.datasharing.changeImageProperties(null);
    //this.cbpService.documentSelected = false;
    if (this.autoSaveEvent) {
      clearInterval(this.autoSaveEvent);
    }
  }

  dropItemsDelete(i: any) {
    this.cbpService.selectedElement.choice = this.cbpService.selectedElement.choice.filter((e: any, n: any) => n != i);
  }

  gotoCurrentDiv(number: any) {
    if (!this.laodingSectionTree) { this.treeUpdated = true; }
    this.goto(number);
    setTimeout(() => { this.treeUpdated = false; }, 1500);
  }
  goto(number: any) {
    if ($("#scrollSection" + number).length !== 0) {
      let title = this.cbpService.cbpJson.documentInfo[0]['header']['isHeaderEnabled'] ? 'center' : 'start';
      $('#scrollSection' + number)[0].scrollIntoView({ behavior: "instant", block: 'start', inline: "nearest" });
      this.countOfindex = [];
    } else {
      // console.log('Index not found' +number);
      this.countOfindex.push(number);
      if (this.countOfindex.length < 2 && this.countOfindex.includes(number)) {
        let event = { original: this.cbpService.selectedElement };
        this.selectStepNode(event);
      }
    }
  }
  selectElemenetForSearch(event: any) {
    const selectedElement = this._buildUtil.getElementByDgUniqueID(event, this.cbpService.cbpJson);
    if (this._buildUtil.isDataEntry(selectedElement)) {
      let id = 0; let selectedItem: any;
      // if (selectedElement?.parentID) {
      //   selectedItem = this._buildUtil.getElementByNumber(selectedElement.parentID, this.cbpService.cbpJson);
      // } else 
      if (selectedElement?.parentStepID) {
        selectedItem = this._buildUtil.getElementByDgUniqueID(selectedElement?.parentStepID, this.cbpService.cbpJson);

      } else {
        id = selectedElement.isTableDataEntry ?
          (selectedElement?.parentStepID ? selectedElement?.parentStepID : (selectedElement.parentDgUniqueID ? selectedElement.parentDgUniqueID : (selectedElement.parentDgUniqueId ? selectedElement.parentDgUniqueId : selectedElement.parentDgUniqId)))
          : (selectedElement.parentDgUniqueID ? selectedElement.parentDgUniqueID : (selectedElement.parentDgUniqueId ? selectedElement.parentDgUniqueId : selectedElement.parentDgUniqId));

        selectedItem = this._buildUtil.getElementByDgUniqueID(id, this.cbpService.cbpJson);
        if (selectedItem.dgType === DgTypes.Form) {
          document.getElementById('table-container-' + selectedItem.dgUniqueID)?.scrollIntoView({ behavior: "smooth", block: 'center', inline: "nearest" });

          let idD = selectedItem?.parentStepID ? selectedItem?.parentStepID : selectedItem.parentID;
          selectedItem = this._buildUtil.getElementByNumber(idD, this.cbpService.cbpJson);

        }
      }
      if (selectedElement?.parentDgUniqueID) {
        document.getElementById('table-container-' + selectedElement.parentDgUniqueID)?.scrollIntoView({ behavior: "smooth", block: 'center', inline: "nearest" });
      }
      if (this.selectedCurrentElement.dgUniqueID === selectedItem?.dgUniqueID) {
        setTimeout(() => {
          // this.cbpService.selectedElement = selectedElement;
          this.gotoSearchField({ dgUniqueID: event }, id);
        }, 1000);
      } else {
        if (selectedItem) {
          const data = { original: selectedItem, event: event };
          this.selectStepNode(data, false);
        }
      }
    } else {
      const data = { original: selectedElement };
      this.selectStepNode(data);
      //this.cbpService.replaceState = false;
    }
  }
  gotoSearchField(selectedElement: any, id: any) {
    const element = document.getElementById('dataEntry' + selectedElement.dgUniqueID);
    if (element) {
      document.getElementById('dataEntry' + selectedElement.dgUniqueID)?.scrollIntoView({ behavior: "smooth", block: 'center', inline: "nearest" });
    } else {
      $("#scrollableElement").animate({ scrollTop: 600 }, "fast");
      // console.log(document.getElementById('dataEntry' + selectedElement.dgUniqueID));
      document.getElementById('dataEntry' + selectedElement.dgUniqueID)?.scrollIntoView({ behavior: "smooth", block: 'center', inline: "nearest" });
    }
    this.cbpService.scrollId = 'dataEntry' + selectedElement.dgUniqueID;
  }

  documentShow() {
    if (!this.cbpService.coverPageViewEnable) {
      this.cbpService.coverPageViewEnable = true;
      this.cbpService.isDisabledControl = true;
      this.cbpService.showviewCoverPage = false;
      this.nodeTreeClicked = false;
      this.cbpService.propertyType = 'document';
      this.cbpService.selectedUniqueId = 0;
      this.showCoverPage = true
      this.cbpService.documentSelected = true;
      this.cbpService.documentSelected = JSON.parse(JSON.stringify(this.cbpService.documentSelected))
      if (this.cbpService.cbpJson.documentInfo[0]?.newCoverPageeEnabled) {
        this.setShowOrHideCover()
        this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0]?.coverPageData;
      } else {
        this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0]
      }
      this.cbpService.tableDataEntrySelected = undefined;
      this.auditService.selectedElementSnapchat = this.cbpService.cbpJson.documentInfo[0];
      let item = this.cbpService.selectedElement;
      if (item) {
        item['dgUniqueID'] = 0;
        this.setProperty();
        this.cbpService.documentSelected = true;
        this.controlService.setSelectItem(item);
      }
      this.cdref.detectChanges();
    }
  }

  clearDocumentSelectFields() {
    this.cbpService.coverPageViewEnable = false;
    this.cbpService.showviewCoverPage = false;
    this.nodeTreeClicked = false;
    this.cbpService.propertyType = 'section';
    this.cbpService.selectedUniqueId = 1;
    this.showCoverPage = false
    this.cbpService.documentSelected = false;
    this.documentSelected = false;
    // this.cbpService.coverPage = false;
  }

  tableTemplateShow() {
    this.cbpService.documentSelected = true;
    this.cbpService.documentSelected = JSON.parse(JSON.stringify(this.cbpService.documentSelected))
    this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0];
    this.tableService.attributesDisable(this.cbpService.cbpJson.documentInfo[0].coverPageData, this.propertyDocument['coverPageData']['listAttributeProperty']);
    this.tableService.isSelectProperty = true;
    this.value = true;
    //this.convert();
    this.cbpService.isViewUpdated = true;
    this.tableService.isBorderRemove = true;
    this.tableService.isPropertyDisable = true;
    this.cbpService.selectedElement['newCoverPage'] = true;
    this.coverForm.withoutLines = true;
    this.cbpService.selectedElement.withoutLines = true;
  }
  templatesObj: any = '';
  value = false;
  convert() {
    this.templatesObj = (this.cbpService.cbpJson.documentInfo[0].templateId);
    this.controlService.setTemplate(this.value, this.templatesObj);
    this.tableService.changed = false;
    this.selectCoverPage();
    this.cbpService.isViewUpdated = true;
  }

  loadNewCoverPage(propertyObj: any) {
    // console.log("checking::template ",propertyObj ,"and also templateObj",templatesJson)
    if (propertyObj?.coverPageData) {
      this.tableService.setCoverItem(false);
      let templateObj = JSON.parse(JSON.stringify(templatesJson));
      let templatesId = this.cbpService.cbpJson.documentInfo[0].templateId;
      if (templatesId == 1) {
        this.setCoverPageItem(propertyObj?.coverPageData);
      }
      else if (templatesId == 2) {
        this.setCoverPageItem(propertyObj?.coverPageData);
      }
      else if (templatesId == 3) {
        this.setCoverPageItem(propertyObj?.coverPageData);
      }
      else {
        this.setCoverPageItem(propertyObj?.coverPageData);
      }
      this.tableTemplateShow();
    } else {
      this.tableService.setCoverItem(true)
      let templateObj = JSON.parse(JSON.stringify(templatesJson));
      let templatesId = this.cbpService.cbpJson.documentInfo[0].templateId;
      if (templatesId == 1) {
        this.setCoverPageItem(templateObj['template-cp']);
      }
      else if (templatesId == 2) {
        this.setCoverPageItem(templateObj['template-cp']);
      }
      else if (templatesId == 3) {
        this.setCoverPageItem(templateObj['template-cp']);
      }
      else {
        this.setCoverPageItem(templateObj['template-cp']);
      }
      this.tableTemplateShow();
    }
    this.tableService.viewMode = true;
    this.tableService.isBorderRemove = true;
    this.tableService.isPropertyDisable = true;
    this.tableService.oldProperty = false;
    this.cbpService.selectedElement.templateId = this.cbpService.cbpJson.documentInfo[0].templateId ?? '1';
  }
  setCoverPageItem(obj: any) {
    this.propertyDocument['coverPageData'] = obj;
    this.propertyDocument['coverPageData']['coverPageTable'] = true;
    this.propertyDocument['isTableAttributes'] = true;
    this.propertyDocument['propertyFieldAdd'] = true;
    this.tableService.attributesDisable(this.propertyDocument['coverPageData'], this.propertyDocument['coverPageData']['listAttributeProperty']);
  }
  selectCoverPage() {
    if (this.cbpService.documentSelected) {
      this.cbpService.selectedElement = this.cbpService.selectedElement?.coverPageData;
      this.tableService.selectedTable = this.cbpService.selectedElement;
      this.controlService.setSelectItem(this.tableService.selectedTable);
      this.tableService.isPropertyDisable = true;
      this.cbpService.isViewUpdated = true;
    }
  }
  setShowOrHideCover() {
    this.cbpService.isDisabledControl = true;
    this.loadNewCoverPage(this.cbpService.cbpJson.documentInfo[0]);
    this.cbpService.cbpJson.documentInfo[0].newCoverPageeEnabled = true;
  }

  // number list
  numberListMethods(type: SequenceTypes) {
    try {
      if (type == this.sequenceTypesNew.NUMERIC) {
        this.numberedList();
      } else {
        this.alphabeticList(type);
      }
      this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    } catch (error) {
      console.log(error)
    }
  }
  // other list

  converToOther(sequencType: any) {
    try {
      this.convertToOtherSequence(this.cbpService.cbpJson.section, sequencType);
      this.controlService.setlayoutItem({ 'indendation': this.layoutService.indendation })
      this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    } catch (error) {
      console.log(error)
    }
  }
  convertToOtherSequence(cbpJson: any, type: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this._buildUtil.otherSteps(this.cbpService.selectedElement, cbpJson, type);
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.SEQUENCE)
    this.numberedDependency();
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.cbpService.popupDocumentSave = false;
  }

  alphabeticList(sequenceType: SequenceTypes) {
    this.backCbpAlphabaticList(sequenceType);
    this.controlService.setlayoutItem({ 'indendation': this.layoutService.indendation })
  }
  backCbpAlphabaticList(sequenceType: SequenceTypes) {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this._buildUtil.alphabeticList(this.cbpService.selectedElement, sequenceType);
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.SEQUENCE)
    this.numberedDependency();
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.cbpService.popupDocumentSave = false;
  }
  numberedList() {
    this.backCbpNumberList(this.cbpService.cbpJson.section);
    this.controlService.setlayoutItem({ 'indendation': this.layoutService.indendation })
  }
  backCbpNumberList(cbpJson: any) {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this._buildUtil.numberedList(this.cbpService.selectedElement, cbpJson);
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.SEQUENCE)
    this.numberedDependency();
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.cbpService.popupDocumentSave = false;
  }
  numberedDependency() {
    if (!this.cbpService.selectedElement.numberedChildren) {
      this.cbpService.selectedElement.usage = Dependency.Information;
      this.cbpService.selectedElement.dependency = Dependency.Independent;
    }
  }
  indentRight() {
    this.indentRightReuseCode(this.cbpService.cbpJson);
  }
  indentRightReuseCode(cbpJson: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.cbpService.loading = true;
    try {
      const indentObj = JSON.parse(JSON.stringify([this.cbpService.selectedElement]));
      const cbpJSON = JSON.parse(JSON.stringify(cbpJson.section));
      let sections = this._buildUtil.indentRight(indentObj, cbpJson.section)
      if (sections) {
        this.auditService.createRightIndentSnapChat(indentObj[0], cbpJSON);
        cbpJson.section = sections;
        this._buildUtil.paginateIndex = 1;
        this._buildUtil.setPaginationIndex(cbpJson.section);
        this.cbpService.setPaginationIndexs(this.cbpService.selectedElement.paginateIndex);
        this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, cbpJson.section);
        this.auditService.createEntry(indentObj[0], this.cbpService.selectedElement, Actions.Update, AuditTypes.INDENT_RIGHT);
        this.cbpService.selectedDgType = this.cbpService.selectedElement.dgType;
        this.cbpService.loading = false;
      } else {
        this.cbpService.loading = false;
        this.showErrorMsg(DgTypes.Warning, 'Can\'t perform action');
      }
    } catch (error: any) {
      this.cbpService.loading = false;
      this.showErrorMsg(DgTypes.Warning, 'error');
    }
  }
  setStateForRightIndent(item: any) {
    let parent
    if (item?.parentID) {
      let parentElement = this._buildUtil.getElementByNumber(item.parentID, this.cbpService.cbpJson.section);
      if (parentElement?.length > 1) {
        parentElement = this._buildUtil.getElementByDgUniqueID(item.parentDgUniqueID, this.cbpService.cbpJson.section);
      }
      if (parentElement?.children) {
        const index = parentElement.children.findIndex((i: any) => i.dgSequenceNumber == item.dgSequenceNumber);
        if (index > 0) {
          parent = parentElement.children[index - 1];
        }
      }
    } else {
      const index = this.cbpService.cbpJson.section.findIndex((i: any) => i.dgSequenceNumber == item.dgSequenceNumber)
      if (index > 0) {
        parent = this.cbpService.cbpJson.section[index - 1];
      }
    }
    if (parent) {
      return !this._buildUtil.validateHeirarchyForRightIndent(parent, this.cbpService.selectedElement, false);
    } else {
      return true;
    }
  }
  setStateForLeftIndent(item: any) {
    if (item?.parentID) {
      let parentElement = this._buildUtil.getElementByNumber(item.parentID, this.cbpService.cbpJson.section);
      if (parentElement?.children) {
        return this._buildUtil.validateHeirarchyForLeftIndent(parentElement, this.cbpService.selectedElement, false);
      }
    } else {
      return true;
    }
  }

  indentLeft() {
    this.backLeftIndentReuseCode(this.cbpService.cbpJson)
  }

  backLeftIndentReuseCode(cbpJson: any) {
    if (!this.validateSearchAlert()) {
      return;
    }
    this.cbpService.loading = true;
    try {
      const indentObj = JSON.parse(JSON.stringify([this.cbpService.selectedElement]));
      const cbpJSON = JSON.parse(JSON.stringify(cbpJson.section));
      let sections = this._buildUtil.indentLeft(indentObj, cbpJson.section);
      if (sections) {
        this.auditService.createLeftIndentSnapChat(indentObj[0], cbpJSON);
        cbpJson.section = sections;
        this._buildUtil.paginateIndex = 1;
        this._buildUtil.setPaginationIndex(cbpJson.section);
        this.cbpService.setPaginationIndexs(this.cbpService.selectedElement.paginateIndex);
        this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, cbpJson.section);
        if (this.cbpService.selectedElement) {
          this.controlService.setSelectItem(this.cbpService.selectedElement);
          this.cbpService.selectedDgType = this.cbpService.selectedElement.dgType;
          this.cbpService.selectedElement.selectedDgType = this.cbpService.selectedElement.dgType;
          this.cbpService.selectedDgType = this.cbpService.selectedElement.dgType;
          this.auditService.createEntry(indentObj[0], this.cbpService.selectedElement, Actions.Update, AuditTypes.INDENT_LEFT);
        }
        this.cbpService.loading = false;
      } else {
        this.cbpService.loading = false;
        this.showErrorMsg(DgTypes.Warning, 'Can\'t perform action');
      }
    } catch (error: any) {
      this.cbpService.loading = false;
      let mesg = error.message ? error?.message : 'Invalid Action: Step with Data Entry cannot be converted to Section.';
      this.showErrorMsg(DgTypes.Warning, mesg);
    }
  }
  //CUT, COPY, PASTE functionalities
  private bindKeypressEvent(): Observable<KeyboardEvent> {
    const eventsType$ = [
      fromEvent(window, 'keypress'),
      fromEvent(window, 'keydown')
    ];
    // we merge all kind of event as one observable.
    return merge(...eventsType$)
      .pipe(
        debounce(() => timer(10)),
        map(state => (state as KeyboardEvent))
      );
  }
  onKeyPress($event: KeyboardEvent) {
    if (this.router.url.includes('builder')) {
      if ($event.ctrlKey && $event.keyCode == 70) {
        // Block CTRL + F event
        $event.preventDefault();
        this.cbpService.isSearchTemplate = true;
      }
    }
  }
  closeSearch() {
    this.cbpService.isSearchTemplate = false;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    // this.controlService.detectAllView(true);
  }
  findMethod() {
    this.cbpService.isSearchTemplate = true;
  }
  //PAGINATION
  onScroll(event: any) {
    const autoScrollConfig = this.cbpService.layOutJson?.layout?.find((i: any) => i.name == 'enableAutoScroll');
    if (!autoScrollConfig?.enableAutoScroll) {
      return;
    }
    if (event?.originalEvent?.target?.id == 'scrollableElement') {
      this.scrollStarted = true;
      if (!this.currentEvent) { this.currentEvent = event; }
      //  console.log((this._buildUtil.paginateIndex - this.cbpService.startIndex ) < this.cbpService.pageSize);
      if (this.currentEvent?.isReachingBottom !== event.isReachingTop && !this.treeUpdated) {
        this.currentEvent = event;
        this.scrollEvent.push(event);
        if (event.isReachingBottom && !this.treeUpdated) {
          // console.log(event);
          this.treeUpdated = true;
          this.movetoNext();
          setTimeout(() => {
            this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
          }, 500);
          this.scrollEvent = [];
        } else if (this.scrollEvent.length >= 1 && !this.treeUpdated && !event.isReachingBottom) {
          // console.log(event);
          // let isReachingTop = this.scrollEvent.filter((item:any)=>item.isReachingTop);
          // if ( this.cbpService.startIndex > 10 &&(isReachingTop?.length>0 || event.isReachingTop)) {
          //   this.treeUpdated = true;
          //   this.movetoPrev();
          //   setTimeout(() => {
          //     this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
          //   }, 100);
          //   if(this.cbpService.startIndex < this.cbpService.pageSize){
          //     this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
          //   }
          //   this.scrollEvent = [];
          // }
        }
      } else if (!this.treeUpdated && ((this._buildUtil.paginateIndex - this.cbpService.startIndex) < this.cbpService.pageSize)) {
        if ((this.cbpService.startIndex > 10)) {
          this.treeUpdated = true;
          this.currentEvent = event;
          this.currentEvent['isReachingBottom'] = true;
          // this.movetoPrev();
          // setTimeout(() => {
          //   this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
          // }, 1000);
          // if(this.cbpService.startIndex < this.cbpService.pageSize){
          //   this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
          // }
          // this.scrollEvent = [];
        }
      } else if (event.isReachingBottom && !this.treeUpdated && !this.cbpService.isSearchTemplate) {
        // console.log(event);
        this.currentEvent = event;
        this.treeUpdated = true;
        this.movetoNext();
        setTimeout(() => {
          this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
        }, 1000);
      }
    }

  }
  movetoPrev() {
    if ((this.cbpService.startIndex) >= this.cbpService.pageSize) {
      this.movePreReuse();
    } else {
      this.cbpService.startIndex = 1;
      this.movePreReuse();
    }
  }
  movePreReuse() {
    if (this.cbpService.startIndex !== 1) { this.cbpService.loading = true; }
    this.cbpService.showEditor = false;
    (this.cbpService.startIndex - this.cbpService.pageSize < 1) ? this.cbpService.startIndex = 1 : this.cbpService.startIndex = this.cbpService.startIndex - this.cbpService.pageSize;
    let indeValue: number = this.cbpService.startIndex === 1 ? this.cbpService.startIndex : this.cbpService.startIndex;
    this.cbpService.selectedElement = this._buildUtil.getElementBypaginationIndex(indeValue, this.cbpService.cbpJson.section);
    if (this.cbpService.selectedElement === undefined) {
      if (!this.cbpService.selectedElement && !this.cbpService.cbpJson.section[0]) {
        this.cbpService.cbpJson.section = [this._buildUtil.build(new Section(), '1.0', this._buildUtil.uniqueIdIndex = 1, '1.0')];
      }
      this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    }
    if (this.cbpService.selectedElement.dgType == DgTypes.DualAction) {
      this.cbpService.selectedElement = this.cbpService.selectedElement?.children[0];
    }
    setTimeout(() => {
      this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
    }, 1000);
    this.setScrollInfo();
  }
  movetoNext() {
    if ((this._buildUtil.paginateIndex - this.cbpService.startIndex) > this.cbpService.pageSize) {
      this.cbpService.loading = true;
      this.cbpService.showEditor = false;
      this.cbpService.startIndex = this.cbpService.startIndex + this.cbpService.pageSize;
      // console.log( this.cbpService.selectedElement);
      this.cbpService.selectedElement = this._buildUtil.getElementBypaginationIndex(this.cbpService.startIndex, this.cbpService.cbpJson.section);
      if (this.cbpService.selectedElement === undefined) {
        let element = this._buildUtil.getElementBypaginationIndex(this.cbpService.startIndex, this.cbpService.cbpJson.section);
        this.cbpService.selectedElement = element?.length == 3 ? element[1] : (element?.length == 2 ? element[0] : element);
      }
      if (this.cbpService.selectedElement.dgType == DgTypes.DualAction) {
        this.cbpService.selectedElement = this.cbpService.selectedElement?.children[0];
      }
      this.setScrollInfo();
      setTimeout(() => {
        this.gotoCurrentDiv(this.cbpService.selectedElement.dgUniqueID);
      }, 500);
    }
    this.cdref.detectChanges();
  }

  setScrollInfo() {
    this.cbpService.selectedUniqueId = this.cbpService.selectedElement?.dgUniqueID;
    this.controlService.setSelectItem(this.cbpService.selectedElement)
    this.isReachingTop = false;
    this.scrollCountForUp = 0;
    this.cbpService.showEditor = true;
    this.isFreshPage = true;
    this.cbpService.loading = false;
  }
  moveToNextButton() {
    try {
      this.treeUpdated = true;
      this.movetoNext();
      this.goto(this.cbpService.selectedElement.dgUniqueID);
      this.callSetTime(1500);
    } catch (error) {
      console.log(error)
      this.cbpService.loading = false;
      this.cbpService.showEditor = true;
    }
  }

  moveToPreviousButton() {
    try {
      this.treeUpdated = true;
      this.bottomDisable = false;
      this.movetoPrev();
      //this.goto(this.cbpService.selectedElement.dgUniqueID);
      this.callSetTime(1500);
    } catch (error) {
      console.log(error)
      this.cbpService.loading = false;
      this.cbpService.showEditor = true;
    }
  }

  goToTop() {
    try {
      if ((this.cbpService.startIndex) >= this.cbpService.pageSize) {
        this.reuseUpBottomCode(1, 'top');
        const element = document.getElementById("tree");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: 'start', inline: "nearest" });
        }
        this.bottomDisable = false;
        this.cdref.detectChanges();
      }
    } catch (error) {
      console.log(error)
      this.cbpService.loading = false;
      this.cbpService.showEditor = true;
    }
  }
  bottomDisable = false;
  goToBottom() {
    try {
      if ((this._buildUtil.paginateIndex - this.cbpService.startIndex) > this.cbpService.pageSize) {
        this.reuseUpBottomCode(this._buildUtil.paginateIndex - this.cbpService.pageSize, 'bottom');
        const element = document.getElementById("tree");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: 'start', inline: "nearest" });
        }
        this.bottomDisable = true;
        this.cdref.detectChanges();
      }
    } catch (error) {
      console.log(error)
      this.cbpService.loading = false;
      this.cbpService.showEditor = true;
    }
  }
  reuseUpBottomCode(startIndex: any, type: string) {
    this.treeUpdated = true;
    this.cbpService.loading = true;
    this.cbpService.showEditor = false;
    this.cbpService.startIndex = startIndex;
    try {
      this.cbpService.selectedElement = this._buildUtil.getElementBypaginationIndex(this.cbpService.startIndex, this.cbpService.cbpJson.section);
      if (!this.cbpService.selectedElement) {
        let index = type === 'bottom' ? this.cbpService?.cbpJson?.section?.length - 1 : 0;
        this.cbpService.selectedElement = this.cbpService.cbpJson.section[index];
      }
      this.cbpService.selectedUniqueId = this.cbpService.selectedElement.dgUniqueID;
      this.controlService.setSelectItem(this.cbpService.selectedElement)
    } catch (error) { }
    this.isReachingTop = false;
    this.scrollCountForUp = 0;
    this.goto(this.cbpService.selectedElement.dgUniqueID);
    this.callSetTime(1000);
  }

  callSetTime(time: any) {
    setTimeout(() => { this.setValues(); }, time);
  }
  setValues() {
    this.cbpService.showEditor = true;
    this.isFreshPage = true;
    this.cbpService.loading = false;
    this.treeUpdated = false;
  }

  changeHeader() {
    this.setHeaderFooter(true, false);
    this.setHeaderFooterValues(-1, false, this.cbpService.cbpJson.documentInfo[0]['header'])
    this.propertyComponent.headerValue = this.cbpService.cbpJson.documentInfo[0]['header'].title;
    this.clearNodes();
  }
  changeFooter() {
    this.setHeaderFooter(false, true);
    this.setHeaderFooterValues(-2, false, this.cbpService.cbpJson.documentInfo[0]['footer']);
    this.propertyComponent.footerValue = this.cbpService.cbpJson.documentInfo[0]['footer'].title;
    this.clearNodes();
  }
  setHeaderFooter(header: boolean, footer: boolean) {
    this.cbpService.headerSelected = header;
    this.cbpService.footerSelected = footer;
  }
  setHeaderFooterValues(uniqueId: any, docId: any, obj: any) {
    obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
    this.cbpService.selectedUniqueId = uniqueId;
    this.documentSelected = docId;
    this.cbpService.selectedElement = obj;
    this.controlService.setSelectItem(obj);
    this.cdref.detectChanges();
  }

  changeHeaders(type: any) {
    if (type === DgTypes.Header) {
      this.addHeaderElement();
    }
    if (type === DgTypes.Footer) {
      this.addFooterElement();
    }
    if (type === DgTypes.WaterMark) {
      this.addWaterMarkElement();
    }
    this.clearNodes();
    this.cdref.detectChanges();
  }
  clearNodes() {
    if (this.treeView) {
      this.treeView.deselectNodes();
    }
  }
  addHeaderElement() {
    this.cbpService.cbpJson.documentInfo[0]['header']['isHeaderEnabled'] =
      !this.cbpService.cbpJson.documentInfo[0]['header']['isHeaderEnabled'];
    if (this.cbpService.cbpJson.documentInfo[0]['header']['isHeaderEnabled']) {
      this.changeHeader();
    }
    if (!this.cbpService.cbpJson.documentInfo[0]['header']['isHeaderEnabled']) {
      this.setFirstSection()
    }
    this.cbpService.popupDocumentSave = false;
  }
  addFooterElement() {
    this.cbpService.cbpJson.documentInfo[0]['footer']['isFooterEnabled'] =
      !this.cbpService.cbpJson.documentInfo[0]['footer']['isFooterEnabled'];
    if (this.cbpService.cbpJson.documentInfo[0]['footer']['isFooterEnabled']) {
      this.changeFooter();
    }
    if (!this.cbpService.cbpJson.documentInfo[0]['footer']['isFooterEnabled']) {
      this.setFirstSection()
    }
    this.cbpService.popupDocumentSave = false;
  }
  setFirstSection() {
    this.cbpService.selectedElement = this.cbpService.cbpJson.section[0];
    this.controlService.setSelectItem(this.cbpService.selectedElement);
  }
  addWaterMarkElement() {
    this.addDeleteMark();
    if (!this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled']) {
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = new waterMarkOptions();
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'] = false;
      this.cbpService.waterMarkValue = '';
      this.cbpService['selectedElement'] = this.cbpService.cbpJson.section[0];
    } else {
      this.changeWaterMark();
    }
    this.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    this.cbpService.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    this.cbpService.popupDocumentSave = false;
  }
  addDeleteMark() {
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'] =
      !this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'];
  }
  changeWaterMark() {
    this.cbpService.selectedUniqueId = -3;
    this.documentSelected = false;
    this.cbpService.documentSelected = false;
    if (this.cbpService.waterMarkValue !== '' && this.cbpService.waterMarkValue !== undefined) {
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text = this.cbpService.waterMarkValue;
    }
    // this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text = this.cbpService.waterMarkValue;
    this.cbpService['selectedElement'] = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'];
    this.cbpService.waterMarkValue = this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text;
    this.clearNodes();
    this.controlService.setSelectItem(this.cbpService['selectedElement'])
    this.cdref.detectChanges();
  }
  setWaterMarkChange(eventObj: any) {
    if (eventObj == false) {
      if (!this._buildUtil.cbpStandalone) {
        this.controlService.hideTrackUi({ 'trackUiChange': true });
        this.cbpService.styleChangeBarSession = [];
      }
    } else {
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.color = eventObj.color;
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.fontSize = this.stylesService.getFontStyles(eventObj.fontSize);
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.fontFamily = eventObj.fontName;
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.backgroundRepeat = eventObj.backgroundRepeat;
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.degree = eventObj.degree;
      this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.alpha = eventObj.alpha;
      // this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['color'] = this.styleObject.color;
    }
    this.cdref.detectChanges();
  }

  //To set/unset node with icon
  setOrUnSetNodeIcon(event: any) {
    this.renameNode = Object.create(event);
  }
  setEdocumentUrl() {
    this.cbpService.clearBuilderJsonItems();
    this.clearBuilderItems();
    this.closeBuilder.emit();
  }

  checkCount(item: any) {
    if (!item) { return true; }
    if (this.cbpService.cbpJson.section?.length !== 0 && (item.number === '1.0' || item.number === 1.0)) {
      return true;
    } else {
      return false;
    }
  }

  //UNDO FUNCTIONALITIES
  UndoElement() {
    this.auditService.undoElement();
    this.treeUpdateOption();
  }
  async deleteElement() {
    let element;
    let parent;
    element = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    if (this.cbpService.selectedElement.dgType == DgTypes.NumericDataEntry) {
      let id = this.cbpService.numericUnit.findIndex(l => l === this.cbpService.selectedElement.dgUniqueID)
      if (id != -1)
        this.cbpService.numericUnit.splice(id, 1);
    }
    if (element.dualStep) {
      let dualstep = JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(element.parentID, this.cbpService.cbpJson.section)));
      if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
        this.cbpService.media = [...this.auditService.cutElementRestore, ...this.cbpService.media];
        this.auditService.cutElementRestore = [];
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, element, Actions.Delete, AuditTypes.DUALSTEP);
        this.auditService.elementsRestoreSnapChats.push(dualstep);
      }
    } else {
      if (element.parentID) {
        parent = JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(element.parentID, this.cbpService.cbpJson.section)))
      } else {
        parent = JSON.parse(JSON.stringify(this.cbpService.cbpJson.section));
      }
      this.cbpService.media.forEach((image: { name: string | any[]; }, mindex: any) => {
        this.auditService.cutElementRestore.push(image);
      })

      if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
        // this.cbpService.media = [...this.auditService.cutElementRestore,...this.cbpService.media];
        this.auditService.cutElementRestore = [];
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, element, Actions.Delete);
        this.auditService.elementsRestoreSnapChats.push(parent);
      }
    }
    this.checkCount(this.cbpService.selectedElement);
    this.controlService.setSelectItem(this.cbpService.selectedElement);
  }

  validateSearchAlert() {
    if (this.cbpService.isSearchTemplate) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please close the search and try again ');
      return false;
    }
    return true;
  }
  async userConformationEvents(Type: any, data: any = { source: '' }) {
    if (data?.source == 'ework') {
      if (this.auditService.auditJson.length > 1) {
        let evt: Request_Msg = { eventType: EventType.editorInitialized, msg: true };
        this.dataJsonChange.emit(evt);
        // this.datasharing.sendMessageFromLibToOutside(evt);
        // data={source:''}
      } else {
        let evt: Request_Msg = { eventType: EventType.editorInitialized, msg: false };
        this.datasharing.sendMessageFromLibToOutside(evt);
        data = { source: '' }
      }
    } else {
      if ((this.cbpService.cbpJson.section?.length > 1 || this.cbpService.cbpJson.section[0].children.length > 0 ||
        this.cbpService.cbpJson.section[0].title !== '') && !this.cbpService.popupDocumentSave) {
        // if(data?.source == 'ework'){
        //   let evt: Request_Msg = { eventType: EventType.editorInitialized, msg: true };
        //   this.datasharing.sendMessageFromLibToOutside(evt);
        // }else{
        const { value: userConfirms, dismiss } =
          await this.cbpService.showMoreButtonsSwal(AlertMessages.closeDocument, 'warning', 'Yes', 'No', 'Cancel',);
        if (!this.cbpService.popupDocumentSave) {
          if (!dismiss && userConfirms) {
            // let evt: Request_Msg = { eventType: EventType.editorsave, msg: {type:Type} };
            // this.datasharing.sendMessageFromLibToOutside(evt);
            this.saveFile();
          } else if (dismiss === undefined && !userConfirms) {
            this.closeEventsBuilder(Type, 'confirm');
            //  let evt: Request_Msg = { eventType: EventType.editorclosed, msg: {type:Type} };
            //  this.datasharing.sendMessageFromLibToOutside(evt);
          }
        } else {
          this.closeEventsBuilder(Type, 'notConfirm');
          //  let evt: Request_Msg = { eventType: EventType.editorcancel, msg: {type:Type} };
          //  this.datasharing.sendMessageFromLibToOutside(evt);
        }
        //  }
      } else {
        if (data?.source == 'ework') {
          let evt: Request_Msg = { eventType: EventType.editorclosed, msg: false };
          this.datasharing.sendMessageFromLibToOutside(evt);
        } else {
          Type == 'User' ? this.newTemplate() : (Type == 'Open' ? this.openFile() : this.setEdocumentUrl());
          // }
        }
        if (Type == 'User') { this._buildUtil.attachmentId = false; }
      }
    }
  }

  closeEventsBuilder(Type: string, condition: string) {
    this.cbpService.popupDocumentSave = false;
    if (Type == 'User') { condition === 'confirm' ? this.newDoc() : this.newTemplate(); }
    if (Type == 'Open') { this.openFile(); }
    if (Type == 'Close') {
      this.setEdocumentUrl();
      this.clearStyles();
    }
  }

  clearStyles() {
    this.cbpService.styleJson = JSON.parse(JSON.stringify(stylesJson));
    this.cbpService.styleModel = new styleModel();
    this.cbpService.styleImageJson = JSON.parse(JSON.stringify(defaultImageJson));
  }

  setItem(item: any) {
    item = this.cbpService.setUserUpdateInfo(item);
    this.cbpService.selectedElement = item;
    this.cbpService.selectedUniqueId = item.dgUniqueID;
  }

  getPdf(event: any) {
    // console.log(event);
  }
  gotoExecution() {
    this.cbpService.loading = false;
    this.showExecuter('execution', '');
  }
  setDefaultZipFiles() {
    let arr = this._buildUtil.getElementByDgType(DgTypes.StepInfo, this.cbpService.cbpJson);
    if (Array.isArray(arr)) {
      arr.forEach((i: any) => delete i['text'])
    } else if (arr) {
      delete arr['text']
    }
    console.log(arr)
    const builderObjects = {
      attachment: this.cbpService.attachment,
      cbpJson: this.cbpService.cbpJson,
      auditJson: this.auditService.auditJson,
      dataJson: this.cbpService.dataJson,
      protectJson: this.cbpService.protectJson,
      executionOrderJson: this.cbpService.executionOrderJson,
      dynamicSectionInfo: this.cbpService.dynamicSectionInfo,
      layOutJson: this.cbpService.layOutJson,
      media: this.cbpService.media,
      styleImageJson: this.cbpService.styleImageJson,
      styleJson: this.cbpService.styleJson,
      signatureJson: this.cbpService.signatureJson,
      styleModel: this.cbpService.styleModel,
      annotateJson: this.cbpService.annotateJson,
      backgroundJson: this.cbpService.backgroundJson,
      undoJson: this.auditService.undoJson,
      elementsRestoreSnapChats: this.auditService.elementsRestoreSnapChats
    };
    return builderObjects;
  }

  showExecuter(typeExecution: string, dynamic: string) {
    let files = this.setDefaultZipFiles();
    let edocFiles = { 'locId': this.cbpService.locationid, 'pckgId': this.cbpService.packagefileid, 'isntId': this.cbpService.instanceid };
    this.showExecuterPage.emit(
      {
        type: typeExecution,
        builderObjects: files,
        package: edocFiles,
        dynamicSection: dynamic
      });
  }
  setCbpZipDownload(cbpJsonModal: any, isBackGroundDocument: any, styleJson: any, media: any, attachment: any, dataJson: any, fileName: any, audits: any[] = [], isDownload: any, data: any) {
    this.cbpService.loading = true;
    data['fileName'] = this.autoSaveFileName;
    if (!styleJson || styleJson['length'] === 0) { styleJson = stylesJson; this.cbpService.styleJson = stylesJson; }
    const styleimageJson = this.cbpService.styleImageJson;
    const layoutJson = this.cbpService.layOutJson;
    cbpJsonModal.documentInfo[0]['fileName'] = fileName;
    if (this._buildUtil.uniqueIdIndex > Number(cbpJsonModal.documentInfo[0]['maxDgUniqueID'])) {
      cbpJsonModal.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
      cbpJsonModal.documentInfo[0]['maxDgUniqueID'] = cbpJsonModal.documentInfo[0]['maxDgUniqueID'].toString();
    }

    const zip = new JSZip();
    if (this.cbpService.primaryDocument) {
      this.cbpService.backgroundJson = this.updateHelpJsonFile();
      this.cbpService.backgroundJson['documentInfo'][0]['isPrimaryDoc'] = true;
    }
    zip.file('cbp.json', JSON.stringify(cbpJsonModal));
    zip.file('style/style.json', JSON.stringify(styleJson));
    zip.file('style/style-image.json', JSON.stringify(styleimageJson));
    zip.file('style/layout.json', JSON.stringify(layoutJson));
    zip.file('audit/audit_' + Math.floor(Date.now() / 1000) + '.json', JSON.stringify(this.auditService.getAuditJSON()))
    if (media && media.length > 0) {
      for (let i = 0; i < media.length; i++) {
        const blob = media[i];
        if (media[i].name.includes('media/')) {
          zip.file(media[i].name, blob);
        } else { zip.file('media/' + media[i].name, blob); }
      }
    } else { zip.folder('media'); }
    if (audits && audits.length > 0) {
      for (let i = 0; i < audits.length; i++) {
        const blob = audits[i];
        if (audits[i].name && audits[i].name.includes('audit/')) {
          zip.file(audits[i].name, blob);
        } else { zip.file('audits/' + audits[i].name, blob); }
      }
    }
    if (attachment && attachment.length > 0) {
      for (let i = 0; i < attachment.length; i++) {
        const blob = attachment[i];
        if (attachment[i].name && attachment[i].name.includes('attachment/')) {
          zip.file(attachment[i].name, blob);
        } else { zip.file('attachment/' + attachment[i].name, blob); }
      }
    } else { zip.folder('attachment'); }
    if (this.cbpService.signatureJson === undefined) {
      this.cbpService.signatureJson = [];
    }
    const signatureJson = this.cbpService.signatureJson;
    if (signatureJson !== undefined) { zip.file('data/signature.json', signatureJson); }
    if (this.cbpService.annotateJson === undefined) {
      this.cbpService.annotateJson = {
        annotateObjects: []
      };
    }
    const annotationJson = this.cbpService.annotateJson;
    if (annotationJson !== undefined) { zip.file('data/annotation.json', JSON.stringify(annotationJson)); }
    if (dataJson === undefined) { dataJson = { dataObjects: [], lastSessionUniqueId: 0 } }
    zip.file('data/data.json', JSON.stringify(dataJson));
    if (this.cbpService.executionOrderJson === undefined) {
      this.cbpService.executionOrderJson = {
        orderObjects: []
      };
    }
    const orderJson = this.cbpService.executionOrderJson;
    if (orderJson !== undefined) { zip.file('data/execution-order.json', JSON.stringify(orderJson)); }
    // when everything has been downloaded, we can trigger the dl
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      this.cbpService.loading = false;
      if (isDownload === 'download') {
        const a = document.createElement('a');
        a.setAttribute('href', (window.URL.createObjectURL(blob)));
        if (!fileName) { fileName = 'downlaodable'; }
        a.setAttribute('download', fileName + '.cbp');
        a.click();
        if (this.cbpService.selectedType === 'Close') {
          this.newDoc();
        }
      } else if (this.cbpService.primaryDocument) {
        this.getCbpFile.emit({
          cbpFile: blob,
          updatedTime: new Date(),
          event: data,
          backgroundObj: {
            cbpJson: this.cbpService.backgroundJson,
            styleJson: styleJson,
            styleImageJson: this.cbpService.styleImageJson,
            layoutJson: layoutJson
          }
        });
      } else {
        this.getCbpFile.emit({ cbpFile: blob, updatedTime: new Date(), event: data });
        this.cbpService.loading = false;
      }
    }, (err) => {
      console.log('err: ' + err);
    });
  }

  saveCBPDownloadFile(fileName: string, isBackGroundDocument: boolean) {
    const attachments = this.cbpService.attachment.filter((item: any) => item.size > 0);
    this.setMaxDgUniqueIDForSave();
    const sections = this._buildUtil.formatForSave(this.cbpService.cbpJson.section, 'build', this.cbpService.maxDgUniqueId);
    this.converCoverPageDgUniqueId();
    this._buildUtil.disableDuplicateCall = true;
    this.cbpService.formObect = {
      section: sections, documentInfo: this.cbpService.cbpJson.documentInfo
    };
    this.setCbpZipDownload(this.cbpService.formObect, isBackGroundDocument, this.cbpService.styleJson,
      this.cbpService.media, attachments, this.cbpService.dataJson, fileName, this.cbpService.cbpZip.audits, 'download', {});
    if (this.cbpService.selectedType == 'New') {
      this.newDoc();
      this.cbpService.istemplateOpen = true
    }
    if (this.cbpService.selectedType == 'Open') {
      this.openFile();
    }
    if (this.cbpService.selectedType == 'docClose' || this.cbpService.selectedType == 'Exit') {
      this.exitCbp();
    }
  }
  setMaxDgUniqueIDForSave() {
    if (!this.cbpService.cbpJson?.documentInfo[0]['maxDgUniqueID']) {
      this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    } else if (this._buildUtil.uniqueIdIndex > Number(this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'])) {
      this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    } else {
      this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'] = this._buildUtil.uniqueIdIndex;
    }
    this._buildUtil.maxDgUniqueId = this.cbpService.cbpJson.documentInfo[0]['maxDgUniqueID'];
    this.setMaxDgUniqueIdToString();
  }
  exitCbp() {
    this.layoutService.setLayoutDefault();
    this.cbpService.resetData();
    this.stylesService.styleModel = new styleModel();
    this.setEdocumentUrl();
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }
  closeModal() {
    this.setErrorMesg('', '', false);
    this.updateProperty();
    this.cbpSharedService.closeModalPopup('error-modal');
  }
  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  exportDOc(type: string) {
    this.exportDoc.emit(type);
  }

  addSequenceInfo(element: any) {
    if (!element['childSequenceType']) {
      if (element.dataType === 'Attachment' || element.aType === 'Attachment') {
        element['childSequenceType'] = SequenceTypes.Attachment;
      }
    }
    return element;
  }
  closeRoleQual(event: any) {
    if (this.cbpService.propertyType === 'document') {
      //this.cbpService.cbpJson.documentInfo[0] = event.item;
      // this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0];
      this.documentShow();
      this.updateProperty();
    }
    this.cbpService.isRoleQualOpen = false;
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
  updateRules(element: any, type: string) {
    //  this.cbpService.selectedElement = element; // commented due to jira 1682
    if (type !== 'alaram') {
      let text = this.cbpService.selectedElement?.action !== undefined ? this.cbpService.selectedElement.action : this.cbpService.selectedElement.title;
      // this.cbpService.selectedElement = this._buildUtil.setIconAndText(this.cbpService.selectedElement);
      // commented due to jira 1682
      this.cbpService.headerItem = {
        text: text,
        number: this.cbpService.selectedElement?.number,
        dgUniqueId: this.cbpService.selectedElement?.dgUniqueID,
        dgType: this.cbpService.selectedElement?.dgType
      }
      this.setOrUnSetNodeIcon(this.cbpService.selectedElement);
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    }
  }
  closeRules(ev: any, type: string) {
    if (type !== 'alaram') {
      // commented due to jira 1682
      // this.cbpService.selectedElement = this._buildUtil.setIconAndText(this.cbpService.selectedElement);
      let text = this.cbpService.selectedElement?.action !== undefined ? this.cbpService.selectedElement.action : this.cbpService.selectedElement.title;
      this.cbpService.headerItem = {
        text: text,
        number: this.cbpService.selectedElement?.number,
        dgUniqueId: this.cbpService.selectedElement?.dgUniqueID,
        dgType: this.cbpService.selectedElement?.dgType
      }
      this.setOrUnSetNodeIcon(this.cbpService.selectedElement);
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    }
  }
  //CoverPage Styles

  fontSizeFamily(event: any) {
    if (this.cbpService.tableDataEntrySelected.dgType == DgTypes.LabelDataEntry ||
      this.cbpService.tableDataEntrySelected?.showLabel) {
      this.setFontFamily({ 'font': this.defaultFontFamily, type: 'fontfamily' });
    } else {
      this.cbpService.tableDataEntrySelected = this.createStyles(this.cbpService.tableDataEntrySelected);
      this.cbpService.tableDataEntrySelected['styleSet']['fontName'] = this.defaultFontFamily;
    }
    this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
    this.viewUpdatepage();
  }
  fontSizeChange(size: any) {
    if (this.cbpService.tableDataEntrySelected.dgType == DgTypes.LabelDataEntry
      || this.cbpService.tableDataEntrySelected?.showLabel
    ) {
      this.setFontFamily({ 'size': this.defaultFontSize, type: 'fontsize' });
    } else {
      this.cbpService.tableDataEntrySelected = this.createStyles(this.cbpService.tableDataEntrySelected);
      this.cbpService.tableDataEntrySelected['styleSet']['fontSize'] = this.stylesService.getFontStyles(this.defaultFontSize);
    }
    this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
    this.viewUpdatepage();
  }
  insertColor(color: string, type: string, event: any) {
    if (this.cbpService.tableDataEntrySelected.dgType == DgTypes.LabelDataEntry ||
      this.cbpService.tableDataEntrySelected?.showLabel
    ) {
      this.setFontFamily({ 'color': color, type: 'fontcolor' });
    } else {
      this.cbpService.tableDataEntrySelected = this.createStyles(this.cbpService.tableDataEntrySelected);
      this.cbpService.tableDataEntrySelected['styleSet']['color'] = color;
    }
    this.selectedColor = color;
    this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
    this.viewUpdatepage();
  }
  setFontFamily(typeInfo: any) {
    if (this.cbpService.selectedElement) {
      if (this.tableService.selectedRow?.length > 1) {
        this.tableService.setstylesForTableEntries(this.cbpService.selectedElement, typeInfo);
      }
    }
    if (this.cbpService.tableDataEntrySelected) {
      this.cbpService.tableDataEntrySelected['styleSet'] =
        { ...(this.cbpService.tableDataEntrySelected['styleSet'] ?? {}), ...this.tableService.getStyleObject(typeInfo) };
      this.cbpService.tableDataEntrySelected['isHtmlText'] = true;
      this.cbpService.tableDataEntrySelected['editorOpened'] = true;
      this.cbpService.tableDataEntrySelected = this.setStyleForElement(this.cbpService.tableDataEntrySelected, typeInfo);
    }
  }
  setStyleForElement(element: any, typeInfo: any) {
    element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.tableService.getStyleObject(typeInfo) };
    element['isHtmlText'] = true;
    if (typeInfo.type === 'fontcolor') {
      element['color'] = typeInfo?.color;
    }
    if (typeInfo.type === 'fontsize') {
      element['defaultFontSize'] = element['styleSet']['fontsize'];
    }
    if (typeInfo.type === 'fontfamily') {
      element['defaultFontName'] = element['styleSet']['fontfamily'];
    }
    if (this.cbpService.tableDataEntrySelected?.prompt) {
      this.cbpService.tableDataEntrySelected.prompt = this.tableService.replaceAlignStyle(this.cbpService.tableDataEntrySelected.prompt, typeInfo);
    }
    if (this.cbpService.tableDataEntrySelected?.showLablePrompt) {
      this.cbpService.tableDataEntrySelected.showLablePrompt = this.tableService.replaceAlignStyle(this.cbpService.tableDataEntrySelected.showLablePrompt, typeInfo);
    }
    return element;
  }

  setField(field: any) {
    field = this.createStyles(field);
    if (field['styleSet']) {
      this.defaultFontFamily = field['styleSet']['fontName'] ?? 'Poppins';
      this.defaultFontSize = field['styleSet']['fontSize'] ?? 2;
      if (this.defaultFontSize.toString().includes('px'))
        this.defaultFontSize = this.stylesService.getSizeStyles(this.defaultFontSize);
      this.selectedColor = field['styleSet']['color'] ?? '#000000';
    }
  }
  createStyles(obj: any) {
    if (!obj['styleSet']) { obj['styleSet'] = {}; }
    return obj;
  }
  //Find && Replace
  replaceAll(searchObj: any) {
    if (searchObj.searchResult && searchObj.searchResult.length > 0) {
      for (let index = 0; index < searchObj.searchResult.length; index++) {
        const result = searchObj.searchResult[index];
        let element = this._buildUtil.getElementByDgUniqueID(result.dgUniqueID, this.cbpService.cbpJson);
        if (Array.isArray(element)) {
          element = element?.filter((obj: any) => obj?.dgType && obj.dgType === result?.dgType);
          element = element[0];
        }
        if (Array.isArray(element)) {
          continue;
        }
        if (element) {
          let propText = this._buildUtil.getSearchText(element, null);
          if (!propText) {
            continue;
          }
          for (let i = 0; i < propText.length; i++) {
            let text = propText[i];
            text = this.replaceText(text, searchObj.searchString);
            let propName = null;
            if (element.dgType === DgTypes.Warning || element.dgType === DgTypes.Caution) {
              propName = i == 0 ? 'cause' : 'effect';
              this._buildUtil.updateReplace(element, text, propName);
            } else if (element.dgType === DgTypes.Note || element.dgType === DgTypes.Alara) {
              this._buildUtil.updateReplace(element, text, propName, i);
            } else {
              this._buildUtil.updateReplace(element, text, null);
            }

          }
        }
      }
      this.cbpService.refreshSearch.next(true);
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
      this.cbpService.setSearchObj({
        totalOccurance: 0,
        currentElement: 0,
        currentIndex: 0,
        currentActivePosition: 0,
        searchResult: []
      })
    }
  }
  replaceText(text: any, searchString: any) {
    const isHTMLText = this._buildUtil.isHTMLText(text);
    let tags = this._buildUtil.getSearchTags(text, searchString, isHTMLText);
    if (tags.length > 0) {
      let arr = [];
      let count = 0;
      tags.forEach(tag => {
        if (isHTMLText) {
          for (let index = tag.indices.start; index <= tag.indices.end; index++) {
            if (count == 0) {
              text = text.substring(0, index) + '$' + text.substring(index + 1);
              count++;
            } else {
              text = text.substring(0, index) + '^' + text.substring(index + 1);
              count++
            }
            if (count == searchString.length) {
              count = 0;
            }
          }
        } else {
          for (let index = tag.indices.start; index < tag.indices.end; index++) {
            if (count == 0) {
              text = text.substring(0, index) + '$' + text.substring(index + 1);
              count++;
            } else {
              text = text.substring(0, index) + '^' + text.substring(index + 1);
              count++
            }
            if (count == searchString.length) {
              count = 0;
            }
          }
        }
      });
    }
    return text?.replace(/\$/g, this.cbpService.replaceString).replace(/\^/g, '');
  }

  checkDynamicSection() {
    if (this.cbpService.cbpJson.documentInfo[0]['dynamicDocument']) {
      let sections = [...this.cbpService.cbpJson.section];
      for (let i = 0; i < this.cbpService.dynamicSectionInfo.length; i++) {
        let dynamicObj = this.cbpService.dynamicSectionInfo[i];
        let object = sections.filter((item: any) => item.number === dynamicObj.number);
        let index: any;
        if (object?.length === 0) {
          index = this.getIndex(dynamicObj, index, -1, sections);
          if (dynamicObj.number !== '1.0' && index === -1) {
            if (index === -1) {
              index = this.getIndex(dynamicObj, index, +1, sections);
              index = index - 1;
            }
          }
          if (dynamicObj)
            sections.splice(index + 1, 0, dynamicObj?.obj);
        }
      }
      if (sections?.length > this.cbpService.cbpJson?.section?.length) {
        this.cbpService.cbpJson.section = sections;
      }
    }
  }
  getIndex(dynamicObj: any, index: any, value: any, sections: any) {
    let number: any = Number(dynamicObj.number) + (value);
    number = number + '.0';
    index = sections.findLastIndex((item: any) => item.number == number);
    return index;
  }
  enableSticky() {
    if (!this.cbpService.selectedElement?.stickyNote) {
      this.cbpService.selectedElement['stickyNote'] = new StickyNote();
    }
    this.cbpService.selectedElement.stickyNote.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID;
    this.cbpService.selectedElement.stickyNote.isAdded = true;
    this.cbpService.selectedElement.stickyNote.show = true;
    this.cbpService.selectedElement.stickyNote.messageArray[0].messageAdded = false;
    this.cbpService.selectedElement.stickyNote.messageArray[0].userName = this.cbpService.loggedInUserName;
    this.cbpService.selectedElement = this.viewTrackChange(this.cbpService.selectedElement);
  }

  refreshTreeUpdate() {
    this.cbpService.cbpJson = this.cbpService.refreshNodes(this.cbpService.cbpJson);
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
  }
  viewUpdatepage() {
    this.cbpService.detectWholePage = true;
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
  changeIsAutoSaveEnable(event: any) {
    if (this.isAutoSaveEnable) {
      localStorage.setItem("isAutoSaveEnable", "true");
      this.autoSaveEvent = setInterval(async () => {
        this.isAutoSaveMessage.msg = 'Saving';
        if (this.editorType.cbpStandalone) {
          await this.buildJsonCreate(true, false);
          this.isAutoSaveMessage.msg = 'Auto save';
        } else {
          this.datasharing.sendMessageFromOutsideToPlugin(
            {
              eventType: EventType.getCbpFile,
              msg: "get cbp file",
              msgType: "",
              source: 'autoSave'
            }
          );
        }
      }, this.autoSaveTimeInterval);
    } else {
      localStorage.setItem("isAutoSaveEnable", "false");
      if (this.autoSaveEvent) {
        clearInterval(this.autoSaveEvent);
        this.isAutoSaveMessage.msg = 'Auto save';
      }
    }
  }

  openBgDoc() {
    this.editorType['showBackgroundIcon'] = false;
    this.openBackground.emit()
  }

  backgroundSingleMedia(event: any) {
    if (this.cbpService.isBackGroundDocument)
      this.singleMedia(event);
  }

  onInputBGClick = (event: any) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  tabClick(type: string) {
    if (type == 'Basic') {
      this.setTabItems(true, false, false, false);
    }
    if (type == 'Data Entry') {
      this.setTabItems(false, true, false, false);
    }
    if (type == 'Reference/Link') {
      this.setTabItems(false, false, true, false);
    }
    if (type == 'Verification') {
      this.setTabItems(false, false, false, true);
    }
  }
  setTabItems(basic: boolean, dataEntry: boolean, ref: boolean, verification: boolean) {
    this.controlTabs.basic = basic;
    this.controlTabs.dataEntry = dataEntry;
    this.controlTabs.reference = ref;
    this.controlTabs.verification = verification;
  }

}
