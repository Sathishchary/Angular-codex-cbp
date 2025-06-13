import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

// thirdparty libraries
import JSZip from 'jszip';

// services
import { NotifierService } from 'angular-notifier';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CbpExeService } from '../services/cbpexe.service';
import { DataJsonService } from '../services/datajson.service';
import { DatashareService } from '../services/datashare.service';
import { ExecutionService } from '../services/execution.service';
import { SharedviewService } from '../services/sharedview.service';
import { AntlrService } from '../shared/services/antlr.service';
import { LayoutService } from '../shared/services/layout.service';
import { StylesService } from '../shared/services/styles.service';
import { TableService } from '../shared/services/table.service';

// components
import { AngularEditorConfig, TreeStructureComponent } from 'dg-shared';
import { DynamicSectionComponent } from '../components/dynamic-section/dynamic-section.component';
import { MenuBarComponent } from '../components/menu-bar/menu-bar.component';
import { TextEditorComponent } from '../components/text-editor/text-editor.component';
import { FormviewComponent } from '../formview/formview.component';

// json info
const stylesJson = require('src/assets/cbp/json/default-styles.json');
const styleImageJson = require('src/assets/cbp/json/style-image.json');
const layoutJson = require('src/assets/cbp/json/default-layout.json');
// models
import {
  AlertMessages,
  CallbackObject,
  CbpSharedService,
  Components,
  Dependency,
  DgTypes,
  ImagePath,
  LinkTypes,
  MathJaxService,
  PropertyDocument,
  SequenceTypes,
  StickyNote,
  styleModel
} from 'cbp-shared';
import {
  ActionId,
  ApproveStatus,
  DataInfo,
  DataInfoModel,
  DataJson,
  DynamicSec,
  EventFormView,
  ExecuteObj, ExecutionOrderJson,
  ImageModal,
  StepAction,
  StepOption,
  StepTypes,
  UndoCommentStore
} from '../models';

// External Files
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ScrollEvent } from 'ngx-scroll-event';
import { annotate, annotationGroup } from 'rough-notation';
import { Subscription } from 'rxjs';
import { CopyFromWordComponent } from '../components/copy-from-word/copy-from-word.component';
import { CBP_Indv_File, ExecutionType, InputFileType, MenuConfig, UserApiConfig } from '../ExternalAccess';
import { ExecuterModes } from '../ExternalAccess/executer-modes';
import { EventType, Event_resource, MenuBarEventType, Request_Msg } from '../ExternalAccess/medaiEventSource';
import { AnnotateJson } from '../models/annotateJson';
import { AnnotateObject } from '../models/annotateObject';
import { DynamicObject } from '../models/dynamicObject';
import { DynamicSectionInfo } from '../models/dynamicSectionInfo';
import { ProtectJson } from '../models/protectJson';
import { ProtectObject } from '../models/protectObject';
const findAnd = require('find-and');
declare var $: any, swal: any;
declare var tui: any, whiteTheme: any, $: any;

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'lib-form-execution',
  templateUrl: './formexecution.component.html',
  styleUrls: ['./formexecution.component.css'],
  providers: [DataJsonService, CbpExeService, SharedviewService, MathJaxService, CbpSharedService,
    AntlrService, LayoutService, StylesService, TableService, ExecutionService]
})
export class FormexecutionComponent implements OnInit, OnDestroy, OnChanges {
  isTree = false;
  currentNodeSelected: any;
  isMenuBarOpen = false;
  detailPage = false;
  loading = false;
  stopCbpExecution!: boolean;
  selectedCommentIndex: any;
  selectedStepSectionInfo: any;
  selectedDelayStep: any;
  propertyDocument: any = new PropertyDocument();
  ImagePath: typeof ImagePath = ImagePath;
  commentObj: any;
  // components open for top nav buttons
  verificationModalOpen = false;
  commentModalOpen = false;
  changeRequestModalOpen = false;
  editStepTitle = false;
  disabledUndo = true;
  disableMedia = false;
  undoComment = false;
  isChangeRequestUpdate = false;
  emailOpen = false;
  delayTimerShow = false;
  showSecurityVerifyUser = false;
  verificationObj: any;
  changeRquestObj: any;
  selectedCRIndex = 0;
  freezeCompletePage = false;
  isViewFormCalled = false;
  monitorExecution = false;
  isActivityExecute = false;
  stepTime: any;
  timeValue = 0;
  disableComponent = false;
  componentInfo: any;
  dgType: typeof DgTypes = DgTypes;
  stepTypes = StepTypes;
  showComponent = false;
  isComponentOpen = false;
  isDetailsTabOpen = false;
  showRefTab = true; // hiding feature
  @Input()
  refTabDisplay = false;
  isRefTabOpen = false;
  isTreeTabOpen = true;
  completedExecution = false;
  terminatedExecution = false;
  stepCompleteCount: any;
  isReadOnlyExecution = false;
  showMaxMinButtons = false;
  securityUpdatedUser: any;
  upadateVerifyUser = false;
  showUsageOption = false;
  isEditStepUpdated = false;
  disableStep = false;
  modalEditStep: any;
  referExecution = false;
  monitorExecutionData = false;
  cbpConstJson: any;
  uploadMediaOpen = false;
  verifyDataJson: DataJson = new DataJson();

  comments: any[] = [];
  crArrayData: any[] = [];
  tempCrData: any[] = [];
  otspData: any[] = [];
  typeValues = [];
  reasonValues = [];
  listOfFacilities = [];
  listOfUnits = [];
  listOfDecipline = [];
  documentSelected = false;
  layoutMargin: any;
  layoutIcons: any;
  indendation: any;
  disableCircle: any;
  sideNavVariables = { commentNavigation: true, mediaLink: false, crNavigation: false, otspView: false };
  customUsers = [{ userName: 'New User', userId: '0', emailId: 'newUser@gmail.com' }];
  isDetailTabEnabled = false;
  verificationUsers = [];

  freezePage: any = false;
  freezePageEntire = false;
  entirePageFreeze: any = false;

  totalRepeatTimes: any;
  repeatTimes!: number;
  isRepeatStep!: boolean;
  isTimerOnStep!: boolean;

  cbpJson!: any;
  styleJson!: any;
  signatureJson!: any;
  layOutJson!: any;
  executionOrderJson: any;
  dynamicExecutionJson: any;
  attachment: any[] = [];
  multipleCbpTab = false;
  autoSaveInterval: any
  selectedUniqueId!: number;
  isReadOnlyFromEdocument: any;
  isEdocument: any = true;
  isMobile: boolean = false;
  disableNumber: any;
  isviewUpdated: boolean = true;
  isCoverPage = true;
  coverPage: any;
  coverPageSet: any = false;
  headerFooterSelected = false;
  subscription!: Subscription;
  openDynamicSection!: boolean;
  dynamicSectionInfo: any[] = [];
  dynamicSectionExecution!: boolean;
  isFromCheckRoles = false;
  userObject: any;
  modalOptions: NgbModalOptions;
  isCommentUpdate!: boolean;
  verifyCationType!: DgTypes;
  saveModalopenLocal!: boolean;
  commentCrModalOpen!: boolean;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;
  layoutMarginValue: any;
  isOnitLoaded = false;
  colorUpdateOpen = false;
  downloadCBPJson: any;
  downloadDataJson!: DataJson;
  dataJson: DataJson = new DataJson();
  windowWidth!: number;
  lastSessionDate = new Date();
  updateTextView$!: Subscription;
  deleteImageObject!: Subscription;
  protectAll!: Subscription;

  autosaveEnable: boolean = false;
  config!: AngularEditorConfig;

  isFromCBPZip = false;
  collapseObj: any;
  annotateJson = new AnnotateJson().init();
  tabEnable = true;
  updateMediaInfo: any[] = []
  mediaFileData: any
  //Input Events
  @Input() fileType: InputFileType = new InputFileType();
  @Input() sourcepath: any = '';
  @Input() executionType: ExecutionType = new ExecutionType();
  @Input() menuConfig: MenuConfig = new MenuConfig();
  @Input() userApiConfig!: UserApiConfig;
  @Input() cbp_Indv_File: CBP_Indv_File | any;
  @Input() cbpJsonZip: any;
  @Input() cbpTab = false;
  @Input() getCurrentDataJson: any;
  @Input() executerModes: ExecuterModes = new ExecuterModes();
  @Input() stickyUiCss = false;
  @Input() attachmentBlobs: any[] = [];
  @Input() standalone = false;
  @Input() isDynamicSection: any;
  @Input() showNotifications: any = true;
  @Input() referenceListItems: any[] = [];
  @Input() saveDataSuccess: any;
  @Input() exitEwp: any;
  @Input() cbp_track_change: any;

  @Input() authenticatorConfig!: any;


  //Ouput Events
  @Output() saveDataJson: EventEmitter<any> = new EventEmitter();
  @Output() propertyDoc: EventEmitter<any> = new EventEmitter();
  @Output() mobilePluginEvents: EventEmitter<any> = new EventEmitter();
  @Output() sendWholeCBP: EventEmitter<any> = new EventEmitter();
  @Output() pdfBlobFile: EventEmitter<any> = new EventEmitter();
  @Output() exitExecutorChange: EventEmitter<any> = new EventEmitter()
  @Output() dataJsonChange: EventEmitter<any> = new EventEmitter();
  @Output() setCurrentDataJson: EventEmitter<any> = new EventEmitter();
  @Output() refObj: EventEmitter<any> = new EventEmitter();
  @Output() getRefObj: EventEmitter<any> = new EventEmitter();
  @ViewChild(FormviewComponent, { static: false }) viewForm!: FormviewComponent;
  @ViewChild(TreeStructureComponent, { static: false }) treeView!: TreeStructureComponent;
  @ViewChild('postion', { static: true }) _div!: ElementRef;

  @Input() cbpServerDataJsonInput: boolean = false;
  @Input() isServer: boolean = false;
  @Output() cbpServerDataJson: EventEmitter<any> = new EventEmitter();
  source = Event_resource.commentsRef;
  typeOfModal: any;
  paginationNumber: any;
  signatureState = false;
  commentCrMediaFiles: any[] = [];
  storeMessages: any[] = [];
  menuBarEvent: typeof MenuBarEventType = MenuBarEventType;
  lastChildObj: any;
  marginBottom: number = 0;
  closeType = '';
  @Input() updatedBackground: any;
  @Input() cbpFileTabInfo: any;
  initailLoad: boolean = false;
  loadedAnnotations: any[] = [];
  isReachingBottomState = false;
  isReachingTopState = false;
  startPosition: number = 0; //global variable
  scrollDirection: string = '';
  showPaginationButtons = true;
  refreshCbpFileChange: boolean = false;
  imageEditor: any;
  mediaFile: any;
  @Input() penInkJson: any;
  authenticatorEvent: any;
  refreshProtectFields = false;
  constructor(public cbpService: CbpExeService, public stylesService: StylesService,
    public executionService: ExecutionService, private cdref: ChangeDetectorRef,
    public deviceService: DeviceDetectorService, public layoutService: LayoutService,
    public antlrService: AntlrService, public notifier: NotifierService,
    public sharedviewService: SharedviewService, public tableService: TableService,
    public datashareService: DatashareService, public dataWrapperService: DatashareService,
    private modalService: NgbModal, public dataJsonService: DataJsonService, public sharedService: CbpSharedService,
    public sanitizer: DomSanitizer) {
    this.modalOptions = this.dataJsonService.modalOptions;
    this.cbpService.activePage = 1;
    this.cbpService.startIndex = 1;
    this.cbpService.paginateIndex = 1;
    this.cbpService.maxPage = 1
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fileType && this.fileType) {
      this.fileType = changes.fileType.currentValue;
    }
    if (changes.exitEwp) {
      this.exitExecutor()
    }
    this.multipleCbpTab = this.fileType.CBP_ZIP ? true : false;
    if (changes.cbp_Indv_File && this.cbp_Indv_File && !this.multipleCbpTab) {
      const cbpIndividualFile = changes.cbp_Indv_File.currentValue;
      this.cbpService.dataJson = cbpIndividualFile.dataJson ? JSON.parse(JSON.stringify(cbpIndividualFile.dataJson)) : new DataJson();
      this.cbpService.protectJson = cbpIndividualFile.protectJson ? JSON.parse(JSON.stringify(cbpIndividualFile.protectJson)) : new ProtectJson().init();
      this.executionService.signatureJson = cbpIndividualFile.signatureJson ? JSON.parse(JSON.stringify(cbpIndividualFile.signatureJson)) : [];
      this.cbpService.dynamicSectionInfo = cbpIndividualFile.dynamicSectionInfo ? JSON.parse(JSON.stringify(cbpIndividualFile.dynamicSectionInfo)) : [];
      this.cbpJson = JSON.parse(JSON.stringify(cbpIndividualFile.cbpJson));
      this.cbpService.defaultSection = this.cbpJson?.section[0];
      this.cbpService.documentInfo = this.cbpJson?.documentInfo[0];
      this.documnetFields();
      this.cbpService.activePage = this.cbpService.activePage ?? 1;
      this.cbpService.documentInfo['dateFormatNew'] = this.sharedviewService.getDateValue(this.cbpService.documentInfo.dateFormat);
      this.cbpService.documentInfo['formatPlaceHolder'] = this.sharedviewService.getPlaceHolder(this.cbpService.documentInfo?.dateFormat);
      // console.log(this.cbpService.documentInfo['dateFormatNew']);
      this.antlrService.callBackObject.dateFormat = this.cbpService.documentInfo['formatPlaceHolder'];
      this.dataJsonService.setdatePlaceholderItem(this.cbpService.documentInfo);
      this.cbpConstJson = JSON.parse(JSON.stringify(cbpIndividualFile.cbpJson));
      this.executionOrderJson = cbpIndividualFile.executionOrderJson ? cbpIndividualFile.executionOrderJson : new ExecutionOrderJson();
      // this.dynamicSectionInfo = cbpIndividualFile.dynamicSectionInfo ? cbpIndividualFile.dynamicSectionInfo : [];
      this.cbpService.styleImageJson = cbpIndividualFile.styleImageJson ? JSON.parse(JSON.stringify(cbpIndividualFile.styleImageJson)) : styleImageJson;
      this.styleJson = cbpIndividualFile.styleJson ? JSON.parse(JSON.stringify(cbpIndividualFile.styleJson)) : (stylesJson);
      this.annotateJson = cbpIndividualFile?.annotateJson ? JSON.parse(JSON.stringify(cbpIndividualFile.annotateJson)) : new AnnotateJson().init();
      this.executionService.styleModel = this.stylesService.applyStyles(new styleModel(), this.styleJson, stylesJson);
      this.layOutJson = cbpIndividualFile.layOutJson ? JSON.parse(JSON.stringify(cbpIndividualFile.layOutJson)) : (layoutJson);
      this.attachment = cbpIndividualFile.attachment ? cbpIndividualFile.attachment : [];
      this.cbpService.media = cbpIndividualFile.media ? cbpIndividualFile.media : [];
      if (this.cbpService.media.length > 0) {
        this.dataJsonService.setMediaItem(this.cbpService.media);
      }

    }
    if (changes.attachmentBlobs && this.attachmentBlobs) {
      let attachmentsFiles = changes.attachmentBlobs.currentValue;
      for (let i = 0; i < attachmentsFiles.length; i++) {
        const fileIndex = this.attachment.findIndex((x: any) => x.name.includes(attachmentsFiles[i].name));
        this.attachment.splice(fileIndex, 1, attachmentsFiles[i]);
        this.storeAttachObject(attachmentsFiles[i]);
      }
    }
    if (changes.cbpJsonZip && this.cbpJsonZip) {
      this.cbpJsonZip = changes.cbpJsonZip.currentValue;
      this.multipleCbpTab = true;
      if (this.isMobile) {
        this.ngOnInit();
      }
    }
    if (this.multipleCbpTab) { this.monitorExecutionData = true; }
    if (changes.userApiConfig && this.userApiConfig) {
      this.userApiConfig = changes.userApiConfig.currentValue;
      // console.log(this.userApiConfig);
      this.executionService.accessToken = this.userApiConfig.accessToken;
      this.executionService.apiUrl = this.userApiConfig.apiUrl;
      this.executionService.loggedInUserId = this.userApiConfig.loggedInUserId;
      this.executionService.loggedInUserName = this.userApiConfig.loggedInUserName;
      this.executionService.emailId = this.userApiConfig.emailId;
      this.executionService.companyID = this.userApiConfig.companyID;
    }
    if (this.menuConfig && changes.menuConfig) {
      this.menuConfig = changes.menuConfig.currentValue;
      this.datashareService.setMenuConfig(this.menuConfig);
    }
    if (this.cbp_track_change && changes.cbp_track_change) {
      // this.cbp_track_change = changes.cbp_track_change.currentValue;
      // if (this.cbp_track_change['DGC_BACKGROUND_DOCUMENT'] || this.cbp_track_change['DGC_BACKGROUND_DOCUMENT_FILE_ID']) {
      //   this.cbpService.primaryDocument = true;
      //   console.log('isPrimary Doc:', this.cbpService.primaryDocument);
      // }
      // if (this.cbp_track_change['DGC_IS_BACKGROUND_DOCUMENT']) {
      //   this.cbpService.isBackGroundDocument = true;
      //   this.cbpService.primaryDocument = false;
      //   if (this.cbpJson['documentInfo']) {
      //     this.cbpJson['documentInfo'][0]['isBackgroundDoc'] = true;
      //     console.log('is background Doc:', this.cbpService.isBackGroundDocument);
      //   }
      // }
    }
    if (changes.cbpFileTabInfo && this.cbpFileTabInfo) {
      this.cbpFileTabInfo = changes.cbpFileTabInfo.currentValue;
      if (this.cbpFileTabInfo?.isBackgroundDocument) {
        this.cbpService.isBackGroundDocument = true;
      }
    }
    if (changes.updatedBackground && this.updatedBackground && this.cbpService?.isBackGroundDocument) {
      this.updatedBackground = changes.updatedBackground.currentValue;
      // this.cbpJson.section = this.executionService.updateParaInCbp(this.cbpJson.section, changes.updatedBackground.currentValue.section)
      // this.cbpJson = this.cbpService.refreshNodes(this.cbpJson, this.disableNumber);
      // executer sync changes
      this.reUpdateCbpWithBackground(this.updatedBackground);

    }
    if (changes.cbpFileTabInfo && this.cbpFileTabInfo) {
      this.cbpFileTabInfo = changes.cbpFileTabInfo.currentValue;
      if (this.cbpFileTabInfo?.isBackgroundDocument ||
        this.cbpFileTabInfo?.documentFileData?.['DGC_IS_BACKGROUND_DOCUMENT']
      ) {
        this.cbpService.isBackGroundDocument = true;
      }
      if (this.cbpFileTabInfo?.documentFileData?.DGC_BACKGROUND_DOCUMENT_ID) {
        this.cbpService.primaryDocument = true;
      }
    }
    if (this.isDynamicSection && changes.isDynamicSection) {
      this.isDynamicSection = changes.isDynamicSection.currentValue;
    }
    this.isMobile = this.datashareService.getMenuConfig()?.isMobile;

    if (this.isMobile) {

      this.executionService.styleModel = this.stylesService.applyStyles(new styleModel(), this.styleJson, stylesJson);
    }
    if (this.executerModes && changes.executerModes) {
      this.executerModes = changes.executerModes?.currentValue;
      this.stopCbpExecution = false;
      this.freezePage = this.executerModes?.viewMode ? true : false;
      this.freezePage = JSON.parse(JSON.stringify(this.freezePage));
      this.completedExecution = JSON.parse(JSON.stringify(false));
      this.terminatedExecution = JSON.parse(JSON.stringify(false));
      this.executerModes = JSON.parse(JSON.stringify(this.executerModes));
      this.executionService.setExecuterModes(this.executerModes);
    }
    if (this.getCurrentDataJson && changes.getCurrentDataJson) {
      this.setCurrentDataJson.emit(this.cbpService.dataJson);
    }
    if (changes.executionType && this.executionType) {
      this.executionType = changes.executionType.currentValue;
      this.isReadOnlyExecution = this.executionType.Read ? true : false;
      this.menuConfig.isReadExecutor = this.isReadOnlyExecution;
      this.stopCbpExecution = false;
      this.menuConfig = JSON.parse(JSON.stringify(this.menuConfig));
      // this.stopCbpExecution = this.isReadOnlyExecution ? false: true;
    }
    // FROM EWORK
    if (changes.authenticatorConfig && !changes.authenticatorConfig.firstChange) {
      this.setAthentivcator();
    }
    if (changes.cbpServerDataJsonInput && !changes.cbpServerDataJsonInput.firstChange) {
      this.saveCbpFile('save', false, 'server');
    }
    if (changes.saveDataSuccess && !changes.saveDataSuccess.firstChange) {
      this.saveDataSuccess = changes.saveDataSuccess.currentValue;
      if (this.saveDataSuccess?.status == 'updated' &&
        (this.closeType !== 'autoSave' && this.closeType !== 'mainSave')) {
        this.closeExe();
      }
    }
  }
  checkAttachInfo() {
    if (this.executionService.selectedFieldEntry?.dgType) {
      setTimeout(() => { this.detach() }, 100);
    } else {
      this.reattach();
    }
    if (this.tableService.selectedRow?.length > 1) {
      this.reattach();
    }
  }
  detach() {
    this.cdref.detach();
  }
  reattach() {
    this.cdref.reattach();
    this.cdref.detectChanges();
  }

  storeAttachObject(obj: any) {
    let user = this.executionService.selectedUserName;
    let dataInfo: DataInfoModel = new DataInfoModel('Attachment', user, new Date(), user, new Date(), '', 'Attachment', this.cbpService.dataJson.lastSessionUniqueId.toString(), 0);
    let dataInfoObj: any = { ...dataInfo, ...this.sharedviewService.setUserInfoObj('AttachFile') };
    dataInfoObj['fileName'] = obj?.name;
    this.dataEntryJsonEvent(dataInfoObj);
  }
  documnetFields() {
    if (!this.cbpService.documentInfo?.dateFormat) {
      this.cbpService.documentInfo.dateFormat = 'mm/dd/yyyy'; // m/j/Y
    }
    if (!this.cbpService.documentInfo?.usage) {
      this.cbpService.documentInfo.usage = DgTypes.Continuous;
    }
    if (this.cbpService.documentInfo['dynamicDocument'] === null) {
      this.cbpService.documentInfo.dynamicDocument = false;
    }
  }

  setStartExecution(res: any) {
    // if(res.status=='running'){
    //   this.completedExecution = JSON.parse(JSON.stringify(false));
    //   this.terminatedExecution = JSON.parse(JSON.stringify(false));
    // }
    this.completedExecution = JSON.parse(JSON.stringify(false));
    this.terminatedExecution = JSON.parse(JSON.stringify(false));
  }
  getLinkPdfEvent(stepObject: any) {
    let cbpDataJson = this.getExecutionDataJsonObject();
    if (stepObject['source'] === LinkTypes.eDocument) {
      if (this.isMobile) {
        let stepObj = JSON.parse(JSON.stringify(stepObject));
        stepObj.eDocumentInfo = stepObj.eDocumentObj.documentTitle;
        stepObj.displayText = stepObj.eDocumentObj.documentTitle;
        stepObj.caption = stepObj.eDocumentObj.documentTitle;
        stepObj.description = stepObj.eDocumentObj.documentTitle;
        stepObj.uri = '';
        let evt: Request_Msg = { eventType: EventType.fireLinkEdocEvent, msg: stepObj, datajson: cbpDataJson };
        this.datashareService.sendMessageFromLibToOutside(evt);
      }
      else {
        this.pdfBlobFile.emit({ type: 'edocumentInfo', step: stepObject, stepInfo: stepObject });
      }
      return false;
    } else if (stepObject['source'] === LinkTypes.Attach) {
      if (this.isMobile) {
        //eventHandler.fireLinkAttachmentEvent(stepObject);
        let evt: Request_Msg = { eventType: EventType.fireLinkAttachmentEvent, msg: stepObject, datajson: cbpDataJson };
        this.datashareService.sendMessageFromLibToOutside(evt);
      } else {
        const fileObject = this.attachment.find((x: any) => x.name.includes(stepObject.uri));
        localStorage.removeItem("documentFileID");
        localStorage.removeItem("parent");
        if (fileObject) {
          let fileName = fileObject.name.toLowerCase();
          if (fileName.includes('.pdf')) {
            this.pdfBlobFile.emit({ type: 'pdfObj', pdfBlob: fileObject, stepInfo: stepObject });
          } else if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg')) {
            this.pdfBlobFile.emit({ type: 'image', pdfBlob: fileObject, stepInfo: stepObject });
          } else if (fileName.includes('.mp4') || fileName.includes('.webm') || fileName.includes('.ogv')) {
            this.pdfBlobFile.emit({ type: 'video', pdfBlob: fileObject, stepInfo: stepObject });
          } else {
            let typeName = this.executionService.splitLastOccurrence(fileName, '.');
            this.pdfBlobFile.emit({ type: typeName[1].toString().toLowerCase(), pdfBlob: fileObject, stepInfo: stepObject });
          }
        }
      }
    } else if (stepObject['source'] === LinkTypes.URL) {
      if (this.isMobile) {
        let evt: Request_Msg = { eventType: EventType.fireLinkURLEvent, msg: stepObject, datajson: cbpDataJson };
        this.datashareService.sendMessageFromLibToOutside(evt);
      }
      else {
        this.pdfBlobFile.emit({ type: 'URL', step: stepObject, stepInfo: stepObject });
      }
      return false;
    }
    // else if (stepObject['source'] === LinkTypes.eMedia) {
    //   if (this.isMobile) {
    //     let evt: Request_Msg = { eventType: EventType.fireLinkEmeadiaEvent, msg: stepObject };
    //     this.datashareService.sendMessageFromLibToOutside(evt);
    //   }
    //   else {
    //     this.pdfBlobFile.emit({ type: 'eMedia', step: stepObject, stepInfo: stepObject  });
    //   }
    //   return false;
    // }
  }
  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.windowWidth = window.innerWidth;

    this.cbpService.windowWidth = window.innerWidth;
    this.executionService.setwidthtem({ width: this.windowWidth });
    this.executionService.setwindSize(window);
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
    this.formatPainter({ executerType: 'formatPainter', value: false });
  }

  ngAfterViewInit(): void {
    this.subscription = this.datashareService.receivedMessage.subscribe((res: Request_Msg) => {
      if (res?.eventType === EventType.saveEvent_HandShake) {
        this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
        this.setDataJsonTxId();
      }
      if (res?.eventType === EventType.startexecution) {
        this.stopExecution();
        if (this.isMobile && this.executionType.Read) {
          this.stopCbpExecution = true;
        }
      }
      if (res && res?.eventType === EventType.setCommentTypes_success)
        this.setTypes(res.msg);
      if (res?.eventType == EventType.setMediaEdit) {
        this.showEditImage(res.msg, res.msgData)

      }
      // if (res.eventType == EventType.fireCameraEvent && res.source==Event_resource.commentsRef)
      //  this.setVideo(res.msg);
      if (res?.eventType === EventType.saveEventFromMobile) {
        this.saveCbpFile('save', false, 'mobile');
      }
      if (res?.eventType === EventType.fireCameraVideoReceivedEvent) {
        this.singleMediaUpdateMobile(res.msg);
      }
      if (res?.eventType === EventType.getCbpData) {
        if (this.cbpService.dataJson?.dataObjects?.length > 0) {
          this.saveDataJson.emit(this.cbpService.dataJson);
          let evt: Request_Msg = {
            eventType: EventType.getCbpData,
            msg: this.cbpService.dataJson,
            datajson: this.cbpService.dataJson
          };
          this.datashareService.sendMessageFromLibToOutside(evt);
        }
      }
      if (res?.eventType === EventType.setClosecbp) {
        let evt = this.getExecutionDataJsonObject();
        this.datashareService.sendMessageFromLibToOutside(evt);
      }
      if (res && res.eventType == EventType.sendEmail_success) {
        if (this.isMobile)
          this.setMessage(AlertMessages.EmailSent);
      }
      if (res && res.eventType === EventType.saveDataJson_success) {
        if (!this.autosaveEnable) {
          this.setLoader(true);
          if (!this.isMobile && res.msg !== 'Server')
            this.setMessage(AlertMessages.saveMessage);
          this.setLoader(false);
          this.autosaveEnable = false;
        }
        this.setDataJsonTxId();
        if (this.refreshCbpFileChange) {
          this.callRefreshApi();
          this.refreshCbpFileChange = false;
        }
      }
      if (res && res.eventType === EventType.saveDataJson_failed) {
        this.cbpService.dataJsonTxnIDS.pop();
        this.setMessage(res.msg);
      }
      if (res && res.eventType === EventType.refreshDataJson_success) {
        if (this.cbpConstJson) {
          this.setLoader(true);
          this.cbpService.activePage = 1;
          this.cbpService.startIndex = 1;
          this.cbpService.maxPage = 1
          this.cbpJson = JSON.parse(JSON.stringify(this.cbpConstJson));
          this.setPaginationIndex(this.cbpJson.section, this.cbpService.pageSize, null, self);
          this.setDataJsonChanges(res.msg.file);
          this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })

          this.setDataJsonTxId();
          this.viewUpdate(true);
        }
      }
      if (res && res.eventType === EventType.refreshDataJson_failed) {
        this.setLoader(false);
        this.setMessage(AlertMessages.refreshDataJsonFail);
      }
      if (res && res.eventType === EventType.setCodeValues_success) {
        this.setCodeValues(res.msg);
      }
      if (res && res.eventType === EventType.setReasonCodeValues_success) {
        this.setReasonCodeValues(res.msg);
      }
      if (res && res.eventType === EventType.setFacilityValues_success) {
        this.setFacility(res.msg);
      }
      if (res?.eventType == EventType.setUnitFacility_success) {
        this.setUnit(res.msg)
      }
      if (res && res.eventType === EventType.setCommentTypes_success) {
        this.setTypes(res.msg);
      }
      if (res && res.eventType === EventType.setAnnotation_Success) {
        console.log("in setAnnoation_Success")
      }
      if (res && res.eventType === EventType.userCBPInfo_success) {
        if (res.msg && this.isFromCheckRoles) {
          const hasRolQual = this.sharedviewService.checkRoles(this.cbpJson.documentInfo[0], true, res.msg);
          this.setFreezePage(!hasRolQual);
          this.isFromCheckRoles = false;
        } else {
          this.checkRolesStep(this.cbpJson.section);
          if (this.userObject && res.msg) {
            this.sharedviewService.userCbpInfo = res.msg;
            this.checkRoleQuals(this.userObject);
            this.viewUpdate(true);
            this.sharedviewService.detectAll = true;
            this.cdref.detectChanges();
          }
        }
      }
      if (res && res.eventType === EventType.getCBPDataJson) {
        this.saveCbpFile('save', false, 'server');
      }
      if (res && res.eventType === EventType.freezeExecuter) {
        this.freezePage = res.msg;
        this.freezePageEntire = res.msg;
      }
      if (res && res.eventType === EventType.getCBPZip) {
        this.saveCbpFile('save', false, 'server');
      }
      if (res && res.eventType === EventType.refObj) {
        this.setRefData(res.msg);
      }
      if (res && res.eventType === EventType.linkObj) {
        this.executionService.setLink(res);
      }
      if (res && res.eventType === EventType.penInk) {
        this.penInkJson = res.msg;
      }
      if (res && res.eventType === EventType.reStartExecution) {
        this.setStartExecution(res)
      }
      if (res && res.eventType === EventType.yubikey) {
        this.authenticatorEvent = JSON.parse(JSON.stringify(res));
      }
    });
    this.datashareService.eventMessageFromPlugin.subscribe((res: Request_Msg) => {
      this.mobilePluginEvents.emit(res);
    });

    this.updateTextView$ = this.executionService.fieldSource.subscribe((res: any) => {
      if (res != '{}' && res.showMenuText) {
        this.executionService.selectedFieldEntry = res.stepObject;
        if (res?.stepItem && res?.stepObject.dgType === DgTypes.Table) {
          this.cbpService.selectedTable = res?.stepObject;
          this.executionService.selectedFieldEntry = res?.stepItem;
        }
      } else {
        this.menuConfig.isUpdateViewText = false;
        this.executionService.selectedFieldEntry = undefined;
      }
      this.checkAttachInfo()
    });
    if (this.isMobile) {
      console.log('Tablet Mode');
      let evt: Request_Msg = { eventType: EventType.TableStartExecution, msg: EventType.TableStartExecution, datajson: [], opt: '' };
      this.datashareService.sendMessageFromLibToOutside(evt);
    }
    this.protectAll = this.cbpService.protectAllFields.subscribe((res: any) => {
      this.protectAllSections();
    });
  }

  ngOnInit() {
    this.setAthentivcator();
    if (this.cbpFileTabInfo) {
      if (this.cbpFileTabInfo.isBackgroundDocument ||
        this.cbpFileTabInfo?.documentFileData?.['DGC_IS_BACKGROUND_DOCUMENT']) {
        this.cbpService.isBackGroundDocument = true;
      }
    }
    this.cbpService.forFooterHeight = this.standalone;
    this.loading = true;
    this.showNotifications = this.showNotifications ?? true;
    this.executionService.refObjID = null;
    this.resizeWindow();
    this.getEventFromModalChild();
    if (this.multipleCbpTab) { this.monitorExecutionData = true; }
    if (!this.menuConfig?.marginBottom) {
      this.menuConfig.marginBottom = 50;
    }
    if (!this.menuConfig?.marginTop) {
      this.menuConfig.marginTop = 50;
    }
    this.marginBottom = 150 + parseInt(this.menuConfig.marginBottom.toString());
    if (this.menuConfig.isLocationEnabled) {
      this.getLocation();
    }
    this.sharedviewService.deviceInfo = this.deviceService;
    this.storeUserNames({
      userName: this.executionService.loggedInUserName,
      userId: this.executionService.loggedInUserId,
      emailId: this.executionService.emailId
    });
    this.executionService.setCurrentUser(this.customUsers[0]);
    if (this.monitorExecutionData) {
      this.isReadOnlyExecution = this.executionType.Read ? true : false;
      let file = new File([this.cbpJsonZip], 'test.cbp');
      if (file) {
        this.monitorExecution = true;
        this.onFileChange([file]);
        this.stopCbpExecution = this.isMobile && this.executionType.Read ? true : false;
      }
    } else {
      if (!this.isOnitLoaded) { this.onExecuterInit(); }
    }
    if (this.isMobile) {
      this.setCommentCrDropdowns();
    }
    this.annotationSDK_Event()
    let autoSave = this.datashareService.getMenuConfig()?.isAutoSave;
    let autoSaveTimeInterval = this.datashareService.getMenuConfig()?.autoSaveTimeInterval;
    if (autoSave) {
      this.autoSaveInterval = setInterval(() => {
        let dataJson = this.getDeltaJson();
        if (dataJson?.dataObjects?.length > 0) {
          this.autosaveEnable = true;
          this.saveCbpFile('save', true, 'autoSave')
        }
      }, autoSaveTimeInterval);
    }
    if (this.isMobile && this.executionType.Read) {
      this.stopCbpExecution = true;
      this.executerModes.viewMode = true;
    }
    if (this.isMobile) {
      this.changeSize({ first: false, defalt: false, last: true });
    }
    this.executionService.refObjValue.subscribe((result) => {
      this.fetchRefObj(result);
    });
    this.cbpService.stickyNoteChange.subscribe(event => {
      this.stickyNoteChangeEvent(event);
    });
    this.cbpService.mediaEditChange.subscribe(event => {
      this.mediaUpdate(event);
    });
  }
  getExecutionDataJsonObject() {
    let evt: Request_Msg = {
      eventType: EventType.saveEvent,
      datajson: this.getDeltaJson(),
      signatureJson: this.executionService.signatureJson,
      dynamicSection: this.cbpService.dynamicSectionInfo,
      protectJson: this.cbpService.protectJson,
      annotateJson: this.annotateJson,
      executionOrderJson: this.executionOrderJson,
      opt: 'close'
    };
    return evt;
  }
  setAthentivcator() {
    this.executionService.authenticatorConfig = this.authenticatorConfig;
    this.executionService.updateAuthenticator(this.authenticatorConfig);
    // if(this.authenticatorConfig?.signature?.authenticator == 'yubikey'){
    //   this.executionService.yubikeySignature = true;
    // }
    // if(this.authenticatorConfig?.signature?.authenticator == 'yubikey'){
    //   this.executionService.yubikeySignature = true;
    // }
    // if(this.authenticatorConfig?.initial?.timeout){
    //   this.executionService.yubikeyInitial = true;
    // }
    // if(this.authenticatorConfig?.initial?.timeoutMessage){
    //   this.executionService.yubikeyInitial = true;
    // }
    // if(this.authenticatorConfig?.signature?.signature_user_info){
    //   this.executionService.yubikeySignature = true;
    // }'

  }


  annotationSDK_Event() {
    // console.log('calling pageview')
    let evt: Request_Msg = { eventType: EventType.annotationSDK, msg: '' };
    this.datashareService.sendMessageFromLibToOutside(evt);
  }
  reUpdateCbpWithBackground(backgroundCbpFile: any) {
    try {
      if (backgroundCbpFile?.cbpJson) {
        if (this.cbpJson?.section?.length > 0) {
          this.cbpService.paraList = [];
          this.cbpService.getParaObjects(this.cbpJson.section);
          this.cbpService.paraList = this.cbpService.removeDuplicates(this.cbpService.paraList, 'dgUniqueID');
          this.cbpJson.section = backgroundCbpFile.cbpJson.section;
          if (this.cbpService.paraList.length > 0) {
            this.updaterParaWithBackgroundCBPFile();
          }
        } else {
          this.cbpJson.section = backgroundCbpFile.cbpJson.section;
        }
        this.cbpService.documentInfo = this.cbpJson.documentInfo[0];
        this.styleJson = backgroundCbpFile.styleJson;
        this.layOutJson = backgroundCbpFile.layoutJson;
        this.cbpService.styleImageJson = backgroundCbpFile.styleImageJson;
        this.cbpService.defaultStylesJson = stylesJson;
        this.cbpService.defaultStyleImageStyle = JSON.parse(JSON.stringify(styleImageJson));
        this.isTree = false;
        this.cbpJson = this.cbpService.refreshNodes(this.cbpJson, this.disableNumber);
        if (!this.styleJson) { this.styleJson = stylesJson; }
        this.applyLayOutChanges();
        // commented to due to multiple calling of color subscription
        // this.executionService.setColorItem({ 'color': this.cbpJson.documentInfo[0]['color'] });
        this.executionService.styleModel = this.stylesService.applyStyles(new styleModel(), this.styleJson, stylesJson);
        this.executionService.setStyleModelItem(this.executionService.styleModel);
        this.storeSectionStepArray(this.cbpJson.section, [], 'refresh');
        this.selectStepFromEvent(this.cbpService.stepSequentialArray);
        // console.log(this.cbpJson.section);
        setTimeout(() => { this.isTree = true; }, 5);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  updaterParaWithBackgroundCBPFile() {
    for (let i = 0; i < this.cbpService.paraList.length; i++) {
      let obj = this.cbpService.paraList[i];
      if (obj.dgType === DgTypes.Table && obj?.parentDgUniqueId) {
        obj.parentDgUniqueID = obj.parentDgUniqueId;
      }
      const step = this.executionService.getElementByDgUniqueID(obj.parentDgUniqueID, this.cbpJson.section)
      if (step) {
        let findDup = step.children.find((item: any) => item.dgUniqueID == obj.dgUniqueID)
        if (!findDup)
          step.children.push(obj);
      }
    }
  }

  setCommentCrDropdowns() {
    let evtComment: Request_Msg = { eventType: EventType.setCommentTypes, msg: '' };
    this.dataWrapperService.sendMessageFromLibToOutside(evtComment);

    let evtCode: Request_Msg = { eventType: EventType.CodeValues, msg: '', eventFrom: Event_resource.crRef };
    this.dataWrapperService.sendMessageFromLibToOutside(evtCode);

    let evtReason: Request_Msg = { eventType: EventType.setReasonCodeValues, msg: '', eventFrom: Event_resource.crRef };
    this.dataWrapperService.sendMessageFromLibToOutside(evtReason);

    let evtFacility: Request_Msg = { eventType: EventType.setFacilityValues, msg: '' };
    this.dataWrapperService.sendMessageFromLibToOutside(evtFacility);

    let evtCrCode: Request_Msg = { eventType: EventType.crOpened, msg: '', eventFrom: Event_resource.crRef };
    this.dataWrapperService.sendMessageFromLibToOutside(evtCrCode);

    // console.log('Tablet Mode');
    let evt: Request_Msg = { eventType: EventType.TableStartExecution, msg: EventType.TableStartExecution, datajson: [], opt: '' };
    this.datashareService.sendMessageFromLibToOutside(evt);

  }
  async exitExecutor() {
    let dataJson = this.getDeltaJson();
    if (dataJson?.dataObjects?.length > 0 && this.menuConfig.isEwpExecuter) {
      const { value: userConfirms, dismiss } =
        await this.cbpService.showMoreButtonsSwal(AlertMessages.closeDocument, 'warning', 'Yes', 'No', 'Cancel',);
      if (!dismiss && userConfirms) {
        this.saveCbpFile('save', false, 'eworkBuilder');
      } else if (dismiss === undefined && !userConfirms) {
        this.closeExe();
      }
    } else {
      this.closeExe();
    }
  }
  closeExe() {
    this.cbpService.media = [];
    if (!this.isMobile) {
      this.cbpJson = this.formatCBPJSON(JSON.parse(JSON.stringify(this.cbpJson)));
    }
    $('.popuptext').css("display", "none");
    this.exitExecutorChange.emit(this.getExecutionDataJsonObject());
  }

  setMessage(mesg: string) {
    this.notifier.hideAll();
    this.notifier.notify('success', mesg);
  }

  errorMessage(event: any) {
    this.terminatedExecution = true;
    this.entirePageFreeze = true;
  }
  getDataJson() {
    this.saveDataJson.emit(this.cbpService.dataJson);
  }

  getDataJsonAndMedia() {
    return { dataJson: this.cbpService.dataJson, media: this.cbpService.media };
  }
  storeUserNames(obj: any) {
    if (!this.customUsers.includes(obj)) { this.customUsers.unshift(obj); }
    this.customUsers = this.cbpService.removeDuplicates(this.customUsers, 'userName');
  }
  onExecuterInit() {
    this.setLoader(true);
    this.cbpService.isBuild = false;
    if (this.cbpJson) {
      this.propertyDocument = this.cbpJson['documentInfo'] ? this.cbpJson.documentInfo[0] : new PropertyDocument();
      this.cbpJson = this.executionService.setHeaderFooterWaterMark(this.cbpJson);
      this.cbpService.documentInfo = this.propertyDocument;
      this.cbpService.documentInfo['isDataProtected'] = true;
      this.menuConfig.isDataProtected = true;
      this.checkRolesStep(this.cbpJson.section);
      this.cbpJson.documentInfo[0].header['children'] = this.cbpJson.documentInfo[0].header['children'] ?? [];
      this.cbpJson.documentInfo[0].footer['children'] = this.cbpJson.documentInfo[0].footer['children'] ?? [];
      this.cbpJson.documentInfo[0]['color'] = this.cbpJson.documentInfo[0]['color'] ?? '#000000';
      if (this.cbpJson.documentInfo[0]['dgUniqueID'] !== 'DG_DOC0') {
        this.cbpJson.documentInfo[0]['dgUniqueID'] = 'DG_DOC0';
      }
      this.constructFormJsonBuildJson();
      this.propertyDoc.emit({ 'event': this.propertyDocument });
      this.executionService.selectedField({ stepItem: {}, stepObject: {}, showMenuText: false });
    }
    const dataEntryDefaultStyles = this.styleJson.style?.find((style: any) => style?.name === 'Normal');
    if (dataEntryDefaultStyles) {
      const { fontSize, fontName } = dataEntryDefaultStyles;
      if (fontSize !== "2" || fontName !== "Poppins") {
        this.executionService.setStyleViewItem({ fontsize: fontSize, fontfamily: fontName, type: 'size&family' });
      }
    }
    this.sharedviewService.detectAll = true;
    this.isOnitLoaded = true;
  }
  treeLoaded() {
    for (let i = 0; i < this.sharedviewService.colorNodes?.length; i++) {
      let obj = this.sharedviewService.colorNodes[i];
      let color = this.sharedviewService.colorNodes[i].type;
      const objValue = $('#' + obj.dgUniqueID + ' > div');
      if (objValue?.length > 0) {
        objValue.css('background', color);
        this.sharedviewService.colorNodes[i].loaded = true;
      } else {
        this.sharedviewService.colorNodes[i].loaded = false;
        objValue.removeAttr('style');
      }
    }
    this.tabEnable = false;
    if (this.annotateJson?.annotateObjects?.length > 0) {
      setTimeout(() => { this.refreshAnnotations(); }, 800);
    }
    if (this.refreshProtectFields) {
      this.protectAllSections();
      this.refreshProtectFields = false;
    }
    this.cdref.detectChanges();
  }
  onFileChange(fileList: any): void {
    const file = fileList[0];
    if (file.name.indexOf('.cbp') > -1 || file.name.indexOf('.CBP') > -1 || file.name.indexOf('.zip') > -1) {
      this.cbpService.isDocumentUploaded = true;
      const self = this;
      let names: string[] = []
      this.clearDatajsonValues();
      this.cbpJson = { documentInfo: [new PropertyDocument()], section: [] };
      const zip = new JSZip();
      zip.loadAsync(file).then(function (zip) {
        let files = Object.keys(zip.files);
        Object.keys(zip.files).forEach((filename) => {
          zip.files[filename].async('string').then(function (fileData) {
            let isValidData = (fileData === undefined || fileData === '') ? false : true;
            if (filename.indexOf('default.json') > -1) { }
            if (filename.indexOf('style.json') > -1) {
              self.styleJson = !isValidData ? (stylesJson) : JSON.parse(fileData);
              self.executionService.styleModel = self.stylesService.applyStyles(new styleModel(), self.styleJson, stylesJson);
              if (self.cbpJson)
                self.executionService.setStyleModelItem(self.executionService.styleModel);
            }
            if (filename.indexOf('style-image.json') > -1) {
              try {
                self.cbpService.styleImageJson = !isValidData ? (styleImageJson) : JSON.parse(fileData);
              } catch (er) {
                self.cbpService.styleImageJson = styleImageJson;
              }
            }
            if (filename.indexOf('layout.json') > -1) {
              try {
                self.layOutJson = !isValidData ? (layoutJson) : JSON.parse(fileData);
              } catch (er) {
                self.layOutJson = layoutJson;
              }
            }
            if (filename.indexOf('data.json') > -1) {
              const dataJson = !isValidData ? new DataJson() : JSON.parse(fileData);
              self.cbpService.dataJson = dataJson;
              self.verifyDataJson = dataJson;
              self.signatureState = false;
              self.cbpService.dataJson['isSavedDataJson'] = self.cbpService.dataJson?.dataObjects?.length > 0 ? true : false;
            }
            if (filename.indexOf('execution-order.json') > -1) {
              self.executionOrderJson = !isValidData ? new ExecutionOrderJson() : JSON.parse(fileData);
            }
            if (filename.indexOf('dynamic-section.json') > -1) {
              self.isFromCBPZip = true;
              self.cbpService.dynamicSectionInfo = !isValidData ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('protect.json') > -1) {
              self.isFromCBPZip = true;
              self.cbpService.protectJson = !isValidData ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('annotation.json') > -1) {
              self.annotateJson = !isValidData ? new AnnotateJson().init() : JSON.parse(fileData);
            }
            if (filename.indexOf('signature.json') > -1) {
              self.executionService.signatureJson = !isValidData ? [] : JSON.parse(fileData);
            }
            if (filename.indexOf('cbp.json') > -1) {
              let cbpJsonStringify = JSON.stringify(fileData);
              let parsedCBP = JSON.parse(cbpJsonStringify);
              self.cbpJson = JSON.parse(parsedCBP);
              self.cbpConstJson = JSON.parse(parsedCBP);
              self.cbpService.defaultSection = self.cbpJson?.section[0];
              self.cbpService.documentInfo = self.cbpJson?.documentInfo[0];
              self.cbpService.documentInfo['dateFormatNew'] = self.sharedviewService.getDateValue(self.cbpService.documentInfo?.dateFormat);
              self.cbpService.documentInfo['formatPlaceHolder'] = self.sharedviewService.getPlaceHolder(self.cbpService.documentInfo?.dateFormat);
              self.dataJsonService.setdatePlaceholderItem(self.cbpService.documentInfo);
            }
            names.push(filename);
            if (names.length == files.length) {
              let valid = names.includes('cbp.json') && names.includes('style/style.json') && names.includes('style/style-image.json') &&
                names.includes('style/layout.json') && names.includes('data/data.json') && names.includes('data/execution-order.json');
              if (!valid) { self.setDefaultJsons(names); }
              self.onExecuterInit();
              // self.dataJsonService.setDataJsonItem(self.cbpService.dataJson);
            }
          });
          zip.files[filename].async('blob').then(function (fileData) {
            if (filename.indexOf('media/') > -1) {
              if (fileData !== undefined) {
                self.cbpService.media.push(new File([fileData], filename));
                self.dataJsonService.setMediaItem(self.cbpService.media);
              }
            }
            if (filename.indexOf('attachment/') > -1) {
              if (fileData !== undefined) {
                self.attachment.push(new File([fileData], filename));
              }
            }
          });
        });
      });
    } else {
      this.cbpService.showSwalDeactive('please upload .cbp file only', 'warning', 'OK');
    }
  }

  setDefaultJsons(names: any) {
    const self = this;
    if (!names.includes('style/layout.json')) {
      self.layOutJson = layoutJson;
    }
    if (!names.includes('data/execution-order.json')) {
      self.executionOrderJson = new ExecutionOrderJson()
    }
    if (!names.includes('style/style-image.json')) {
      self.cbpService.styleImageJson = styleImageJson;
    }
    if (!names.includes('data/data.json')) {
      self.cbpService.dataJson = new DataJson();
      self.verifyDataJson = new DataJson();
    }
  }
  setTree(isReload: boolean) {
    this.cbpService.nodes = [];
    if (this.monitorExecutionData || isReload) {
      const isDynamicDocument = this.cbpJson.documentInfo[0]?.dynamicDocument === true;
      const dynamicDocValue = isDynamicDocument ? true : null;
      this.cbpJson = this.cbpService.refreshNodes(this.cbpJson, this.disableNumber, dynamicDocValue);
    }
    this.isTree = true;
  }
  treeObj: any = {};

  constructFormJsonBuildJson() {
    try {
      this.checkSecurityLevelRoles();
      if ((!this.cbpService.dataJson || !this.cbpService.dataJson['dataObjects'])) {
        this.cbpService.dataJson = new DataJson();
      }
      const self = this;
      if (this.cbpJson.documentInfo[0]['maxDgUniqueID']) {
        if (this.cbpService.uniqueIdIndex < Number(this.cbpJson.documentInfo[0]['maxDgUniqueID'])) {
          this.cbpService.uniqueIdIndex = Number(this.cbpJson.documentInfo[0]['maxDgUniqueID']);
        }
      }
      if (self.cbpService.dataJson?.dataObjects?.length > 0) {
        // self.cbpService.dataJson.dataObjects = self.sharedviewService.removeDuplicateJson(self.cbpService.dataJson.dataObjects);
        // self.verifyDataJson.dataObjects = self.sharedviewService.removeDuplicateJson(self.verifyDataJson.dataObjects);
        this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
        this.setDataJsonTxId();
      }
      self.executionService.setSignatureJson(self.cbpService.dataJson);
      self.executionService.setSignatureJson(self.verifyDataJson);
      this.disableNumber = this.layOutJson?.layout?.filter((item: any) => item.name === 'disableNumber');
      if (this.disableNumber?.length == 0)
        this.disableNumber = [{ name: 'disableNumber', disableNumber: false }];
      this.cbpJson = this.cbpService.refreshNodes(this.cbpJson, this.disableNumber)
      this.cbpService.setLevel(this.cbpJson.section);
      if (!this.styleJson) { this.styleJson = stylesJson; }
      this.applyLayOutChanges();
      this.executionService.setColorItem({ 'color': this.cbpJson.documentInfo[0]['color'] });
      this.executionService.styleModel = this.stylesService.applyStyles(new styleModel(), this.styleJson, stylesJson);
      this.executionService.setStyleModelItem(this.executionService.styleModel);
      this.cbpService.dynmaicDocument = false;
      if (this.cbpJson.documentInfo[0]['dynamicDocument']) {
        this.cbpService.dynmaicDocument = true;
        if (!this.cbpService.dynamicSectionInfo.dynamicObjects
          || (this.cbpService.dynamicSectionInfo?.dynamicObjects && this.cbpService.dynamicSectionInfo?.dynamicObjects?.length == 0)) {
          // this.dynamicSectionInfo.length = 0;
          this.checkDynamicSection();
        } else {
          this.mapDynamicSection();
          this.setDynamicSection('load');
        }
        this.setTreeUpdate();
      }
      if (this.cbpService.dataJson['dataObjects'].length === 0) {
        this.cbpService.dataJson.lastSessionUniqueId = 0;
        this.storeSectionStepArray(this.cbpJson.section, [], '');
        this.setHeaderInfo([]);
      } else {
        this.checkDocumentProtect();
        this.dataJsonUpdate('inital');
      }
      if (this.isReadOnlyExecution) { this.startCbpExecution(); }
      let start = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === DgTypes.StartExecution);
      if (start?.length === 0) { this.startCbpExecution(); }
      this.setLoader(false);
      this.setTree(false);
      this.setMenuBarFields(this.cbpJson.documentInfo[0]);
      if (this.cbpService.dataJson.dataObjects?.length > 1) {
        let tableInfo = this.cbpService.dataJson.dataObjects.filter((item: any) => (item.dgType === 'RowUpdated' || item.dgType === 'RowDeleted'));
        let tableInfoObj = tableInfo.filter((it: any) => it?.tableInfo);
        if (tableInfo?.length > 0 && tableInfoObj?.length > 0)
          // this.setTableExecuterRows(this.cbpJson.section, this.cbpService.dataJson);
          tableInfoObj.forEach((item: any) => {
            if (item.dgType === 'RowUpdated' && item.tableInfo.type !== 'delete') {
              try {
                let dgUniqueID = item.dgUniqueID.toString();
                let table = findAnd.returnFound(this.cbpJson.section, { dgUniqueID: dgUniqueID });
                if (table) {
                  this.setTableExecuterRows1(table, item);
                } else {
                  dgUniqueID = Number(item.dgUniqueID);
                  table = findAnd.returnFound(this.cbpJson.section, { dgUniqueID: dgUniqueID });
                  if (table) {
                    this.setTableExecuterRows1(table, item);
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
          });
        this.deleteRows(tableInfo);
        this.setTableMedia(this.cbpJson.section, this.cbpService.dataJson)
      }
      this.setPaginationIndex(this.cbpJson.section, this.cbpService.pageSize, null, self);
      self.mapDataJsonWithCbpJson(self.cbpService.dataJson);
      this.selectStepFromEvent(this.cbpService.stepSequentialArray);
      this.treeObj = JSON.parse(JSON.stringify(this.cbpJson));
      this.setTreeObject(this.treeObj);
      if (this.annotateJson?.annotateObjects?.length > 0) {
        // setTimeout(() => { this.setAnnotations(); }, 40);
        self.setAnnotations();
        setTimeout(() => { this.refreshAnnotations(); }, 1000);
      }
      this.sharedviewService.detectAll = true;
      this.loading = false;
    } catch (error) { console.log(error); }
  }
  mapDynamicSection() {
    if (this.cbpService.dynamicSectionInfo?.dynamicObjects?.length > 0) {
      for (let i = 0; i < this.cbpService.dynamicSectionInfo?.dynamicObjects.length; i++) {
        let obj = this.cbpService.dynamicSectionInfo.dynamicObjects[i];
        obj.dgUniqueIDList.forEach((ele, j) => {
          let cbpJSONObject: any = null;
          try {
            cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: ele });
            if (ele == '1') {
              cbpJSONObject = findAnd.returnFound(this.cbpJson.section, { dgSequenceNumber: '1.0' });
            }
            if (!cbpJSONObject) {
              cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: Number(ele) });
            }
          } catch (error) {
          }
          if (cbpJSONObject) {
            if (cbpJSONObject.length > 1) {
              cbpJSONObject.forEach((item: any) => {
                if (item.id === ele) {
                  cbpJSONObject = item
                }
              })
            }
            let dynamicObj = this.dynamicSectionInfo.find((k) => k.dgUniqueID == cbpJSONObject.dgUniqueID);
            if (dynamicObj) {
              dynamicObj.dynamic_number = obj.valueList[j];
              if (dynamicObj?.hide_section) {
                this.updateChildren(cbpJSONObject?.children, cbpJSONObject.hide_section);
              }
            } else {
              if ((cbpJSONObject.dgType === DgTypes.Section || cbpJSONObject.dgType === DgTypes.StepAction || cbpJSONObject.dgType === DgTypes.Timed || cbpJSONObject.dgType === DgTypes.Repeat)
                && cbpJSONObject?.dynamic_section) {
                if (cbpJSONObject?.hide_section)
                  this.updateChildren(cbpJSONObject?.children, cbpJSONObject.hide_section);
                this.dynamicSectionInfo.push(new DynamicSec(cbpJSONObject, i));
              }
            }
          }
        });
      }
    }
  }

  setTreeObject(cbpJson: any) {
    if (cbpJson.section?.length > 0) {
      for (let index = 0; index < cbpJson.section.length; index++) {
        const item = cbpJson.section[index];
        if (item.dgSequenceNumber) {
          this.executionService.deletePropForTreeStructure(item);
          if (item.children && item.children.length > 0) {
            this.setTreeObject(item);
          }
        } else {
          cbpJson.section = cbpJson.section.filter((k: any, l: any) => index != l);
          --index;
        }
      }
    } else if (cbpJson.children?.length > 0) {
      for (let index = 0; index < cbpJson.children.length; index++) {
        const item = cbpJson.children[index];
        if (item.dgSequenceNumber) {
          this.executionService.deletePropForTreeStructure(item);
          if (item.children && item.children.length > 0) {
            this.setTreeObject(item);
          }
        } else {
          cbpJson.children = cbpJson.children.filter((k: any, l: any) => index != l);
          --index;
        }
      }
    };
  }
  setTableMedia(section: any, dataJson: DataJson) {
    let tableMediaJson = dataJson.dataObjects.filter((i: any) => i.rowDgUniqueId && i.tableFigures && i.dgType == this.dgType.Figures);
    let deleteFigures = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === 'DeleteFigure');
    if (deleteFigures.length > 0) {
      tableMediaJson = this.executionService.removeDeletedFigures(tableMediaJson, deleteFigures)
    }
    tableMediaJson = this.cbpService.removeDuplicates(tableMediaJson, 'TxnId');
    tableMediaJson = this.cbpService.removeDuplicates(tableMediaJson, 'dgUniqueID');
    tableMediaJson.forEach((dataJsonItem: any) => {
      if (dataJsonItem.rowDgUniqueId && dataJsonItem.col > -1 && dataJsonItem.index > -1 && dataJsonItem.selectedStepDgUniqueId) {
        if (tableMediaJson.length > 0) {
          let rOWDGUniqueID = JSON.parse(JSON.stringify(dataJsonItem.rowDgUniqueId));
          const row = findAnd.returnFound(this.cbpJson.section, { dgUniqueID: rOWDGUniqueID });
          if (row && row.entry?.length > 0) {
            const column = row.entry[dataJsonItem.col];
            if (column) {
              column['children'] = !column['children'] ? [] : column['children'];
              if (column['children']?.length == 0) {
                column['children'].push(dataJsonItem)
              } else {
                column['children'] = this.tableService.insertArrayIndex(column['children'], dataJsonItem.index, dataJsonItem)
              }
            }
          }
        }
      } else {
        if (this.cbpJson.documentInfo[0].header.children.length) {
          const row = findAnd.returnFound(this.cbpJson.documentInfo[0].header.children, { dgUniqueID: dataJsonItem.rowDgUniqueId });
          if (row && row.entry?.length > 0) {
            const column = row.entry[dataJsonItem.col];
            if (column) {
              column['children'] = !column['children'] ? [] : column['children'];
              if (column['children']?.length == 0) {
                column['children'].push(dataJsonItem)
              } else {
                column['children'] = this.tableService.insertArrayIndex(column['children'], dataJsonItem.index, dataJsonItem)
              }
            }
          }
        }
        if (this.cbpJson.documentInfo[0].footer.children.length) {
          const row = findAnd.returnFound(this.cbpJson.documentInfo[0].footer.children, { dgUniqueID: dataJsonItem.rowDgUniqueId });
          if (row && row.entry?.length > 0) {
            const column = row.entry[dataJsonItem.col];
            if (column) {
              column['children'] = !column['children'] ? [] : column['children'];
              if (column['children']?.length == 0) {
                column['children'].push(dataJsonItem)
              } else {
                column['children'] = this.tableService.insertArrayIndex(column['children'], dataJsonItem.index, dataJsonItem)
              }
            }
          }
        }
        // else {
        //   const row = findAnd.returnFound(this.cbpJson.section, { dgUniqueID: dataJsonItem.rowDgUniqueId });
        //   if (row && row.entry?.length > 0) {
        //     const column = row.entry[dataJsonItem.col];
        //     if (column) {
        //       column['children'] = !column['children'] ? [] : column['children'];
        //       if (column['children']?.length == 0) {
        //         column['children'].push(dataJsonItem)
        //       } else {
        //         column['children'] = this.tableService.insertArrayIndex(column['children'], dataJsonItem.index, dataJsonItem)
        //       }
        //     }
        //   }
        // }
      }
    });
  }

  setDataJsonTxId() {
    if (this.cbpService.dataJson?.dataObjects?.length > 0) {
      // this.cbpService.dataJsonTxnIDS.dataJsonTxnId = new Date().getTime();
    } else {
      this.cbpService.dataJson = new DataJson();
      this.cbpService.dataJson.dataObjects = [];
      this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
    }
  }

  deleteRows(rowsToDelete: any[]) {
    rowsToDelete.forEach((rowInfo) => {
      if (rowInfo?.tableInfo?.type == 'delete') {
        let table = findAnd.returnFound(this.cbpJson.section, { dgUniqueID: rowInfo.dgUniqueID });
        if (table) {
          if (!Array.isArray(table)) {
            if (table.calstable[0]?.table?.tgroup?.tbody[0]?.row?.length > 0) {
              let originalIndex = table.calstable[0].table.tgroup.tbody[0].row.findIndex((i: any) => i.dgUniqueID == rowInfo.tableInfo.rowDgUniqueID);
              if (originalIndex > -1) {
                table.calstable[0].table.tgroup.tbody[0].row.splice(originalIndex, 1);
              }
            }
          } else {
            for (let index = 0; index < table.length; index++) {
              if (table[index].dgType == DgTypes.Form) {
                if (table[index].calstable[0]?.table?.tgroup?.tbody[0]?.row?.length > 0) {
                  let originalIndex = table[index].calstable[0].table.tgroup.tbody[0].row.findIndex((i: any) => i.dgUniqueID == rowInfo.tableInfo.rowDgUniqueID);
                  if (originalIndex > -1) {
                    table[index].calstable[0].table.tgroup.tbody[0].row.splice(originalIndex, 1);
                  }
                }
                break;
              }
            }
          }
        }
      }
    });
  }
  /*
   MAPPING DATA.JSON with CBP>JSON
  */
  mapDataJsonWithCbpJson(res: any) {
    let consilidatedProtectObj = this.buildConsilidatedProtectObj();
    this.settingCheckBoxProtection(consilidatedProtectObj);
    if (res && res != '{}' && res['dataObjects'] && res['dataObjects'].length > 0) {
      res['dataObjects'].forEach((valueObj: any) => {
        let cbpJSONObject: any = null;
        try {
          cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: valueObj.dgUniqueID });
          if (Array.isArray(cbpJSONObject)) {
            cbpJSONObject = cbpJSONObject.find((i: any) => i.dgType == valueObj.dgType);
          }
          if (!cbpJSONObject) {
            cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: Number(valueObj.dgUniqueID) });
          }
        } catch (error) {
        }
        try {
          if (cbpJSONObject && valueObj.dgUniqueID) {
            if (consilidatedProtectObj.dgUniqueIDProtectList.includes(cbpJSONObject.dgUniqueID.toString())) {
              cbpJSONObject['protect'] = true;
            }
            if (consilidatedProtectObj.dgUniqueIDUnProtectList.includes(cbpJSONObject.dgUniqueID.toString())) {
              cbpJSONObject['protect'] = false;
            }
            if (this.executionService.isDataEntry(cbpJSONObject)) {
              if (cbpJSONObject.dgType === DgTypes.CheckboxDataEntry) {
                valueObj = Array.isArray(valueObj) ? valueObj : [valueObj];
                if (valueObj.length > 0) {
                  if (typeof valueObj[valueObj.length - 1].value == 'string') {
                    cbpJSONObject['storeValue'] = valueObj[valueObj.length - 1].value == "true" ? true : false;
                  } else if (typeof valueObj[valueObj.length - 1].value == 'boolean') {
                    cbpJSONObject['storeValue'] = valueObj[valueObj.length - 1].value;
                  } else {
                    cbpJSONObject['storeValue'] = cbpJSONObject?.selected ? true : false
                  }
                }
                valueObj = valueObj[valueObj.length - 1];
              }
              cbpJSONObject.storeValue = valueObj.value;
              this.antlrService.callBackObject.initExecution(cbpJSONObject.dgUniqueID, this.cbpService.removeHTMLTags(cbpJSONObject?.storeValue));
              cbpJSONObject.oldValue = valueObj.oldValue ? valueObj.oldValue : cbpJSONObject.storeValue;
            }
            if (this.executionService.messageCondition(cbpJSONObject)) {
              cbpJSONObject = this.sharedviewService.setMessageValues(cbpJSONObject, [valueObj]);
              this.checkDuplicateUserExecution([valueObj]);
            }
            if (this.executionService.checkDataEntryDgTypes(cbpJSONObject) ||
              cbpJSONObject.dgType === DgTypes.SignatureDataEntry || cbpJSONObject.dgType === DgTypes.InitialDataEntry) {
              if (cbpJSONObject.dgType === DgTypes.NumericDataEntry) {
                cbpJSONObject['isError'] = false;
                if (cbpJSONObject['defaultValue']) { cbpJSONObject['isLoadedFromJson'] = true }
              }
              if (cbpJSONObject.dgType === DgTypes.InitialDataEntry) {
                this.sharedviewService.setDefaultInitial(cbpJSONObject, [valueObj]);
                if (cbpJSONObject?.initialStore && !this.refreshProtectFields) {
                  this.refreshProtectFields = true;
                }
              } else if (cbpJSONObject.dgType === DgTypes.SignatureDataEntry) {
                this.sharedviewService.setDefaultSignature(cbpJSONObject, [valueObj]);
                if (cbpJSONObject?.signatureValue && !this.refreshProtectFields) {
                  this.refreshProtectFields = true;
                }
              } else if (cbpJSONObject.dgType === DgTypes.CheckboxDataEntry) {
                this.sharedviewService.setDefaultCheckbox(cbpJSONObject, [valueObj]);
              } else {
                if (valueObj) {
                  cbpJSONObject['approveList'] = (valueObj?.approveList ? valueObj?.approveList : []);
                  cbpJSONObject['innerHtmlView'] = true;
                  if (cbpJSONObject.dgType === DgTypes.TextAreaDataEntry) {
                    if (valueObj?.height) {
                      cbpJSONObject['height'] = valueObj?.height;
                    }
                  }
                  if (cbpJSONObject?.protect && cbpJSONObject['storeValue'] !== '') {
                    if (cbpJSONObject?.protect) {
                      cbpJSONObject['comments'] = valueObj?.comments ? valueObj?.comments : '';
                      cbpJSONObject['approveList'] = valueObj?.approveList ? valueObj?.approveList : [];
                      cbpJSONObject['commentsEnabled'] = cbpJSONObject['comments'] === '' ? false : true;
                      cbpJSONObject['isCommentUpdated'] = cbpJSONObject['comments'] === '' ? false : true;
                      cbpJSONObject['protectColor'] = valueObj?.protectColor;
                      if (cbpJSONObject['protect'] && cbpJSONObject['isCommentUpdated']) {
                        this.sharedviewService.showComments = true;
                      }
                    }
                  }
                  if (cbpJSONObject['storeValue'] && this.cbpService.isHTMLText(cbpJSONObject['storeValue'])) {
                    cbpJSONObject['innerHtmlView'] = true;
                  }
                }
                cbpJSONObject['protectOldValue'] = this.setProtectOldObjectValue(valueObj, '', cbpJSONObject);
                cbpJSONObject['styleSet'] = this.sharedviewService.setStyleValue(valueObj, {});
                if (cbpJSONObject['innerHtmlView']) {
                  if (cbpJSONObject?.dgType == DgTypes.TextDataEntry && cbpJSONObject?.dataType == "Dropdown" && cbpJSONObject?.choice?.length > 0) {
                    cbpJSONObject.storeValue = this.cbpService.removeHTMLTags(cbpJSONObject.storeValue);
                    cbpJSONObject['styleSet'] = valueObj?.styleSet;
                    let fontSize = valueObj?.styleSet?.fontsize;
                    if (!fontSize?.toString()?.includes('px')) {
                      cbpJSONObject['styleSet'].fontsize = this.stylesService.getFontStyles(fontSize ? fontSize : 2);
                    }
                  }
                }
                if (cbpJSONObject?.valueType == DgTypes.Derived && (cbpJSONObject.dgType == DgTypes.NumericDataEntry || cbpJSONObject.dgType == DgTypes.TextDataEntry) && cbpJSONObject?.storeValue != '') {
                  cbpJSONObject['styleSet'] = valueObj?.styleSet;
                  cbpJSONObject['color'] = valueObj?.styleSet?.fontcolor ? valueObj?.styleSet?.fontcolor : '#000000'
                  cbpJSONObject['innerHtmlView'] = false;
                }
              }
              this.checkDuplicateUserExecution([valueObj]);
            }
            if (cbpJSONObject.dgType === DgTypes.Figures) {
              this.cbpService.mediaBuilderObjects = [...this.cbpService.mediaBuilderObjects, ...cbpJSONObject.images];
              this.cbpService.mediaBuilderObjects = this.sharedviewService.removeDuplicates(this.cbpService.mediaBuilderObjects, 'fileName');
              cbpJSONObject = this.setImageCaption(res['dataObjects'], cbpJSONObject);
            }
            if (cbpJSONObject.dgType === DgTypes.VerificationDataEntry) {
              if (valueObj['loginType'] == 'signature') {
                cbpJSONObject['authenticator'] = valueObj?.authenticator;
              }
            }
          }
        } catch (error) {
          console.log(cbpJSONObject, valueObj);
        }
        this.cdref.detectChanges();
      });
      this.setMediaCrItems(this.cbpJson.section, res['dataObjects']);
    } else {
      this.initializeStepSections();
    }
    this.cdref.detectChanges();
  }
  settingCheckBoxProtection(protectJson: any) {
    protectJson.dgUniqueIDProtectList.forEach((valueObj: any) => {
      let cbpJSONObject: any = null;
      try {
        cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: valueObj });
        if (!cbpJSONObject) {
          cbpJSONObject = findAnd.returnFound(this.cbpJson, { dgUniqueID: Number(valueObj) });
        }
      } catch (error) {
      }
      if (cbpJSONObject && valueObj && cbpJSONObject.dgType == 'CheckboxDataEntry') {
        cbpJSONObject['protect'] = true;
      }
    })
  }
  buildConsilidatedProtectObj() {
    let dgUniqueIDProtectList: Array<any> = [];
    let dgUniqueIDUnProtectList: Array<any> = [];
    if (this.cbpService.protectJson) {
      this.cbpService.protectJson.protectObjects?.forEach((po: ProtectObject) => {
        if (po.dgUniqueIDProtectList && po.dgUniqueIDProtectList.length > 0) {
          po.dgUniqueIDProtectList.forEach((dgUniqueID: any) => {
            if (dgUniqueIDProtectList.findIndex((i: any) => i == dgUniqueID) == -1) {
              dgUniqueIDProtectList.push(dgUniqueID);
            }
            if (dgUniqueIDUnProtectList.findIndex((i: any) => i == dgUniqueID) > -1) {
              const index = dgUniqueIDUnProtectList.findIndex((i: any) => i == dgUniqueID);
              if (index > -1) { // only splice array when item is found
                dgUniqueIDUnProtectList.splice(index, 1); // 2nd parameter means remove one item only
              }
            }
          });
        }
        if (po.dgUniqueIDUnProtectList && po.dgUniqueIDUnProtectList.length > 0) {
          po.dgUniqueIDUnProtectList.forEach((dgUniqueID: any) => {
            if (dgUniqueIDUnProtectList.findIndex((i: any) => i == dgUniqueID) == -1) {
              dgUniqueIDUnProtectList.push(dgUniqueID);
            }
            if (dgUniqueIDProtectList.findIndex((i: any) => i == dgUniqueID) > -1) {
              const index = dgUniqueIDProtectList.findIndex((i: any) => i == dgUniqueID);
              if (index > -1) { // only splice array when item is found
                dgUniqueIDProtectList.splice(index, 1); // 2nd parameter means remove one item only
              }
            }
          });
        }
      });
    }
    return {
      dgUniqueIDProtectList: dgUniqueIDProtectList,
      dgUniqueIDUnProtectList: dgUniqueIDUnProtectList
    }
  }

  setMediaCrItems(objects: any, res: any) {
    for (let i = 0; i < objects.length; i++) {
      let item = objects[i];
      if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo) {
        item = this.sectionDataJson(item, res);
      }
      if (this.executionService.stepActionCondition(item)) {
        item = this.stepDataJson(item, res);
      }
      item = this.newObjectCheckCRMediacomment(item, res);
      if (item.dgType === DgTypes.Form) {
        let findTables = res.filter((data: any) => data?.tableDgUniqueID === item.dgUniqueID && data?.tableRuleExecution);
        this.setTableRuleExecution(findTables, item);
      }
      if (item?.children && Array.isArray(item?.children)) {
        let galleryEnabled = item?.children.filter((dataentry: any) => dataentry?.dgType === DgTypes.Figures);
        objects[i]['galleryEnabled'] = galleryEnabled?.length > 0 ? true : false;
      }
      if (!this.cbpJson.section[i]?.isChecked && this.executionService.stepActionCondition(this.cbpJson.section[i]) && this.cbpService.currentStep === undefined) {
        this.setNewStepObject(this.cbpJson.section[i]);
      }
      this.setIsCheckedValues(item);
      if (this.dataJsonService.errorMessage) {
        this.cbpService.notiferMessage('error', 'Duplicate Execution found in Section/Section ' + item.number + ' with user,' + this.executionService.selectedUserName)
        this.errorMessage({ error: 'Conflict DataJson API' })
        return;
      }
      if (objects[i]?.children && objects[i]?.children?.length > 0) {
        this.setMediaCrItems(objects[i]?.children, res);
      }
    }
  }

  checkDuplicateUserExecution(dataObject: any) {
    if (this.menuConfig.isPreProcessorEnabled) {
      if (dataObject.length > 0 && this.sharedviewService.containsDuplicates(dataObject)) {
        this.dataJsonService.errorMessage = true;
      }
    }
  }

  setProtectOldObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      defaultValue = valueObj.length > 1 ? valueObj[valueObj.length - 2]?.oldValue : valueObj[valueObj.length - 1].value;
    }
    return defaultValue;
  }
  setOldObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      defaultValue = valueObj.length > 1 ? valueObj[valueObj.length - 2].value : valueObj[valueObj.length - 1].value;
    }
    return defaultValue;
  }

  setObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      this.antlrService.callBackObject.initExecution(stepObj.dgUniqueID, valueObj[valueObj.length - 1].value);
    }
    return valueObj && valueObj.length > 0 ? valueObj[valueObj.length - 1].value : defaultValue;
  }
  setTableRuleExecution(list: any, cbpJsonObject: any) {
    for (let i = 0; i < list.length; i++) {
      let obj = list[i];
      if (obj.tableRuleExecution) {
        if (obj?.dgType === 'updateRows')
          this.updateRows(obj.ruleValid, obj.row, obj.col, cbpJsonObject);
        if (obj?.dgType === 'disableColumn')
          this.updateCurrentColumn(obj.row, obj.col, obj.attr, obj.ruleValid, cbpJsonObject);
        if (obj?.dgType === 'Disable' || obj?.dgType === 'Enable') {
          this.updateCurrentColumn(obj.row, obj.col, obj.attr, obj.ruleValid, cbpJsonObject);
        }
        if (obj?.dgType === 'Message') {
          this.storeMessages.push(obj.message);
        }
      }
    }
    if (this.storeMessages?.length > 0) { this.callMessages(this.storeMessages); }
  }
  callMessages(messages: any) {
    const messageQue: any = [];
    messages.forEach((item: any, i: any) => {
      messageQue.push({
        title: messages[i], customClass: 'swal-wide swal-height',
        showCancelButton: false, confirmButtonText: 'OK'
      });
    });
    swal.queue(messageQue);
    this.storeMessages = [];
  }
  updateRows(isEnableBelowRows: boolean, rowNo: number, col: number, cbpJsonObject: any) {
    let rowdata = cbpJsonObject.calstable[0].table.tgroup.tbody[0].row;
    for (let l = 0; l < rowdata.length; l++) {
      if (rowNo < l) {
        this.setProtectOrUnProtect(rowdata[l].entry, isEnableBelowRows, l, col, cbpJsonObject);
      }
    }
  }
  setProtectOrUnProtect(entryObj: any, bol: boolean, l: number, col: number, cbpJsonObject: any) {
    for (let m = 0; m < entryObj?.length; m++) {
      if (entryObj[m]) {
        const object = cbpJsonObject.calstable[0].table.tgroup.tbody[0].row[l].entry[col];
        for (let k = 0; k < object.children.length; k++) {
          object.children[k]['protect'] = bol;
          object.children[k]['disableField'] = bol;
        }
      }
    }
  }
  updateCurrentColumn(rowNo: number, col: number, attr: number, bol: boolean, tableObj: any) {
    const object = tableObj.calstable[0].table.tgroup.tbody[0].row[rowNo].entry[col];
    if (attr) {
      object.children[attr]['protect'] = bol;
      object.children[attr]['disableField'] = bol;
    } else {
      for (let k = 0; k < object.children.length; k++) {
        object.children[k]['protect'] = bol;
        object.children[k]['disableField'] = bol;
      }
    }
  }

  setImageCaption(objects: any, stepObject: any) {
    let updateFigures = objects.filter((item: any) => item.dgType === 'UpdateFigure');
    for (let i = 0; i < stepObject.images?.length; i++) {
      let selectedFile = updateFigures.filter((file: any) => file.name === stepObject.images[i].name);
      if (selectedFile?.length > 0)
        stepObject.images[i].caption = selectedFile[selectedFile.length - 1].caption;
    }
    return stepObject;
  }
  sectionDataJson(item: any, dataObject: any) {
    if (dataObject && dataObject?.length > 0) {
      const newSectionObject = dataObject.filter((x: any) => x.dgUniqueID == item.dgUniqueID && x.dgType == DgTypes.Section);
      if (newSectionObject.length > 0) {
        item = this.setNotApplicableItem(item, newSectionObject);
        this.checkDuplicateUserExecution(newSectionObject);
      }
      if (item.acknowledgementReqd) {
        item.acknowledgementReqd = true;
        item['createdBy'] = '';
        const objectData = dataObject.filter((x: any) => x.dgUniqueID == item.dgUniqueID);
        if (objectData && objectData.length > 0) {
          item.isTapped = 2;
          item['isChecked'] = true;
          item.options = new StepOption();
          item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
          item.options.complete = true;
        } else {
          item.isChecked = false;
        }
      }
      if (Array.isArray(newSectionObject) && newSectionObject?.length > 0) {
        if (newSectionObject[newSectionObject.length - 1]?.status === this.stepTypes.SkipStep) {
          item.options = new StepOption();
          item = this.sharedviewService.setStepActionStatus(item, newSectionObject[newSectionObject.length - 1], true);
          item.options.skip = true;
          this.sharedviewService.colorNodes.push({ 'dgUniqueID': item.dgUniqueID, type: 'silver', loaded: false });
          item = this.sharedviewService.setDropDownValues(item, false, false, false, false, true);
          item = this.protectOrUnProtectDataEntries(item, true, 'skip');
        }
      }
    }
    return item;
  }

  stepDataJson(item: any, dataObject: any) {
    if (item && dataObject && dataObject?.length > 0) {
      const objectData = dataObject.filter((x: any) => (x.dgUniqueID == item.dgUniqueID || x['selectedStepDgUniqueID'] == item.dgUniqueID ||
        x['selectedStepDgUniqueId'] == item.dgUniqueID) && (this.executionService.stepActionCondition(x) || x.dgType === DgTypes.UndoComment ||
          (x.dgType == DgTypes.UndoAuthorization && x?.status == DgTypes.UndoStep) && !this.executionService.messageCondition(x)));
      this.dataJsonService.errorMessage = false;
      this.checkDuplicateUserExecution(dataObject);
      if (!this.dataJsonService.errorMessage) {
        if (objectData && objectData.length > 0) {
          const isRepeatOrTimedOrDelayStep = item?.dgType === DgTypes.DelayStep || item?.dgType === DgTypes.Timed || item?.dgType === DgTypes.Repeat;
          if (objectData[objectData.length - 1].status?.toLowerCase()?.includes('complete') ||
            objectData[objectData.length - 1].status === this.stepTypes.CompleteStep) {
            if (this.executionService.stepActionCondition(objectData[objectData.length - 1])) {
              const latestDataObj = objectData[objectData.length - 1];
              if (objectData[objectData.length - 1]?.dgType === DgTypes.Repeat && objectData[objectData.length - 1]?.repeatTime?.toString() != item?.repeatTimes?.toString()) {
                item['currentRepeatTimes'] = Number(objectData[objectData.length - 1]?.repeatTime);
                item = this.repeatStepStartAgain(item);
                return item;
              }
              if (item?.isParentRepeatStep && latestDataObj?.isParentRepeatStep) {
                let parentRepetStep = this.getParentRepeatStepObj(item);
                if (!this.hasRepeatStepStarted(item, dataObject, latestDataObj, parentRepetStep)) {
                  if (parentRepetStep) {
                    parentRepetStep = this.repeatStepStartAgain(parentRepetStep);
                  }
                }
                if (latestDataObj?.totalRepeatTimes?.toString() != latestDataObj?.repeatTime?.toString() && this.isParentRepeatStepCompletedOnce(item, dataObject, latestDataObj, parentRepetStep)) {
                  return item;
                }
              }
              item.options = new StepOption();
              item['isTapped'] = 2;
              item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
              item.options.complete = true;
              item = this.protectOrUnProtectDataEntries(item, true, 'complete');
            }
          }
          if (objectData[objectData.length - 1].status === this.stepTypes.InProgressStep) {
            if (objectData[objectData.length - 1]?.dgType == DgTypes.Repeat && objectData[objectData.length - 1]?.dgUniqueID?.toString() == item?.dgUniqueID?.toString() && objectData[objectData.length - 1]?.repeatTime != '0') {
              item = this.repeatStepStartAgain(item);
              return item;
            }
            item.options = new StepOption();
            item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
            if (isRepeatOrTimedOrDelayStep) {
              item.isChecked = false;
              item.isTapped = 1;
            }
            item.options.inProgress = true;
            this.sharedviewService.applyColorToNode(item, 'lightblue');
            this.sharedviewService.colorNodes.push({ 'dgUniqueID': item.dgUniqueID, type: 'lightblue', loaded: false });
            item = this.sharedviewService.setDropDownValues(item, true, false, false, false, false);
            if (item?.dgType == DgTypes.DelayStep && item?.allowedtoStop && objectData[objectData.length - 1]?.currentDelayTime) {
              item['delayTime'] = objectData[objectData.length - 1]?.currentDelayTime
            }
          }
          if (objectData[objectData.length - 1].status === this.stepTypes.HoldStep) {
            item.options = new StepOption();
            item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
            item.options.hold = true;
            if (isRepeatOrTimedOrDelayStep) {
              item.isChecked = false;
              item.isTapped = 1;
            }
            this.sharedviewService.colorNodes.push({ 'dgUniqueID': item.dgUniqueID, type: 'yellow', loaded: false });
            this.sharedviewService.applyColorToNode(item, 'yellow');
            item = this.sharedviewService.setDropDownValues(item, false, false, true, false, false);
          }
          if (objectData[objectData.length - 1].status === this.stepTypes.NotApplicableStep) {
            item.options = new StepOption();
            if (this.validateRepeatStepChildCompletion(item, dataObject, objectData[objectData.length - 1])) {
              item.isChecked = false;
              return item;
            }
            item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
            item.options.notApplicable = true;
          }
          if (objectData[objectData.length - 1].status === this.stepTypes.SkipStep) {
            item.options = new StepOption();
            if (this.validateRepeatStepChildCompletion(item, dataObject, objectData[objectData.length - 1])) {
              return item;
            }
            item = this.sharedviewService.setStepActionStatus(item, objectData[objectData.length - 1], true);
            item.options.skip = true;
            this.sharedviewService.colorNodes.push({ 'dgUniqueID': item.dgUniqueID, type: 'silver', loaded: false });
            item = this.sharedviewService.setDropDownValues(item, false, false, false, false, true);
            item = this.protectOrUnProtectDataEntries(item, true, 'skip');
          }
          if (objectData[objectData.length - 1].status === DgTypes.UndoStep) {
            item.options = new StepOption();
            item.isChecked = false;
            item = this.sharedviewService.stepActionInitialize(item);
          }
          // item['statusDate'] = objectData[objectData.length - 1]['createdDate'];
          if (typeof item === 'object' && item !== null) {
            item['statusDate'] = objectData[objectData.length - 1]['createdDate'];
          }
        } else {
          item.isChecked = false;
        }
      }
    }
    return item;
  }
  validateRepeatStepChildCompletion(stepObject: any, dataObjects: any, latestObject: any) {
    if (stepObject?.isParentRepeatStep && latestObject?.isParentRepeatStep) {
      let parentRepetStep = this.getParentRepeatStepObj(stepObject);
      if (latestObject?.totalRepeatTimes?.toString() != latestObject?.repeatTime?.toString() && this.isParentRepeatStepCompletedOnce(stepObject, dataObjects, latestObject, parentRepetStep)) {
        return true;
      }
      return false;
    }
    return false;
  }

  newObjectCheckCRMediacomment(object: any, dataObject: any) {
    const newObject = dataObject.filter((x: any) => x.selectedStepDgUniqueId == object.dgUniqueID);
    if (newObject.length > 0) {
      newObject.forEach((item: any) => {
        if (item.dgType === DgTypes.ChangeRequest || item.dgType === DgTypes.deleteChangeRequest) {
          let obj = Number(item['action']) === ActionId.Delete ? false : true;
          object['isCRAvailable'] = obj;
        }
        if (item.dgType === DgTypes.Comment || item.dgType === DgTypes.DeleteComment || item.dgType === "deleteComment") {
          let obj = Number(item['action']) === ActionId.Delete ? false : true;
          object['isCommentAvailable'] = obj;
        }
        if (item.dgType === DgTypes.OrderChange) {
          object = this.sharedviewService.setSectionValues(object, true);
        }
        if (item.dgType === DgTypes.EditText) {
          object = this.sharedviewService.setEditTextValues(object, item);
        }
        if (item.dgType === DgTypes.Figures) {
          let deleFigures = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === 'DeleteFigure');
          let updateFigures = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === 'UpdateFigure');
          item.images = this.cbpService.removeDuplicates(item.images, 'fileName');
          if (deleFigures.length > 0) {
            item.images = this.executionService.removeDuplicatesFromTwoArrays(item.images, deleFigures);
          }
          if (object?.children) {
            let duplicate = object?.children.filter((itemim: any) => (itemim?.TxnId == item?.TxnId && itemim.dgType === DgTypes.Figures));
            object.children = object?.children?.length > 0 ? object?.children : []
            if (duplicate.length === 0) {
              if (updateFigures.length > 0) {
                item = this.checkItemSize(item, updateFigures);
              }
              item.images.forEach((imageObj: any) => {
                let obj = updateFigures.filter((update: any) => update.fileName == imageObj.fileName);
                if (obj?.length > 1)
                  imageObj.caption = obj[obj.length - 1].caption;
              });
              if (!item.tableFigures) {
                if (item?.images?.length > 0)
                  object?.children?.push(item);
                // object['dataEntryEnabled'] = item?.images?.length > 0 ? true : false;
                object['dataEntryEnabled'] = true;
              }
              this.cbpService.mediaExecutorObjects = [...this.cbpService.mediaExecutorObjects, ...item.images]
              this.cdref.detectChanges();
            }
          }
        }
        if (this.executionService.messageCondition(item)) {
          object = this.sharedviewService.setMessageValues(object, item);
        }
      });
      this.checkDuplicateUserExecution(newObject);
      this.sharedviewService.isViewUpdated = true;
      this.sharedviewService.detectAll = true;
    }
    return object;
  }

  setNewStepObject(obj: any) {
    try {
      if (obj !== undefined) {
        this.cbpService.currentStep = obj.dgUniqueID;
        this.cbpService.selectedElement = JSON.parse(JSON.stringify(obj));
        setTimeout(() => {
          if (obj.dgUniqueID != "1")
            this.executionService.isClickedCurrentStep = false;
          this.notifyParenFormPage('execution', obj, obj.dgUniqueID, true);
          this.cdref.detectChanges();
        }, 1000);
      }
    } catch (error) { console.log(error); }
  }

  notifyParenFormPage(stepType: any, stepObject: any, selectedId: any, isUndo: any) {
    this.getFormViewEvent({
      'type': stepType,
      'selectedDgUniquId': selectedId,
      'object': stepObject,
      'selectedNode': stepObject.number,
      'undoComment': isUndo
    });
  }

  setIsCheckedValues(stepObject: any) {
    try {
      const indexStep = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === stepObject.dgUniqueID);
      if (indexStep !== -1) { this.cbpService.stepActionArray[indexStep] = stepObject; }
      const indexSeq = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgUniqueID === stepObject.dgUniqueID);
      if (indexSeq !== -1) { this.cbpService.stepSequentialArray[indexSeq] = stepObject; }
    } catch (error) { console.log('ischecked not available'); }
  }

  initializeStepSections() {
    this.cbpJson?.section?.forEach((item: any) => {
      if (item.dgSequenceNumber && item.dgSequenceNumber.endsWith('.0')) {
        this.executionService.setValueIndent = 1;
      }
      if (item['isIndent'] && (item['isIndent'] === true)) {
        (item.children.forEach((item: any) => { item.indentLevel = this.executionService.setValueIndent; }));
      }
      if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo) {
        if (item.acknowledgementReqd) {
          item['isChecked'] = false;
          item.acknowledgementReqd = true;
          item['createdBy'] = '';
          item = this.sharedviewService.setStepActionStatus(item, [], false);
        } else {
          item = this.sharedviewService.commentCrintialize(item);
        }
        if (!item['options']) { item['options'] = new StepOption(); }
        item = this.sharedviewService.setSectionValues(item, false);
      }
      if (this.executionService.stepActionCondition(item)) {
        item = this.sharedviewService.stepActionInitialize(item);
        item = this.sharedviewService.commentCrintialize(item);
        if (!item['options']) { item['options'] = new StepOption(); }
        item.isTapped = 0;
        if (item.dgType === DgTypes.Timed) {
          if (item.children && item.children.length > 0) {
            item = this.sharedviewService.timedChildren(item);
          }
        }
      }
      if (item?.children?.length > 0) {
        let dataEntryEnabled = item?.children.filter((dataentry: any) => this.executionService.isDataEntry(dataentry));
        item['dataEntryEnabled'] = dataEntryEnabled?.length > 0 ? true : false;
        let galleryEnabled = item?.children.filter((dataentry: any) => dataentry?.dgType === DgTypes.Figures);
        item['galleryEnabled'] = galleryEnabled?.length > 0 ? true : false;
        this.cdref.detectChanges();
      }
    });
    this.cdref.detectChanges();
  }

  alertsValidation: boolean = false;

  protectOrUnProtectDataEntries(stepObject: any, bol: boolean, type: string) {
    if (stepObject.children.length > 0) {
      if (this.sharedviewService.hasAnyAlertMessages(stepObject)) { this.alertsValidation = true; return false; }
      for (let i = 0; i < stepObject.children.length; i++) {
        if (this.executionService.checkDataEntryDgTypes(stepObject.children[i]) || stepObject.children[i].dgType === DgTypes.SignatureDataEntry
          || stepObject.children[i].dgType === DgTypes.InitialDataEntry) {
          stepObject.children[i]['disableField'] = bol;

          if (stepObject.children[i].storeValue !== '' && stepObject.children[i]?.storeValue) {
            stepObject.children[i]['protect'] = bol;
            stepObject.children[i]['oldValue'] = stepObject.children[i]['storeValue'];
            stepObject.children[i]['protectOldValue'] = stepObject.children[i]['storeValue'];
          }
          if (type === 'complete') {
            stepObject.children[i]['disableField'] = true;
            stepObject.children[i]['protect'] = bol;
          }
        }
        if (stepObject.children[i].dgType === DgTypes.Form) {
          let typeInfo = { type: 'protectDataEntries', value: bol };
          this.cbpService.setDefaultCBPTableChanges(stepObject.children[i], typeInfo);
        }
      }
    }
    return stepObject;
  }
  checkItemSize(imageFile: any, updateImageList: any) {
    imageFile.images.forEach((element: any) => {
      let files = updateImageList.filter((item: any) => item.fileName === element.fileName);
      if (files?.length > 0) {
        element.height = files[files.length - 1].height;
        element.width = files[files.length - 1].width;
      }
    });
    return imageFile;
  }
  /*
    END OF MAPPING
  */
  dataJsonUpdate(type: string) {
    this.reUpdateCbpJsonWithDataJson(type);
    this.setHeaderInfo(this.cbpService.dataJson.dataObjects);
    this.setDetailsTabInfo();

  }
  setHeaderInfo(dataObjects: any) {
    this.cbpJson.documentInfo[0].header.children = this.clearUnUsedFields(this.cbpJson.documentInfo[0].header.children);
    this.cbpJson.documentInfo[0].footer.children = this.clearUnUsedFields(this.cbpJson.documentInfo[0].footer.children);
    if (this.cbpJson.documentInfo[0]?.coverPageData) {
      this.cbpService.setDefaultCBPTableChanges(this.cbpJson.documentInfo[0]?.coverPageData, { type: 'BuilderImages', protect: false, dataObject: [], headerProtect: false }, null, new ProtectObject().init());
      this.cbpService.mediaBuilderObjects = this.sharedviewService.removeDuplicates(this.cbpService.mediaBuilderObjects, 'fileName');
    }
  }

  checkSecurityLevelRoles() {
    if (this.isMobile) {
    } else {
      if (this.cbpJson['documentInfo']) {
        if (this.executionService.hasDocumentSecurityRoleQual(this.cbpJson.documentInfo[0])) {
          this.isFromCheckRoles = true;
          let evt: Request_Msg = { eventType: EventType.userCBPInfo, msg: { userId: this.executionService.selectedUserId }, datajson: '' };
          this.datashareService.sendMessageFromLibToOutside(evt);
        }
      }
    }
  }
  setFreezePage(isFreeze: any) {
    this.freezePage = isFreeze;
    this.entirePageFreeze = isFreeze;
    this.freezeCompletePage = isFreeze;
    if (isFreeze) {
      this.cbpService.showSwalDeactive(AlertMessages.invalidRole, 'warning', 'OK');
      this.executionType.Read = true;
      this.executionType.Execute = false;
      this.stopCbpExecution = isFreeze;
      this.executerModes.viewMode = isFreeze;
      this.executerModes = JSON.parse(JSON.stringify(this.executerModes));
      this.executionType = JSON.parse(JSON.stringify(this.executionType));
      this.stopCbpExecution = JSON.parse(JSON.stringify(this.stopCbpExecution));
    }
  }
  setDetailsTabInfo() {
    this.getCommentsAndCrInfo(this.cbpService.dataJson.dataObjects);
  }
  mediaFileObjects(event: any) {
    this.cbpService.media = [...this.cbpService.media, ...event.mediaBlob];
    this.cbpService.media = this.sharedviewService.removeDuplicates(this.cbpService.media, 'name');
  }
  headerFooterEvent(hide: any) {
    if (hide === 'footer') {
      this.cbpService.selectedElement = this.cbpJson?.documentInfo[0]?.header;
      this.cbpService.currentStep = -1;
    }
    if (hide === 'header') {
      this.cbpService.selectedElement = this.cbpJson?.documentInfo[0]?.footer;
      this.cbpService.currentStep = -2;
    }
    if (this.treeView) {
      this.treeView.deselectNodes();
    }
    this.headerFooterSelected = true;
  }
  selectedObject(obj: any, type: string) {
    let newObj = obj;
    if (type == 'scroll') {
      this.getLastStepObjet(obj);
      newObj = this.lastChildObj;
    }
    this.selectedStepSectionInfo = newObj;
    this.cbpService.selectedElement = newObj;
    this.cbpService.currentStep = newObj.dgUniqueID;
    this.currentNodeSelected = obj.dgUniqueID;
    this.documentSelected = false;
    this.checkComponentInfo(newObj);
    if (this.viewForm) { this.viewForm.fillDerivedSteps(newObj, false); }
    this.cdref.detectChanges();
  }
  selectedStepAnnotationsReload(selectedStepAnnotations: any) {
    if (selectedStepAnnotations?.length > 0) {
      for (let i = 0; i < selectedStepAnnotations?.length; i++) {
        let obj = selectedStepAnnotations[i];
        setTimeout(() => {
          if (!this.loadedAnnotations.includes(obj.TxnId)) {
            if (this.refreshAnnotationsObjects(obj, 'refresh')) {
              this.loadedAnnotations.push(obj.TxnId);
            };
          }
        }, 100);
      }
    }
  }
  getLastStepObjet(obj: any) {
    this.lastChildObj = JSON.parse(JSON.stringify(obj));
    let find = obj?.children.filter((item: any) => this.executionService.sectionAndStep(item));
    if (find?.length > 0) {
      obj = JSON.parse(JSON.stringify(find[0]));
      this.getLastStepObjet(obj);
    }
  }
  headerfooterSelect(type: string) {
    this.cbpService.currentStep = type === 'header' ? '-1' : '-2';
    this.headerFooterSelected = true;
  }
  setCurrentNode(obj: any, isFromStart: boolean) {
    if (obj !== undefined) {
      if ((!isFromStart || obj?.children?.length > 0) && (obj.dgType !== DgTypes.Timed && obj.dgType !== DgTypes.Repeat)) { obj = this.getChildObj(obj); }
      if (obj.dgType === this.dgType.Repeat) {
        this.isRepeatStep = true;
        // this.executionService.repeatStepEnable = true;
        this.repeatTimes = obj['currentRepeatTimes'] ?? 1;
        this.totalRepeatTimes = obj.repeatTimes;
      }
      let type = obj.dgType == DgTypes.Timed || obj.dgType == DgTypes.Repeat ? 'not' : 'scroll';
      this.selectedObject(obj, type);
      this.dynamicSectionExecution = false;
    }
  }
  getChildObj(obj: any) {
    const getChildrenSteps = obj.children.filter((item: any) => this.executionService.stepActionCondition(item));
    if (getChildrenSteps.length > 0) {
      obj = getChildrenSteps[0];
      this.getChildObj(JSON.parse(JSON.stringify(getChildrenSteps[0])));
    }
    return JSON.parse(JSON.stringify(obj));
  }
  checkDgSequence(stepObj: any) {
    const indent = this.indendation && this.indendation[0].showIndendation ? true : false;
    return !indent && stepObj.originalSequenceType !== SequenceTypes.DGSEQUENCES ? true : false;
  }

  setStyleValues(data: any) {
    data['setIndentaion'] = this.stylesService.setIndentaion(data, this.indendation);
    data['setAlignIndentaion'] = this.stylesService.setAlignIndentaion(data, this.indendation, this.layoutIcons);
    data['styleObj'] = this.stylesService.getDynamicStyles(data, this.executionService.styleModel);
    if (!data['styleObj']) {
      this.executionService.styleModel = this.stylesService.applyStyles(new styleModel(), this.styleJson, stylesJson);
      data['styleObj'] = this.stylesService.getDynamicStyles(data, this.executionService.styleModel);
    }
    if (data['styleObj']) {
      if (data['styleObj']['background-color'] === '#fff' ||
        data['styleObj']['background-color'] === '#ffffff') {
        data['styleObj']['background-color'] = 'transparent';
      }
    }
    if (data?.dualStep) {
      let count = this.getLevelByNumber(data?.number);
      data['styleObj'] = this.stylesService.getDynamicStyles({ level: count - 1 }, this.executionService.styleModel);
      data['setLayoutindentation'] = this.layoutService.setLayoutIndendation(data, this.indendation, this.layoutIcons);
    } else {
      data['setLayoutindentation'] = this.layoutService.setLayoutIndendation(data, this.indendation, this.layoutIcons);
    }
    if (data.dgType === DgTypes.Section && data.dataType === 'Attachment') {
      data['styleObjAttach'] = this.stylesService.getDynamicStyles({ 'level': 'attachmentTitle' }, this.executionService.styleModel);
      data['styleObjAttachTitle'] = this.stylesService.getDynamicStyles({ 'level': 0, 'dataType': 'Attachment' }, this.executionService.styleModel)
    }
    data['iconStyle'] = this.stylesService.getIconStyles(data, this.executionService.styleModel);
    data['styleNumber'] = this.stylesService.getNumberIconStyles(data, this.executionService.styleModel);
    if (data?.dualStep) {
      let count = this.getLevelByNumber(data?.number);
      data['iconStyle'] = this.stylesService.getIconStyles({ level: count - 1 }, this.executionService.styleModel);
      data['styleNumber'] = this.stylesService.getNumberIconStyles(data, this.executionService.styleModel);
    }
    data['topStyle'] = this.stylesService.getTopStyles(data['iconStyle']);
    data['isCheckDgSequence'] = this.checkDgSequence(data);
    return data;
  }
  getLevelByNumber(number: any) {
    let split = number.toString().split('.');
    let length = split?.length;
    return length;
  }
  //refactor
  setTableExecuterRows(object: any, dataObject: any) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Table) {
          object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'tableRowAdded', dataObject: dataObject }, null);
          if (this.cbpService.dataJson?.dataObjects?.length > 0) {
            object[i] = this.tableService.loadRowsWithDgUniqueIdToTable(object[i], this.cbpService.dataJson);
          }
          this.tableService.setDefaultTableChanges(object[i], { type: 'rowUpdated' }, null);
        }
        if (object[i]?.dgType === DgTypes.DualAction) {
          this.setTableExecuterRows(object[i].children, dataObject);
          this.setTableExecuterRows(object[i].rightDualChildren, dataObject);
        }
        if (object[i]?.children?.length > 0) {
          this.setTableExecuterRows(object[i]?.children, dataObject)
        }
      }
    }
  }
  setTableExecuterRows1(table: any, dataObject: any) {
    if (table.dgType === DgTypes.Table) {
      this.tableService.setDefaultTableChanges(table, { type: 'tableRowAdded', dataObject: [dataObject] }, null);
      this.tableService.loadRowsWithDgUniqueIdToTable(table, { dataObjects: [dataObject] });
      this.tableService.setDefaultTableChanges(table, { type: 'rowUpdated' }, null);
    }
  }
  // refactor
  storeSectionStepArray(object: any, dataObject: any, type: string) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section || object[i].dgType === DgTypes.StepInfo) {
          object[i] = this.setStyleValues(object[i]);
          object[i]['options'] = new StepOption();
          if (dataObject?.length > 0) {
            const newObject = dataObject.filter((x: any) => x.dgUniqueID == object[i].dgUniqueID ||
              x.selectedStepDgUniqueId == object[i].dgUniqueID);
            if (newObject.length > 0) {
              object[i] = this.setSectionDependencyObj(object[i], newObject);
              object[i] = this.setNotApplicableItem(object[i], newObject);
              object[i] = this.setStickyNoteItem(object[i], newObject);
            }
          }
          if (!this.cbpService.dynmaicDocument && object[i]?.hide_section && (object[i]?.hide_section == true)) {
            object[i]['hide_section'] = false;
            object[i]['dynamic_section'] = false
          }
          if (!object[i]?.hide_section)
            this.cbpService.stepSequentialArray.push(object[i]);
          if (object[i].acknowledgementReqd) {
            if (!object[i]?.hide_section)
              this.cbpService.stepActionArray.push(object[i]);
          }
          if (object[i]['hasDataEntry']) {
            object[i]['options']['complete'] = true;
            if (!object[i]?.hide_section)
              this.cbpService.stepActionArray.push(object[i]);
          }
        }
        if (this.executionService.stepActionCondition(object[i])) {
          object[i] = this.setStyleValues(object[i]);
          if (!object[i]['options']) { object[i]['options'] = new StepOption(); }
          if (object[i].dgType === DgTypes.DelayStep && !object[i]['title']) {
            object[i]['title'] = ' ';
          }
          if ((object[i].dgType === DgTypes.StepAction || object[i].dgType === DgTypes.Timed || object[i].dgType === DgTypes.Repeat) && !object[i]['action']) {
            object[i]['action'] = ' ';
          }
          if (dataObject?.length > 0) {
            const newObject = dataObject.filter((x: any) => x.dgUniqueID == object[i].dgUniqueID ||
              x.selectedStepDgUniqueId == object[i].dgUniqueID);
            if (newObject.length > 0) {
              object[i] = this.setNotApplicableItem(object[i], newObject);
              object[i] = this.setStickyNoteItem(object[i], newObject);
            }
          }
          if (!this.cbpService.dynmaicDocument && object[i]?.hide_section && (object[i]?.hide_section == true)) {
            object[i]['hide_section'] = false;
            object[i]['dynamic_section'] = false
          }
          if (!object[i]?.hide_section) {
            this.cbpService.stepActionArray.push(object[i]);
            this.cbpService.stepSequentialArray.push(object[i]);
          }
        }
        if (object[i].dgType === DgTypes.DualAction) {
          this.storeSectionStepArray(object[i].children, dataObject, type);
          this.storeSectionStepArray(object[i].rightDualChildren, dataObject, type);
        }
        if (this.executionService.messageCondition(object[i])) {
          object[i]['options'] = new StepOption();
          if (dataObject?.length > 0) {
            const newObject = dataObject.filter((x: any) => x.dgUniqueID == object[i].dgUniqueID);
            if (newObject.length > 0) {
              object[i] = this.setNotApplicableItem(object[i], newObject);
            }
          }
        }
        if (object[i].dgType === DgTypes.Figures) {
          this.cbpService.mediaBuilderObjects = [...this.cbpService.mediaBuilderObjects, ...object[i].images];
          this.cbpService.mediaBuilderObjects = this.sharedviewService.removeDuplicates(this.cbpService.mediaBuilderObjects, 'fileName');
        }
        if ((object[i]?.isParentRepeatStep || object[i]?.isParentTimedStep) && this.executionService.checkDataEntryDgTypes(object[i])) {
          object[i]['isContentEditable'] = false;
        }
        if (object[i].dgType === DgTypes.Form) {
          object[i] = this.cbpService.setDefaultCBPTableChanges(object[i], { type: 'BuilderImages', protect: false, dataObject: [], headerProtect: false }, null, new ProtectObject().init());
        }
        if (object[i]?.children?.length > 0) {
          let dataEntryEnabled = object[i]?.children.filter((dataentry: any) => this.executionService.isDataEntry(dataentry));
          object[i]['dataEntryEnabled'] = dataEntryEnabled?.length > 0 ? true : false;
        }
        if (this.annotateJson?.annotateObjects?.length > 0) {
          let findAnnotate = this.annotateJson?.annotateObjects.filter(item => item.selectedStepDgUniqueID == object[i].dgUniqueID && item?.objectInfo?.length > 0);
          if (findAnnotate.length > 0) {
            object[i] = this.getAnnotationObjectInfo(findAnnotate[findAnnotate.length - 1], object[i]);
          }
        }
        if (object[i].children) {
          this.storeSectionStepArray(object[i].children, dataObject, type);
        }
      }
    }
  }
  setNotApplicableItem(object: any, valueObj: any) {
    if (valueObj.length > 0) {
      if (!object['options']) { object['options'] = new StepOption(); }
      if (valueObj[valueObj.length - 1]['status']?.toLowerCase() === 'completed' &&
        this.executionService.messageCondition(valueObj[valueObj.length - 1])) {
        object = this.sharedviewService.setMessageValues(object, valueObj);
        object = this.sharedviewService.setRoleQuals(object, false, false);
      }
      if (valueObj[valueObj.length - 1]['status'] === 'Not Applicable') {
        object['options'].notApplicable = true;
        object['isChecked'] = true;
        object = this.sharedviewService.setRoleQuals(object, false, false);
      }
    }
    return object;
  }

  setStickyNoteItem(object: any, dataObject: any) {
    let sticky = dataObject.filter((item: any) => item.dgType === DgTypes.StickyNote);
    if (sticky?.length > 0) {
      object['stickyExeNote'] = sticky[sticky.length - 1];
    }
    return object;
  }
  checkRolesStep(section: any) {
    if (this.isMobile) {
      //Mobile roles/Config
      this.userObject = section;
    } else {
      if (!this.sharedviewService.userCbpInfo) {
        this.userObject = section;
        let evt: Request_Msg = { eventType: EventType.userCBPInfo, msg: { userId: this.executionService.selectedUserId }, datajson: '' };
        this.datashareService.sendMessageFromLibToOutside(evt);
      } else {
        this.checkRoleQuals(section);
      }
    }
  }
  checkRoleQuals(object: any) {
    for (let i = 0; i < object?.length; i++) {
      if (object[i]['Security'] && this.sharedviewService.hasSecurity(object[i])) {
        const hasRolQual = this.sharedviewService.checkRoles(object[i], false, this.sharedviewService.userCbpInfo);
        if (!hasRolQual && !object[i].isChecked) {
          this.sharedviewService.setRoleQuals(object[i], true, true);
          if (Array.isArray(object[i].children) && object[i].children.length > 0) {
            this.setChildrenRolQualRequired(object[i].children, true, 'userRoles');
          }
        }
        if (this.executionService.isDataEntry(object[i])) {
          const hasRolQual = this.sharedviewService.checkRoles(object[i], false, this.sharedviewService.userCbpInfo);
          let value = !hasRolQual && this.sharedviewService.hasSecurity(object[i]);
          object[i] = this.sharedviewService.setRoleQuals(object[i], value, value);
          object[i]['disableField'] = value;
        }
        if (object[i].dgType === DgTypes.Form) {
          object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'checkRoles', roleObject: this.sharedviewService.userCbpInfo }, null)
        } else {
          if (!this.sharedviewService.hasSecurity(object[i])) {
            this.sharedviewService.setRoleQuals(object[i], false, false);
          }
          if (Array.isArray(object[i]?.children) && object[i]?.children?.length > 0) {
            let bol = object[i]['showLockIcon'] ? true : false;
            this.setChildrenRolQualRequired(object[i]?.children, bol, 'userRoles');
          }
        }
      }
      if (this.executionService.isDataEntry(object[i])) {
        const hasRolQual = this.sharedviewService.checkRoles(object[i], false, this.sharedviewService.userCbpInfo);
        let value = !hasRolQual && this.sharedviewService.hasSecurity(object[i]);
        object[i] = this.sharedviewService.setRoleQuals(object[i], value, value);
      }
      if (object[i].dgType === DgTypes.Form) {
        object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'checkRoles', roleObject: this.sharedviewService.userCbpInfo }, null)
      }
      if (Array.isArray(object[i]?.children) && object[i]?.children?.length > 0) {
        this.checkRoleQuals(object[i].children);
      }
    }
  }
  setChildrenRolQualRequired(object: any, type: any, roleType: string) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.StepAction || object[i].dgType === DgTypes.Section) {
        object[i] = this.sharedviewService.setRoleQuals(object[i], false, type);
        object[i] = this.viewForm.protectOrUnProtectDataEntries(object[i], type, roleType);
      }
      if (this.executionService.isDataEntry(object[i])) {
        object[i]['disableField'] = type;
      }
      if (Array.isArray(object[i].children) && object[i].children.length > 0) {
        this.setChildrenRolQualRequired(object[i].children, type, roleType);
      }
    }
  }
  setSectionDependencyObj(object: any, dataObject: any) {
    const dependencyItems = dataObject.filter((item: any) => (item.dgUniqueID == object.dgUniqueID && item.dgType === DgTypes.SectionDependency));
    if (dependencyItems.length > 0) {
      const orderChnages = this.executionOrderJson.orderObjects.filter((item: any) => item.dgUniqueID == object.dgUniqueID);
      if (orderChnages.length > 0) {
        this.updateCBPJSONOrder(object.children, object.dgUniqueID);
        object.orderChanged = true;
      }
      this.setSectionDependencyItems(object, dependencyItems[dependencyItems.length - 1]);
    }
    return object;
  }
  getCommentsAndCrInfo(dataObject: any) {
    if (!this.comments) { this.comments = []; }
    if (!this.crArrayData) { this.crArrayData = []; }
    if (!this.otspData) { this.otspData = []; }
    const allcomments = this.cbpService.getArrayObjectsCm(dataObject, DgTypes.Comment, DgTypes.DeleteComment);
    const alldata = this.cbpService.removeDuplicates(allcomments, "TxnId");
    if (alldata.length > 0) {
      this.setCommentCrItems(DgTypes.Comment, alldata);
    }
    const allCRequests = this.cbpService.getArrayObjectsCR(dataObject, DgTypes.ChangeRequest, DgTypes.deleteChangeRequest);
    const allCRdata = this.cbpService.removeDuplicates(allCRequests, "TxnId");
    if (allCRdata.length > 0) {
      this.setCommentCrItems(DgTypes.ChangeRequest, allCRdata);
    }
    this.otspData = this.cbpService.getArrayObjects(dataObject, DgTypes.EditText);
    this.otspData = this.cbpService.removeDuplicates(this.otspData, "TxnId");
    const figures = this.cbpService.getArrayObjectsImages(dataObject, DgTypes.Figures, "DeleteFigure");
    const allFigures = this.cbpService.removeDuplicates(figures, "TxnId");
    if (allFigures.length > 0) {
      allFigures.forEach((itemValue: any) => {
        if (itemValue.action != ActionId.Delete) {
          this.cbpService.mediaExecutorObjects = [...this.cbpService.mediaExecutorObjects, ...itemValue.images];
        } else {
          this.cbpService.mediaExecutorObjects = this.cbpService.mediaExecutorObjects.filter((item: any) => item.name !== itemValue?.fileName);
        }
      });
      this.cbpService.mediaExecutorObjects = this.sharedviewService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'name');
    }
  }

  deleteMediaObject(name: string) {
    this.cbpService.mediaExecutorObjects = this.cbpService.mediaExecutorObjects.filter((item: any) => item.name !== name);
  }

  setCommentCrItems(type: string, itemsCRComments: any) {
    itemsCRComments.forEach((item: any) => {
      if (item.action != ActionId.Delete) {
        if (type === DgTypes.Comment) {
          const index = this.comments.findIndex((itemV: any) => itemV.dgUniqueID == item.dgUniqueID);
          index == -1 ? this.comments.push(item) : this.comments[index] = item;
        } else if (type === DgTypes.ChangeRequest) {
          const index = this.crArrayData.findIndex((itemV: any) => itemV.dgUniqueID == item.dgUniqueID);
          index == -1 ? this.crArrayData.push(item) : this.crArrayData[index] = item;
        }
      } else {
        if (type === DgTypes.Comment) {
          this.comments = this.comments.filter((itemV: any) => itemV.dgUniqueID != item.dgUniqueID);
        } else if (type === DgTypes.ChangeRequest) {
          this.crArrayData = this.crArrayData.filter((itemV: any) => itemV.dgUniqueID != item.dgUniqueID);
        }
      }
    });
  }

  changeSize(event: any) {
    this.cbpService.checkedFirst = event.first;
    this.cbpService.checkedDefault = event.defalt;
    this.cbpService.checkedLast = event.last;
    this.cbpService.tabletCheck = event.tablet;
    this.viewUpdate(true);
    this.cdref.detectChanges();
  }
  changeControl(type: any) {
    if (type === 'index') {
      this.changeLabels(false, false, true);
    } else if (type === 'component') {
      this.changeLabels(true, false, false);
    } else if (type === 'refTab') {
      this.getReferenceAPIInfo({}, '', '');
      this.changeLabels(false, false, false, true);
    } else {
      this.changeLabels(false, true, false);
      this.setDetailPageValues(true, false, false, false)
    }
    if (this.isComponentOpen && this.viewForm) {
      setTimeout(() => { this.viewForm.gotoCurrentDiv('section' + this.cbpService.currentStep); }, 10);
    }
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }
  changeLabels(comp: any, detail: any, tree: any, refTab = false) {
    this.isComponentOpen = comp; this.isDetailsTabOpen = detail; this.isTreeTabOpen = tree; this.isRefTabOpen = refTab;
    this.cbpService.refTabOpen = this.isRefTabOpen;
    this.cdref.detectChanges();
  }
  componentControl() {
    this.showComponent = true;
  }
  enableComponent() {
    this.showComponent = !this.showComponent;
    if (this.showComponent) { this.changeLabels(true, false, false); } else { this.changeLabels(false, false, true); }
  }
  selectStepNode(event: any) {
    try {
      this.cbpService.coverPageSelected = false;
      this.headerFooterSelected = false;
      this.documentSelected = false;
      if (this.cbpService.currentStep !== event.original.dgUniqueID) { this.cbpService.currentStep = event.original.dgUniqueID; }
      if (!this.cbpService.executionClicked && event.original.dgUniqueID && this.cbpService.currentStep !== event.original.dgUniqueID) {
        this.cbpService.currentStep = event.original.dgUniqueID;
      }
      this.gotoCurrentStep('section' + event.original.dgUniqueID)
      this.selectedStepSectionInfo = event.original;
      this.cbpService.selectedElement = this.executionService.getElementByDgUniqueID(event.original.dgUniqueID, this.cbpJson.section);
      this.cbpService.scrollState = -1;
      this.isReachingBottomState = true;
      this.isReachingTopState = true;
      this.paginationNumber = JSON.parse(JSON.stringify(this.cbpService.startIndex));
      this.cbpService.startIndex = this.cbpService.selectedElement.paginateIndex ? ((Math.floor(this.cbpService.selectedElement.paginateIndex / this.cbpService.pageSize) * this.cbpService.pageSize)) + 1 : 1;
      if (this.cbpService.startIndex <= this.cbpService.pageSize) {
        this.cbpService.startIndex = 1;
      }
      this.gotToPosition(this.cbpService.selectedElement);
      setTimeout(() => {
        this.cbpService.scrollState = 0;
        this.isReachingBottomState = false;
        this.isReachingTopState = false;
        this.scrollDirection = '';
        this.scrollCount = 0;
      }, 2000);
      if (this.cbpService.selectedElement?.length > 0) {
        this.cbpService.selectedElement = event.original;
      }
      this.dataJsonService.setSelectItem({ item: this.cbpService.selectedElement });
      this.executionService.toggleDisplaySections(this.cbpService.selectedElement, this.cbpJson?.section, 0);
      this.checkComponentInfo(this.cbpService.selectedElement);
      if (this.paginationNumber !== this.cbpService.startIndex) {
        setTimeout(() => {
          this.removeAnnotaions();
          this.refreshAnnotations();
        }, 1000);
      }
      this.cdref.detectChanges();
    } catch (error) {
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
    }
  }

  getFormViewEvent(event: any) {
    this.menuConfig.showRowTable = false;
    this.menuConfig = JSON.parse(JSON.stringify(this.menuConfig));
    switch (event.type) {
      case EventFormView.menuBarRefresh:
        this.menuConfig = JSON.parse(JSON.stringify(this.menuConfig));
        break;
      case EventFormView.RepeatComplete:
        this.repeatStepComplete(event.object, event);
        break;
      case EventFormView.CurrentSelected:
        this.checkStepNotApplicable(event.object);
        this.disableStep = event?.object?.isChecked;
        if (!this.cbpJson.documentInfo[0]['usage']) {
          this.cbpJson.documentInfo[0]['usage'] = DgTypes.Continuous;
        }
        if (this.cbpJson.documentInfo[0]['usage'] !== DgTypes.Continuous) {
          this.executionService.setMenuBarField({ event: 'disabledUndo', obj: !event?.object?.isChecked })
        } else {
          let parentObj = (event.object.parentID === null || event.object.parentID === undefined) ? event.object : this.viewForm.getSelectedSectionParentObj(event.object?.parentDgUniqueID);
          if (parentObj.parentID !== null) {
            parentObj = this.viewForm.getSelectedSectionParentObj(parentObj.parentDgUniqueID);
          }
          if (parentObj.parentID !== null) {
            parentObj = this.viewForm.getSelectedSectionParentObj(parentObj.parentDgUniqueID);
          }
          if (parentObj['usage'] !== DgTypes.Continuous) {
            this.executionService.setMenuBarField({ event: 'disabledUndo', obj: !event?.object?.isChecked })
          } else {
            this.executionService.setMenuBarField({ event: 'disabledUndo', obj: event.undoComment })
          }
        }
        this.selectedObject(event.object, 'not');
        this.applyTableRules(this.cbpService.selectedElement?.children);
        break;
      case EventFormView.UsageOption:
        this.showUsageOption = true;
        break;
      case EventFormView.CrComment:
        this.selectedObject(event.object, 'not');
        this.showCrComment(event);
        break;
      case EventFormView.SecurityVerify:
        this.existingSecurityUser(event.user, event.securityType);
        break;
      case EventFormView.LastStepCompleted:
        this.disabledUndo = this.viewForm.checkUndoStep(event.object);
        if (this.cbpService.selectedElement?.dgUniqueID != event?.object?.dgUniqueID) {
          this.disabledUndo = this.viewForm.checkUndoStep(this.cbpService.selectedElement);
        }
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo })
        break;
      case EventFormView.CompleteStep:
        this.disabledUndo = false;
        this.selectedStepSectionInfo = event.object;
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo })
        this.terminationOrComplete(DgTypes.CompletedExecution, ActionId.ExecutionComplete);
        break;
      case EventFormView.TimedStep:
        this.validateTimedStep(event);
        break;
      case EventFormView.DelayTimer:
        this.showTimer(event['object']);
        break;
      case EventFormView.SkipVerification:
        this.openSkipVerification(event.data);
        break;
      case EventFormView.Verification:
        this.openVerification(event.data);
        break;
      case EventFormView.UpdateStepCompletionCount:
        this.executionService.setMenuBarField({ event: 'updateStepCompletionCount' });
        break;
      default:
        this.executionFormEventDefault(event);
        break;
    }
  }
  executionFormEventDefault(event: any) {
    if (event.type !== 'refreshMenuBar') {
      if (event['object'] && event.object['dgType'] !== undefined) {
        this.selectedStepSectionInfo = event.object;
        this.cbpService.selectedElement = JSON.parse(JSON.stringify(event.object));
        this.disableStep = event.object.isChecked;
        this.disableMedia = false;
        this.checkComponentInfo(event.object);
        this.setSelectedItem(event);
      } else {
        this.selectedStepSectionInfo = undefined;
        this.disableMedia = true;
      }
      if (event.type === 'execution') {
        this.currentNodeSelected = event.selectedDgUniquId;
        this.cbpService.currentStep = event.selectedDgUniquId;
        this.setSelectedItem(event);
        // this.disabledUndo = JSON.parse(JSON.stringify(this.disabledUndo));
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo })
      }
      this.sharedviewService.detectAll = true;
      if (this.viewForm && !this.executionService.isClickedCurrentStep && event.selectedDgUniquId != "1") {
        this.gotoCurrentStep('section' + event.selectedDgUniquId);
      }
    }
  }

  setSelectedItem(event: any) {
    let items = this.executionService.getElementByDgUniqueID(event.object.dgUniqueID, this.cbpJson.section);
    if (items?.length > 0) {
      items.forEach((element: any) => {
        if (element.dgType === event.object.dgType) {
          this.cbpService.selectedElement = element;
        } else {
          element.dgUniqueID = ++this.cbpService.documentInfo.dgUniqueID;
        }
      });
    } else {
      this.cbpService.selectedElement = items;
    }
    this.isReachingBottomState = true;
    this.cbpService.startIndex = this.cbpService.selectedElement.paginateIndex ? ((Math.floor(this.cbpService.selectedElement.paginateIndex / this.cbpService.pageSize) * this.cbpService.pageSize)) + 1 : 1;
    if (this.cbpService.startIndex <= this.cbpService.pageSize) {
      this.cbpService.startIndex = 1;
    }
    setTimeout(() => {
      this.cbpService.scrollState = 0;
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
      this.scrollDirection = '';
      this.scrollCount = 0;
    }, 3000);
  }
  checkComponentInfo(obj: any) {
    if (this.executionService.stepActionCondition(obj) && obj['componentInformation'] &&
      obj['componentInformation']['length'] > 0) {
      this.setComponentObj(true, true, false, obj['componentInformation'][0]);
    } else {
      this.setComponentObj(false, false, true, undefined);
    }
  }
  setComponentObj(bool1: any, bool2: any, bool3: any, compObj: any) {
    this.isComponentOpen = bool1;
    this.showComponent = bool2;
    this.isTreeTabOpen = bool3;
    this.componentInfo = compObj;
  }
  checkStepNotApplicable(obj: any) {
    if (this.executionService.stepActionCondition(obj)) {
      if (obj.options.notApplicable && !this.validateStepIsChecked(obj)) { this.disabledUndo = false; }
      if (obj.options.complete && this.validateStepIsChecked(obj)) { this.disabledUndo = true; }
      this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo })
    }
  }

  validateStepIsChecked(obj: any) {
    let currentIndex = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === obj.dgUniqueID);
    if (currentIndex !== undefined) {
      currentIndex = currentIndex + 1;
      for (let i = currentIndex; i < this.cbpService.stepActionArray.length; i++) {
        if (this.cbpService.stepActionArray[i].isChecked && this.cbpService.stepActionArray[i].options.complete) {
          return true;
        }
      }
    }
  }
  repeatStepStop(event: any) {
    this.isRepeatStep = false;
    this.executionService.setTimerStep({ dgType: DgTypes.Repeat, repeatStepEnable: false });
    this.executionService.repeatStepEnable = false;
  }

  repeatStepComplete(stepObject: any, event: any) {
    const total = (Number(stepObject.repeatTimes) - 1);
    if (!this.cbpService.selectedElement['currentRepeatTimes']) { this.cbpService.selectedElement['currentRepeatTimes'] = 0; }
    if (this.cbpService.selectedElement['currentRepeatTimes'] === total) {
      this.executionService.repeatStepEnable = false;
      this.isRepeatStep = false;
      this.freezePage = false;
      this.repeatTimes = 0;
      this.cbpService.selectedElement['currentRepeatTimes'] = 1;
      const obj = { repeatTime: total }
      this.storeDataObject(stepObject, 'Completed', obj);
    } else {
      this.cbpService.selectedElement['currentRepeatTimes'] += 1;
      this.repeatTimes = this.cbpService.selectedElement['currentRepeatTimes'];
      this.cbpService.selectedElement.isChecked = false;
      this.cbpService.selectedElement['options'] = new StepOption();
      this.cbpService.selectedElement.isTapped = 0;
      this.clearStepObjectContent('repeat');
      this.executionService.repeatStepEnable = true;
      const obj = { repeatTime: this.repeatTimes }
      this.storeDataObject(stepObject, 'Completed', obj);
      this.viewUpdate(true);
      this.setCommentByDgUniqueID(this.cbpJson.section, stepObject);
      this.executionService.setTimerStep({ updateRepeatTimes: (this.repeatTimes + 1) });
    }
  }
  clearDataEntryValues(object: any, reupdateDgUniqueID: boolean, dynamic: boolean,
    id: number, type: string, count: any, parentDgUniqueID: any, storeType: string) {
    for (let i = 0; i < object.length; i++) {
      if (dynamic) {
        object[i]['parentDynamicDgUniqueID'] = id;
      }
      if (type === 'dynamic') {
        object[i]['dgUniqueID'] = 'd_' + count + '_' + (object[i]['dgUniqueID']);
        object[i]['parentDgUniqueID'] = object[i].parentID ? parentDgUniqueID : null;
        this.processDerivedAndDataEntry(object[i]);
        if (object[i]?.dgSequenceNumber) {
          this.antlrService.callBackObject.init(object[i]?.dgSequenceNumber, object[i].dgUniqueID)
        }
      }
      if (object[i].dgSequenceNumber && object[i].dgType === DgTypes.Section) {
        object[i]['options'] = new StepOption();
        object[i]['isCommentAvailable'] = false;
        object[i]['isCRAvailable'] = false;
        if (type === 'clear') {
          object[i] = this.sharedviewService.clearStyleKeys(object[i]);
          object[i].children = object[i].children.filter((item: any) => item?.selectedStepDgUniqueId !== object[i].dgUniqueID)
        }
      }
      if (this.executionService.stepActionCondition(object[i])) {
        object[i].isChecked = false;
        object[i].isTapped = 0;
        object[i]['options'] = new StepOption();
        if (type === 'dynamic' && object[i]?.rule?.length > 0) {
          this.executionService.stepConditionalRuleObjs.push(object[i])
        }
        if (type === 'dynamic' && object[i]?.applicabilityRule?.length > 0) {
          this.executionService.applicabilityObjs.push(object[i])
        }
        object[i] = this.clearStepRules(object[i]);
        if (type === 'clear') {
          object[i] = this.sharedviewService.clearStyleKeys(object[i]);
          object[i].children = object[i].children.filter((item: any) => item?.selectedStepDgUniqueId !== object[i].dgUniqueID);
        }
      }
      if (this.executionService.checkDataEntryDgTypes(object[i])) {
        if (type !== 'undo') {
          object[i]['oldValue'] = '';
          object[i]['storeValue'] = '';
          object[i]['innerHtmlView'] = false;
          object[i]['styleSet'] = { fontfamily: 'Poppins', fontsize: 2, fontcolor: '#000000' };
          object[i]['color'] = '#000000';
          object[i]['defaultFontSize'] = 2;
          object[i]['defaultFontName'] = 'Poppins';
          if (object[i]?.approveList?.length > 0) { object[i]['approveList'] = []; }
        }
        object[i]['protect'] = false;
        object[i]['disableField'] = false;
      }
      if (object[i].dgType === DgTypes.SignatureDataEntry) {
        if (type !== 'undo') {
          object[i] = this.sharedviewService.setDefaultSignature(object[i], []);
        }
        object[i]['disableField'] = false;
        object[i]['protect'] = false;
      }
      if (object[i].dgType === DgTypes.InitialDataEntry) {
        if (type !== 'undo') {
          object[i] = this.sharedviewService.setDefaultInitial(object[i], []);
        }
        object[i]['disableField'] = false;
        object[i]['protect'] = false;
      }
      if (object[i].dgType === DgTypes.NumericDataEntry) {
        if (type !== 'undo') {
          object[i]['isError'] = false;
          object[i].storeValue = object[i].defaultValue ? object[i].defaultValue : '';
        }
        object[i]['disableField'] = false;
        object[i]['protect'] = false;
      }
      if (object[i].dgType === DgTypes.CheckboxDataEntry) {
        if (type !== 'undo') {
          object[i].storeValue = object[i].valueType === 'Selected' ? true : false;
        }
        object[i]['disableField'] = false;
        object[i]['protect'] = false;
      }
      if (object[i].dgType === DgTypes.Form && type === 'dynamic') {
        this.setDgUniqueIdsForDynamicSectionTable(object[i]);

        if (this.cbpService.dataJson?.dataObjects?.length > 0) {
          object[i] = this.tableService.loadRowsWithDgUniqueIdToTable(object[i], this.cbpService.dataJson);
        }
        object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'dynamicDynamic', count: count });
      }
      if (object[i].dgType === DgTypes.Form && type !== 'dynamic') {
        // if (type !== 'undo') {
        object[i] = this.tableService.setDefaultTableChanges(object[i], { actualType: type, type: 'clear', dataObject: [], 'storeType': storeType });
        // }
      }
      if (object[i].dgType === DgTypes.Figures) {
        object[i].images = object[i].images.filter((item: any) => !item?.isExecuter);
      }
      if (this.executionService.messageCondition(object[i])) {
        object[i]['notApplicable'] = false;
        object[i] = this.sharedviewService.setMessageValues(object[i], []);
        object[i]['options'].complete = false;
        object[i]['isTapped'] = 0;
      }
      if (object[i].children && Array.isArray(object[i].children) && object[i].children.length > 0 && typeof object[i].children === "object") {
        this.clearDataEntryValues(object[i].children, reupdateDgUniqueID, dynamic, id, type, count, object[i].dgUniqueID, storeType);
      }
    }
    return object;
  }
  storeDataEntryObj(object: any) {
    let obj: any = this.sharedviewService.storeDataObj(object, '');
    this.sessionDataStore(obj, object);
  }
  storeAlerts(obj: any) {
    let user = this.executionService.selectedUserName;
    let dataInfo: DataInfoModel = new DataInfoModel('undo', user, new Date(), user, new Date(), '', obj.dgType, obj.dgUniqueID, '');
    let dataInfoObj: any = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(ActionId.Alert) };
    this.sessionDataStore(dataInfoObj, obj);
  }

  undoStoreStep(item: any) {
    let undoObj = new UndoCommentStore('', '', new Date(), this.executionService.selectedUserName);
    let userName = this.executionService.selectedUserName;
    let dgUniqueID = (++this.cbpService.lastSessionUniqueId).toString();
    let dataInfo: any = new DataInfoModel(DgTypes.UndoStep, userName, new Date(), userName, new Date(), '', DgTypes.UndoComment, dgUniqueID, item.dgUniqueID);
    dataInfo = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(ActionId.UndoVerification), ...undoObj };
    this.sessionDataStore(dataInfo, item);
  }
  sessionDataStore(obj: any, object: any) {
    obj['selectedStepDgUniqueID'] = object.dgUniqueID;
    this.sessionDataJsonStore(obj);
    this.datashareService.changeCount++;
    this.cdref.detectChanges();
  }
  // rows datajson which are added to section in dynamic sections
  storeDynamicTableRowInfo(tableInfo: any, row: any) {
    let user = this.executionService.selectedUserName;
    let obj: any = { ...this.sharedviewService.setUserInfoObj('') };
    obj['dgUniqueID'] = tableInfo['table'].dgUniqueID;
    obj['dgType'] = 'RowUpdated';
    delete tableInfo['table'];
    obj['tableInfo'] = tableInfo;
    obj['tableInfo']['rowDgUniqueID'] = row.dgUniqueID;
    obj['tableInfo']['refDgUniqueID'] = tableInfo['row']['dgUniqueID'];
    delete tableInfo['row'];
    obj['user'] = user;
    obj['action'] = this.sharedviewService.setStepActionValue(obj['dgType'])
    this.dataEntryJsonEvent(obj);
  }
  // storing the data.json file
  storeDataObject(stepObject: any, status: any, otherObj: any) {
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction(status, user, new Date(), user, new Date(), '',
      stepObject.dgType, stepObject.dgUniqueID, this.sharedviewService.setStepActionValue(status));
    stepAction = { ...stepAction, ...otherObj, ...this.sharedviewService.setUserInfoObj(stepAction.action) };
    if (stepObject?.dgType == 'DynamicSection') { stepAction.action = otherObj.action; }
    this.dataEntryJsonEvent(stepAction);
  }
  dataEntryJsonEvent(event: any) {
    if (event) {
      this.sessionDataJsonStore(JSON.parse(JSON.stringify(event)));
      this.datashareService.changeCount++;
    }
    if (event === false && this.tableService.reExecuterRules) {
      if (this.cbpService?.selectedTable) {
        let findTables = this.cbpService.dataJson.dataObjects.filter((data: any) => data?.tableDgUniqueID == this.cbpService.selectedTable.dgUniqueID && data?.tableRuleExecution);
        if (findTables?.length > 0)
          this.setTableRuleExecution(findTables, this.cbpService.selectedTable);
      }
    }
    this.tableService.reExecuterRules = true;
    this.dataJsonChange.emit(this.cbpService.dataJson);
    this.viewUpdate(true);
  }
  tableEvent(e: any) {
    if (this.viewForm) {
      this.viewForm.checkValidation(e.event, e.stepObj, e.value);
    }
  }

  /// refactor below methods
  getEventFromModalChild() {
    this.verificationModalOpen = false;
    this.commentModalOpen = false;
    this.changeRequestModalOpen = false;
    this.editStepTitle = false;
    this.uploadMediaOpen = false;
    this.undoComment = false;
    this.isCommentUpdate = false;
    this.emailOpen = false;
    this.showSecurityVerifyUser = false;
    this.saveModalopenLocal = false;
    this.commentCrModalOpen = false;
    this.cdref.reattach();
  }
  openCr(isUpdate: boolean) {
    this.changeRequestModalOpen = true;
    this.detachExecuter();
  }
  openEmailRequest() {
    this.emailOpen = true;
    this.detachExecuter();
  }
  refreshViewPage(event: any) {
    this.cdref.detectChanges();
    this.notifier.hideAll();
    this.notifier.notify('success', 'Table data has ' + event + ' successfully');
    if (this.viewForm)
      this.viewForm.reattach();
  }
  sendEmailEvent(emailObj: any) {
    if (emailObj != false) {
      let evt: Request_Msg = { eventType: EventType.SendEmail, msg: emailObj };
      this.dataWrapperService.sendMessageFromLibToOutside(evt);
    }
    this.emailOpen = false;
    this.getEventFromModalChild();
  }
  openUploadMedia() {
    this.uploadMediaOpen = true;
  }
  openComment() {
    this.commentModalOpen = true;
    let evtComment: Request_Msg = { eventType: EventType.setCommentTypes, msg: '' };
    this.datashareService.sendMessageFromLibToOutside(evtComment);
    this.detachExecuter();
  }
  getComment(item: any, i: any) {
    let evtComment: Request_Msg = { eventType: EventType.setCommentTypes, msg: '' };
    this.dataWrapperService.sendMessageFromLibToOutside(evtComment);
    this.commentObj = JSON.parse(JSON.stringify(item));
    this.isCommentUpdate = true;
    this.selectedCommentIndex = i;
    this.commentModalOpen = true;
    this.commentCrMediaFiles = [...this.cbpService.media];
    // this.codeValues = JSON.parse(JSON.stringify(this.codeValues));
    // console.log("clicked inn",this.codeValues ,this.comments)
    this.detachExecuter();
  }

  getCRObject(item: any, i: any) {
    this.changeRquestObj = JSON.parse(JSON.stringify(item));
    this.selectedCRIndex = i;
    this.isChangeRequestUpdate = true;
    this.commentCrMediaFiles = [...this.cbpService.media];
    this.openCr(true);
  }
  openEditStepModal(obj: any, i: any) {
    this.isEditStepUpdated = true;
    this.modalEditStep = obj;
    this.detachExecuter();
  }
  editStepTitleModal() {
    this.editStepTitle = false;
    this.editStepTitle = true;
    if (this.isEditStepUpdated) {
      this.isEditStepUpdated = false;
    }
    this.detachExecuter();
  }
  closeEditStep() {
    this.isEditStepUpdated = false;
    this.editStepTitle = false;
    this.getEventFromModalChild();
  }
  callDetailPage(event: any) {
    event.type === 'crObject' ? this.getCRObject(event.obj, event.i) :
      (event.type === 'comment' ? this.getComment(event.obj, event.i) :
        this.openEditStepModal(event.obj, event.i));
  }
  openUndoVerification() {
    this.setVerificatioTypes(this.dgType.UndoAuthorization, this.selectedStepSectionInfo);
  }
  openSkipVerification(obj: any) {
    this.selectedStepSectionInfo = obj;
    this.setVerificatioTypes(this.dgType.SkipVerification, this.selectedStepSectionInfo);
  }
  openVerification(item: any) {
    this.setVerificatioTypes(this.dgType.VerificationDataEntry, item);
  }

  setVerificatioTypes(dgType: DgTypes, item: any) {
    this.verificationModalOpen = true;
    this.verificationObj = item;
    this.verifyCationType = dgType;
  }
  goToStep() {
    this.detailPage = false;
    this.changeLabels(false, false, true);
    this.documentSelected = false;
    this.cbpService.currentStep = this.cbpService.selectedElement.dgUniqueID;
    this.currentNodeSelected = this.cbpService.selectedElement.dgUniqueID;
    if (this.cdref) { this.cdref.detectChanges(); }
    this.gotoCurrentStep('section' + this.cbpService.selectedElement.dgUniqueID);
  }
  openUndo() {
    this.undoComment = true;
    this.detachExecuter();
  }
  gotoCurrentStep(id: any, autoScroll = 0) {
    if (this.viewForm) { this.viewForm.gotoCurrentDiv(id, autoScroll); }
  }

  /// refactor above  methodsf
  openUndoComment() {
    let checkType: any;
    if (this.selectedStepSectionInfo?.children && this.selectedStepSectionInfo?.children?.length > 0) {
      checkType = this.sharedviewService.dgTypeExists(this.selectedStepSectionInfo.children, DgTypes.VerificationDataEntry);
    }
    if (!checkType) {
      if (this.selectedStepSectionInfo?.dgUniqueID == this.cbpService.selectedElement?.dgUniqueID) {
        checkType = this.sharedviewService.dgTypeExists(this.cbpService.selectedElement?.children, DgTypes.VerificationDataEntry);
      }
    }
    if (checkType) { this.openUndoVerification(); } else { this.openUndo(); }
  }
  getInfoObjWithProperties(dgTypeStore: string) { return { dgType: dgTypeStore }; }
  undoCommentStore(obj: any) {
    if (obj !== false) {
      this.disabledUndo = true;
      this.disableStep = false;
      this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo })
      this.clearStepObjectContent('undo');
      this.cbpService.selectedElement = this.clearStepRules(this.cbpService.selectedElement);
    }
    this.getEventFromModalChild();
  }
  clearStepRules(stepObject: any) {
    if (stepObject.dgType == DgTypes.Repeat) {
      stepObject['currentRepeatTimes'] = 0;
      stepObject['repeatStepStarted'] = false;
    }
    if (stepObject.dgType == DgTypes.Timed) {
      stepObject['stepTimerStart'] = false;
      stepObject['timerStepCompleted'] = false;
    }
    if (stepObject.dgType == DgTypes.DelayStep) {
      stepObject['delayTime'] = stepObject['originalDelayTime'] ? stepObject['originalDelayTime'] : stepObject['delayTime'];
    }
    return stepObject;
  }
  clearStepObjectContent(type: string) {
    if (type !== 'undo')
      this.cbpService.selectedElement.children = this.clearDataEntryValues(this.cbpService.selectedElement.children, false, false, 0, 'undo', 0, 0, 'save');
    const indexStep = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === this.cbpService.selectedElement.dgUniqueID);
    if (type == 'undo') {
      this.cbpService.selectedElement.children?.forEach((child: any) => {
        if (child['disableField']) {
          child['disableField'] = false;
        }
        if (child['protect'] && child['comments'] && child['comments']?.length == 0) {
          child['protect'] = false;
        }
        if (child['protect'] && !(child['comments'])) {
          child['protect'] = false;
        }
        if (child.dgType === DgTypes.Form) {
          let typeInfo = { type: 'protectDataEntries', value: false };
          this.cbpService.setDefaultCBPTableChanges(child, typeInfo);
        }
      });
      if (this.cbpService.selectedElement['isAppExecuted']) {
        this.cbpService.selectedElement['isAppExecuted'] = false;
      }
      if (this.cbpService.selectedElement['isConditionalRuleApplied']) {
        this.cbpService.selectedElement['isConditionalRuleApplied'] = false;
      }
    }
    this.cbpService.stepActionArray[indexStep] = this.cbpService.selectedElement;
    this.cbpService.selectedElement['options'] = new StepOption();
    this.cbpService.selectedElement['isChecked'] = false;
    this.cbpService.selectedElement['isTapped'] = 0;
    if (this.cbpService.selectedElement.dgType == DgTypes.Repeat) {
      this.executionService.repeatStepEnable = false;
    }
    this.sharedviewService.detectAll = true;
    this.viewUpdate(true);
  }
  updateEditStepInfo(modal: any) {
    if (modal !== false) {
      if (!this.otspData) { this.otspData = []; }
      //this.otspData = modal.modal.otspData;;
      this.otspData = this.otspData.filter((element) => element !== undefined);
      const element = this.executionService.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.treeObj.section);
      element['isEdited'] = true;
      element['newText'] = modal.modal.newTextValue;
      element['oldText'] = modal.modal.title;
      element['text'] = element.number + ' ' + this.cbpService.removeHTMLTags(modal.modal.newTextValue)
      if (this.executionService.stepActionCondition(element) && element.dgType !== DgTypes.DelayStep) {
        element['action'] = modal.modal.newTextValue;
      } else {
        element['title'] = modal.modal.newTextValue;
      }
      const elementObj = this.executionService.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpJson.section);
      elementObj['isEdited'] = true;
      elementObj['newText'] = modal.modal.newTextValue;
      elementObj['oldText'] = modal.modal.title;
      elementObj['text'] = elementObj.number + ' ' + this.cbpService.removeHTMLTags(modal.modal.newTextValue)
      this.cbpService.selectedElement = elementObj;
      console.log("ece", this.cbpService.selectedElement)
      this.isTree = false;
      this.reSetTree()
      this.viewUpdate(true);
    }
    this.getEventFromModalChild();
    this.closeEditStep();
  }

  updateVerification(modal: any) {
    if (modal) {
      if (modal.type === DgTypes.VerificationDataEntry) {
        this.cbpService.selectedStepObject['storeValue'] = modal.object.name;
      }
      if (modal.type === DgTypes.UndoAuthorization) {
        this.disableStep = false;
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: this.disabledUndo });
        this.clearStepObjectContent('undo');
        this.cbpService.selectedElement = this.clearStepRules(this.cbpService.selectedElement);
      }
      if (modal.type === DgTypes.SkipVerification) {
        if (this.viewForm) {
          this.viewForm.isStepSkipSuccess(this.selectedStepSectionInfo, modal);
        }
      }
    }
    this.getEventFromModalChild();
    this.sharedviewService.isViewUpdated = true;
  }
  setSectionDependencyItems(object: any, infoObj: any) {
    object.usage = infoObj.usage;
    object.dependency = infoObj.dependency;
    if (object.dependency === Dependency.SectionStep) {
      object.configureDependency = infoObj.configureDependency;
    }
    this.setSubSectionUsageAndDependeny([object], infoObj)
  }
  setSubSectionUsageAndDependeny(object: any, infoObj: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.Section) {
        object[i].usage = infoObj.usage;
        object[i].dependency = infoObj.dependency;
        if (object[i].dependency === Dependency.SectionStep) {
          object[i].configureDependency = infoObj.configureDependency;
        }
      }
      if (object[i].children && object[i].children.length && typeof object[i].children === "object") {
        this.setSubSectionUsageAndDependeny(object[i].children, infoObj);
      }
    }
  }

  // refactor this method
  selectStepFromEvent(listOfSteps: any) {
    this.currentNodeSelected = undefined;
    if (Array.isArray(listOfSteps) && listOfSteps?.length > 0) {
      for (let i = 0; i < listOfSteps.length; i++) {
        if (this.sharedviewService.hasAnyAlertMessages(listOfSteps[i])) {
          this.setCurrentNode(listOfSteps[i], true);
          break;
        }
        if ((listOfSteps[i].acknowledgementReqd && !listOfSteps[i]?.isChecked) || listOfSteps[i]['hasDataEntry']) {
          this.setCurrentNode(listOfSteps[i], true);
          break;
        }
        if (!this.currentNodeSelected && this.executionService.stepActionCondition(listOfSteps[i])) {
          if (!listOfSteps[i].isChecked) {
            this.setCurrentNode(listOfSteps[i], false);
            break;
          }
        }
      }
      if (!this.currentNodeSelected) {
        this.setCurrentNode(listOfSteps[0], false);
      }
    }
  }

  // set the single media file into execution section/step
  singleMediaUpdate(files: any) {
    let type = files?.target?.files[0].name.split('.');
    if (this.executionService.accept.includes(type[1])) {
      const fileArray: any = this.uploadMedia(files);
      if (fileArray[0]) { delete fileArray[0].baseUrl; }
      const dataInfo = this.sharedviewService.storeMediaUpload(fileArray, 'single', this.cbpService.currentStep, ++this.cbpService.lastSessionUniqueId);
      this.setMediaNewExecution({ dataInfo: dataInfo });
    } else {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Unable to support the format');
    }
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }

  singleMediaUpdateMobile(msg: any) {
    let slipt = msg.fileName.split('.');
    let imageObj = null;
    this.cbpService.lastSessionUniqueId = Number(this.cbpService.lastSessionUniqueId);
    this.cbpService.lastSessionUniqueId = ++this.cbpService.lastSessionUniqueId;
    imageObj = new ImageModal(msg.fileName, '', '', 'data-' + (new Date().getTime()),
      msg.type, 'executor', slipt[1], false, 'Figure', {}, msg.fileName, msg.fileName, 8100);
    const dataInfo = this.sharedviewService.storeMediaUpload([imageObj], 'single', this.cbpService.currentStep, new Date().getTime());
    this.setMediaNewExecution({ dataInfo: dataInfo });
  }

  uploadMedia(event: any) {
    let mediaObjArray = this.executionService.uploadMedia(event, [], this.cbpService.media, this.cbpService.maxDgUniqueId);
    this.cbpService.maxDgUniqueId = mediaObjArray.maxid;
    this.cbpService.media = [...this.cbpService.media, ...mediaObjArray.mediaArray];
    this.dataJsonService.setMediaItem(this.cbpService.media);
    return mediaObjArray.mediaFiles;
  }

  setMediaNewExecution(eventObj: any) {
    this.uploadMediaOpen = false;
    if (eventObj != false) {
      if (this.isMobile && this.cbpService.selectedTable) {
        eventObj.dataInfo.mediaType = "single"
      }
      if (this.cbpService.selectedTable && this.tableService.selectedRow?.length > 0 && eventObj?.dataInfo?.mediaType === 'single') {
        this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col].children.push(eventObj.dataInfo);
        eventObj.dataInfo['row'] = this.tableService.selectedRow[0].row;
        eventObj.dataInfo['rowDgUniqueId'] = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row]['dgUniqueID'];

        eventObj.dataInfo['col'] = this.tableService.selectedRow[0].col;
        eventObj.dataInfo['index'] = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col].children.length;
        eventObj.dataInfo['tableFigures'] = true;
        this.cbpService.dataJson.lastSessionUniqueId = Number(this.cbpService.dataJson.lastSessionUniqueId);
        this.cbpService.dataJson.lastSessionUniqueId = ++this.cbpService.dataJson.lastSessionUniqueId;
        eventObj.dataInfo['dgUniqueID'] = 'data-' + (new Date().getTime());
        this.mediaUdateFiles(eventObj);
        this.dataEntryJsonEvent(eventObj.dataInfo);
      } else {
        if (eventObj) {
          if (this.cbpService.selectedElement.children === undefined) {
            this.cbpService.selectedElement['children'] = [];
          }
          eventObj.dataInfo['isExecuter'] = true;
          eventObj.dataInfo['dgUniqueID'] = 'data-' + (new Date().getTime());
          this.cbpService.dataJson.lastSessionUniqueId = ++this.cbpService.dataJson.lastSessionUniqueId;
          this.cbpService.selectedElement.children.push(eventObj.dataInfo);
          this.cbpService.selectedElement['dataEntryEnabled'] = true;
          this.cbpService.selectedElement['galleryEnabled'] = true;
          eventObj.dataInfo['toUsername'] = this.executionService.selectedUserName;
          this.mediaUdateFiles(eventObj);
        }
        this.setUpdateCBP();
        this.dataJsonService.setDetailsChange(this.sideNavVariables)
      }
    }
    // this.viewUpdate(true);
    this.sharedviewService.detectAll = true;
    this.getEventFromModalChild();
  }
  setUpdateCBP() {
    const indexStep = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === this.cbpService.selectedElement.dgUniqueID);
    this.cbpService.stepActionArray[indexStep] = this.cbpService.selectedElement;
    const indexSeq = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgUniqueID === this.cbpService.selectedElement.dgUniqueID);
    this.cbpService.stepSequentialArray[indexSeq] = this.cbpService.selectedElement;
    this.cbpService.selectedElement = this.executionService.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpJson.section);
    this.viewUpdate(true);
  }

  mediaUdateFiles(eventObj: any) {
    this.cbpService.mediaExecutorObjects = [...this.cbpService.mediaExecutorObjects, ...eventObj.dataInfo.images];
    this.cbpService.mediaExecutorObjects = this.sharedviewService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'name');
    if (eventObj?.type === 'upload') {
      this.cbpService.media = [...this.cbpService.media, ...eventObj.media];
      this.dataJsonService.setMediaItem(this.cbpService.media);
    }
    eventObj.dataInfo['selectedStepDgUniqueId'] = this.cbpService.selectedElement.dgUniqueID;
    eventObj.dataInfo['toUsername'] = this.executionService.selectedUserName;
    this.dataEntryJsonEvent(eventObj.dataInfo);
  }

  getCommentResponse(response: any) {
    this.commentModalOpen = false;
    this.isCommentUpdate = false;
    this.checkCommentOrChangRequest(response);
    if (this.cbpService.selectedElement.length > 1) {
      this.cbpService.selectedElement.filter((item: any) => {
        if (item?.dgUniqueID == response.dgUniqueID) {
          this.cbpService.selectedElement = item;
        }
      });
    }
  }
  getChangeRequestEvent(response: any) {
    this.changeRequestModalOpen = false;
    this.isChangeRequestUpdate = false;
    if (response !== false) {
      this.crArrayData = response.crData;
      this.tempCrData = response.crData;
    }
    this.checkCommentOrChangRequest(response);
    if (this.cbpService.selectedElement.length > 1) {
      this.cbpService.selectedElement.filter((item: any) => {
        if (item?.dgUniqueID == response.dgUniqueID) {
          this.cbpService.selectedElement = item;
        }
      });
    }
  }
  /// refactor this method
  checkCommentOrChangRequest(response: any) {
    if (response !== false) {
      if (response.dgType === 'updateComment' || response.dgType === 'UpdateChangeRequest') {
        this.cbpService.media = [...this.cbpService.media, ...response.media];
        this.cbpService.media = this.sharedviewService.removeDuplicates(this.cbpService.media, 'name');
        this.comments = JSON.parse(JSON.stringify(this.comments));
        this.crArrayData = JSON.parse(JSON.stringify(this.crArrayData));
        this.deleteItems(response);
      }
      // if (response.dgType === DgTypes.ChangeRequest || response.dgType === DgTypes.Comment) {
      //   if (response.dgType === DgTypes.ChangeRequest) {
      //     this.cbpService.selectedElement.isCRAvailable = true;
      //   } else {
      //     this.cbpService.selectedElement.isCommentAvailable = true;
      //   }
      // }made changes as comment/cr not working when section was changed while adding
      if (response.dgType === DgTypes.ChangeRequest || response.dgType === DgTypes.Comment) {
        if (response.dgType === DgTypes.ChangeRequest) {
          let currentStepCr = this.crArrayData.filter((item: any) => item.selectedStepDgUniqueId == this.cbpService.selectedElement);
          if (currentStepCr?.length > 0) {
            this.cbpService.selectedElement.isCRAvailable = true;
          } else { }
        } else {
          if (response.dgType === DgTypes.Comment) {
            let currentStepCom = this.crArrayData.filter((item: any) => item.selectedStepDgUniqueId == this.cbpService.selectedElement);
            if (currentStepCom?.length > 0) {
              this.cbpService.selectedElement.isCommentAvailable = true;
            } else { }
          }
        }
      }
      else {
        if (response.dgType === 'DeleteComment') {
          this.dataJsonService.setDetailsChange(this.sideNavVariables);
          this.cbpService.selectedElement = this.executionService.getElementByDgUniqueID(response.dgUniqueID, this.cbpJson.section);
          if (!response.isComment) {
            this.clearCommentIcons(response);
          }
          this.deleteItems(response);
        }
        if (response.dgType === 'deleteChangeRequest') {
          this.dataJsonService.setDetailsChange(this.sideNavVariables);
          this.cbpService.selectedElement = this.executionService.getElementByDgUniqueID(response.dgUniqueID, this.cbpJson.section);
          if (!response.isCR) { this.clearCrIcons(response); }
          this.deleteItems(response);
        }
      }
      this.dataJsonService.setMediaItem(this.cbpService.media);
      this.setCommentByDgUniqueID(this.cbpJson.section, response);
      this.setUpdateCBP();
      this.viewUpdate(true);
    }
    this.getEventFromModalChild();
  }

  deleteItems(response: any) {
    if (response?.deleteItems) {
      response?.deleteItems.forEach((fileName: string) => {
        //  const indexFileUrl = this.cbpService.dataJson.dataObjects.findIndex((item: any) => item.fileName === fileName);
        //  this.cbpService.dataJson.dataObjects.splice(indexFileUrl, 1);
        const indexValueUrl = this.cbpService.media.findIndex((item: any) => item.name === fileName || item.name === 'media/' + fileName);
        if (indexValueUrl != -1) {
          this.cbpService.media.splice(indexValueUrl, 1);
        }
        let mediaIndex = this.cbpService.mediaExecutorObjects.findIndex((item: any) => item.name === fileName)
        if (mediaIndex != -1) {
          this.cbpService.mediaExecutorObjects.splice(mediaIndex, 1);
        }
        this.cbpService.mediaBuilderObjects = JSON.parse(JSON.stringify(this.cbpService.mediaBuilderObjects));
        this.cbpService.mediaExecutorObjects = JSON.parse(JSON.stringify(this.cbpService.mediaExecutorObjects));
        this.cbpService.mediaExecutorObjects = this.cbpService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'fileName');
        this.cbpService.mediaBuilderObjects = this.cbpService.removeDuplicates(this.cbpService.mediaBuilderObjects, 'fileName');

        if (this.isMobile) {
          let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireMeadiaRemove, msg: fileName };
          this.datashareService.sendMessageFromLibToOutside(evt);
        }
        this.dataJsonService.setMediaItem(this.cbpService.media);
      });
    }
  }

  clearCommentIcons(response: any) {
    if (Array.isArray(this.cbpService.selectedElement)) {
      let newCmObj = this.cbpService.selectedElement.filter(item => this.executionService.sectionAndStep(item));
      this.cbpService.selectedElement = newCmObj[0];
    }
    this.cbpService.selectedElement.isCommentAvailable = false;
  }
  clearCrIcons(response: any) {
    if (Array.isArray(this.cbpService.selectedElement)) {
      let newCRObj = this.cbpService.selectedElement.filter(item => this.executionService.sectionAndStep(item));
      this.cbpService.selectedElement = newCRObj[0];
    }
    this.cbpService.selectedElement.isCRAvailable = false;
  }

  setCommentByDgUniqueID(object: any, obj: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgUniqueID == obj.dgUniqueID) {
        if (obj.dgType === DgTypes.Comment) {
          object[i].isCommentAvailable = true;
        }
        if (obj.dgType === 'ChangeRequest') {
          object[i].isCRAvailable = true;
        }
        if (obj.dgType === 'Repeat') {
          object[i].isChecked = false;
          object[i]['options'] = new StepOption();
          object[i].isTapped = 0;
        }
        break;
      }
      if (object[i].children) {
        this.setCommentByDgUniqueID(object[i].children, obj)
      }
    }
  }

  documentShow() {
    this.selectedUniqueId = 0;
    this.documentSelected = true;
    this.propertyDocument = this.cbpJson.documentInfo[0];
    this.cbpService.coverPageSelected = true;
    if (this.cdref) { this.cdref.detectChanges(); }
  }
  // e edocument code
  checkImageInCommentCR(data: any) {
    const images: any = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].dgType === DgTypes.Comment || data[i].dgType === DgTypes.ChangeRequest) {
        if (data[i].media.length > 0) {
          data[i].media.forEach((file: any) => { if (file) { images.push({ fileName: file.name }); } });
        }
      }
    }
    return images;
  }


  dataJsonUniqueIds() {
    this.cbpService.dataJson.dataObjects.forEach((element: any) => {
      if (element.dgUniqueID) {
        element.dgUniqueID = element.dgUniqueID.toString();
      }
    });
  }

  getCRCommentImages() {
    this.dataJsonUniqueIds();
    let images = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === DgTypes.Figure);
    let figrues = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === DgTypes.Figures);
    let updateFigures = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === 'UpdateFigure');
    let figuresSingleObjects: any[] = []
    if (figrues.length > 0) {
      for (let i = 0; i < figrues.length; i++) {
        if (figrues[i]?.images)
          figuresSingleObjects = [...figuresSingleObjects, ...figrues[i].images];
      }
    }
    const commentCrImages = this.checkImageInCommentCR(this.cbpService.dataJson.dataObjects);
    images = [...images, ...commentCrImages, ...figuresSingleObjects, ...updateFigures, ...this.updateMediaInfo];
    const storeImges: any = [];
    if (images.length > 0) {
      images.forEach((itemImage: any) => {
        const obj = this.cbpService.media.filter((item: any) => item.name.includes(itemImage.fileName) &&
          this.checkFileNameExistorNot(item.name, itemImage.fileName))
        if (obj[0] && obj[0]['size'] > 0 && !storeImges.includes(obj[0]))
          storeImges.push(obj[0]);
      });
    }
    return storeImges;
  }

  checkFileNameExistorNot(name: string, main: string) {
    let title: any;
    if (name.includes('media/')) {
      name.substring(6, name.length)
      title = name
    }
    else {
      title = main
    }
    return name === title ? true : false;
  }

  getAttachmentsBlobs() {
    let attachFiles = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dgType === 'Attachment');
    let attacheFiles: any[] = [];
    if (attachFiles?.length > 0) {
      attachFiles.forEach((itemImage: any) => {
        const obj = this.attachment.filter((item: any) => item.name.includes(itemImage.fileName) &&
          this.cbpService.checkAttachNameExist(item.name, itemImage.fileName));
        attacheFiles.push(obj[0]);
      });
    }
    return attacheFiles;
  }

  setLatestCurrentDataJson() {
    let items = this.cbpService.dataJson?.dataObjects.length > 0 ? this.cbpService.dataJson?.dataObjects : [];
    let dataObjects = JSON.parse(JSON.stringify(items));
    return dataObjects;
  }


  // code optimize
  saveCbpFileOnServer(type: any, source: any, fromType: string) {
    let zip = this.refactoreZipChanges(type, 'server');
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const file = new File([blob], 'testcbp');
      this.lastSessionDate = new Date();
      if (this.isMobile) {
        let evt: Request_Msg = { eventType: EventType.SaveDataJson, msg: '', opt: source };
        this.dataWrapperService.sendMessageFromLibToOutside(evt);
      } else if (source === 'inputevent' || fromType == 'autoSave' || fromType === 'server') {
        let evt: Request_Msg = { eventType: EventType.SaveDataJson, msg: { fileObj: file, type: type, currentDate: this.lastSessionDate, lastUpdatedTime: this.cbpService.updatedDateTime }, opt: source };
        // this.dataWrapperService.sendMessageFromLibToOutside(evt);
        this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
        this.cbpServerDataJson.emit(evt);
        //this.setDataJsonTxId();
      } else {
        let evt: Request_Msg = { eventType: EventType.SaveDataJson, msg: { fileObj: file, type: type, currentDate: this.lastSessionDate, lastUpdatedTime: this.cbpService.updatedDateTime }, opt: source };
        this.dataWrapperService.sendMessageFromLibToOutside(evt);
      }
      this.setLoader(false);
    }, (err: any) => {
      console.log('err: ' + err);
      this.setLoader(false);
    });
  }
  saveLocalCBP() {
    this.saveCbpFile('save', false, 'Local');
  }
  saveCbpFile(type: any = 'save', isAutoSaveEnabled: boolean = false, fromType: string = 'normal') {
    let other = '';
    if (this.menuConfig.isEwpExecuter && fromType === 'mainSave') {
      other = 'mainSave';
      fromType = 'eworkBuilder';
    }
    fromType = this.getFromType(fromType);
    this.cbpService.dataJson['isAutoSave'] = isAutoSaveEnabled;
    if (fromType === 'mobile' || this.isMobile) {
      if (!this.stopCbpExecution) {
        this.cbpService.dataJson['isAutoSave'] = isAutoSaveEnabled;
        this.saveDataJson.emit(this.cbpService.dataJson);
        let evt: Request_Msg = {
          eventType: type == 'refresh' ? EventType.refreshEvent : EventType.saveEvent,
          msg: type,
          datajson: JSON.parse(JSON.stringify(this.getDeltaJson())),
          signatureJson: this.executionService.signatureJson,
          dynamicSection: this.cbpService.dynamicSectionInfo,
          protectJson: this.cbpService.protectJson,
          annotateJson: this.annotateJson,
          executionOrderJson: this.executionOrderJson,
          opt: 'save',
          lastUpdatedEvent: this.cbpService.dataJson.dataObjects[this.cbpService.dataJson.dataObjects.length - 1].dgType,
        };
        this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
        this.datashareService.sendMessageFromLibToOutside(evt);
        if (!isAutoSaveEnabled) {
          this.setMessage(AlertMessages.mobile_save_Done);
        }
      }
    }
    if ((fromType != 'Local' && (fromType === 'server' || fromType === 'normal' || (this.cbpService.dataJson?.dataObjects?.length > 0)))
      && !this.menuConfig.isEwpExecuter) {
      if (type === 'refresh') {
        let evt: Request_Msg = { eventType: EventType.RefreshDataJson, msg: { type: 'refresh' } };
        this.dataWrapperService.sendMessageFromLibToOutside(evt);
      } else {
        this.saveCbpFileOnServer(type, 'save', fromType);
      }
    }
    if (this.menuConfig.isEwpExecuter && (fromType === 'eworkBuilder' || fromType === 'autoSave')) {
      let cbpJSON = {};
      let cbpJson = this.cbpConstJson;
      cbpJson.documentInfo[0] = this.cbpJson.documentInfo[0];
      cbpJSON = { ...cbpJson };
      this.downloadCBPJson = this.formatCBPJSON(JSON.parse(JSON.stringify(cbpJSON)));
      let zip = this.refactoreZipChanges(type, 'wholeCBP');
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const file = new File([blob], 'testcbp');
        this.closeType = other == '' ? fromType : other;
        this.sendWholeCBP.emit(file);
        this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
        this.setDataJsonTxId();
        // this.cbpService.dataJson = new DataJson();
      }, (err) => {
        console.log('err: ' + err);
      });
    }
    if (fromType === 'Local') {
      this.scroll();
      let cbpJSON = {};
      let cbpJson = this.cbpConstJson;
      cbpJson.documentInfo[0] = this.cbpJson.documentInfo[0];
      cbpJSON = { ...cbpJson };
      this.downloadCBPJson = this.formatCBPJSON(JSON.parse(JSON.stringify(cbpJSON)));
      this.cbpService.dataJson['isSavedDataJson'] = true;
      if (this.dynamicSectionInfo?.length > 0)
        this.dynamicSectionInfo.forEach(element => {
          if (element?.obj) delete element.obj;
        });
      this.saveModalopenLocal = true;
      this.detachExecuter();
    }
  }

  refactoreZipChanges(type: string, fromType: string) {
    const zip = new JSZip();
    if (fromType === 'server') {
      const storeImges = this.getCRCommentImages();
      if (storeImges.length > 0) {
        storeImges.forEach((blob: any) => {
          if (blob && blob.name !== 'media/') {
            zip.file('media/' + blob.name, blob);
          }
        });
      }
      const storeAttachments = this.getAttachmentsBlobs();
      if (storeAttachments?.length > 0) {
        storeAttachments.forEach((blob: any) => {
          if (blob && blob.name !== 'attachment/') {
            if (blob.name.includes('attachment/')) { blob.name = blob.name.substring(11, blob.name.length) }
            zip.file('attachment/' + blob.name, blob);
          }
        });
      }
      zip.file('data/data.json', JSON.stringify(this.getDeltaJson()));
    }
    if (fromType === 'wholeCBP') {
      zip.file('cbp.json', JSON.stringify(this.downloadCBPJson));
      zip.file('style/style.json', JSON.stringify(this.styleJson));
      zip.file('style/style-image.json', JSON.stringify(this.cbpService.styleImageJson));
      zip.file('style/layout.json', JSON.stringify(this.layOutJson));

      this.cbpService.dataJson['isSavedDataJson'] = type === 'ewpExecuter' ? true : false;
      zip.file('data/data.json', JSON.stringify(this.cbpService.dataJson));
      zip.file('data/protect.json', JSON.stringify(this.cbpService.protectJson));
      if (this.cbpService.media && this.cbpService.media.length > 0) {
        for (let i = 0; i < this.cbpService.media.length; i++) {
          const blob = this.cbpService.media[i];
          if (this.cbpService.media[i].name.includes('media/')) {
            zip.file(this.cbpService.media[i].name, blob);
          } else { zip.file('media/' + this.cbpService.media[i].name, blob); }
        }
      } else { zip.folder('media'); }
      if (this.attachment && this.attachment.length > 0) {
        for (let i = 0; i < this.attachment.length; i++) {
          const blob = this.attachment[i];
          if (this.attachment[i].name && this.attachment[i].name.includes('attachment/')) {
            zip.file(this.attachment[i].name, blob);
          } else { zip.file('attachment/' + this.attachment[i].name, blob); }
        }
      } else { zip.folder('attachment'); }
    }
    zip.file('data/signature.json', JSON.stringify(this.executionService.signatureJson));
    zip.file('data/execution-order.json', JSON.stringify(this.executionOrderJson));
    zip.file('data/dynamic-section.json', JSON.stringify(this.cbpService.dynamicSectionInfo));
    zip.file('data/protect.json', JSON.stringify(this.cbpService.protectJson));
    let annotateJson: any = (this.annotateJson?.annotateObjects?.length > 0) ? this.annotateJson : new AnnotateJson().init();
    zip.file('data/annotation.json', JSON.stringify(annotateJson))
    return zip;
  }

  getFromType(type: string) {
    if (type === 'normal') {
      this.isMobile = this.datashareService.getMenuConfig().isMobile;
      if (this.isMobile) return 'mobile';
      if (this.menuConfig.isEwpExecuter) return 'eworkBuilder';
      if (this.isServer) return 'server';
    }
    return type;
  }

  // code otimize

  getDeltaJson(): any {
    const dataJson = JSON.parse(JSON.stringify(this.cbpService.dataJson));
    const txnId = this.cbpService.dataJsonTxnIDS[this.cbpService.dataJsonTxnIDS.length - 1].dataJsonTxnId;
    dataJson.dataObjects = dataJson.dataObjects.filter((d: any, i: number) => this.sharedviewService.checkInt(d.TxnId, txnId));
    return dataJson;
  }

  // code otimizeng

  refreshCbpFile() {
    this.setLoader(true);
    let dataJson = this.getDeltaJson();
    this.refreshCbpFileChange = dataJson?.dataObjects?.length > 0 ? true : false;
    let type = this.refreshCbpFileChange ? 'save' : 'refresh';
    this.saveCbpFile(type, false, 'server');
  }
  callRefreshApi() {
    this.setLoader(true);
    let evt: Request_Msg = { eventType: EventType.RefreshDataJson, msg: { type: 'refresh' } };
    this.dataWrapperService.sendMessageFromLibToOutside(evt);
  }

  formatCBPJSON(object: any) {
    object.section.forEach((item: any) => this.removeUnwantedVariables(item, true));

    object.section = object.section.filter((item: any) => !item?.parentDynamicDgUniqueID);
    object.section = this.clearDataEntryValues(object.section, false, false, 0, 'clear', 0, 0, 'clear');
    object.documentInfo[0].header.children = this.clearTableImages(object.documentInfo[0].header.children);
    object.documentInfo[0].footer.children = this.clearTableImages(object.documentInfo[0].footer.children);
    if (object.documentInfo[0]?.newCoverPageeEnabled)
      object.documentInfo[0].coverPageData = this.tableService.setDefaultTableChanges(object.documentInfo[0].coverPageData, { type: 'clear', dataJson: [] });
    return object;
  }

  removeUnwantedVariables(data: any, isDownload: boolean = false) {
    if (data.number) {
      delete data['text'];
      if (data.children && Array.isArray(data.children)) {
        data.children.forEach((item: any) => this.removeUnwantedVariables(item, isDownload));
      }
    }
  }

  clearTableImages(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType == DgTypes.Form) {
        object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'removeImage', dataJson: [] });
        object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'removeUnUsedFields', dataJson: [] });
      }
    }
    return object;
  }

  clearUnUsedFields(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType == DgTypes.Form) {
        object[i] = this.tableService.setDefaultTableChanges(object[i], { type: 'removeUnUsedFields', dataJson: [] });
      }
    }
    return object;
  }

  setDataJsonChanges(data: any) {
    const self = this;
    let names: string[] = [];
    self.initailLoad = true;
    const zip = new JSZip();
    this.loading = true;
    zip.loadAsync(data).then(function (zip) {
      let files = Object.keys(zip.files);
      let isAnnoJsonMissing: boolean = !files.includes('data/annotation.json') ? true : false
      let isSignJsonMissing: boolean = !files.includes('data/signature.json') ? true : false;
      Object.keys(zip.files).forEach(function (filename, i: number) {
        zip.files[filename].async('string').then(function (fileData) {
          let isValidData = (fileData === undefined || fileData === '') ? false : true;
          if (filename.indexOf('data.json') > -1) {
            if (!isValidData) {
              self.cbpService.dataJson = new DataJson();
              self.setLoader(false);
            } else {
              self.cbpService.dataJson = new DataJson();
              self.clearDatajsonValues();
              self.cbpService.dataJson = JSON.parse(fileData);
            }
          }
          if (filename.indexOf('dynamic-section.json') > -1) {
            self.isFromCBPZip = true;
            self.cbpService.dynamicSectionInfo = !isValidData ? [] : JSON.parse(fileData);
          }
          if (filename.indexOf('signature.json') > -1) {
            self.executionService.signatureJson = JSON.parse(fileData);
            self.loading = false;
          }
          if (filename.indexOf('execution-order.json') > -1) {
            self.executionOrderJson = !isValidData ? new ExecutionOrderJson() : JSON.parse(fileData);
          }
          if (filename.indexOf('protect.json') > -1) {
            self.isFromCBPZip = true;
            self.cbpService.protectJson = !isValidData ? [] : JSON.parse(fileData);
          }
          if (filename.indexOf('annotation.json') > -1) {
            self.annotateJson = !isValidData ? new AnnotateJson().init() : JSON.parse(fileData);
          }
          names.push(filename)
          let valid = names.includes('data/data.json') && names.includes('data/dynamic-section.json') &&
            (isSignJsonMissing || names.includes('data/signature.json')) && (isAnnoJsonMissing || names.includes('data/annotation.json'))
            && names.includes('data/execution-order.json') && names.includes('data/protect.json');
          if (valid && self.initailLoad) {
            isAnnoJsonMissing = false;
            isSignJsonMissing = false;
            self.initailLoad = false;
            self.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
            self.setDataJsonTxId();
            self.cbpJson = self.cbpService.refreshNodes(self.cbpJson, self.disableNumber);
            if (self.cbpJson.documentInfo[0]['dynamicDocument']) {
              self.cbpService.dynmaicDocument = true;
              if (!self.cbpService.dynamicSectionInfo.dynamicObjects
                || (self.cbpService.dynamicSectionInfo?.dynamicObjects &&
                  self.cbpService.dynamicSectionInfo?.dynamicObjects?.length == 0)) {
                self.checkDynamicSection();
              } else {
                self.mapDynamicSection();
                self.setDynamicSection('load');
              }
              self.setTreeUpdate();
            }

            self.cbpService.stepActionArray = [];
            self.cbpService.stepSequentialArray = [];
            self.mapDataJsonWithCbpJson(self.cbpService.dataJson);
            self.storeSectionStepArray(self.cbpJson.section, self.cbpService.dataJson.dataObjects, 'refresh');
            self.selectStepFromEvent(self.cbpService.stepSequentialArray);
            self.getCommentsAndCrInfo(self.cbpService.dataJson.dataObjects);
            self.gotoCurrentStep('section' + self.cbpService.currentStep);
            if (self.cbpService.dataJson && self.cbpService.dataJson?.dataObjects?.length > 0) {
              self.executionService.setSignatureJson(self.cbpService.dataJson);
              self.executionService.setSignatureJson(self.verifyDataJson);
            }
            if (self.annotateJson?.annotateObjects?.length > 0) {
              // setTimeout(() => { self.setAnnotations(); }, 40);
              self.setAnnotations();
              self.loadedAnnotations = [];
              setTimeout(() => { self.refreshAnnotations(); }, 100);
            }
            self.sharedviewService.isViewUpdated = true;
            self.setMessage(AlertMessages.refreshMessage);
            self.setLoader(false);
          }
        });
        zip.files[filename].async('blob').then(function (fileData) {
          if (filename.indexOf('media/') > -1 && filename.length > 6) {
            self.cbpService.media.push(new File([fileData], filename));
            self.dataJsonService.setMediaItem(self.cbpService.media);
          }
          if (filename.indexOf('attachment/') > -1 && filename.length > 6) {
            const blob = new File([fileData], filename);
            self.attachment.push(blob);
          }
        });
      });
    });
  }
  validateTimedStep(event: any) {
    if (event.object?.children?.length > 0) {
      let children = event.object?.children.filter((item: any) => item.dgType === DgTypes.StepAction && item?.isChecked);
      if (children?.length == 0) {
        this.showTimedTimer(event['object']);
      }
    } else {
      this.showTimedTimer(event['object']);
    }
  }
  showTimer(obj: any) {
    this.selectedDelayStep = obj;
    if (obj?.dealyTime === undefined) { obj.dealyTime = '1'; }
    if (typeof obj?.dealyTime == 'number') { obj.dealyTime = obj.dealyTime.toString(); }
    if (obj.dealyTime.indexOf('.') > -1) {
      const minutes = obj.dealyTime.split('.');
      if (minutes?.length === 3) {
        this.timeValue = Number(minutes[0]) * 60 * 60 + Number(minutes[1]) * 60 + Number(minutes[2]) * 60;
      } else {
        this.timeValue = Number(minutes[0]) * 60 + Number(minutes[1]);
      }
    } else {
      this.timeValue = Number(obj.dealyTime) * 60;
    }
    this.delayTimerShow = true;
  }
  showTimedTimer(object: any) {
    this.isTimerOnStep = false;
    this.isTimerOnStep = JSON.parse(JSON.stringify(this.isTimerOnStep));
    this.cbpService.selectedElement['options']['inProgress'] = true;
    if (!this.cbpService.selectedElement['timerStepCompleted']) {
      this.cbpService.selectedElement['timerStepCompleted'] = false;
    }
    setTimeout(() => {
      this.isTimerOnStep = true;
      this.viewForm.isTimerOnStep = true;
      object['stepTimerStart'] = true;
      this.entirePageFreeze = true;
      this.executionService.setTimerStep({ dgType: DgTypes.Timed, type: 'start', object: object });
      let children = this.sharedviewService.getChildrenSteps(object);
      if (children?.length > 0) {
        this.viewForm.executeStepActions(children[0]);
      }
    }, 100);
  }
  getTimerEvent(event: any) {
    this.delayTimerShow = false;
    if (event.dgType === DgTypes.DelayStep) {
      if (this.viewForm)
        this.viewForm.stepActionComplete(event, true);
      this.storeDataObject(event, 'Completed', { 'delaystep': 'delaystepcomplete' });
    } else {
      event.time = event.time.replace(/:/g, '.');
      event.time = event.time.substring(3, event.time.length);
      this.cbpService.selectedElement['dealyTime'] = event.time;
      this.cbpService.selectedElement.options.inProgress = true;
    }
  }
  timedStepStop(event: any) {
    this.cbpService.selectedTimerRepeatStep = undefined;
    this.viewForm.isTimerOnStep = false;
    this.entirePageFreeze = false;
    this.executionService.setTimerStep({ dgType: DgTypes.Timed, type: 'stop' });
    this.cbpService.selectedElement['timerStepCompleted'] = true;
  }
  timerFinished(e: any) {
    if (e['action'] === 'done') {
      this.viewForm.isTimerOnStep = false;
      this.isTimerOnStep = JSON.parse(JSON.stringify(this.isTimerOnStep));
      this.executionService.setTimerStep({ dgType: DgTypes.Timed, type: 'stop' });
      this.freezePage = false;
      this.entirePageFreeze = false;
      this.cbpService.showSwalDeactive('Time Expired, Step has not completed.', 'warning', 'OK');
      this.cbpService.selectedElement = this.executionService.getElementByDgUniqueID(this.cbpService.selectedTimerRepeatStep.dgUniqueID, this.cbpJson.section)
      if (this.cbpService.selectedElement?.children?.length > 0)
        this.viewForm.setNotApplicable(this.cbpService.selectedElement.children, this.cbpService.selectedElement, this.stepTypes.NotApplicableStep);
      this.cbpService.selectedTimerRepeatStep = undefined;
      this.cbpService.selectedElement['isChecked'] = true;
      this.cbpService.selectedElement = this.sharedviewService.setDropDownValues(this.cbpService.selectedElement, false, true, false, false, false);
      if (this.viewForm) {
        this.viewForm.storeDataObject(this.cbpService.selectedElement, this.stepTypes.NotApplicableStep);
        let undoStep = this.viewForm.checkUndoStep(this.cbpService.selectedElement);
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: undoStep })
        this.viewForm.clearTimer(false);
      }
    }
  }
  getExecutionObj(type: string) {
    return new ExecuteObj(this.executionService.loggedInUserName, type);
  }
  async completeExecution() {
    let mesg: any;
    this.stepCompleteCount = this.cbpService.stepActionArray.filter((el: any) => (el.options.complete === true || el.options.notApplicable));
    mesg = AlertMessages.completeMessage; // as we have issue 720 jira
    const { value: userConfirms } = await this.cbpService.showCustomSwal(mesg, 'warning', 'No', 'Yes');
    this.completedExecution = userConfirms ? true : false;
    if (this.completedExecution) { this.terminationOrComplete(DgTypes.CompletedExecution, ActionId.ExecutionComplete); }
  }
  async terminateExecution() {
    const mesg = AlertMessages.terminateMessage;
    const { value: userConfirms } = await this.cbpService.showCustomSwal(mesg, 'warning', 'No', 'Yes');
    this.terminatedExecution = userConfirms ? true : false;
    if (this.terminatedExecution) { this.terminationOrComplete(DgTypes.TerminatedExecution, ActionId.ExecutionTerminate); }
  }

  stopExecution() {
    this.stopCbpExecution = !this.stopCbpExecution;
    let autoSave = this.datashareService.getMenuConfig()?.isAutoSave;
    if (this.stopCbpExecution) {//Stop Mode
      if (this.isMobile && autoSave)
        if (this.autoSaveInterval != undefined)
          clearInterval(this.autoSaveInterval); // Will clear the timer.
      if (this.isMobile) {
        let evt: Request_Msg = { eventType: EventType.stopexecution, msg: "stop execution", datajson: "", opt: 'stop' };
        this.datashareService.sendMessageFromLibToOutside(evt);
      }
    } else { //start Mode
      if (this.isMobile) {
        let evt: Request_Msg = { eventType: EventType.startexecution, msg: "start execution", datajson: "", opt: 'start' };
        this.datashareService.sendMessageFromLibToOutside(evt);
      }
    }
    const action = this.stopCbpExecution ? ActionId.ExecutionPause : ActionId.ExecutionStart;
    const type = this.stopCbpExecution ? 'PauseExecution' : 'RePlayExecution';
    this.storeDataJsonObject({ dgType: type }, action);
  }
  startCbpExecution() {
    this.terminationOrComplete(DgTypes.StartExecution, ActionId.ExecutionStart);
  }
  terminationOrComplete(type: any, action: any) {
    const obj: any = this.getExecutionObj(type);
    obj['dgType'] = type;
    obj['dgUniqueID'] = type === DgTypes.StartExecution ? 0 : -1;
    this.storeDataJsonObject(obj, action);
    if (ActionId.ExecutionTerminate == action || ActionId.ExecutionComplete == action) {
      this.cbpService.isDisabledAllInputEntries = true;
      this.cdref.detectChanges()
    }
    if (type != DgTypes.StartExecution && !this.isReadOnlyExecution && this.isEdocument && !this.isReadOnlyFromEdocument) {
      this.saveCbpFile('save', false, 'server');
    }
  }
  storeDataJsonObject(obj: any, action: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    if (obj.dgType === '') { delete obj.dgType; }
    dataInfo.action = action;
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj };
    if (dataInfoObj?.dgUniqueID == 0) {
      // console.log('dataJson Start Object', dataInfoObj);
    }
    this.dataEntryJsonEvent(dataInfoObj);
  }
  checkDocumentProtect() {
    if (this.cbpService.dataJson?.dataObjects?.length > 0) {
      let findIndex = this.cbpService.dataJson.dataObjects.findIndex((item: any) => item.dgType == DgTypes.CompletedExecution || item.dgType == DgTypes.TerminatedExecution)
      if (findIndex != -1) {
        let findUndoArray = this.cbpService.dataJson.dataObjects.slice(findIndex, this.cbpService.dataJson.dataObjects.length);
        if (findUndoArray?.length > 0) {
          let find = findUndoArray.filter((item: any) => item.dgType === DgTypes.UndoComment || item.dgType == DgTypes.UndoAuthorization);
          let bol = find?.length !== 0 ? false : true;
          this.setCompleteOrTermination(bol);
        } else {
          this.setCompleteOrTermination(true);
        }
      }
      this.completedExecution = JSON.parse(JSON.stringify(this.completedExecution));
      this.terminatedExecution = JSON.parse(JSON.stringify(this.terminatedExecution));
      this.cbpService.isDisabledAllInputEntries = this.completedExecution || this.terminatedExecution ? true : false;
    }
  }
  setCompleteOrTermination(bol: any) {
    this.terminatedExecution = bol;
    this.completedExecution = bol;
  }
  getCompleteOrTerm(dgType: any) {
    return (dgType == DgTypes.CompletedExecution || dgType == DgTypes.TerminatedExecution) ? true : false;
  }
  existingSecurityUserFromParent(event: any) {
    this.existingSecurityUser(event.item, event.type);
  }
  existingSecurityUser(item: any, type: any) {
    if (type === 'close') {
      this.customUsers = this.customUsers.filter(itemobj => itemobj !== item);
    } else if (type === 'exist' && item.userName !== 'New User') {
      this.securityUpdatedUser = item;
      this.openSecurity(true);
    } else {
      this.openSecurity(false);
    }
  }
  openSecurity(value: any) {
    this.upadateVerifyUser = value;
    this.showSecurityVerifyUser = true;
  }
  setSwitchUser(obj: any) {
    if (obj !== false) {
      this.setLoader(true);
      this.checkRolesStep(this.cbpJson.section);
      this.setLoader(false);
      this.customUsers = obj.customUsers;
    }
    this.getEventFromModalChild();
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.sharedviewService.longtitude = position.coords.longitude;
          this.sharedviewService.latitude = position.coords.latitude;
        } else { this.errorLocation(); }
      }, error => {
        this.errorLocation();
      })
    }
  }
  errorLocation() {
    this.sharedviewService.longtitude = this.sharedviewService.latitude = 'No data found';
  }
  closeUsageOption(event: any) {
    if (event !== false) {
      if (event?.oderJson) { this.executionOrderJson = event.oderJson; }
      let infoObj: any = this.getInfoObjWithProperties(event.obj);
      infoObj = { ...infoObj, ...event.obj };
      if (event.order !== undefined) { infoObj['modifyObj'] = event.order; }
      this.setSectionDependencyItems(this.cbpService.selectedElement, infoObj);
      if (infoObj['modifyObj']) {
        this.cbpService.selectedElement.orderChanged = true;
        this.updateCBPJSONOrder(this.cbpService.selectedElement.children, infoObj.dgUniqueID);
        this.setTreeOptions();
      }
      if (event.order !== undefined && infoObj['modifyObj']) {
        this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
        this.reUpdateCbpJsonWithDataJson('usage');
        this.setTreeOptions();
      }
    }
    this.showUsageOption = false;
    this.getEventFromModalChild();
  }
  setTreeOptions() {
    this.isTree = false;
    this.reSetTree();
    this.cdref.detectChanges();
  }

  // updating the orderjson changes
  updateCBPJSONOrder(object: any, dgUniqueID: any) {
    object.orderChanged = true;
    if (this.executionOrderJson?.orderObjects?.length > 0) {
      const orderObject: any = this.executionOrderJson.orderObjects.filter((item: any) => item.dgUniqueID == dgUniqueID)
      if (orderObject?.length > 0) {
        this.updateJSONOrder(object, orderObject[orderObject.length - 1].orderJson);
      }
    }
  }
  updateJSONOrder(object: any, orderArray: any) {
    orderArray.forEach((item: any) => {
      let index = object.findIndex((i: any) => i.dgUniqueID == item.dgUniqueID);
      let previousIndex = object.findIndex((i: any) => i.dgUniqueID == item.previousDgUniqueID);
      if (index == -1) {
        const element = this.executionService.getElementByNumber(item.parentID, object);
        if (element && element.children && object[item.previousPosition].dgSequenceNumber == item.previousDgSequenceNumber) {
          this.sharedviewService.swapElements(element.children, item.previousPosition, item.currentPosition);
        }
      } else {
        if (previousIndex != index && object[item.previousPosition].dgSequenceNumber == item.previousDgSequenceNumber) {
          this.sharedviewService.swapElements(object, item.previousPosition, item.currentPosition);
        }
      }
    });
  }
  setLoader(isLoader: boolean) {
    this.loading = isLoader;
  }

  /// layout changes
  applyLayOutChanges() {
    if (this.layOutJson !== undefined) {
      const layoutstyles = this.layOutJson.layout;
      if (layoutstyles && layoutstyles.length > 0) {
        this.layoutMargin = layoutstyles.filter((item: any) => item.name === 'margin');
        this.layoutIcons = layoutstyles.filter((item: any) => item.name === 'showhideicons');
        this.layoutService.layoutIcons = this.layoutIcons;
        this.indendation = layoutstyles.filter((item: any) => item.name === 'showIndendation');
        if (this.indendation?.length > 0)
          this.menuConfig.isIndendationEnabled = this.indendation[0].showIndendation;
        this.disableCircle = layoutstyles.filter((item: any) => item.name === 'disableCircle');
        this.disableNumber = layoutstyles.filter((item: any) => item.name === 'disableNumber');
        this.coverPage = layoutstyles.filter((item: any) => item.name === 'coverPage');
        this.collapseObj = layoutstyles.filter((item: any) => item.name === 'collapseView');
        if (this.disableCircle.length === 0) { this.disableCircle = [{ name: 'disableCircle', disableCircle: false }] }
        if (this.disableNumber.length === 0) { this.disableNumber = [{ name: 'disableNumber', disableNumber: false }] }
        this.layoutService.isDisableNumber = this.disableNumber[0].disableNumber;
        if (this.coverPage?.length === 0) {
          this.coverPage = [{ name: 'coverPage', coverPage: true }];
        }
        if (this.collapseObj?.length == 0) {
          this.collapseObj = [{ name: 'collapseView', collapseView: false }];
        }
        this.coverPageSet = this.coverPage[0].coverPage;
        this.layoutService.isHiddenIcon = this.layoutService.setLayoutStyle('showhideicons', this.layoutMargin, this.layoutIcons);
        this.layoutService.isDisableCircleSelected = this.layoutService.isDisableCirle(this.disableCircle);
        this.layoutMarginValue = this.layoutService.setLayoutStyle('margin', this.layoutMargin, this.layoutIcons);
        if (layoutstyles[6]?.marginTop != undefined) {
          this.menuConfig.marginTop = layoutstyles[6].marginTop
        }
        if (layoutstyles[7]?.marginBottom != undefined) {
          this.menuConfig.marginBottom = layoutstyles[7].marginBottom
        }
        if (this.menuConfig.marginBottom) {
          this.marginBottom = 150 + parseInt(this.menuConfig.marginBottom.toString());
        } else {
          this.marginBottom = 150;
        }

        if (layoutstyles[8]?.enableAutoScroll != undefined) {
          this.menuConfig.isAutoScrollEnabled = layoutstyles[8].enableAutoScroll
        }
        if (layoutstyles[9]?.enableDataProtection != undefined) {
          this.menuConfig.isDataProtected = layoutstyles[9].enableDataProtection
        }
      } else { this.setLayoutDefault(); }
    } else { this.setLayoutDefault(); }
  }

  setLayoutDefault() {
    this.layoutMargin = [{ name: 'margin', margin: '0' }];
    this.layoutIcons = [{ name: 'showhideicons', showIcons: true }];
    this.indendation = [{ name: 'showIndendation', showIndendation: false }];
    this.menuConfig.isIndendationEnabled = this.indendation[0].showIndendation;
    this.disableCircle = [{ name: 'disableCircle', disableCircle: false }];
    this.disableNumber = [{ name: 'disableNumber', disableNumber: false }];
    this.coverPage = [{ name: 'coverPage', coverPage: true }];
    this.collapseObj = [{ name: 'collapseView', collapseView: false }];
    this.layoutService.isHiddenIcon = this.layoutService.setLayoutStyle('showhideicons', this.layoutMargin, this.layoutIcons);
    this.layoutService.isDisableCircleSelected = this.layoutService.isDisableCirle(this.disableCircle);
  }

  setDetailPageValues(comment: any, media: any, cr: any, otSpView: any) {
    this.sideNavVariables.commentNavigation = comment;
    this.sideNavVariables.mediaLink = media;
    this.sideNavVariables.crNavigation = cr;
    this.sideNavVariables.otspView = otSpView;
    this.executionService.detailUpdate = true;
    this.dataJsonService.setDetailsChange(this.sideNavVariables);
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }
  viewUpdate(bol: boolean) {
    this.sharedviewService.isViewUpdated = bol;
    this.sharedviewService.tableViewUpdated = bol;
    this.scroll();
  }
  openDynamic() {
    this.openDynamicSection = true;
    if (!this.dynamicSectionInfo) { this.dynamicSectionInfo = []; }
    this.openDynamicSectionModal();
  }

  openDynamicSectionModal() {
    let obj = JSON.parse(JSON.stringify(this.modalOptions));
    obj.size = 'lg';
    const modalRef = this.modalService.open(DynamicSectionComponent, obj);
    modalRef.componentInstance.section = this.cbpJson?.section;
    modalRef.componentInstance.sectionInfo = this.dynamicSectionInfo;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      if (result.type == 'save') {
        result?.dynamicExecution?.forEach((item: any) => {
          if (item['update']) {
            let actionCode = item?.previousNumber > item?.dynamic_number ? 9250 : 9200;
            let dynamicSection = { dgType: 'DynamicSection', dgUniqueID: `s_${item.dgUniqueID}` };
            this.storeDataObject(dynamicSection, 'DynamicSection', { action: actionCode });
          }
        });
        this.closeDynamicSection(result);
        this.treeObj = JSON.parse(JSON.stringify(this.cbpJson));
        this.setTreeObject(this.treeObj);
      } else {
        this.dynamicSectionInfo = result.obj;
      }
      this.openDynamicSection = false;
      modalRef.close();
    });
  }

  checkDynamicSection() {
    this.loadDynamicSections();
    if (this.dynamicSectionInfo?.length > 0) {
      this.setDynamicSection('');
    }
  }
  loadDynamicSections() {
    // latest code to get all dynamic sections in cbp.
    this.loadDynamicObjects(this.cbpJson.section);
  }
  loadDynamicObjects(sections: any) {
    if (sections?.length > 0) {
      for (let i = 0; i < sections.length; i++) {
        if ((sections[i].dgType === DgTypes.Section || this.cbpService.stepActionCondition(sections[i])) && sections[i]?.dynamic_section) {
          this.dynamicSectionInfo.push(new DynamicSec(sections[i], i));
        }
        if (sections[i]?.children && sections[i]?.children?.length > 0) {
          this.loadDynamicObjects(sections[i].children);
        }
      }
    }
  }

  closeDynamicSection(event: any) {
    if (event !== false) {
      this.dynamicSectionInfo = event.dynamicExecution;
      this.currentNodeSelected = undefined;
      this.setDynamicSection('');
      this.setTreeUpdate();
      if (this.verifyDataJson == undefined) { this.verifyDataJson = new DataJson(); }
      this.cbpService.stepActionArray = [];
      this.cbpService.stepSequentialArray = [];
      this.cbpService.loadedCurrentStep = false;
      this.storeSectionStepArray(this.cbpJson.section, this.cbpService.dataJson.dataObjects, 'dynamic');
      this.dynamicSectionExecution = true;
      this.isTree = false;
      this.reSetTree();
      this.viewUpdate(true);
    }
    this.openDynamicSection = false;
  }
  reUpdateCbpJsonWithDataJson(type: string) {
    this.cbpService.stepActionArray = [];
    this.cbpService.stepSequentialArray = [];
    this.storeSectionStepArray(this.cbpJson.section, this.cbpService.dataJson.dataObjects, type);
  }

  setTreeUpdate() {
    this.isTree = false;
    this.cbpJson.section.forEach((element: any) => {
      element['state'] = element.hide_section ? { hidden: true } : { hidden: false }
    });
    this.cbpJson = this.cbpService.refreshNodes(this.cbpJson, this.disableNumber, true);
    const self = this;
    self.mapDataJsonWithCbpJson(self.cbpService.dataJson);
    this.treeObj = JSON.parse(JSON.stringify(this.cbpJson));
    this.setTreeObject(this.treeObj);
    this.reSetTree();
  }
  reSetTree() {
    setTimeout(() => { this.isTree = true; }, 5);
  }
  setDynamicSection(type: string) {
    let indexes: any = [];
    let dynamicObjects: any = [];
    if (type != 'load') {
      this.dynamicSectionInfo.forEach((i, d) => {
        if (i.dynamic_number != i['previousNumber']) {
          indexes.push(d);
          dynamicObjects.push(JSON.parse(JSON.stringify(i)));
        }
      })
    } else {
      this.dynamicSectionInfo.forEach((i, d) => { indexes.push(d); })
    }
    if (indexes && indexes.length > 0) {
      for (let i = 0; i < indexes.length; i++) {
        let numberLength = this.dynamicSectionInfo[indexes[i]].dynamic_number;
        const object = this.executionService.getElementByDgUniqueID(this.dynamicSectionInfo[indexes[i]].dgUniqueID, this.cbpConstJson?.section)
        if (object) {
          let dynamicObjArray = JSON.parse(JSON.stringify(object));
          let dynamicObj = Array.isArray(dynamicObjArray) ? dynamicObjArray[0] : dynamicObjArray;
          if (dynamicObj) {
            if (numberLength == 1 || numberLength == 0) { this.clearObjects(numberLength, dynamicObj); }
            if (numberLength > 1) { this.checkAllSections(numberLength, dynamicObj, type); }
            this.reupdateDgUniqueIdValues(dynamicObj);
          }
        }
      }
    }
    if (dynamicObjects?.length > 0) {
      let dynamicObject = new DynamicObject().init();
      dynamicObject.by = this.executionService.selectedUserId;
      dynamicObject.device = this.sharedviewService.getDeviceInfo();
      if (!this.cbpService.dynamicSectionInfo?.dynamicObjects) {
        this.cbpService.dynamicSectionInfo = new DynamicSectionInfo();
        this.cbpService.dynamicSectionInfo.dynamicObjects = [];
      }
      dynamicObjects.forEach((d: any) => {
        dynamicObject.dgUniqueIDList.push(d.dgUniqueID);
        dynamicObject.valueList.push(d.dynamic_number);
      });
      this.cbpService.dynamicSectionInfo.dynamicObjects.push(dynamicObject);
    }
    this.cbpService.activePage = 1;
    this.cbpService.startIndex = 1;
    this.cbpService.maxPage = 1
    const self = this;
    this.setPaginationIndex(this.cbpJson.section, this.cbpService.pageSize, null, self);
    this.cdref.detectChanges();
    // console.log(this.cbpJson.section);
  }
  reupdateDgUniqueIdValues(dynamicObj: any) {
    // update dgUniqueId in sections
    if (dynamicObj.dgSequenceNumber.endsWith('.0')) {
      const dynamicSections = this.cbpJson.section.filter((item: any) => item.number === dynamicObj.number);
      dynamicSections.forEach((element: any, i: number) => {
        if (i !== 0 && !element.dgUniqueID.toString().includes('d_')) {
          element = this.clearDataEntryValues([element], true, true, dynamicObj.dgUniqueID, 'dynamic', i - 1, element.dgUniqueID, 'dynamic');
          element = this.applyAllExecutionRules(element);
          this.executionService.dynamicDataEntryIds = new Map();
          this.setDynamicSectionMedia(element[0], i);
        }
      });
    }
  }

  clearObjects(count: number, object: any) {
    let objects = this.executionService.getElementByNumber(object.dgSequenceNumber, this.cbpJson.section);
    objects = Array.isArray(objects) ? objects : [objects];
    if (objects?.length > 0) {
      if (objects?.length === 1) {
        const section = this.executionService.getElementByNumber(object.dgSequenceNumber, this.cbpJson.section);
        section.hide_section = (count == 0) ? true : false;
        this.updateChildren(section.children, section.hide_section);
        this.cbpService.updateSelectedElement(section, this.cbpJson.section);
      } else {
        for (let i = 0; i < objects.length; i++) {
          if (objects[i].dgUniqueID.toString().includes('d'))
            this.cbpJson.section = this.executionService.deletElement(this.cbpJson.section, objects[i].dgUniqueID);
        }
        const section = this.executionService.getElementByNumber(object.dgSequenceNumber, this.cbpJson.section);
        section.hide_section = (count == 0) ? true : false;
        this.updateChildren(section.children, section.hide_section);
        this.cbpService.updateSelectedElement(section, this.cbpJson.section);
      }
    }
  }
  updateChildren(object: any, bol: boolean) {
    if (object && Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        if (this.cbpService.stepActionCondition(object[i]) || object[i].dgType === DgTypes.Section
          || object[i].dgType === DgTypes.StepInfo) {
          object[i]['hide_section'] = bol;
          this.cbpService.updateSelectedElement(object[i], this.cbpJson.section)
        }
        if (object[i]?.children && object[i]?.children?.length > 0) {
          this.updateChildren(object[i]?.children, bol);
        }
      }
    }
  }


  checkAllSections(count: number, dynamicObj: any, type: string) {
    let allSections = this.executionService.getElementByNumber(dynamicObj.number, this.cbpJson.section);
    allSections = Array.isArray(allSections) ? allSections : [allSections];
    this.setSections(dynamicObj);
    if (allSections?.length !== count) {
      if (allSections.length < count) {
        this.setObjects(count - allSections.length, dynamicObj, type);
      }
      if (allSections.length > count) {
        this.spliceCountSections(dynamicObj, count);
      }
    }
  }
  setSections(dynamicObj: any) {
    let objects = this.executionService.getElementByNumber(dynamicObj.dgSequenceNumber, this.cbpJson.section);

    objects = Array.isArray(objects) ? objects : [objects];
    for (let i = 0; i < objects.length; i++) {
      const dynamicObject = this.executionService.getElementByDgUniqueID(objects[i].dgUniqueID, this.cbpJson.section);
      dynamicObject.hide_section = false;
      this.updateChildren(dynamicObject.children, dynamicObject.hide_section);
    }
  }
  spliceCountSections(dynamicObj: any, count: any) {
    let objects = this.executionService.getElementByNumber(dynamicObj.dgSequenceNumber, this.cbpJson.section);
    objects = Array.isArray(objects) ? objects : [objects];
    for (let i = objects.length - 1; i >= count; i--) {
      const object = this.executionService.getElementByDgUniqueID(this.cbpJson.section, objects[i].dgUniqueID);
      this.deleteMediaForDynamicSction(object)
      this.cbpJson.section = this.executionService.deletElement(this.cbpJson.section, objects[i].dgUniqueID);
    }
  }

  deleteMediaForDynamicSction(newObj: any) {
    if (newObj && newObj.children && newObj.children.length > 0) {
      newObj.children.forEach((child: any) => {
        if (child.dgType == DgTypes.Figures) {
          child.images.forEach((img: any, index2: number) => {
            if (this.cbpService.media) {
              const value = this.cbpService.media.findIndex((media: any) => media.name === img.name);
              if (value != -1) { this.cbpService.media.splice(value, 1); }
            }
            const value = this.cbpService.mediaBuilderObjects.findIndex((media: any) => media.name === img.name);
            if (value != -1) {
              this.cbpService.mediaBuilderObjects.splice(value, 1);
            }
          });
        } else if (child.dgType == DgTypes.Figure) {
          if (this.cbpService.media) {
            const value = this.cbpService.media.findIndex((media: any) => media.name === child.name);
            if (value != -1) { this.cbpService.media.splice(value, 1); }
          }
          const value = this.cbpService.mediaBuilderObjects.findIndex((media: any) => media.name === child.name);
          if (value != -1) { this.cbpService.mediaBuilderObjects.splice(value, 1); }
        } else if (child.children && child.children.length > 0) {
          child.children.forEach((subChild: any, index2: number) => {
            this.deleteMediaForDynamicSction(subChild);
          });
        }
      });
      this.cdref.detectChanges();
    }
  }
  setObjects(add: number, dynamicObj: any, type: any) {
    for (let i = 0; i < add; i++) {
      let newObj = JSON.parse(JSON.stringify(dynamicObj));
      newObj['parentDynamicDgUniqueID'] = newObj.dgUniqueID;
      newObj.dynamic_number = 1;
      newObj.hide_section = false;
      // add element to cbpJson
      let newObj1 = JSON.parse(JSON.stringify(newObj));
      let object: any = this.executionService.getElementByNumber(dynamicObj.dgSequenceNumber, this.cbpJson.section);
      if (Array.isArray(object)) {
        object = object[object.length - 1];
      }
      if (this.cbpService.reverseTempMapUniqueID?.size !== this.cbpService.tempMapUniqueID?.size) {
        this.cbpService.tempMapUniqueID.forEach((value, key) => this.cbpService.reverseTempMapUniqueID.set(value?.toString(), key));
      }
      if (object.dgSequenceNumber.endsWith('.0')) {
        let newIndex = this.cbpJson.section.findLastIndex((item: any) => item.dgSequenceNumber == object.dgSequenceNumber);
        let index = newIndex + 1;
        const newObj1 = JSON.parse(JSON.stringify(newObj));
        this.cbpJson.section.splice(index, 0, newObj1);
      } else {
        const parent = this.executionService.getElementByNumber(object.parentID, this.cbpJson.section);
        let children = parent.children.filter((item: any) => item.number === object.number);
        newObj1 = this.clearDataEntryValues([newObj1], true, true, dynamicObj.dgUniqueID, 'dynamic', children.length - 1, newObj1.dgUniqueID, 'dynamic');
        newObj1 = this.applyAllExecutionRules(newObj1);
        this.executionService.dynamicDataEntryIds = new Map();
        this.setDynamicSectionMedia(newObj1[0], i);
        // parent.children.push(newObj1[0]); // fix DGV9DOT4-469
        let newIndex = parent.children.findLastIndex((item: any) => item.number === object.number);
        if (newIndex == -1 || newIndex == undefined) {
          newIndex = parent.children.findIndex((item: any) => item.number == object.number);
        }
        let index = newIndex + 1;
        parent.children.splice(index, 0, newObj1[0]);
      }
      this.cdref.detectChanges();
    }
  }
  applyAllExecutionRules(newObj: any): any {
    let execution = this.executionService;
    let antlr = this.antlrService;
    let reverseMap = this.cbpService.reverseTempMapUniqueID;
    if (execution.stepChildDerivedObjs?.length > 0) {
      newObj = execution.updateDerivedObjRules(newObj, antlr);
      execution.stepChildDerivedObjs = [];
    }
    if (execution.dataEntryAlarmRuleObj?.length > 0) {
      newObj = execution.updateAlarmObjRules(newObj, antlr);
      execution.dataEntryAlarmRuleObj = [];
    }
    if (execution.stepConditionalRuleObjs?.length > 0) {
      newObj = execution.applyAndClearConditionalRules(newObj, antlr, reverseMap, this.cbpJson.section);
      execution.stepConditionalRuleObjs = [];
    }
    if (execution.applicabilityObjs?.length > 0) {
      newObj = execution.updateApplicabilityRules(newObj, antlr);
      execution.applicabilityObjs = [];
    }
    return newObj;
  }

  setDynamicSectionMedia(newObj: any, index: number = 1, subIndex: number = 0) {
    if (newObj && newObj.children && newObj.children.length > 0) {
      newObj.children.forEach((child: any) => {
        if (child.dgType == DgTypes.Figures) {
          child.images.forEach((img: any, index2: number) => {
            img.dgUniqueID = 'D_' + index + '_' + (subIndex++)
            const fileData = this.cbpService.media.find(i => this.getMediaNames(i, child));
            this.storeMediaFiles(fileData, img);
          });
        } else if (child.dgType == DgTypes.Figure) {
          const fileData = this.cbpService.media.find(i => {
            child.dgUniqueID = 'D_' + index + '_' + (subIndex++)
            this.getMediaNames(i, child);
          })
          this.storeMediaFiles(fileData, child);
        } else if (child.children && child.children.length > 0) {
          child.children.forEach((subChild: any, index2: number) => {
            this.setDynamicSectionMedia(subChild, index, subIndex);
          });
        }
      });
    }
  }
  getMediaNames(i: any, img: any) {
    return i.name.includes('media/') ? i.name == 'media/' + img.fileName : i.name == img.fileName;
  }
  storeMediaFiles(fileData: any, child: any) {
    if (fileData) {
      const blob = new File([fileData], 'media/' + child.dgUniqueID + '_' + child.fileName);
      child.fileName = child.dgUniqueID + '_' + child.fileName;
      child.name = child.fileName;
      this.cbpService.media.push(blob);
      this.dataJsonService.setMediaItem(this.cbpService.media);
      this.cbpService.mediaBuilderObjects.push(child);
    }
  }

  detachExecuter() {
    this.cdref.reattach();
    setTimeout(() => { this.cdref.detach(); }, 5000);
  }
  closeDownload(value: any) {
    this.saveModalopenLocal = false;
    this.getEventFromModalChild();
  }
  menuBarChange(event: any) {
    this.isMenuBarOpen = event;
    let obj = JSON.parse(JSON.stringify(this.modalOptions));
    obj.size = 'lg';
    const modalRef = this.modalService.open(MenuBarComponent, obj);
    modalRef.componentInstance.propertyDocument = this.propertyDocument;
    modalRef.componentInstance.menuConfig = this.menuConfig;
    modalRef.componentInstance.standalone = this.standalone;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      if (result != false) {
        this.menuConfig = result.menuConfig;
        if (this.menuConfig.marginBottom) {
          this.marginBottom = 150 + parseInt(this.menuConfig.marginBottom.toString());
        } else {
          this.marginBottom = 150;
        }
        if (this.menuConfig.isLocationEnabled) {
          this.getLocation();
        } else {
          this.sharedviewService.longtitude = '';
          this.sharedviewService.latitude = '';
        }
        this.closeMenuBar(result.menuConfig);
        modalRef.close();
      }
      this.isMenuBarOpen = false;
      modalRef.close();
    });
  }
  setMenuBarFields(documentInfo: any) {
    this.menuConfig.isNavigation = this.propertyDocument['showNavigation'] ?? true;
    this.menuConfig.isPageHeader = documentInfo.header.isHeaderEnabled;
    this.menuConfig.isDataProtected = this.cbpJson.documentInfo[0]['isDataProtected'];
    this.menuConfig.isPageFooter = documentInfo.footer.isFooterEnabled;
    this.menuConfig.isDisableCircle = this.disableCircle[0].disableCircle;
    this.menuConfig.isShowSectionStepIcon = this.layoutIcons[0].showIcons;
    if (!this.layOutJson) { this.layOutJson = layoutJson; }
    this.menuConfig.isCollapsibleViewEnabled = this.collapseObj[0].collapseView;
    this.menuConfig.isPageHeader = this.cbpJson.documentInfo[0]['header']['isHeaderEnabled'];
    this.menuConfig.isPageFooter = this.cbpJson.documentInfo[0]['footer']['isFooterEnabled'];
    this.menuConfig.isNavigation = this.cbpJson.documentInfo[0]['showNavigation'];
    this.menuConfig.disableAutoStepNavigation = this.cbpJson.documentInfo[0]['disableAutoStepNavigation'] ? this.cbpJson.documentInfo[0]['disableAutoStepNavigation'] : true;
    this.cbpService.disableAutoStep = this.menuConfig.disableAutoStepNavigation;
  }
  closeMenuBar(menuConfig: any) {
    this.menuConfig = JSON.parse(JSON.stringify(menuConfig));
    this.disableCircle[0].disableCircle = this.menuConfig.isDisableCircle;
    this.layoutIcons[0].showIcons = this.menuConfig.isShowSectionStepIcon;
    this.isMenuBarOpen = false;
    this.cbpService.documentInfo['isDataProtected'] = this.menuConfig.isDataProtected;
    this.layoutService.isDisableCircleSelected = this.layoutService.isDisableCirle(this.disableCircle);
    this.layoutService.isHiddenIcon = this.layoutService.setLayoutStyle('showhideicons', this.layoutMargin, this.layoutIcons);
    this.indendation[0].showIndendation = this.menuConfig.isIndendationEnabled;
    this.cbpService.showUpdates = this.menuConfig.showUpdates;
    this.cbpService.disableAutoStep = this.menuConfig.disableAutoStepNavigation;
    if (this.cbpService.disableAutoStep) {
      this.propertyDocument['disableAutoStepNavigation'] = this.cbpService.disableAutoStep;
      this.cbpJson.documentInfo[0]['disableAutoStepNavigation'] = this.cbpService.disableAutoStep;
    }
    this.reUpdateLayout();
    this.cdref.detectChanges();
  }
  updateNavigation(event: any) {
    this.menuConfig.isNavigation = event;
    this.propertyDocument['showNavigation'] = event;
    this.cbpJson.documentInfo[0]['showNavigation'] = event;
  }
  reUpdateLayout() {
    let collaspe = this.layOutJson?.layout?.filter((item: any) => item.name === 'collapseView');
    if (collaspe?.length === 0) {
      this.layOutJson.layout.push({ name: 'collapseView', collapseView: false });
    }
    this.layOutJson?.layout.forEach((item: any) => {
      if (item.name === 'showIcons') {
        item.showIcons = this.menuConfig.isShowSectionStepIcon
      }
      if (item.name === 'disableCircle') {
        item.disableCircle = this.menuConfig.isDisableCircle
      }
      if (item.name === 'collapseView') {
        item.collapseView = this.menuConfig.isCollapsibleViewEnabled
      }
    });
    this.propertyDocument['showNavigation'] = this.menuConfig.isNavigation;
    this.cbpJson.documentInfo[0]['showNavigation'] = this.menuConfig.isNavigation;
    this.cbpJson.documentInfo[0]['header']['isHeaderEnabled'] = this.menuConfig.isPageHeader;
    this.cbpJson.documentInfo[0]['footer']['isFooterEnabled'] = this.menuConfig.isPageFooter;
    this.storelayoutStyles(this.cbpJson.section);
  }
  updateViewTextMethod(event: any) {
    let stepObj = this.executionService?.selectedFieldEntry;
    stepObj = this.setFieldObj(stepObj)
    if (stepObj !== undefined) {
      this.executionService.isPopupOpened = true;
      let obj = JSON.parse(JSON.stringify(this.modalOptions));
      obj.size = 'lg';
      const modalRef = this.modalService.open(TextEditorComponent, obj);
      modalRef.componentInstance.input = stepObj.storeValue;
      modalRef.componentInstance.stepObject = stepObj;
      this.config = this.resetConfig(this.config);
      modalRef.componentInstance.foreColor = this.cbpJson.documentInfo[0]['color'];
      modalRef.componentInstance.config = JSON.parse(JSON.stringify(this.config));
      modalRef.componentInstance.selectedFieldEntry = this.executionService?.selectedFieldEntry;
      modalRef.componentInstance.closeEvent.subscribe((result: any) => {
        if (result != false) {
          this.executionService.selectedFieldEntry = this.setFieldObj(this.executionService.selectedFieldEntry);
          this.executionService.selectedFieldEntry['innerHtmlView'] = true;
          if (this.executionService.selectedFieldEntry?.decimal > 0) {
            let field = this.executionService.selectedFieldEntry;
            let item = this.tableService.getStylesForElement(result);
            let numberText = this.cbpService.removeHTMLTags(result);
            let split = numberText.split('.');
            let lastText = split[1].slice(0, this.executionService.selectedFieldEntry?.decimal);
            numberText = split[0] + '.' + lastText;
            if (item.color || item.size || item.family) {
              numberText = this.tableService.setStylesForElement(item, field?.setStyle?.textalign, numberText);
            }
            result = numberText;
          }
          this.executionService.selectedFieldEntry['storeValue'] = result;
          if (this.executionService.selectedFieldEntry.protect && this.executionService.selectedFieldEntry?.comments !== '') {
            this.executionService.selectedFieldEntry['isCommentUpdated'] = true;
            this.executionService.selectedFieldEntry['protectColor'] = '#c7ab21';
            this.sharedviewService.showComments = true;
            if (!this.executionService.selectedFieldEntry['approveList']) { this.executionService.selectedFieldEntry['approveList'] = []; }
            if (this.executionService.selectedFieldEntry['approveList']?.length === 0) { this.executionService.selectedFieldEntry = this.setProtectObj(this.executionService.selectedFieldEntry); }
            this.executionService.setColorItem({ 'enableCommentsProtect': 'enableComments', bol: true });
          }
          let obj = this.sharedviewService.storeDataObj(this.executionService.selectedFieldEntry, this.executionService.selectedFieldEntry.storeValue);
          this.sessionDataJsonStore(obj);
          this.datashareService.changeCount++;
          this.viewUpdate(true);
        }
        this.executionService.isPopupOpened = false;
        modalRef.close();
        this.executionService.selectedNewEntry = undefined;
      });
    }
  }
  resetConfig(config: any) {
    config = JSON.parse(JSON.stringify(this.dataJsonService.config));
    config.toolbarPosition = 'top';
    config.minHeight = '5rem';
    config.maxHeight = '15rem';
    config.overFlow = 'auto';
    config.foreColor = this.cbpJson.documentInfo[0]['color'];
    return config;
  }
  setFieldObj(stepObj: any) {
    if (stepObj?.dgType === DgTypes.Table ||
      (this.executionService.selectedFieldEntry === undefined &&
        this.executionService?.selectedNewEntry)) {
      stepObj = this.executionService?.selectedNewEntry;
      this.executionService.selectedFieldEntry = stepObj;
    }
    return stepObj;
  }

  setProtectObj(stepObject: any) {
    stepObject['approveList'].push(new ApproveStatus(stepObject.protectOldValue, stepObject.storeValue, this.executionService.selectedUserName, '', new Date(), 'Pending', stepObject.comments))
    return stepObject;
  }

  protectSection(event: any) {
    event.item['protect'] = event.protect;
    let index = this.cbpJson.section.findIndex((item: any) => item.dgUniqueID === event.item.dgUniqueID);
    this.cbpJson.section[index] = event.item;
    this.dataJsonService.setSelectItem({ item: event.item });
    this.applyTableRules(this.cbpJson.section[index]?.children);
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction('completed', user, new Date(), user, new Date(), '',
      'ProtectSection', '', '6000');
    let protect = { 'protect': event.protect };
    stepAction = { ...stepAction, ...this.sharedviewService.setUserInfoObj(6000), ...protect };
    console.log(stepAction);
    this.dataEntryJsonEvent(stepAction);
    this.sharedviewService.detectAll = true;
    this.cdref.detectChanges();
  }
  applyTableRules(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.Form) {
        let findTables = this.cbpService.dataJson.dataObjects.filter((data: any) => data?.tableDgUniqueID === object[i].dgUniqueID && data?.tableRuleExecution);
        if (findTables?.length > 0)
          this.setTableRuleExecution(findTables, object[i]);
      }
      if (object[i]?.children?.length > 0 && object[i]?.children) {
        this.applyTableRules(object[i]?.children);
      }
    }

  }
  selectedRowTable(event: any) {
    if (event.type === 'bottom' || event.type === 'above') {
      let type = this.cbpService.selectedTable.dgUniqueID?.toString()?.includes('d') ? 'dynamic' : '';
      let newObject;
      if (type == '') {
        newObject = this.updateDgUniqueIdForRowsAndColumnsOnly(JSON.parse(JSON.stringify(event.row)));
      } else {
        newObject = this.updateDynamicSectionDgUniqueIdForRowsAndColumnsOnly(JSON.parse(JSON.stringify(event.row)), event);
      }
      // console.log(newObject);
      let obj = this.tableService.reupdateEntryValues(newObject, 'empty');
      let index = event.type === 'bottom' ? event.index + 1 : event.index;
      obj = this.applyAllExecutionRules(obj);
      this.executionService.dynamicDataEntryIds = new Map();
      this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row =
        this.executionService.insertArrayIndex(this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row, index, JSON.parse(JSON.stringify(obj)));
      if (event?.index == index) {
        this.executionService.setRowField({ type: 'slectedRow', row: obj, table: this.cbpService.selectedTable, index: event.index });
      }
      this.storeDynamicTableRowInfo(event, newObject);
      let count = 0;
      // if(type === 'dynamic'){
      //   let items = this.executionService.getElementByNumber(this.cbpService.selectedElement.number, this.cbpJson.section);
      //   count = items.findIndex((item:any)=>item.dgUniqueID === this.cbpService.selectedElement.dgUniqueID);
      //   this.cbpService.selectedTable = this.tableService.setDefaultTableChanges(this.cbpService.selectedTable, {type:type, count:count-1},null)
      // } else {
      //   this.cbpService.selectedTable = this.tableService.setDefaultTableChanges(this.cbpService.selectedTable, {type: 'rowUpdated'}, null);
      // }
      let rowLength = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row.length;
      if (index != rowLength) {
        let next = event.type === 'bottom' ? index + 1 : index - 1;
        this.setDataJsonRows(index, next, this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row)
      }
    } else if (event.type === 'delete') {
      let originalIndex = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row.findIndex((i: any) => i.dgUniqueID == event?.row?.dgUniqueID);
      //this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row.splice(originalIndex, 1);
      // this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row.splice(event.index, 1);
      if (event?.row?.dgUniqueID) {
        this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row =
          this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row.filter((i: any) => i.dgUniqueID != event?.row?.dgUniqueID)
        this.storeDynamicTableRowInfo(event, event.row);
      }


    } else if (event.type === 'copy') {
      this.notifier.hideAll();
      this.notifier.notify('success', 'Table data has copied successfully');
      this.clearCopyTableInfo();
    } else if (event.type === 'paste') {
      this.cbpService.selectCellEnabled = false;
      const item = this.executionService.selectedFieldEntry ? this.executionService.selectedFieldEntry : this.executionService.selectedNewEntry;
      if (this.tableService.selectedRow.length === 1 && event.row?.length == 1) {
        if (item?.dataType == "Number") {
          if (!isNaN(this.cbpService.copySelectedDataEntry?.storeValue)) {
            item.storeValue = this.cbpService.copySelectedDataEntry?.storeValue;
          }
          else {
            this.cbpService.notiferMessage('error', 'Only numbers are allowed')
            this.tableService.selectedRow = [];
          }
        }
        else {
          if (this.cbpService.copySelectedDataEntry?.storeValue && this.cbpService.isHTMLText(this.cbpService.copySelectedDataEntry?.storeValue)) {
            item['innerHtmlView'] = true;
          }
          item.storeValue = this.cbpService.copySelectedDataEntry?.storeValue;
        }
      }
      else {
        if ((this.tableService.selectedRow.length == event.row?.length) || (event.row?.length > this.tableService.selectedRow.length)) {
          this.tableService.pasteCurrentElement(item, this.cbpService.media);
        } else {
          this.notifier.notify('error', 'Unable to paste the table data, Selected fields and Copy data miss match');
        }
      }
      let rows = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row;
      this.storeTableDataEntryItems(rows)
    }
    // this.cdref.detectChanges();
    this.viewUpdate(true);

  }

  updateDynamicSectionDgUniqueIdForRowsAndColumnsOnly(row: any, event: any) {
    row['previousRowDgUniqueID'] = row.dgUniqueID;
    let procedureSnippetIndex = '';
    let dgUniqueIdString = event.table.dgUniqueID.toString();
    if (dgUniqueIdString.includes('p_')) {
      let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
      //const index =  indexArr[1].split('_')[0]
      if (indexArr) {
        indexArr.pop();
        procedureSnippetIndex = indexArr.join('_') + '_';
      }
    }
    row.dgUniqueID = event.table.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + 'r_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;
    row.entry?.forEach((entry: any) => {
      entry['previousColumnDgUniqueID'] = + entry['dgUniqueID'];
      entry['dgUniqueID'] = event.table.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;
      if (entry.children && entry.children.length > 0) {
        entry.children.forEach((child: any) => {
          if (child.dgType === DgTypes.Form) {
            this.setDgUniqueIdsForTable(child, procedureSnippetIndex);
          } else if (this.tableService.checkTableDataEntries(child) || child?.dgType == DgTypes.LabelDataEntry || child?.dgType == DgTypes.Para) {
            // child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + child['dgUniqueID'];
            child['previousEntryDgUniqueID'] = child['dgUniqueID'];
            const dgUniqueID = JSON.parse(JSON.stringify(child['dgUniqueID']));
            if (typeof child['dgUniqueID'] === 'string' && child['dgUniqueID']?.includes('_')) {
              const splitChar = procedureSnippetIndex ? '_' : Components.SPECIAL_SPLIT_CHAR;
              let split = child['dgUniqueID'].split(splitChar);
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
            } else {
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + child['previousEntryDgUniqueID'];
            }
            if (this.cbpService.isDataEtry(child)) {
              this.storeTableDerivedAndAlarmObjs(child, dgUniqueID);
            }
          }
        });
      }
    });
    return row;
  }
  updateDgUniqueIdForRowsAndColumnsOnly(row: any) {
    row['previousRowDgUniqueID'] = row.dgUniqueID;
    let procedureSnippetIndex = '';
    let dgUniqueIdString = row.dgUniqueID.toString();
    if (dgUniqueIdString.includes('p_')) {
      let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
      //const index =  indexArr[1].split('_')[0]
      if (indexArr) {
        indexArr.pop();
        procedureSnippetIndex = indexArr.join('_') + '_';
      }
    }
    row.dgUniqueID = 'e_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;
    row.entry?.forEach((entry: any) => {
      entry['previousColumnDgUniqueID'] = entry['dgUniqueID'];
      entry['dgUniqueID'] = 'e_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;
      if (entry.children && entry.children.length > 0) {
        entry.children.forEach((child: any) => {
          if (child.dgType === DgTypes.Form) {
            this.setDgUniqueIdsForTable(child, procedureSnippetIndex);
          } else if (this.tableService.checkTableDataEntries(child) || child?.dgType == DgTypes.LabelDataEntry || child?.dgType == DgTypes.Para
          ) {
            // child['dgUniqueID'] = row.dgUniqueID + '_' + child['dgUniqueID'];
            child['previousEntryDgUniqueID'] = child['dgUniqueID'];
            const dgUniqueID = JSON.parse(JSON.stringify(child['dgUniqueID']));
            if (typeof child['dgUniqueID'] === 'string' && child['dgUniqueID']?.includes('_')) {
              const splitChar = procedureSnippetIndex ? '_' : Components.SPECIAL_SPLIT_CHAR;
              let split = child['dgUniqueID'].split(splitChar);
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
            } else {
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + child['previousEntryDgUniqueID'];
            }
            if (this.cbpService.isDataEtry(child)) {
              this.storeTableDerivedAndAlarmObjs(child, dgUniqueID);
            }
          }
        });
      }
    });
    return row;
  }
  setDgUniqueIdsForTable(data: any, procedureSnippetIndex = '') {
    try {
      data?.calstable[0]?.table?.tgroup?.thead?.forEach((th: any) => {
        if (!th['dgUniqueID']) {
          th['dgUniqueID'] = 'e_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;

        }
      });
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        if (!tr['dgUniqueID']) {
          tr['previousRowDgUniqueID'] = i > 0 ? data?.calstable[0]?.table?.tgroup?.tbody[0]?.row[i - 1]?.['dgUniqueID'] : undefined;
          tr['dgUniqueID'] = 'e_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;
          tr.entry?.forEach((entry: any) => {
            if (!entry['dgUniqueID']) {
              entry['dgUniqueID'] = 'e_' + procedureSnippetIndex + ++this.cbpService.uniqueIdIndex;

            }
            if (entry.children && entry.children.length > 0) {
              entry.children.forEach((child: any) => {
                if (child.dgType === DgTypes.Form) {
                  this.setDgUniqueIdsForTable(child);
                } else if (this.tableService.checkTableDataEntries(child)) {
                  const dgUniqueID = JSON.parse(JSON.stringify(child['dgUniqueID']));
                  const splitChar = procedureSnippetIndex ? '_' : Components.SPECIAL_SPLIT_CHAR;

                  let split = child['dgUniqueID'].split(splitChar);
                  child['previousEntryDgUniqueID'] = child['dgUniqueID'];
                  child['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
                  if (this.cbpService.isDataEtry(child)) {
                    this.storeTableDerivedAndAlarmObjs(child, dgUniqueID);
                  }
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  storeTableDerivedAndAlarmObjs(child: any, dgUniqueID: any) {
    if (child) {
      if (this.cbpService.reverseTempMapUniqueID?.size !== this.cbpService.tempMapUniqueID?.size) {
        this.cbpService.tempMapUniqueID.forEach((value, key) => this.cbpService.reverseTempMapUniqueID.set(value?.toString(), key));
      }
      if (dgUniqueID?.toString().includes("e_")) {
        const parts = dgUniqueID.toString().split('_');
        dgUniqueID = parts.length >= 3 ? parts[2] : '';
      }
      let fieldName = this.cbpService.reverseTempMapUniqueID.get(dgUniqueID);
      if (fieldName) {
        fieldName = fieldName?.replace(/[\[\]']+/g, '')
        this.antlrService.callBackObject.init(fieldName, child.dgUniqueID);
      }
      if ((child.dgType === DgTypes.NumericDataEntry || child.dgType === DgTypes.TextDataEntry) && child?.valueType == DgTypes.Derived) {
        this.executionService.stepChildDerivedObjs.push(child)
      }
      if (child?.alarm?.length > 0) {
        this.executionService.dataEntryAlarmRuleObj?.push(child);
      }
      if (!fieldName) { fieldName = child?.fieldName };
      this.executionService.storeDynamicDataEntryIDs(fieldName, child.dgUniqueID);
    }
  }
  setDgUniqueIdsForDynamicSectionTable(data: any) {
    try {
      data?.calstable[0]?.table?.tgroup?.thead?.forEach((th: any, i: number) => {
        th['dgUniqueID'] = data['dgUniqueID'] + '_h_' + (th['dgUniqueID'] ? th['dgUniqueID'] : i);
      });
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        tr['previousRowDgUniqueID'] = i > 0 ? data?.calstable[0]?.table?.tgroup?.tbody[0]?.row[i - 1]?.['dgUniqueID'] : undefined;
        tr['dgUniqueID'] = data['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + 'r_' + (tr['dgUniqueID'] ? tr['dgUniqueID'] : i);
        tr.entry?.forEach((entry: any, c: number) => {
          entry['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + entry['dgUniqueID'];
          if (entry.children && entry.children.length > 0) {
            entry.children.forEach((child: any) => {
              if (child.dgType === DgTypes.Form) {
                child['dgUniqueID'] = data['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + child['dgUniqueID'];
                this.setDgUniqueIdsForDynamicSectionTable(child);
              }
              if (this.tableService.checkTableDataEntries(child)) {
                const dgUniqueID = JSON.parse(JSON.stringify(child['dgUniqueID']));
                child['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + child['dgUniqueID'];
                if (this.cbpService.isDataEtry(child)) {
                  let fieldName = this.cbpService.reverseTempMapUniqueID.get(dgUniqueID);
                  if (fieldName == undefined) {
                    fieldName = child?.tableFieldName?.replace(/[\[\]']+/g, '')
                    this.cbpService.reverseTempMapUniqueID.set(dgUniqueID, fieldName);
                    this.cbpService.storeTempMapID(fieldName, { dgUniqueID: dgUniqueID })
                  }
                  fieldName = fieldName?.replace(/[\[\]']+/g, '')
                  this.antlrService.callBackObject.init(fieldName, child.dgUniqueID);
                  this.executionService.storeDynamicDataEntryIDs(fieldName, child.dgUniqueID);
                }
                if ((child.dgType === DgTypes.NumericDataEntry || child.dgType === DgTypes.TextDataEntry) && child?.valueType == DgTypes.Derived) {
                  this.executionService.stepChildDerivedObjs.push(child)
                }
                if (child?.alarm?.length > 0) {
                  this.executionService.dataEntryAlarmRuleObj?.push(child);
                }
              }
            });
          }
        });
      });
    } catch (error) {
      console.log(error)
    }

  }
  clearCopyTableInfo() {
    this.cbpService.selectCellEnabled = false;
    this.cbpService.copiedElement = [];
    this.tableService.selectedRow = [];
  }

  storeTableDataEntryItems(rows: any) {
    for (let k = 0; k < rows.length; k++) {
      if (rows[k]) {
        const entryObj = rows[k].entry;
        for (let l = 0; l < entryObj.length; l++) {
          if (entryObj[l]) {
            const object = entryObj[l].children;
            for (let m = 0; m < object.length; m++) {
              if (object[m]?.dgType) {
                if (object[m].dgType !== DgTypes.SignatureDataEntry &&
                  object[m].dgType !== DgTypes.InitialDataEntry) {
                  if (object[m]?.storeValue !== '')
                    this.viewForm.storeItemOfEnter(object[m], object[m].storeValue);
                }
              }
            }
          }
        }
      }
    }
  }
  setDataJsonRows(current: any, next: any, tableItemRow: any) {
    this.tableService.setTableObjects(tableItemRow[current], 'current');
    this.tableService.setTableObjects(tableItemRow[next], 'next');
  }
  updateColorOpen() {
    this.colorUpdateOpen = false;
    this.colorUpdateOpen = true;
  }
  updateColor(event: any) {
    if (event !== false) {
      this.cbpJson.documentInfo[0]['color'] = event;
      if (this.executionService.selectedFieldEntry) {
        this.executionService.selectedFieldEntry['color'] = event;
        this.setFieldColor(event);
        if (event !== '#000000') {
          this.executionService.selectedFieldEntry['innerHtmlView'] = true;
        }
      } else if (this.executionService.selectedNewEntry) {
        this.executionService.selectedNewEntry['color'] = event;
        this.setFieldColor(event);
        if (event !== '#000000') {
          this.executionService.selectedNewEntry['innerHtmlView'] = true;
        }
      }
      this.executionService.setColorItem({ 'color': event });
    }
    this.colorUpdateOpen = false;
    this.sharedviewService.detectAll = true;
    this.sharedviewService.tableViewUpdated = true;
    this.getEventFromModalChild();
    this.setFieldsColor(event);
    this.setpropertyDoc();
    this.tableService.selectedRow = [];
    this.cdref.detectChanges();
    this.viewUpdate(true);
  }
  setFieldsColor(color: string) {
    if (this.cbpService.selectCellEnabled) {
      if (this.tableService.selectedRow.length === 1 || this.executionService.selectedNewEntry) {
        this.setFieldColor(color);
      } else {
        this.setColorForFields(color);
      }
    } else {
      if (this.tableService.selectedRow.length > 1) {
        let type = this.tableService.selectedRow[this.tableService.selectedRow.length - 1].type;
        let typeInfo = { type: 'fontcolor', 'color': color };
        if (type === 'row') {
          this.setColorForFields(color);
        } else if (type === 'column') {
          for (let i = 0; i < this.tableService.selectedRow.length; i++) {
            let item: any = this.tableService.selectedRow[i];
            const tablerows = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row;
            for (let j = 0; j < tablerows.length; j++) {
              const colorObj = tablerows[j].entry[item.col];
              for (let m = 0; m < colorObj.children.length; m++) {
                if (colorObj.children[m].dgType !== DgTypes.DateDataEntry) {
                  if (!colorObj.children[m]?.storeValue) { colorObj.children[m].storeValue = ''; }
                  if (colorObj.children[m]?.storeValue?.includes('<font color')) {
                    colorObj.children[m].storeValue = this.tableService.replaceStyle(colorObj.children[m].storeValue, 'color');
                  }
                  colorObj.children[m]['storeValue'] = '<font color="' + color + '">' + colorObj.children[m].storeValue + '</font>'
                  colorObj.children[m]['innerHtmlView'] = true;
                  colorObj.children[m]['editorOpened'] = false;
                  if (!colorObj.children[m]['styleSet']) { colorObj.children[m]['styleSet'] = {}; }
                  colorObj.children[m]['styleSet']['fontcolor'] = color;
                  colorObj.children[m] = this.tableService.setStyleForElement(colorObj.children[m], typeInfo);
                  this.saveDataStoreValue(colorObj.children[m], colorObj.children[m].storeValue);
                }
              }
            }
          }
        }
      }
      if (this.tableService.selectedRow.length === 1 || this.executionService.selectedNewEntry) {
        this.setFieldColor(color);
      }
    }
    this.cbpService.selectCellEnabled = false;
  }
  setColorForFields(color: string) {
    for (let i = 0; i < this.tableService.selectedRow.length; i++) {
      let item: any = this.tableService.selectedRow[i];
      const colorObj = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[item.row].entry[item.col];
      for (let m = 0; m < colorObj.children.length; m++) {
        if (colorObj.children[m].dgType === DgTypes.TextDataEntry ||
          colorObj.children[m].dgType === DgTypes.NumericDataEntry ||
          colorObj.children[m].dgType === DgTypes.TextAreaDataEntry) {
          if (!colorObj.children[m]?.storeValue) { colorObj.children[m].storeValue = ''; }
          if (colorObj.children[m]?.storeValue?.includes('<font color')) {
            colorObj.children[m].storeValue = this.tableService.replaceRemoveStyle(colorObj.children[m].storeValue, 'color', color);
          }
          colorObj.children[m]['storeValue'] = '<font color="' + color + '">' + colorObj.children[m].storeValue + '</font>'
          colorObj.children[m]['innerHtmlView'] = true;
          colorObj.children[m]['editorOpened'] = false;
          if (!colorObj.children[m]['styleSet']) { colorObj.children[m]['styleSet'] = {}; }
          colorObj.children[m]['styleSet']['fontcolor'] = color;
          this.saveDataStoreValue(colorObj.children[m], colorObj.children[m].storeValue);
        }
      }
    }
  }
  setFieldColor(color: string) {
    if (this.executionService.selectedNewEntry?.coverPageAttribute) {
      if (this.executionService.selectedNewEntry?.dynamic == 1) {
        this.executionService.selectedNewEntry = this.createStyles(this.executionService.selectedNewEntry);
        this.executionService.selectedNewEntry['styleSet']['color'] = color;
        this.executionService.setAttributeUpdate({ type: 'updateview' });
      }
    } else {
      if (this.executionService.selectedNewEntry) {
        this.executionService.selectedNewEntry['innerHtmlView'] = true;
        this.setStyleForSign({ type: 'fontcolor', 'color': color });
        if (this.executionService.selectedNewEntry?.dgType !== DgTypes.SignatureDataEntry &&
          this.executionService.selectedNewEntry?.dgType !== DgTypes.InitialDataEntry
        ) {
          this.executionService.selectedNewEntry = this.tableService.setStyleForElement(this.executionService.selectedNewEntry, { type: 'fontcolor', 'color': color });
        }
        if (this.executionService.selectedNewEntry?.dgType === DgTypes.SignatureDataEntry
          || this.executionService.selectedNewEntry?.dgType === DgTypes.InitialDataEntry
        ) {
          this.executionService.selectedNewEntry = this.tableService.setStoreValue(this.executionService.selectedNewEntry, 'color', color);
          console.log(this.executionService.selectedNewEntry['styleSet'],
            this.executionService.selectedNewEntry['userIdStyleSet'],
            this.executionService.selectedNewEntry['notesStyleSet']);
        }
        // if (this.cbpService.isDataEtry(this.executionService.selectedNewEntry) && (this.executionService.selectedNewEntry?.innerHtmlView || this.cbpService.isHTMLText(this.executionService.selectedNewEntry?.storeValue))) {
        //   this.executionService.selectedNewEntry.storeValue = this.cbpService.processTextWithTags(this.executionService.selectedNewEntry?.storeValue);
        // }
        let dataInfo = this.sharedviewService.storeDataObj(this.executionService.selectedNewEntry, this.executionService.selectedNewEntry.storeValue);
        if (this.executionService.selectedNewEntry?.dgType == DgTypes.TextDataEntry && this.executionService.selectedNewEntry?.dataType == "Dropdown" && this.executionService.selectedNewEntry?.choice?.length > 0) {
          this.executionService.selectedNewEntry.storeValue = this.cbpService.removeHTMLTags(this.executionService.selectedNewEntry.storeValue);
          this.executionService.setDropdownStyleView(this.executionService.selectedNewEntry?.styleSet);
        }
        this.sessionDataJsonStore(dataInfo);
        this.datashareService.changeCount++;
      }
    }
  }
  createStyles(obj: any) {
    if (!obj['styleSet']) { obj['styleSet'] = {}; }
    return obj;
  }
  ngDoCheck() {
    if (this.cbpService.notiferShow) {
      this.notifier.hideAll();
      if (this.dataJsonService.errorMessage) {
        this.errorMessage('');
      }
      this.notifier.notify(this.cbpService.messageObj.type, this.cbpService.messageObj.mesg);
      this.cbpService.notiferShow = false;
      if (this.tableService.pastedSucess) {
        this.sharedviewService.midPaste = false;
        if (this.tableService.pasteItems.length > 0) {
          for (let i = 0; i < this.tableService.pasteItems.length; i++) {
            this.viewForm.checkValidation('', this.tableService.pasteItems[i], this.tableService.pasteItems[i].storeValue);
          }
        }
        this.tableService.pastedSucess = false;
      }
    }
    if (this.cbpService.dualSteps?.length > 0)
      this.hideObject();
    if (this.sharedviewService.colorNodes?.length > 0) {
      let items = this.sharedviewService.colorNodes.filter((item: any) => !item.loaded);
      if (items?.length > 0) { this.treeLoaded(); }
    }
    if (this.refreshProtectFields) {
      this.protectAllSections();
      this.refreshProtectFields = false;
    }
  }

  hideObject() {
    this.cbpService.dualSteps.forEach((item: any) => {
      if (!item.added)
        item = this.sharedviewService.hideStepInTree(item.id);
    });
  }

  clearDatajsonValues() {
    this.comments = [];
    this.crArrayData = [];
    this.otspData = [];
    this.cbpService.media = [];
    if (!this.cbpService.dataJson?.isSavedDataJson) {
      this.cbpService.dataJson = new DataJson();
    }
    this.typeValues = [];
    this.reasonValues = [];
    this.listOfFacilities = [];
    this.listOfUnits = [];
    this.listOfDecipline = [];
    this.cbpService.codeValues = [];
    this.attachment = [];
    this.cbpService.mediaBuilderObjects = [];
    this.cbpService.mediaExecutorObjects = [];
    this.executionService.clearFieldValues();
    this.sharedviewService.colorNodes = [];
    this.executionService.styleModel = new styleModel();
  }

  setCodeValues(data: any) {
    this.typeValues = data;
  }
  setReasonCodeValues(data: any) {
    this.reasonValues = data;
  }
  setFacility(data: any) {
    this.listOfFacilities = data;
  }
  setUnit(data: any) {
    this.listOfUnits = data;
  }
  setDecipline(data: any) {
    this.listOfDecipline = data;
  }
  setTypes(data: any) {
    this.cbpService.codeValues = data;
  }
  scroll() {
    this.executionService.selectedField({ stepItem: {}, stepObject: {}, showMenuText: false });
  }
  fetchRefObj(refObj: any) {
    try {
      if (refObj?.target?.attributes) {
        this.executionService.refObjID = refObj.target.attributes.id.value;
        let msg = {
          eventType: EventType.refObj,
          msg: {
            "dgc_reference_object_key": refObj.target.attributes.dgc_reference_object_key.value,
            "reference_object_code": refObj.target.attributes.reference_object_code.value
          }
        }
        this.refObj.emit(msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  setRefData(data: any) {
    if (data.response.linkType == 1) {
      let string = '<div class="popuptext" id="refObjLinkDrop-' + this.executionService.refObjID + '" style="display:block"><div class="popuptextContent" id="popuptextContent-' + this.executionService.refObjID + '">' + data?.response?.detailDesc + '</div></div>';
      if (this.executionService.refObjID) {
        $('.popuptext').css("display", "none");
        const position = $('#' + this.executionService.refObjID).position();
        $('#refObjLinkDrop-' + this.executionService.refObjID).remove();
        $('#' + this.executionService.refObjID).append(string);
        if (data.response) {
          this.executionService.refObjArr.push(data);
          this.executionService.refObjID = null;
          this.cdref.detectChanges();
        }
      }
    } else if (data.response.linkType == 2) {
      const element = this.cbpService.stepSequentialArray.find((el: any) => el.dgUniqueID == data.response.dgUniqueID);
      this.sharedviewService.isLinkSelected = true;
      this.viewForm.setNewStepObject(element);
    }
  }

  getReferenceAPIInfo(item: any, refid: string = '', childRefid: string = '') {
    this.getRefObj.emit({ item: item, refid: refid, childRefid: childRefid });
  }
  callRefMethod(item: any, index: any) {
    if (item.DGC_REFERENCE_OBJECT_DETAIL) {
      item['show'] = true
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

  dragReferenceObj(item: any) {
    if (item.DGC_HAS_CHILD == 0) { }
  }
  collapse(item: any) {
    item['children'] = []
    item.show = false;
  }

  referenceEvent() {
    if (this.executionService.selectedFieldEntry?.dgType == DgTypes.TextAreaDataEntry
      || this.executionService.selectedNewEntry?.dgType == DgTypes.TextDataEntry) {
      this.executionService.referenceObjectEditMode = !this.executionService.referenceObjectEditMode;
      this.showRefTab = true;
    } else {
      this.showRefTab = false;
    }
  }
  stickyNoteExecuter(event: string) {
    if (!this.cbpService.selectedElement?.stickyExeNote) {
      this.cbpService.selectedElement['stickyExeNote'] = new StickyNote();
    }
    this.cbpService.selectedElement.stickyExeNote['TxnId'] = new Date().getTime();
    this.cbpService.selectedElement.stickyExeNote.isAdded = true;
    this.cbpService.selectedElement.stickyExeNote['deleted'] = false;
    this.cbpService.selectedElement.stickyExeNote.show = true;
    this.cbpService.selectedElement.stickyExeNote.messageArray[0].messageAdded = false;
    this.cbpService.selectedElement.stickyExeNote.messageArray[0].userName = this.executionService.loggedInUserName;
    this.cbpService.selectedElement.stickyExeNote.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID;
    this.sessionDataJsonStore(this.cbpService.selectedElement.stickyExeNote);
    this.datashareService.changeCount++;
  }
  stickyNoteChangeEvent(stickyObj: any) {
    let stickyNote = stickyObj.stickyNote;
    if (stickyNote['deleted']) {
      this.cbpService.selectedElement.stickyExeNote = new StickyNote();
      this.cbpService.selectedElement.stickyExeNote['deleted'] = true;
      this.cbpService.selectedElement.stickyExeNote['TxnId'] = new Date().getTime();
      this.cbpService.selectedElement.stickyExeNote['selectedStepDgUniqueId'] = this.cbpService.selectedElement.dgUniqueID;
      this.sessionDataJsonStore(this.cbpService.selectedElement.stickyExeNote);
      this.datashareService.changeCount++;
      this.menuConfig = JSON.parse(JSON.stringify(this.menuConfig));
    } else {
      this.cbpService.selectedElement.stickyExeNote = stickyNote;
      let stickyNoteIndex = this.cbpService.dataJson.dataObjects.findIndex((item: any) => item.selectedStepDgUniqueId === stickyNote.selectedStepDgUniqueId);
      if (stickyNoteIndex !== -1) {
        this.cbpService.selectedElement.stickyExeNote['TxnId'] = new Date().getTime();
        this.cbpService.dataJson.dataObjects[stickyNoteIndex] = this.cbpService.selectedElement.stickyExeNote;
      } else {
        this.sessionDataJsonStore(this.cbpService.selectedElement.stickyExeNote);
        this.datashareService.changeCount++;
      }
    }
  }

  tableEntryStyle(typeInfo: any) {
    if (typeInfo.type === 'fontsize') {
      typeInfo['size'] = typeInfo.font;
      this.cbpJson.documentInfo[0]['fontsize'] = typeInfo.font;
      this.executionService.setStyleViewItem({ 'fontsize': typeInfo.font, type: 'fontsize' });
      this.setFontandFamily(typeInfo);
    }
    if (typeInfo.type === 'fontfamily') {
      typeInfo['fontfamily'] = typeInfo.font;
      this.cbpJson.documentInfo[0]['fontfamily'] = typeInfo.font;
      this.executionService.setStyleViewItem({ 'fontfamily': typeInfo.font, type: 'fontfamily' });
      this.setFontandFamily(typeInfo);
    }
    if (typeInfo.type === 'right' || typeInfo.type === 'left' || typeInfo.type === 'center') {
      if (this.cbpService.selectedTable) {
        if (this.tableService.selectedRow?.length > 1) {
          this.tableService.setstylesForTableEntries(this.cbpService.selectedTable, typeInfo);
          this.storeDataTableEntries();
        } else {
          this.setAlignOfDataEntry(typeInfo);
        }
      } else {
        this.setAlignOfDataEntry(typeInfo);
      }
      this.cbpService.selectCellEnabled = false;
    }
    this.viewUpdate(true);
    this.executionService.setAttributeUpdate({ type: 'updateview' });
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
    this.cdref.detectChanges();
  }
  setAlignOfDataEntry(typeInfo: any) {
    if (this.executionService.selectedNewEntry) {
      this.executionService.selectedNewEntry['innerHtmlView'] = true;
      this.setStyleForSign(typeInfo);
      this.executionService.selectedNewEntry.storeValue = this.tableService.replaceAlignStyle(this.executionService.selectedNewEntry.storeValue, typeInfo);
      let dataInfo = this.sharedviewService.storeDataObj(this.executionService.selectedNewEntry, this.executionService.selectedNewEntry.storeValue);
      this.sessionDataJsonStore(dataInfo);
      this.datashareService.changeCount++;
    }
  }
  storeDataTableEntries() {
    for (let m = 0; m < this.tableService.selectedRow.length; m++) {
      const tableObj = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[m].row].entry[this.tableService.selectedRow[m].col].children;
      tableObj.forEach((element: any) => {
        let storeValue = element?.signatureValue ? element.signatureValue : element.storeValue;
        if (storeValue) {
          this.saveDataStoreValue(element, storeValue);
        }
      });
    }
  }
  setFontandFamily(typeInfo: any) {
    let typeV; let valueV;
    if (typeInfo.type === 'fontsize') {
      typeV = 'size',
        valueV = typeInfo.size;
    }
    if (typeInfo.type === 'fontfamily') {
      typeV = 'family',
        valueV = typeInfo.family ? typeInfo.family : typeInfo?.fontfamily;
    }
    if (this.executionService.selectedNewEntry?.coverPageAttribute) {
      if (this.executionService.selectedNewEntry?.dynamic == 1) {
        this.executionService.selectedNewEntry = this.createStyles(this.executionService.selectedNewEntry);
        if (typeInfo.type === 'fontsize')
          this.executionService.selectedNewEntry['styleSet']['fontSize'] = this.stylesService.getFontStyles(valueV);
        if (typeInfo.type === 'fontfamily')
          this.executionService.selectedNewEntry['styleSet']['fontName'] = valueV;
        this.executionService.setAttributeUpdate({ type: 'updateview' });
      }
    } else {
      if (this.cbpService.selectedTable) {
        if (this.tableService.selectedRow?.length > 1) {
          this.tableService.setstylesFontFamilyTableEntries(this.cbpService.selectedTable, typeInfo);
          this.storeDataTableEntries();
        }
      }
      if (this.executionService.selectedNewEntry) {
        this.setStyleForSign(typeInfo);
        this.executionService.selectedNewEntry['innerHtmlView'] = true;
        if (this.executionService.selectedNewEntry.dgType !== DgTypes.SignatureDataEntry) {
          this.executionService.selectedNewEntry = this.tableService.setStyleForElement(this.executionService.selectedNewEntry, typeInfo);
        } else {
          this.executionService.selectedNewEntry = this.tableService.setStoreValue(this.executionService.selectedNewEntry, typeV, valueV);
        }
        // if (this.cbpService.isDataEtry(this.executionService.selectedNewEntry) && (this.executionService.selectedNewEntry?.innerHtmlView || this.cbpService.isHTMLText(this.executionService.selectedNewEntry?.storeValue))) {
        //   this.executionService.selectedNewEntry.storeValue = this.cbpService.processTextWithTags(this.executionService.selectedNewEntry?.storeValue);
        // }
        let dataInfo = this.sharedviewService.storeDataObj(this.executionService.selectedNewEntry, this.executionService.selectedNewEntry.storeValue);
        if (this.executionService.selectedNewEntry?.dgType == DgTypes.TextDataEntry && this.executionService.selectedNewEntry?.dataType == "Dropdown" && this.executionService.selectedNewEntry?.choice?.length > 0) {
          this.executionService.selectedNewEntry.storeValue = this.cbpService.removeHTMLTags(this.executionService.selectedNewEntry.storeValue);
          this.executionService.selectedNewEntry.styleSet['fontsize'] = this.stylesService.getFontStyles(this.executionService.selectedNewEntry.styleSet['fontsize']);
          this.executionService.setDropdownStyleView(this.executionService.selectedNewEntry?.styleSet);
        }
        this.sessionDataJsonStore(dataInfo);
        this.datashareService.changeCount++;
      }
    }

  }
  setStyleForSign(typeInfo: any) {
    if (this.executionService.selectedNewEntry.dgType == DgTypes.SignatureDataEntry ||
      this.executionService.selectedNewEntry.dgType == DgTypes.InitialDataEntry) {
      this.executionService.selectedNewEntry = this.tableService.setSignStyles(this.executionService.selectedNewEntry, typeInfo);
    } else {
      this.executionService.selectedNewEntry['styleSet'] =
        { ...(this.executionService.selectedNewEntry['styleSet'] ?? {}), ...this.tableService.getStyleObject(typeInfo) };
    }
  }
  saveDataStoreValue(element: any, value: string) {
    // if (this.cbpService.isDataEtry(element) && (element?.innerHtmlView || this.cbpService.isHTMLText(value))) {
    //   value = this.cbpService.processTextWithTags(value);
    // }
    let dataInfo = this.sharedviewService.storeDataObj(element, value);
    if (!this.cbpService.dataJson?.dataObjects) {
      this.cbpService.dataJsonTxnIDS.push({ dataJsonTxnId: new Date().getTime(), signatureJsonTxnId: null })
      this.setDataJsonTxId()
    }
    this.sessionDataJsonStore(dataInfo);
    this.datashareService.changeCount++;
  }

  setTableCell(event: any) {
    if (!event?.value)
      this.tableService.selectedRow.length = 1;
    this.viewUpdate(true);
  }
  showCrComment(event: any) {
    this.typeOfModal = event.typeOf;
    this.commentCrModalOpen = false;
    this.commentCrModalOpen = true;
    this.detachExecuter();
  }

  formatPainter(event: any) {
    if (!event.value) {
      this.executionService.formatPainterEnable = false;
      this.menuConfig = JSON.parse(JSON.stringify(this.menuConfig));
    }
  }
  setPaginationIndex(sections: any, pageSize: any = 20, parent: any = null, ref: any = null) {
    if (Array.isArray(sections)) {
      let count = 0;
      let count1 = 0;
      if (sections?.length > 0)
        sections.forEach((item, n) => {

          if (item.dgSequenceNumber) {
            if ((this.cbpJson.documentInfo[0]['dynamicDocument'] && !item.hide_section)
              || ((!this.cbpJson.documentInfo[0]['dynamicDocument']))) {
              if (item.dgSequenceNumber == '1.0' && n == 0) {
                this.cbpService.paginateIndex = 1;
                this.cbpService.activePage = 1;
                this.cbpService.maxPage = 1;
              }
              item['position'] = ++count;
              item['paginateIndex'] = this.cbpService.paginateIndex++;
              item['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;
              this.cbpService.maxPage = item['page'];
              item['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);
              if (item.dgType === DgTypes.DualAction) {
                item.rightDualChildren['position'] = ++count;
                item.rightDualChildren['paginateIndex'] = this.cbpService.paginateIndex++;
                item.rightDualChildren['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;
                item.rightDualChildren['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);
              }
              if (item?.children && Array.isArray(item?.children)) {
                let tables = item.children.filter((i: any) => i.dgType == DgTypes.Table);
                this.increasePaginateIndex(tables, item, ref, null);
              }
              if (this.cbpService.paginateIndex >= ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
                this.cbpService.paginateIndex = ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
              }
              if (Array.isArray(item?.children) && item?.children?.length > 0) {
                this.setPaginationIndex(item.children, pageSize, item, ref);
              }
              if (item.dgType === DgTypes.DualAction) {
                let tables = findAnd.returnFound(item.rightDualChildren, { dgType: DgTypes.Table });

                this.increasePaginateIndex(tables, item.rightDualChildren, ref, null);
                if (this.cbpService.paginateIndex > ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
                  this.cbpService.paginateIndex = ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
                }
                if (Array.isArray(item.rightDualChildren) && item?.rightDualChildren?.length > 0) {
                  this.setPaginationIndex(item.rightDualChildren);
                }

              }
            } else {
              if (item.hide_section) {
                item['paginateIndex'] = 0;
                item['page'] = 0;
              }
              item['position'] = ++count1;
              item['isLastChild'] = (count1 == sections.filter(i => !i.dgSequenceNumber).length) && (sections.filter(i => i.dgSequenceNumber).length == 0);
            }
          }
        });
    }
  }
  increasePaginateIndex(tables: any, parent: any, ref: any, parentTable: any) {
    if (Array.isArray(tables)) {
      tables.forEach((obj: any) => {
        if (Array.isArray(obj)) {
          this.increasePaginateIndex(obj, parent, ref, null);
        } else {
          if (obj.rowSize) {
            if (ref?.cbpService)
              ref.cbpService.paginateIndex = ref?.cbpService?.paginateIndex + obj?.rowSize;
            let tables1 = findAnd.returnFound(obj.calstable, { dgType: DgTypes.Table });
            if (tables1) {
              this.increasePaginateIndex(tables1, parent, ref, obj);
            }
          }
        }
      })
    } else if (tables) {
      this.increasePaginateIndex([tables], parent, ref, null);
    }
  }

  moveToPreviousButton(autoScroll = 0) {
    this.cbpService.scrollState = 0;
    this.isReachingBottomState = true;
    this.isReachingTopState = true;
    const startIndex = this.cbpService.startIndex;
    let obj: any;
    try {
      if ((this.cbpService.startIndex) >= this.cbpService.pageSize) {
        this.cbpService.loading = true;
        this.loading = true;

        this.cbpService.startIndex = ((Math.floor(this.cbpService.startIndex / this.cbpService.pageSize) * this.cbpService.pageSize) - this.cbpService.pageSize) + 1;
        // obj = findAnd.returnFound(this.cbpJson.section, { paginateIndex: this.cbpService.startIndex });

        for (let index = (this.cbpService.startIndex + this.cbpService.pageSize - 1); index >= this.cbpService.startIndex; index--) {
          obj = findAnd.returnFound(this.cbpJson.section, { paginateIndex: index });
          if (obj) {
            this.cbpService.selectedElement = obj;
            break;
          }
        }
        this.cbpService.activePage = obj.page;
        // When upscroll not  working please check this
        //Menu bar update value
        this.setScrollObj(obj);
        setTimeout(() => {
          this.gotToPosition(this.cbpService.selectedElement, autoScroll);
          this.isReachingBottomState = false;
          this.isReachingTopState = false;
          this.scrollDirection = '';
          this.scrollCount = 0;
          this.cbpService.loading = false;
          this.loading = false;
        }, 1000);

      } else {
        setTimeout(() => {
          this.isReachingBottomState = false;
          this.isReachingTopState = false;
          this.scrollDirection = '';
          this.scrollCount = 0;
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      this.cbpService.startIndex = startIndex;
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
      this.cbpService.loading = false;
      this.loading = false;
    }
  }
  moveToNextButton(autoScroll = 0) {
    this.cbpService.scrollState = 0;
    this.isReachingBottomState = true;
    this.isReachingTopState = true;
    const startIndex = this.cbpService.startIndex;
    let obj: any
    try {
      if ((this.cbpService.paginateIndex - this.cbpService.startIndex) > this.cbpService.pageSize) {
        this.loadingPage();
        this.cbpService.startIndex = ((Math.floor(this.cbpService.startIndex / this.cbpService.pageSize) * this.cbpService.pageSize) + this.cbpService.pageSize) + 1;
        obj = findAnd.returnFound(this.cbpJson.section, { paginateIndex: this.cbpService.startIndex });
        this.cbpService.activePage = obj.page;
        this.setScrollObj(obj);
        this.gotToPosition(this.cbpService.selectedElement, autoScroll);
        setTimeout(() => {
          this.isReachingBottomState = false;
          this.isReachingTopState = false;
          this.scrollDirection = '';
          this.scrollCount = 0;
        }, 1000);
        //this.loading = false;
      } else {
        this.isReachingBottomState = false;
        this.isReachingTopState = false;

      }
    } catch (error) {
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
      this.cbpService.startIndex = startIndex;

      this.cbpService.loading = false;
      this.loading = false;
    }
  }
  goToBottom() {
    this.cbpService.scrollState = 0;
    this.isReachingBottomState = true;
    this.isReachingTopState = true;
    const startIndex = this.cbpService.startIndex;
    try {
      if ((this.cbpService.paginateIndex - this.cbpService.startIndex) > this.cbpService.pageSize) {
        this.loadingPage();
        this.cbpService.startIndex = ((Math.floor(this.cbpService.paginateIndex / this.cbpService.pageSize) * this.cbpService.pageSize)) + 1;
        this.cbpService.activePage = this.cbpService.maxPage;
        let obj = findAnd.returnFound(this.cbpJson.section, { paginateIndex: this.cbpService.startIndex });
        this.setScrollObj(obj);
        this.gotToPosition(this.cbpService.selectedElement);
        setTimeout(() => {
          this.isReachingBottomState = false;
          this.isReachingTopState = false;
          this.scrollDirection = '';
          this.scrollCount = 0;
        }, 1000);
      } else {
        this.isReachingTopState = false;
        this.isReachingBottomState = false;
      }
    } catch (error) {
      console.error(error);
      this.cbpService.startIndex = startIndex;
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
      this.cbpService.loading = false;
      this.loading = false;
    }
  }
  loadingPage() {
    this.cbpService.loading = true;
    this.loading = true;
  }
  goToTop() {
    this.cbpService.scrollState = 0;
    this.isReachingBottomState = true;
    this.isReachingTopState = true;
    const startIndex = this.cbpService.startIndex;
    let obj: any;
    try {
      this.loadingPage();
      this.cbpService.activePage = 1
      this.cbpService.startIndex = 1;
      obj = findAnd.returnFound(this.cbpJson.section, { paginateIndex: this.cbpService.startIndex });
      this.setScrollObj(obj);
      this.gotToPosition(obj);
      setTimeout(() => {
        this.isReachingBottomState = false;
        this.isReachingTopState = false;
        this.scrollDirection = '';
        this.scrollCount = 0;
      }, 1000);
    } catch (error) {
      console.error(error);
      this.cbpService.startIndex = startIndex;
      this.isReachingBottomState = false;
      this.isReachingTopState = false;
      this.cbpService.loading = false;
      this.loading = false;
    }
  }
  setScrollObj(obj: any) {
    if (!this.documentSelected) {
      if (obj && Array.isArray(obj)) { obj = obj[0]; }
      this.cbpService.loading = false;
      this.getIndexOfCurrentObj(obj);
      setTimeout(() => {
        this.loading = false;
        this.cbpService.scrollState = 1;
        this.removeAnnotaions();
        this.refreshAnnotations();
        this.cdref.detectChanges();
      }, 1000);
    } else {
      this.loading = false;
      this.cbpService.loading = false;
    }
  }

  getIndexOfCurrentObj(obj: any) {
    let index = this.cbpService.stepSequentialArray.findIndex((item: any) => item.dgUniqueID == obj.dgUniqueID);
    let listArray = this.cbpService.stepSequentialArray.slice(index);
    // this.selectStepFromEvent(listArray);
    this.setCurrentNode(listArray[0], false);

  }
  gotToPosition(obj: any, autoScroll = 0) {
    setTimeout(() => {
      this.gotoCurrentStep('section' + obj.dgUniqueID, autoScroll);
    }, 500);
  }

  onScroll(event: any) {
    if (this.startPosition + 200 > event.target.scrollHeight) {
      this.showPaginationButtons = false;
    } else {
      this.showPaginationButtons = true;
    }
    if (
      this.startPosition <=
      event.target.offsetHeight + event.target.scrollTop + 50
    ) {
      // console.log('DOWN');
      // console.log(this.startPosition+'=====>'+event.target.scrollHeight);

      this.scrollDirection = 'DOWN';
    } else {
      this.scrollDirection = 'UP';
    }
    this.startPosition =
      event.target.offsetHeight + event.target.scrollTop + 50;

  }

  scrollCount = 0;
  handleScroll(event: ScrollEvent) {
    if (this.menuConfig.isAutoScrollEnabled) {
      if (event.isReachingBottom) {
        this.scrollCount++;
        if (!this.isReachingBottomState && this.scrollDirection == 'DOWN' && this.scrollCount > 3) {
          this.isReachingBottomState = true;
          console.log(`the user is reaching the bottom`);
          this.moveToNextButton(1);
        }
      }
      if (event.isReachingTop) {
        this.scrollCount++;
        if (!this.isReachingTopState && this.scrollDirection == 'UP' && this.scrollCount > 1) {
          this.isReachingTopState = true;
          console.log(`the user is reaching the top`);
          this.moveToPreviousButton(1);
        }
      }
    }
  }

  annotateEvent(event: any) {
    // console.log(event);
    if (event.type == 'add') {
      this.annotationAdd(event);
    } else if (event.type === 'remove') {
      this.removeAnnotation(event);
    } else {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please select text before applying it');
    }
  }
  removeAnnotation(event: any) {
    let text = this.cbpService.getSelectionText();
    if (text !== '') {
      let findText: any = this.annotateJson.annotateObjects.filter(it => it.text === text.trim() ||
        this.sharedviewService.checkInludes(it.text, text) || this.sharedviewService.spaceCheck(it.text, text));
      findText = findText.filter((item: any) => item.selectedStepDgUniqueID == this.cbpService.annotationObj.obj.dgUniqueID);
      if (findText?.length > 0) {
        const selection: any = window.getSelection();
        let type = this.cbpService.annotationObj.type;
        let selected = this.cbpService.annotationObj.obj;
        let step = this.sharedviewService.getStepID(selected, type);
        let findobj: any;
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!step.contains(range.commonAncestorContainer) || range.commonAncestorContainer.nodeType !== 3) {
            if (!this.adjustRangeToElement(range, step)) {
              this.notifier.hideAll();
              this.notifier.notify('warning', 'Please select the step and properly select the text before applying the annotation');
              return false;
            }
          }
          findText.forEach((item: any) => { if (item.id == range?.commonAncestorContainer?.parentNode.id) { findobj = item; } });
        }
        let e: any = document.querySelector(findobj?.id);
        if (e == null || e == '') { e = this.sharedviewService.getElement(findobj); }
        let list: any = this.annotateJson?.annotateObjects.filter(item => item.selectedStepDgUniqueID == findobj?.selectedStepDgUniqueID);
        let index = list?.indexOf(list?.find((item: any) => item.id == findobj.id));
        findobj.show = false;
        let index1 = this.loadedAnnotations.indexOf(findobj.TxnId);
        if (index1 >= 0) {
          this.loadedAnnotations.splice(index1, 1);
        }
        let undoAnnotateObj = JSON.parse(JSON.stringify(findobj))
        undoAnnotateObj.TxnId = new Date().getTime();
        this.annotateJson.annotateObjects.push(undoAnnotateObj);
        // let type = this.cbpService.annotationObj.type;
        // let step = this.sharedviewService.getStepID(this.cbpService.annotationObj.obj, type);
        step.innerHTML = step.innerHTML.replace(e.outerHTML, e.innerHTML)
        step.innerHTML = step.innerHTML.replace(/<svg.*?>.*?<\/svg>/ig, '');
        if (index == list?.length - 1) {
          this.annotateJson.annotateObjects.forEach((item: any) => {
            if (item.id == list[index - 1]?.id) {
              item.objectInfo = step.innerHTML;
            }
          })
          console.log(this.annotateJson.annotateObjects);
        }
        if (type == 'alaraNotes' || type == 'notes') {
          this.cbpService.annotationObj.obj[type][0] = step.innerHTML;
        } else {
          this.cbpService.annotationObj.obj[type] = step.innerHTML;
        }
        let reloadedAnnotatelist = this.annotateJson.annotateObjects.filter(item => item.selectedStepDgUniqueID === findText[findText.length - 1].selectedStepDgUniqueID && item.prompt === findText[findText.length - 1].prompt)
        this.saveAnnotation(selected, 'remove');
        setTimeout(() => {
          console.log(reloadedAnnotatelist);
          this.refreshStepAnnotations(reloadedAnnotatelist);
        }, 500);
        this.sharedviewService.isViewUpdated = true;
        this.cdref.detectChanges();
      }
      else {
        this.notifier.hideAll();
        this.notifier.notify('warning', 'Selected text doesnt contain the Annotation');
      }
      this.cbpService.setAnnotation({ type: 'annotation', value: false });
    }
  }

  annotationAdd(event: any) {
    this.cbpService.annotationObj.text = this.cbpService.getSelectionText();
    let selected = this.cbpService.annotationObj.obj;
    if (this.cbpService.annotationObj.type === '') {
      this.cbpService.annotationObj.type = this.sharedviewService.getType(selected.dgType);
    }
    // console.log(selected);
    let text = this.cbpService.annotationObj.text;
    let type = this.cbpService.annotationObj.type;
    // if (!selected[type]?.includes(text)) {
    //   this.cbpService.setAnnotation({ type: 'annotation', value: false });
    //   this.notifier.hideAll();
    //   this.notifier.notify('warning', 'Selected text is not applicable to Annotate ');
    //   return false;
    // }
    let txID = new Date().getTime();
    let selectdId = `#step${selected.dgUniqueID}an${txID}`;
    let replaceTitle = `<span id="${selectdId}">${this.cbpService.annotationObj.text}</span>`;
    let replaceTitleWithSpaceBreak = `<span id="${selectdId}" style="white-space: nowrap; display: inline;">${this.cbpService.annotationObj.text}</span>`;
    let spanTagsContainingText: any;
    if (Object.keys(selected).length !== 0 && this.cbpService.annotationObj.text !== '') {
      const selection: any = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let step1 = this.sharedviewService.getStepID(selected, type);
        if (this.isTextBroken(range)) {
          replaceTitle = replaceTitleWithSpaceBreak;
        }
        if (step1.contains(range.commonAncestorContainer) && (range.commonAncestorContainer.nodeType == 3 || range.commonAncestorContainer.nodeType == 1)) {
          if (this.checkAnnotationIsExist(selected, spanTagsContainingText, event.selectedType, text, range)) {
            return
          }
          if (range.commonAncestorContainer.nodeType == 1) {
            const htmlElement = range.commonAncestorContainer;
            replaceTitle = this.checkTextBoldUnderlineWrapper(htmlElement, selectdId, replaceTitle)
          }
          range.deleteContents();
          range.insertNode(this.sharedviewService.createHTMLFragment(`${replaceTitle}`));
        } else {
          if (!this.adjustRangeToElement(range, step1)) {
            this.notifier.hideAll();
            this.notifier.notify('warning', 'Please select the step and properly select the text before applying the annotation');
            return false;
          } else {
            if (this.checkAnnotationIsExist(selected, spanTagsContainingText, event.selectedType, text, range)) {
              return
            } else {
              // const startContainer = range.startContainer;
              // const startOffset = range.startOffset;
              // const endContainer = range.endContainer;
              // const endOffset = range.endOffset;
              if (step1.contains(range.commonAncestorContainer) && (range.commonAncestorContainer.nodeType == 3 || range.commonAncestorContainer.nodeType == 1) && (range.startOffset != range.endOffset)) {
                // range.setStart(startContainer, startOffset);
                // range.setEnd(endContainer, startOffset);
                if (range.commonAncestorContainer.nodeType == 1) {
                  const htmlElement = range.commonAncestorContainer;
                  replaceTitle = this.checkTextBoldUnderlineWrapper(htmlElement, selectdId, replaceTitle)
                }
                range.deleteContents();
                range.insertNode(this.sharedviewService.createHTMLFragment(`${replaceTitle}`));
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                this.notifier.hideAll();
                this.notifier.notify('warning', 'Please select the step and properly select the text before applying the annotation');
                return false;
              }
            }
          }
        }
      }
      let step = this.sharedviewService.getStepID(selected, type);
      if (step.innerHTML.includes(selectdId)) {
        this.setStepItem(type, step);
      }
      let totaltitle = (type == 'alaraNotes' || type == 'notes') ? this.cbpService.annotationObj.obj[type][0] : this.cbpService.annotationObj.obj[type];
      let duplicates = this.cbpService.findDuplicates(totaltitle, text.trim())
      let isInserted = false;
      if (!step.innerHTML.includes(selectdId)) {
        isInserted = true;
        if (duplicates.length == 0) {
          document?.getElementById(`${selectdId}`)?.remove();
          step.innerHTML = totaltitle.replace(/<svg.*?>.*?<\/svg>/ig, '');
          step.innerHTML = step.innerHTML.replace(`style="position: relative;"`, '');
          let replaceT = `<span id="${selectdId}">${this.cbpService.annotationObj.text.trim()}</span>`;
          step.innerHTML = step.innerHTML.replace(text.trim(), replaceT);
        }
      }
      if (!this.annotateJson?.annotateObjects) {
        this.annotateJson = new AnnotateJson().init();
      }
      this.annotateJson.annotateObjects.push(new AnnotateObject().build(
        this.cbpService.annotationObj.text,
        event.selectedType,
        selected.dgUniqueID,
        this.annotateJson.annotateObjects.length,
        this.cbpService.annotationObj.type,
        selectdId,
        this.sharedviewService.getDeviceInfo(),
        this.executionService.selectedUserId
      ));
      this.annotateJson.annotateObjects[this.annotateJson.annotateObjects.length - 1].TxnId = txID;
      this.repalceTextWithOri(step);
      let annotatelist = this.annotateJson.annotateObjects.filter(item => item.selectedStepDgUniqueID === selected.dgUniqueID);
      if (annotatelist?.length > 1) {
        let ids: any[] = [];
        const roughAnnotations = step.querySelectorAll('.rough-annotation');
        if (isInserted && !step.innerHTML.includes('<svg>') && roughAnnotations?.length == 0) {
          setTimeout(() => {
            this.refreshStepAnnotations(annotatelist);
            this.sharedviewService.clearSelection();
          }, 200);
        } else {
          setTimeout(() => {
            let selectedObj: any = this.executionService.annotations.find(item => item.type === annotatelist[annotatelist.length - 1].type);
            let e: any = document.querySelector(annotatelist[annotatelist.length - 1].id);
            selectdId = annotatelist[annotatelist.length - 1].id;
            if (e) {
              ids.push(annotate(e, selectedObj));
            } else {
              let e: any = document.querySelector(selectdId);
              if (e == null || e == '') { e = this.sharedviewService.getElement({ id: selectdId }); }
              if (e !== null) {
                this.loadedAnnotations.push(annotatelist[annotatelist.length - 1]?.TxnId)
                ids.push(annotate(e, selectedObj));
              }
            }
            const ag = annotationGroup(ids);
            ag.show();
            this.sharedviewService.clearSelection();
          }, 200);
        }
      } else {
        setTimeout(() => {
          let e: any = document.querySelector(selectdId);
          if (e) {
            this.loadedAnnotations.push(annotatelist[annotatelist.length - 1]?.TxnId);
            let selectedObj: any = this.executionService.annotations.find(item => item.type === event.selectedType);
            const annotation = annotate(e, selectedObj);
            if (!annotation.isShowing()) {
              annotation.show();
              this.sharedviewService.clearSelection();
            }
          } else {
            let e: any = document.querySelector(selectdId);
            if (e == null || e == '') { e = this.sharedviewService.getElement({ id: selectdId }); }
            let selectedObj: any = this.executionService.annotations.find(item => item.type === event.selectedType);
            if (e !== null) {
              this.loadedAnnotations.push(annotatelist[annotatelist.length - 1]?.TxnId);
              const annotation = annotate(e, selectedObj);
              if (!annotation.isShowing()) {
                annotation.show();
                this.sharedviewService.clearSelection();
              }
            }
          }
        }, 300);
      }
      this.saveAnnotation(selected, 'add');
      this.sharedviewService.isViewUpdated = true;
      this.cbpService.setAnnotation({ type: 'annotation', value: false });
      this.cdref.detectChanges();
    } else {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please select text before applying it');
    }
  }

  checkDuplicateText(text: any, mainText: any, id: any, obj: any) {
    if ((mainText === text.trim()) || this.sharedviewService.checkInludes(mainText, text) ||
      this.sharedviewService.spaceCheck(mainText, text) && id == obj.selectedStepDgUniqueID) { return true; }
    return false;
  }
  setStepItem(type: string, step: any) {
    if (type == 'alaraNotes' || type == 'notes') {
      this.cbpService.annotationObj.obj[type][0] = step.innerHTML;
    } else {
      this.cbpService.annotationObj.obj[type] = step.innerHTML;
    }
  }
  repalceTextWithOri(step: any) {
    let textHtml = step.innerHTML.replace(/<svg.*?>.*?<\/svg>/ig, '');
    let len = this.annotateJson.annotateObjects.length;
    const lastId = this.annotateJson.annotateObjects[len - 1].selectedStepDgUniqueID;
    let list = this.annotateJson.annotateObjects.filter(item => item.selectedStepDgUniqueID == lastId);
    const causeArray: any = []; const effectArray: any = [];
    this.annotateJson.annotateObjects.filter(item => {
      if (item.selectedStepDgUniqueID == lastId) {
        if (item.prompt == "cause") {
          causeArray.push(item);
        } else if (item.prompt == "effect") {
          effectArray.push(item);
        }
      }
    });
    if (list.length > 1) {
      this.annotateJson.annotateObjects.forEach((item: any, index: any) => {
        if (item.selectedStepDgUniqueID == lastId) {
          if (index != len - 1) {
            if (effectArray.length > 0 && causeArray.length > 0) {
              if (item.prompt == "cause") {
                let position = causeArray.findIndex((ano: any) => ano.TxnId == item.TxnId);
                position != causeArray.length - 1 ? item.objectInfo = '' : item.objectInfo;
              } else if (item.prompt == "effect") {
                let position = effectArray.findIndex((ano: any) => ano.TxnId == item.TxnId);
                position != effectArray.length - 1 ? item.objectInfo = '' : item.objectInfo;
              }
            } else {
              item.objectInfo = '';
            }
          }
        }
      })
    }
    this.annotateJson.annotateObjects[len - 1].objectInfo = textHtml;
  }
  annotationObjSet(obj: any) {
    try {
      let selected = this.executionService.getElementByDgUniqueID(Number(obj.selectedStepDgUniqueID), this.cbpJson.section);
      if (!selected) {
        selected = this.executionService.getElementByDgUniqueID(String(obj.selectedStepDgUniqueID), this.cbpJson.section);
      }
      if (selected)
        selected = this.getAnnotationObjectInfo(obj, selected);
      else
        console.log(obj);
    } catch (error: any) { console.error(obj) }
  }
  getAnnotationObjectInfo(obj: any, selected: any) {
    if (obj.prompt === 'alaraNotes' || obj.prompt === 'notes') {
      selected[obj.prompt][0] = obj.objectInfo
    } else {
      selected[obj.prompt] = obj.objectInfo;
    }
    return selected;
  }

  setAnnotations() {
    const undoAnnotations: any = this.annotateJson?.annotateObjects?.filter((annotation: any) => annotation?.show === false).map((annotation: any) => annotation.id) || [];
    let withObjectInfoList: any = this.annotateJson?.annotateObjects?.filter((annotation: any) => (annotation?.objectInfo?.length > 0 && !undoAnnotations.includes(annotation.id)));
    for (let i = 0; i < withObjectInfoList?.length; i++) {
      let obj: any = withObjectInfoList[i];
      this.annotationObjSet(obj);
    }
  }

  refreshStepAnnotations(list: any) {
    const undoAnnotations: any = this.annotateJson?.annotateObjects?.filter((annotation: any) => annotation?.show === false).map((annotation: any) => annotation.id) || [];
    for (let i = 0; i < list?.length; i++) {
      if (!undoAnnotations.includes(list[i].id)) {
        setTimeout(() => {
          let obj = list[i];
          this.refreshAnnotationsObjects(obj, 'refresh');
        }, 100);
      }
    }
  }

  refreshAnnotations() {
    const undoAnnotations: any = this.annotateJson?.annotateObjects?.filter((annotation: any) => annotation?.show === false).map((annotation: any) => annotation.id) || [];
    for (let i = 0; i < this.annotateJson.annotateObjects?.length; i++) {
      if (!undoAnnotations.includes(this.annotateJson.annotateObjects[i].id)) {
        let obj = this.annotateJson.annotateObjects[i];
        setTimeout(() => {
          if (!this.loadedAnnotations.includes(obj.TxnId)) {
            if (this.refreshAnnotationsObjects(obj, 'refresh')) {
              this.loadedAnnotations.push(obj.TxnId);
            };
          }
        }, 100);
      }
    }
  }
  removeAnnotaions(list: any = null) {
    let mainObj: any = list == null ? this.annotateJson.annotateObjects : list
    let annotationList = mainObj.filter((item: any, index: any, self: any) =>
      index === self.findIndex((t: any) => (t.selectedStepDgUniqueID === item.selectedStepDgUniqueID && t.prompt === item.prompt)));
    for (let i = 0; i < annotationList.length; i++) {
      let annotaion: any = annotationList[i];
      let step: any = this.sharedviewService.getStepID({ dgUniqueID: annotaion.selectedStepDgUniqueID }, annotaion.prompt);
      if (step) {
        step.innerHTML = step.innerHTML.replace(/<svg.?>.?<\/svg>/ig, '');
        step.innerHTML = step.innerHTML.replace(`style = "position: relative;"`, '');
        if (annotationList != null) {
          let index1 = this.loadedAnnotations.indexOf(annotaion?.TxnId);
          if (index1 >= 0) {
            this.loadedAnnotations.splice(index1, 1);
          }
        }
      }
    }
    if (list == null) { this.loadedAnnotations = []; }
  }
  isTextBroken(range: Range): boolean {
    const rects = range.getClientRects();
    return rects.length > 1;
  }
  saveAnnotation(stepObject: any, type: any) {
    let annotationType = type == 'add' ? 'Annotation' : 'RemoveAnnotation'
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction(annotationType, user, new Date(), user, new Date(), '',
      'Annotation', stepObject.dgUniqueID, '');
    stepAction = { ...stepAction, ...this.sharedviewService.setUserInfoObj(stepAction.action) };
    stepAction['dgType'] = 'Annotation';
    stepAction['selectedStepDgUniqueID'] = stepObject.dgUniqueID;
    stepAction['dgUniqueID'] = new Date().getTime();
    this.dataEntryJsonEvent(stepAction);
    this.sharedviewService.clearSelection();
  }

  refreshAnnotationsObjects(obj: any, type: string) {
    let event = { selectedType: obj.type }
    let selectdId = obj.id;
    let e: any = document.querySelector(selectdId);
    if (e == null || e == '') { e = this.sharedviewService.getElement({ id: selectdId }); }
    let selectedObj: any = this.executionService.annotations.find(item => item.type === event.selectedType);
    if (e == null || e == '') { e = this.sharedviewService.getElement({ id: selectdId }); }
    if (e) {
      const annotation = annotate(e, selectedObj);
      annotation.show();
      return true;
    }
    return false;
  }


  adjustRangeToElement(range: Range, element: HTMLElement) {
    const startNode = this.findClosestTextNode(element, range.startContainer, range.startOffset, true);
    const endNode = this.findClosestTextNode(element, range.endContainer, range.endOffset, false);
    if (startNode && endNode) {
      range.setStart(startNode.node, startNode.offset);
      range.setEnd(endNode.node, endNode.offset);
      console.log(range);
      return true;
    }
    return false;
  }

  findClosestTextNode(element: HTMLElement, node: Node, offset: number, isStart: boolean): { node: Node, offset: number } | null {
    if (element.contains(node)) {
      return { node, offset };
    }
    let closestNode: Node | null = null;
    let closestOffset = 0;
    function traverseNodes(currentNode: Node) {
      if (currentNode.nodeType === Node.TEXT_NODE && element.contains(currentNode)) {
        closestNode = currentNode;
        closestOffset = isStart ? 0 : currentNode.textContent!.length;
      }
      for (let child = currentNode.firstChild; child; child = child.nextSibling) {
        traverseNodes(child);
      }
    }
    traverseNodes(element);
    if (closestNode) {
      return { node: closestNode, offset: closestOffset };
    }
    return null;
  }
  checkAnnotationIsExist(selected: any, spanTagsContainingText: any, annotaionType: any, selectedText: any, range: any) {
    let allSpanTags = document.querySelectorAll(`span[id^="#step${selected.dgUniqueID}an"]`);
    let matchedSpan: HTMLElement | null | any = null;
    spanTagsContainingText = Array.from(allSpanTags).filter((span: any) => (span.textContent === selectedText || span.innerText === selectedText.trim()));
    let spanIds: any = [];
    spanTagsContainingText.forEach((spans: any) => spanIds.push(spans.id));
    let indexOfMatchedSpan = spanTagsContainingText.indexOf(spanTagsContainingText.find((span: HTMLElement) => span.lastChild == span.firstChild && range?.commonAncestorContainer?.parentNode.id === span?.id));
    matchedSpan = spanTagsContainingText[indexOfMatchedSpan];
    if (matchedSpan) {
      const undoAnnotations: any = this.annotateJson?.annotateObjects?.filter((annotation: any) => annotation?.show === false).map((annotation: any) => annotation.id) || [];
      let existIdObjs = this.annotateJson.annotateObjects.filter((annotation: any) => spanIds.includes(annotation.id) && annotation.type == annotaionType && !undoAnnotations.includes(annotation.id))
      if (existIdObjs?.length > 0) {
        this.notifier.hideAll();
        this.notifier.notify('warning', `${annotaionType} Annotation is already exists`);
        this.sharedviewService.clearSelection();
        return true;
      }
    }
    return false;
  }

  storelayoutStyles(object: any) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section || object[i].dgType === DgTypes.StepInfo) {
          object[i] = this.setLayoutChanges(object[i]);
        }
        if (this.executionService.stepActionCondition(object[i])) {
          object[i] = this.setLayoutChanges(object[i]);
        }
        if (object[i].dgType === DgTypes.DualAction) {
          this.storelayoutStyles(object[i].children);
          this.storelayoutStyles(object[i].rightDualChildren);
        }
        if (object[i].children) {
          this.storelayoutStyles(object[i].children);
        }
      }
    }
  }

  setLayoutChanges(data: any) {
    data['setIndentaion'] = this.stylesService.setIndentaion(data, this.indendation);
    data['setAlignIndentaion'] = this.stylesService.setAlignIndentaion(data, this.indendation, this.layoutIcons);
    data['setLayoutindentation'] = this.layoutService.setLayoutIndendation(data, this.indendation, this.layoutIcons);
    return data;
  }

  fontFamilyForCBP(event: any) {
    this.cbpService.mainFontFamily = event.font;
    this.cbpJson.documentInfo[0]['fantfamily'] = event.font;
    this.setpropertyDoc();
    this.executionService.setStyleViewItem({ 'fontFamily': event.font, type: 'fontFamily' });
  }

  updateFontSize(event: any) {
    if (event !== false) {
      this.cbpJson.documentInfo[0]['fantSize'] = event.font;
      this.setpropertyDoc();
      this.executionService.setStyleViewItem({ 'fantSize': event.font, type: 'fontSize' });
    }
  }

  setpropertyDoc() {
    this.cbpService.documentInfo = this.cbpJson.documentInfo[0];
    this.propertyDocument = this.cbpJson.documentInfo[0];
  }
  refreshEvent() {
    this.viewUpdate(true);
    this.cdref.detectChanges();
  }

  linkEvent(event: any) {
    if (event.type == 'add') {
      this.linkEventAdd(event);
    } else if (event.type === 'remove') {
      this.removeLink(event);
    } else {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please select text before applying it');
    }
  }
  removeLink(event: any) {
    throw new Error('Method not implemented.');
  }
  linkEventAdd(event: any) {
    const selectedText = this.cbpService.getSelectionText().trim();
    this.getRefObj.emit({ type: 'link', selectedText: selectedText });
  }

  mediaUpdate(event: any) {
    let mediaObj = event?.file;
    if (mediaObj) {
      const fileIndex = this.cbpService.media.findIndex((x: any) => x.name.includes(mediaObj.name) &&
        this.cbpService.checkFileNameExist(mediaObj.name, x.name));
      if (fileIndex != -1) {
        this.cbpService.media.splice(fileIndex, 1, mediaObj);
      }
      this.updateMediaInfo.push({ fileName: mediaObj.name });
      this.dataJsonChange.emit(this.cbpService.dataJson);
      this.dataJsonService.setMediaItem(this.cbpService.media);
    }
  }

  copyFromWord(event: any) {
    this.clearTableRowInfo();
    let obj = JSON.parse(JSON.stringify(this.modalOptions));
    obj.size = 'lg';
    const modalRef = this.modalService.open(CopyFromWordComponent, obj);
    modalRef.componentInstance.initialData = this.executionService.wordHtml;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      if (result != false) {
        this.executionService.wordData = result.wordData;
        this.executionService.wordHtml = result.wordHtml;
      }
      this.cdref.detectChanges();
      modalRef.close();
    });
  }
  sessionDataJsonStore(dataInfo: any) {
    if (dataInfo && !this.executionService.isEmpty(dataInfo)) {
      if (this.cbpService.isDataEtry({ dgType: dataInfo.dgType }) && this.cbpService.isHTMLText(dataInfo.value)) {
        let lastElement = this.cbpService.dataJson.dataObjects[this.dataJson.dataObjects.length - 1];
        this.cbpService.storeDataJsonEntries({ innerHtmlView: true, dgType: dataInfo.dgType }, dataInfo, lastElement);
      } else {
        this.cbpService.dataJsonStoreChange(dataInfo);
      }
    }
  }
  protectAllSections() {
    this.cbpService.protectOrUnProtectData(this.cbpJson.section, true);
    this.protectHeaderFooter(this.cbpJson.documentInfo[0].header.children);
    this.protectHeaderFooter(this.cbpJson.documentInfo[0].footer.children);
    this.applyTableRules(this.cbpService.selectedElement?.children);
    // this.cbpJson.documentInfo[0].coverPageData = this.cbpService.setDefaultCBPTableChanges(this.cbpJson.documentInfo[0].coverPageData, { type: 'protect', protect: true, dataObject: [] }, null,this.cbpService.protectJson);
    const protectJsonObject = new ProtectObject().init();
    protectJsonObject.by = this.executionService.selectedUserId;
    protectJsonObject.Action = ActionId.Update;
    protectJsonObject.device = this.sharedviewService.getDeviceInfo();
    this.cbpService.setDefaultCBPTableChanges(this.cbpJson.documentInfo[0]?.coverPageData, { type: 'protect', protect: true, dataObject: [] }, null, protectJsonObject)//this.cbpService.protectJson);
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction('completed', user, new Date(), user, new Date(), '',
      'ProtectAll', '', '6000');
    stepAction = { ...stepAction, ...this.sharedviewService.setUserInfoObj(6000) };
    this.checkDupTxIdProtectJson();
    this.dataEntryJsonEvent(stepAction);
    this.sharedviewService.detectAll = true;
    this.cdref.detectChanges();
  }
  checkDupTxIdProtectJson() {
    let protectInfo = this.getUniqueObjects(this.cbpService.protectJson.protectObjects);
    protectInfo.dup = this.cbpService.removeDuplicates(protectInfo.dup, 'TxnId');
    this.cbpService.protectJson.protectObjects = this.cbpService.removeDuplicates(this.cbpService.protectJson.protectObjects, 'TxnId');
    protectInfo.dup.forEach((element: any) => {
      let find = this.cbpService.protectJson.protectObjects.filter((item: any) => item.TxnId == element.TxnId);
      if (!find || find?.length == 0) {
        this.cbpService.protectJson.protectObjects.push(element);
      }
    });
    // console.log(this.cbpService.protectJson.protectObjects);
  }
  getUniqueObjects(array: any) {
    const dup: any = [];
    const uniqueItems = new Set();
    array.forEach(function (a: any) {
      if (uniqueItems.has(a.TxnId)) {
        dup.push(a);
      }
      uniqueItems.add(a.TxnId);
    });
    return { dup: dup, unique: uniqueItems }
  }

  protectHeaderFooter(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.Form) {
        const protectJsonObject = new ProtectObject().init();
        protectJsonObject.by = this.sharedviewService.executionService.selectedUserId;
        protectJsonObject.Action = ActionId.Update;
        protectJsonObject.device = this.sharedviewService.getDeviceInfo();
        object[i] = this.cbpService.setDefaultCBPTableChanges(object[i], { type: 'protect', protect: true, dataObject: [], headerProtect: true }, null, protectJsonObject);
      }
      if (object[i].children) { this.protectHeaderFooter(object[i].children); }
    }
  }

  eventFromExecuterMenuBar(event: any) {
    if (event.eventType === this.menuBarEvent.protectAllFields) {
      this.protectAllSections();
    }
    if (event.eventType === this.menuBarEvent.ClearSelectedFields) {
      this.cbpService.clearSelectedRowFields(this.tableService.selectedRow);
      this.tableService.selectedRow = this.tableService.selectedRow.slice(0, 1);
      if (this.cbpService.clearSignObject?.length > 0) {
        this.dataJsonService.clearSignItem(this.cbpService.clearSignObject);
      }
      this.sharedviewService.detectAll = true;
      this.cdref.detectChanges();
    }
  }

  clearTableRowInfo() {
    this.cbpService.copiedElement = [];
    if (localStorage.getItem("tableRow") !== null) {
      localStorage.removeItem("tableRow");
    }
  }
  ngOnDestroy() {
    this.setLoader(true);
    if (this.isMobile) {
      if (this.autoSaveInterval)
        clearInterval(this.autoSaveInterval); // Will clear the timer.
    }
    try {
      this.subscription?.unsubscribe();
      this.antlrService.callBackObject = new CallbackObject();
      this.cbpService.loading = false;
      this.sharedviewService.deviceInfo = null;
      this.layoutService.isDisableNumber = false;
      this.layoutService.layoutIcons = [];
      this.cbpJsonZip = undefined;
      this.clearDatajsonValues();
      this.cbpService.clearDataVariables();
      this.cbpJson = this.cbpConstJson;
      this.cbpJson.documentInfo[0]['fontfamily'] = 'Poppins';
      this.cbpJson.documentInfo[0]['fontsize'] = 2;
      this.cbpJson.documentInfo[0]['color'] = '#000000';
      this.dataJsonService.errorMessage = false;
      this.sharedviewService.midPaste = false;
      this.executionService.selectedFieldEntry = undefined;
      this.executionService.defualtInitial = null;
      this.executionService.defualtSign = null;
      this.cbpService.media = [];
      this.executionService.formatPainterEnable = false;
      this.cbpService.isDisabledAllInputEntries = false;
      this.executionService.formatStyle = {};
      this.updateTextView$.unsubscribe();
      this.protectAll?.unsubscribe();
      this.clearCopyTableInfo();
      this.clearTableRowInfo();
      this.loadedAnnotations = [];
      this.deleteImageObject?.unsubscribe();
    } catch (error) { console.log(error); }
  }

  checkTextBoldUnderlineWrapper(htmlElement: any, selectdId: any, replaceTitle: any) {
    let isSelectedTextBold = false;
    let isSelectedTextUnderlined = false;
    for (let i = 0; i < htmlElement?.childNodes?.length; i++) {
      const child = htmlElement.childNodes[i];
      if (child.nodeType === 1) {
        const isBold = child.tagName === 'B' && child.innerText === this.cbpService.annotationObj.text?.trim();
        const isUnderlined = child.tagName === 'U' && child.innerText === this.cbpService.annotationObj.text?.trim();
        if (isBold || isUnderlined) {
          isSelectedTextBold = isSelectedTextBold || isBold;
          isSelectedTextUnderlined = isSelectedTextUnderlined || isUnderlined;
          break;
        }
        if (child.tagName === 'B' || child.tagName === 'U') {
          const nestedChild = child.querySelector('u, b');
          if (nestedChild && nestedChild.innerText === this.cbpService.annotationObj.text?.trim()) {
            isSelectedTextBold = isSelectedTextBold || child.tagName === 'B';
            isSelectedTextUnderlined = isSelectedTextUnderlined || child.tagName === 'U';
            break;
          }
        }
      }
    }
    if (isSelectedTextBold || isSelectedTextUnderlined) {
      replaceTitle = `<span id="${selectdId}">`;
      if (isSelectedTextBold) replaceTitle += `<b>`;
      if (isSelectedTextUnderlined) replaceTitle += `<u>`;
      replaceTitle += `${this.cbpService.annotationObj.text}`;
      if (isSelectedTextUnderlined) replaceTitle += `</u>`;
      if (isSelectedTextBold) replaceTitle += `</b>`;
      replaceTitle += `</span>`;
    }
    return replaceTitle;

  }
  isParentRepeatStepCompletedOnce(item: any, dataObjects: any, latestDataObj: any, parentRepetStep: any) {
    if (parentRepetStep) {
      let parentStepCompltionObjets = dataObjects?.filter((obj: any) => obj?.dgType == DgTypes.Repeat && obj?.dgUniqueID?.toString() == parentRepetStep?.dgUniqueID?.toString() && obj?.status?.toLowerCase()?.includes('complete') || obj?.status === this.stepTypes.CompleteStep)
      return parentStepCompltionObjets?.length > 0 && parentStepCompltionObjets[parentStepCompltionObjets?.length - 1]?.repeatTime?.toString() == latestDataObj?.repeatTime?.toString();
    }
    return false;
  }
  hasRepeatStepStarted(item: any, dataObjects: any, latestDataObj: any, parentRepeatStep: any): boolean {
    if (!parentRepeatStep) return false;
    const parentStepId = parentRepeatStep.dgUniqueID?.toString();
    const isInProgress = dataObjects?.some((obj: any) => obj.dgType === DgTypes.Repeat && obj.dgUniqueID?.toString() === parentStepId && (obj.status?.toLowerCase().includes('in progress') || obj.status === this.stepTypes.InProgressStep));
    if (isInProgress) return true;
    const isCompleted = dataObjects?.some((obj: any) => obj.dgType === DgTypes.Repeat && obj.dgUniqueID?.toString() === parentStepId && (obj.status?.toLowerCase().includes('complete') || obj.status === this.stepTypes.CompleteStep));
    return parentRepeatStep?.repeatStepStarted || isCompleted;
  }
  repeatStepStartAgain(item: any) {
    if (this.executionService.repeatStepEnable) {
      return item;
    }
    item['repeatStepStarted'] = true;
    if (!item['repeatTimes']) { item['repeatTimes'] = 1; }
    if (!item['currentRepeatTimes']) { item['currentRepeatTimes'] = 0; }
    this.repeatTimes = item['currentRepeatTimes'] + 1;
    let repeatObj: any = { dgType: DgTypes.Repeat, repeatStepEnable: true, object: item, updateRepeatTimes: item['currentRepeatTimes'] + 1 };
    this.executionService.setTimerStep(repeatObj);
    this.executionService.repeatStepEnable = true;
    this.cbpService.selectedTimerRepeatStep = item;
    let dgType = 'repeatStepStarted';
    item[dgType] = true;
    if (item.children?.length > 0) {
      item = this.cbpService.notifyRepeatOrTimedStepChilds(dgType, item);
    }
    return item;
  }
  getParentRepeatStepObj(item: any): any | null {
    const parentStep = this.cbpService.stepActionArray.find((parent: any) =>
      parent?.dgUniqueID?.toString() === item?.parentDgUniqueID?.toString()
    );
    if (parentStep?.dgType === DgTypes.Repeat) {
      return parentStep;
    }
    return parentStep ? this.getParentRepeatStepObj(parentStep) : null;
  }
  processDerivedAndDataEntry(object: any) {
    const obj = object;
    const isDerivedDataEntry =
      (obj.dgType === DgTypes.NumericDataEntry || obj.dgType === DgTypes.TextDataEntry) &&
      obj?.valueType === DgTypes.Derived;
    if (isDerivedDataEntry) {
      if (obj?.valueType == 'Derived') {
        if (this.cbpService.reverseTempMapUniqueID?.size !== this.cbpService.tempMapUniqueID?.size) {
          this.cbpService.tempMapUniqueID.forEach((value, key) => this.cbpService.reverseTempMapUniqueID.set(value?.toString(), key));
        }
        obj['ParsedValue'] = this.cbpService.validateDerivedRuleWithDgUniqueIDs(obj, this.cbpService.reverseTempMapUniqueID);
      }
      this.executionService.stepChildDerivedObjs.push(obj);
    }
    if (this.cbpService.isDataEtry(obj)) {
      if (obj?.alarm?.length > 0) {
        this.executionService.dataEntryAlarmRuleObj?.push(obj);
      }
      this.executionService.storeDynamicDataEntryIDs(obj?.fieldName, obj.dgUniqueID);
      this.antlrService.callBackObject.init(obj?.fieldName, obj.dgUniqueID);
    }
  }


  base64ToBlob(base64: any, mime: any) {
    mime = "image/jpeg";
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  showEditImage(file: any, fileData: any) {
    this.mediaFileData = fileData;
    let imageBlob = this.base64ToBlob(file, fileData)
    this.mediaFile = { baseUrl: imageBlob, name: fileData.fileName }
    if (this.mediaFile.baseUrl instanceof Blob) {
      this.getBase64(this.mediaFile.baseUrl, (base64Data: any) => {
        this.mediaFile.baseUrl = base64Data;
        this.openEditor();
      });
    }
  }

  openEditor() {
    this.sharedService.openModalPopup('imageEditTab');
    let self = this;
    setTimeout(() => {
      const container = document.getElementById('tablet-tui-image-editor-container');
      if (container) {
        this.imageEditor = new tui.ImageEditor(container, {
          includeUI: {
            loadImage: { path: self.mediaFile.baseUrl, name: self.mediaFile.name },
            theme: whiteTheme,
            initMenu: 'draw',
            menuBarPosition: 'right'
          },
          cssMaxWidth: 700,
          cssMaxHeight: 450,
          usageStatistics: false,
        });
        window.onresize = function () { self.imageEditor.ui.resizeEditor(); };
        $('.help').css({ "margin-bottom": "-7px" });
      }
    }, 0)
  }

  closeModal() {
    if (this.imageEditor) {
      this.imageEditor.destroy();
      this.imageEditor = null;
    }
    this.sharedService.hideModal('imageEditTab');
    let obj = {
      action: 7000,
      baseUrl: "",
      fileName: this.mediaFileData?.fileName
    }
    let newObj = { ...{ datajson: [] }, ...obj }
    if (this.isMobile) {
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireEditedMedia, msg: newObj };
      this.datashareService.sendMessageFromLibToOutside(evt);
    }
  }

  saveImgeBlob() {
    let obj = {
      action: 7000,
      baseUrl: this.imageEditor?.toDataURL(),
      fileName: this.mediaFileData?.fileName
    }
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = 7000;
    dataInfo.dgType = "UpdateFigure";
    let dataInfoObj: any = { ...dataInfo, ...obj, ...this.sharedviewService.setUserInfoObj(obj.action) }
    let deltaObj = { datajson: JSON.parse(JSON.stringify(this.getDeltaJson())) }
    if (dataInfoObj?.baseUrl) delete dataInfoObj.baseUrl;
    dataInfoObj.dgUniqueID = 'm_' + ++this.cbpService.uniqueIdIndex;
    if (dataInfoObj['mediaUrl']) {
      delete dataInfoObj.mediaUrl;
    }
    deltaObj.datajson.dataObjects.push(dataInfoObj);
    let newObj = { ...deltaObj, ...obj }
    console.log(obj);
    console.log(newObj);
    this.cbpService.dataJsonStoreChange(dataInfoObj);
    if (this.isMobile) {
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireEditedMedia, msg: newObj };
      this.datashareService.sendMessageFromLibToOutside(evt);
    }
    if (this.imageEditor) {
      this.imageEditor.destroy();
      this.imageEditor = null;
    }
    this.sharedService.hideModal('imageEditTab');
  }
  eventSubmit(event: any) {
    if (event.type === 'Ok') {
      this.saveImgeBlob();
    } else {
      this.closeModal();
    }
  }

}
