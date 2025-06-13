import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  isDevMode
} from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { ExecuterModes } from '../../ExternalAccess/executer-modes';
import { EventType, Event_resource, MenuBarEventType, Request_Executor_Msg, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { StylesService } from '../../shared/services/styles.service';
import { TableService } from '../../shared/services/table.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-execution-menu-bar',
  templateUrl: './execution-menu-bar.component.html',
  styleUrls: ['./execution-menu-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionMenuBarComponent implements AfterViewInit, OnChanges {
  ImagePath: typeof ImagePath = ImagePath;
  @Input() documentSelected: any;
  @Input() customUsers!: any;
  @Input() isDetailTabEnabled!: any;
  @Input() freezePage!: any;
  @Input() entirePageFreeze!: any;
  @Input() stepCompleteCount: any;
  @Input() isEdocument: any;
  @Input() isReadOnlyFromEdocument: any;
  @Input() completedExecution: any;
  @Input() terminatedExecution: any;
  @Input() isDetailsTabOpen: any;
  @Input() isRepeatStep: any;
  totalRepeatTimes: any;
  @Input() disableStep: any;
  repeatTimes: any;
  disabledUndo: boolean = true;
  @Input() selectedStepSectionInfo: any;
  @Input() disableMedia: any;
  @Input() isReadOnlyExecution: any;
  @Input() isTimerOnStep: any;
  @Input() stopCbpExecution: any;
  @Input() stepTime: any;
  @Input() menuConfig: any;
  @Input() executerModes!: ExecuterModes;
  @Input() dataJson: any;
  @Input() headerFooterSelected: any;
  @Input() stepObject: any;

  actionSteps: any;

  @Output() showUserEvent: EventEmitter<any> = new EventEmitter();
  @Output() isNavigationOpenChange: EventEmitter<any> = new EventEmitter();
  @Output() saveCbpFile: EventEmitter<any> = new EventEmitter();
  @Output() refreshCbpFile: EventEmitter<any> = new EventEmitter();
  @Output() isDetailTabEnabledChange: EventEmitter<any> = new EventEmitter();
  @Output() goToStep: EventEmitter<any> = new EventEmitter();
  @Output() singleMedia: EventEmitter<any> = new EventEmitter();
  @Output() stopExecution: EventEmitter<any> = new EventEmitter();

  @Output() emailOpn: EventEmitter<any> = new EventEmitter();
  @Output() openCR: EventEmitter<any> = new EventEmitter();
  @Output() openComment: EventEmitter<any> = new EventEmitter();
  @Output() editStepModal: EventEmitter<any> = new EventEmitter();
  @Output() undoModal: EventEmitter<any> = new EventEmitter();
  @Output() completeExecute: EventEmitter<any> = new EventEmitter();
  @Output() terminateExecute: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();
  @Output() uploadMediaOpen: EventEmitter<any> = new EventEmitter();
  @Output() timerFinishEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicSection: EventEmitter<any> = new EventEmitter();
  @Output() saveCBPModal: EventEmitter<any> = new EventEmitter();
  @Output() isMenuBarChange: EventEmitter<any> = new EventEmitter();
  @Output() updateViewText: EventEmitter<any> = new EventEmitter();
  @Output() tableAddRow: EventEmitter<any> = new EventEmitter();
  @Output() colorUpdateSet: EventEmitter<any> = new EventEmitter();
  @Output() referenceEventObj: EventEmitter<any> = new EventEmitter();
  @Output() linkEventObj: EventEmitter<any> = new EventEmitter();
  @Output() hideDocSize: EventEmitter<any> = new EventEmitter();
  @Output() excuterMenuBar: EventEmitter<any> = new EventEmitter();
  @Output() copyFromWordEvent: EventEmitter<any> = new EventEmitter();
  @Output() annotate: EventEmitter<any> = new EventEmitter();
  @Output() parentEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('select') selectDropdown!: any;
  @ViewChild('bgInput') colorChange!: any;

  @ViewChild('selectFamily') selectFontFamilyDropdown!: any;
  @ViewChild('selectMainFamily') selectMainFamily!: any;
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];

  roughAnnotation = ['underline', 'box', 'circle', 'highlight', 'strike-through', 'crossed-off', 'bracket']
  selecedAnnotate = '';
  // all types of event
  @Output() executerType: EventEmitter<any> = new EventEmitter();
  @Output() styleFontType: EventEmitter<any> = new EventEmitter()
  @Output() updateColor: EventEmitter<any> = new EventEmitter();
  @Output() notifyEventToExecuter: EventEmitter<Request_Executor_Msg> = new EventEmitter();


  btnClass = "btn btn-icon btn-outline-secondary btn-sm button-pad";
  show = false;
  @Input() isMenuBarOpen = false;
  isMobile = false;
  isLandScapeMode = false;
  @Input() propertyDocument: any;
  table_subscription!: Subscription;
  selectedRow: any;
  selectedTable: any;
  showRow = false;
  rowIndex: any;
  colorUpdateOpen = false;
  pasteTableData = false;
  selectedRowCol: any;
  windowWidth!: number;
  commentEnable = false;
  selectElement$!: Subscription;
  windowSizesubscription!: Subscription;
  updateTextView$!: Subscription;
  menuBarFields$!: Subscription;
  enableAnnotationSub$!: Subscription;
  enableViewModeSub!: Subscription;
  timerStepSubscription!: Subscription;
  selectedItem: any;
  enableSave = false;
  dgType: typeof DgTypes = DgTypes;
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  tableExists = false;
  defaultColor: string = '#000000';
  defaultFontSize: any = '2';
  defaultFontFamily = 'Poppins';
  defaultTextAlign = 'left';
  mainFontFamily = 'Poppins';
  menuBarEvent: typeof MenuBarEventType = MenuBarEventType;
  repeatStepEnable: any;
  disableForNNS = false;
  constructor(public executionService: ExecutionService, private datashareService: DatashareService,
    public cdr: ChangeDetectorRef, public cbpService: CbpExeService, public tableService: TableService,
    public dataJsonService: DataJsonService, public sharedviewService: SharedviewService,
    public styleService: StylesService) {
  }

  ngAfterViewInit(): void {
    this.isMobile = this.datashareService.getMenuConfig()?.isMobile;
    if (this.isMobile) {
      this.isReadOnlyExecution = false;
      this.isEdocument = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.cbpService.stepActionArray.length > 0) {
      this.getStepsLength();
      this.getCurrentIndex();
    }
    for (const propName in changes) {
      if (propName === 'isMenuBarOpen' && !changes.isMenuBarOpen.firstChange) {
        this.isMenuBarOpen = changes.isMenuBarOpen.currentValue;
      }
      if (propName === 'documentSelected' && !changes.documentSelected.firstChange) {
        this.documentSelected = changes.documentSelected.currentValue;
      }
      if (propName === 'customUsers' && !changes.customUsers.firstChange) {
        this.customUsers = changes.customUsers.currentValue;
      }
      if (propName === 'isDetailTabEnabled' && !changes.isDetailTabEnabled.firstChange) {
        this.isDetailTabEnabled = changes.isDetailTabEnabled.currentValue;
      }
      if (propName === 'freezePage' && !changes.freezePage.firstChange) {
        this.freezePage = changes.freezePage.currentValue;
      }
      if (propName === 'entirePageFreeze' && !changes.entirePageFreeze.firstChange) {
        this.entirePageFreeze = changes.entirePageFreeze.currentValue;
      }
      if (propName === 'stepCompleteCount' && !changes.stepCompleteCount.firstChange) {
        this.stepCompleteCount = changes.stepCompleteCount.currentValue;
      }
      if (propName === 'isEdocument' && !changes.isEdocument.firstChange) {
        this.isEdocument = changes.isEdocument.currentValue;
      }
      if (propName === 'isReadOnlyFromEdocument' && !changes.isReadOnlyFromEdocument.firstChange) {
        this.isReadOnlyFromEdocument = changes.isReadOnlyFromEdocument.currentValue
      }
      if (propName === 'completedExecution' && !changes.completedExecution.firstChange) {
        this.completedExecution = changes.completedExecution.currentValue;
        this.cbpService.isDisabledAllInputEntries = this.completedExecution;
        this.cdr.detectChanges();
      }
      if (propName === 'menuConfig' && !changes.menuConfig.firstChange) {
        this.menuConfig = changes.menuConfig.currentValue;
        if (this.menuConfig) { this.datashareService.setMenuConfig(this.menuConfig); }
        this.cdr.detectChanges();
      }
      if (propName === 'terminatedExecution' && !changes.terminatedExecution.firstChange) {
        this.terminatedExecution = changes.terminatedExecution.currentValue;
        this.cbpService.isDisabledAllInputEntries = this.terminatedExecution;
        this.cdr.detectChanges();
      }
      if (propName === 'isDetailsTabOpen' && !changes.isDetailsTabOpen.firstChange) {
        this.isDetailsTabOpen = changes.isDetailsTabOpen.currentValue;
      }
      if (propName === 'isRepeatStep' && !changes.isRepeatStep.firstChange) {
        this.isRepeatStep = changes.isRepeatStep.currentValue;
      }
      if (propName === 'disableStep' && !changes.disableStep.firstChange) {
        this.disableStep = changes.disableStep.currentValue;
      }
      if (propName === 'selectedStepSectionInfo' && !changes.selectedStepSectionInfo.firstChange) {
        this.selectedStepSectionInfo = changes.selectedStepSectionInfo.currentValue;
      }
      if (propName === 'disableMedia' && !changes.disableMedia.firstChange) {
        this.disableMedia = changes.disableMedia.currentValue;
      }
      if (propName === 'isReadOnlyExecution' && !changes.isReadOnlyExecution.firstChange) {
        this.isReadOnlyExecution = changes.isReadOnlyExecution.currentValue;
      }
      if (propName === 'stopCbpExecution' && !changes.stopCbpExecution.firstChange) {
        this.stopCbpExecution = changes.stopCbpExecution.currentValue;
      }
      if (propName === 'propertyDocument' && !changes.propertyDocument.firstChange) {
        this.propertyDocument = changes.propertyDocument.currentValue;
        this.initializeDefaultStyles();
      }
      if (propName === 'dataJson' && !changes.dataJson.firstChange) {
        this.dataJson = changes.dataJson.currentValue;
      }
      if (propName === 'headerFooterSelected' && !changes.headerFooterSelected.firstChange) {
        this.headerFooterSelected = changes.headerFooterSelected.currentValue;
      }
      if (propName === 'stepObject' && !changes.stepObject.firstChange) {
        this.stepObject = changes?.stepObject?.currentValue;
        if (this.stepObject) {
          this.setMenubarStyleDropdowns();
        }
      }
    }
  }

  setStyleObject(styleSet: any) {
    if (styleSet && !this.executionService.isEmpty(styleSet)) {
      if (styleSet['fontsize'] || styleSet['fontSize']) {
        let fontSize;
        if (styleSet['fontSize']) {
          fontSize = this.styleService.getSizeStyles(styleSet['fontSize']);
        }
        this.defaultFontSize = styleSet['fontsize'] ? styleSet['fontsize'] : fontSize;
        if (this.defaultFontSize?.toString()?.includes('px')) {
          this.defaultFontSize = this.styleService.getSizeStyles(this.defaultFontSize?.toString())
        }
      } else {
        this.defaultFontSize = 2;
      }
      if (styleSet['fontfamily'] || styleSet['fontName']) {
        this.defaultFontFamily = styleSet['fontfamily'] ? styleSet['fontfamily'] : styleSet['fontName'];
      } else {
        this.defaultFontFamily = 'Poppins';
      }
      if (styleSet['fontcolor'] || styleSet['color']) {
        this.defaultColor = styleSet['fontcolor'] ? styleSet['fontcolor'] : styleSet['color'];
        if (this.colorChange.nativeElement)
          this.colorChange.nativeElement.style.color = this.defaultColor;
      } else {
        this.defaultColor = '#000000';
      }
      if (styleSet['textalign']) {
        this.defaultTextAlign = styleSet['textalign'] ? styleSet['textalign'] : 'left';
      } else {
        this.defaultTextAlign = 'left';
      }
    } else {
      if (!this.stepObject?.dgType && this.stepObject?.property) {
        this.defaultStyles();
      } else {
        this.initializeDefaultStyles();
      }
    }
  }

  onInputClick = (event: any) => {
    console.log('input click iamge');
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  uploadCameraEvent() {
    let evt: Request_Msg = { eventFrom: Event_resource.camUpload, eventType: EventType.fireCameraVideoEvent, msg: '' };
    this.datashareService.sendMessageFromLibToOutside(evt);
  }

  ngOnInit() {
    if (isDevMode()) {
      this.enableSave = true;
    }
    this.table_subscription = this.executionService.setTablelobjValue.subscribe((res: any) => {
      if (res != '{}' && res?.row !== undefined) {
        // parentDynamicDgUniqueID commented to show table add column and row buttons
        this.menuConfig.showRowTable = true;
        if (res?.type === 'slectedRow') {
          this.selectedRow = res.row;
          this.selectedTable = res.table;
          this.rowIndex = res.index;
          this.selectedRowCol = res?.rowCol;
        }
        if (res?.type === 'tableCopy') {
          this.cbpService.selectCellEnabled = false;
          this.copyTable('copy');
        }
        if (res?.type === 'tablePaste') {
          this.cbpService.selectCellEnabled = false;
          this.copyTable('paste');
        }
        this.cdr.detectChanges();
      }
    });
    if (this.cbpService.monitorExecution) {
      this.menuConfig.isSave = true;
      this.menuConfig.isReadExecuter = false;
    }
    this.windowSizesubscription = this.executionService.windSizeChange.subscribe((window: any) => {
      if (window) {
        this.windowWidth = window.innerWidth;
        this.isLandScapeMode = window.innerHeight > window.innerWidth ? false : true;
        this.cdr.detectChanges();
      }
    });
    this.selectElement$ = this.dataJsonService.selectedElement$.subscribe((res: any) => {
      if (res != '{}' && !this.executionService.isEmpty(res)) {
        this.selectedItem = res.item;
        this.cdr.detectChanges();
      }
    });
    this.updateTextView$ = this.executionService.fieldSource.subscribe((res: any) => {
      if (res != '{}' && res.showMenuText) {
        // this.cbpService.annotationObj = { obj: {}, text: '', type: '' };
        this.menuConfig.isUpdateViewText = true;
        if (!res.stepObject?.isTableDataEntry) {
          this.cbpService.selectedTable = undefined;
        }
        this.executionService.selectedFieldEntry = res.stepObject;
        if (res?.stepObject) {
          this.stepObject = res.stepObject;
          this.setMenubarStyleDropdowns();
        }
        if (res?.stepItem && res?.stepObject?.dgType === DgTypes.Table) {
          this.cbpService.selectedTable = res?.stepObject;
          this.executionService.selectedFieldEntry = res?.stepItem;
          this.executionService.selectedNewEntry = res.stepObject;
        }
      } else {
        this.menuConfig.isUpdateViewText = false;
        this.executionService.selectedFieldEntry = undefined;
      }
      this.cdr.detectChanges();
    });
    this.menuBarFields$ = this.executionService.menuBarFieldsEvent.subscribe((res: any) => {
      if (res?.event !== '') {
        if (res?.event == 'disabledUndo') {
          this.disabledUndo = res.obj;
        }
        if (res.event == 'updateStepCompletionCount') {
          this.getCurrentIndex();
        }
        this.cdr.detectChanges();
      }
    });
    this.enableAnnotationSub$ = this.cbpService.enableAnnotationSubscription.subscribe((res: any) => {
      if (res.type === 'annotation') {
        this.cbpService.enableAnnotation = res.value;
        this.cdr.detectChanges();
      }
    });
    this.enableViewModeSub = this.executionService.executerModesEventChange.subscribe((res: any) => {
      if (res !== undefined) {
        this.executerModes = res;
        if (!this.executerModes.viewMode) { this.stopCbpExecution = false; }
        this.freezePage = this.executerModes.viewMode ? true : false;
        this.cdr.detectChanges();
      }
    });
    this.timerStepSubscription = this.executionService.timerStepChangeEvent.subscribe((res: any) => {
      if (res !== undefined) {
        if (res?.dgType === DgTypes.Timed) {
          if (res.type == 'start') {
            this.setTimerStep(res.object);
          } else {
            this.isTimerOnStep = false;
          }
        }
        if (res?.dgType == DgTypes.Repeat) {
          this.repeatStepEnable = res.repeatStepEnable;
          if (this.repeatStepEnable) {
            this.totalRepeatTimes = Number(res.object.repeatTimes);
            this.repeatTimes = res?.updateRepeatTimes ? res?.updateRepeatTimes : 1;
          }
        }
        if (res?.updateRepeatTimes) {
          this.repeatTimes = res?.updateRepeatTimes;
        }
        this.cdr.detectChanges();
      }
    });
  }
  setTimerStep(object: any) {
    if (object.timeInMinutes === undefined) { object.timeInMinutes = '1'; }
    object.timeInMinutes = object?.timeInMinutes?.toString();
    this.stepTime = Number(object.timeInMinutes) * 60;
    this.stepTime = JSON.parse(JSON.stringify(this.stepTime));
    this.isTimerOnStep = true;
  }
  setMenubarStyleDropdowns() {
    if (this.executionService.selectedNewEntry?.dgType == DgTypes.SignatureDataEntry) {
      if (this.cbpService.signatureFieldItem == 'signatureNotes') {
        if (this.stepObject['notesStyleSet'])
          this.setStyleObject(this.stepObject['notesStyleSet']);
        else
          this.defaultStyles();
      }
      if (this.cbpService.signatureFieldItem === 'signatureUserId') {
        if (this.stepObject['userIdStyleSet'])
          this.setStyleObject(this.stepObject['userIdStyleSet']);
        else
          this.defaultStyles();
      }
      if (this.cbpService.signatureFieldItem === 'signatureName') {
        if (this.stepObject['styleSet'])
          this.setStyleObject(this.stepObject['styleSet']);
        else
          this.defaultStyles();
      }
    } else {
      this.setStyleObject(this.stepObject['styleSet']);
    }
  }
  defaultStyles() {
    this.defaultColor = '#000000';
    this.defaultFontSize = 2;
    this.defaultFontFamily = 'Poppins';
    this.defaultTextAlign = 'left';
  }
  initializeDefaultStyles() {
    this.defaultColor = this.propertyDocument['color'] ?? '#000000';
    this.defaultFontSize = this.propertyDocument['fontsize'] ?? 2;
    this.defaultFontFamily = this.propertyDocument['fontfamily'] ?? 'Poppins';
    this.defaultTextAlign = this.propertyDocument['align'] ?? 'left';
  }

  viewupdate(type: boolean) {
    this.hideDocSize.emit(type);
    this.cdr.detectChanges();
  }
  setCommentEnable() {
    this.commentEnable = !this.commentEnable;
    this.sharedviewService.showComments = this.commentEnable;
    this.executionService.setColorItem({ 'enableCommentsProtect': 'enableComments', bol: this.commentEnable });
  }

  storeItemOfEnter(stepObject: any, value: any) {
    let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
    this.cbpService.dataJson.dataObjects.push(dataInfoObj);
  }

  addRowTable(typeValue: string) {
    let table = { row: this.selectedRow, table: this.selectedTable, type: typeValue, index: this.rowIndex };
    this.tableAddRow.emit(table);
    // this.menuConfig.showRowTable = false;
  }

  copyTable(type: any) {
    if (type === 'copy') {
      if (this.executionService.selectedNewEntry)
        this.cbpService.copySelectedDataEntry = JSON.parse(JSON.stringify(this.executionService.selectedNewEntry));
      let table = {
        row: this.cbpService.copiedElement, table: this.selectedTable,
        type: 'copy', index: this.rowIndex,
        rowCol: this.selectedRowCol
      };
      if (this.cbpService.copiedElement?.length > 0) {
        this.cbpService.copiedElement.forEach((element: any) => {
          element.cellInfo.forEach((item: any) => {
            if (item?.dgType === DgTypes.Figures) {
              let name = item.images[0].fileName;
              let mediaObject = this.cbpService.media.filter(it => it.name === name);
              this.getBase64(mediaObject[0], (base64Data: any) => {
                if (localStorage.getItem("mediaFiles") !== null) {
                  let strinObjects: any = localStorage.getItem("mediaFiles");
                  let arrayFiles = JSON.parse(strinObjects);
                  arrayFiles.push({ fileName: name, fileObj: base64Data });
                  localStorage.setItem('mediaFiles', JSON.stringify(arrayFiles));
                } else {
                  let arrayFiles: any[] = [];
                  let obj = { fileName: name, fileObj: base64Data };
                  arrayFiles.push(obj);
                  localStorage.setItem('mediaFiles', JSON.stringify(arrayFiles));
                }
              });
            }
          });
        });
      }
      localStorage.setItem('tableRow', JSON.stringify(table));
      this.tableAddRow.emit(table);
    }
    if (type === 'paste') {
      let tableNew: any = localStorage.getItem('tableRow');
      if (tableNew !== '' && tableNew !== null) {
        let tableObj = JSON.parse(tableNew);
        tableObj['type'] = 'paste';
        this.tableAddRow.emit(tableObj);
        this.cdr.detectChanges();
      }
    }
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  async deleteRowTable(typeValue: string) {
    let dataIsThere = false;
    this.cbpService.selectCellEnabled = false;
    this.tableService.selectedRow.length = 0;
    const entryObj = this.selectedRow.entry;
    for (let l = 0; l < entryObj.length; l++) {
      if (entryObj[l]) {
        for (let m = 0; m < entryObj[l].children.length; m++) {
          if (entryObj[l].children[m]?.storeValue || entryObj[l].children[m]?.signatureValue) {
            dataIsThere = true;
            break;
          }
        }
      }
    }
    let message = dataIsThere ? 'Row has Data. Do you want to delete the row?' : 'Do you want to delete the row ?';
    const { value: userConfirms, dismiss } = await this.cbpService.showSwal(message, 'warning', 'Yes');
    if (userConfirms) {
      this.addRowTable(typeValue);
    }
  }

  dynamicSectionTest() {
    this.dynamicSection.emit();
  }

  timerFinished(event: any) {
    this.timerFinishEvent.emit(event);
  }

  colorUpdate() {
    this.colorUpdateSet.emit()
  }

  saveLocalCBP() {
    this.saveCBPModal.emit();
  }
  updateViewTextView() {
    this.menuConfig.isUpdateViewText = true;
    this.updateViewText.emit(true);
  }

  getCurrentIndex() {
    this.stepCompleteCount = this.cbpService.stepActionArray.filter((el: any) => (el?.options?.complete === true || el?.options?.notApplicable));
    return this.stepCompleteCount.length;
  }
  getStepsLength() {
    this.actionSteps = this.cbpService.stepActionArray;
  }

  saveCbpFileCall(event: any) {
    if (event === 'refresh') {
      this.refreshCbpFile.emit({ type: event });
    } else {
      this.saveCbpFile.emit({ type: event });
    }

  }
  referenceEvent() {
    this.referenceEventObj.emit();
  }

  linkEvent() {
    this.linkEventObj.emit({ selectedType: 'link', type: 'add' });
  }

  singleMediaChange(event: any) {
    console.log('files selected' + event);
    this.singleMedia.emit({ files: event })
  }

  existingSecurityUserFromParent(event: any) {
    this.showUserEvent.emit(event);
  }

  detailsTabChange() {
    this.isDetailTabEnabled = !this.isDetailTabEnabled;
    this.isDetailTabEnabledChange.emit(this.isDetailTabEnabled);
  }

  stopExecutionChange() {
    this.stopExecution.emit();
  }
  change() {
    this.menuConfig.isNavigation = !this.menuConfig.isNavigation;
    this.isNavigationOpenChange.emit(this.menuConfig.isNavigation);
  }
  menuChange() {
    this.isMenuBarChange.emit(true);
  }

  getDisable() {
    // || (this.cbpService.isDisabledCBP)
    return (this.stopCbpExecution || this.completedExecution) ? true : false;
  }
  getDisableComplete() {
    // || this.cbpService.isDisabledCBP
    return (this.completedExecution) ? true : false;
  }
  disableFreeze() {
    return (this.completedExecution || this.terminatedExecution || this.isDetailsTabOpen) ? true : false;
  }

  openEmailRequest() {
    this.emailOpn.emit();
  }

  openCr() {
    this.openCR.emit();
  }

  commentModal() {
    this.openComment.emit();
  }

  editStepTitleModal() {
    this.editStepModal.emit();
  }
  openUndoComment() {
    this.undoModal.emit();
  }

  completeExecution() {
    this.completeExecute.emit();
  }
  terminateExecution() {
    this.terminateExecute.emit();
  }

  exitExecutor() {
    this.exit.emit();
  }

  fontSizeChange(event: any) {
    this.executionService.formatPainterEnable = false;
    this.defaultFontSize = this.selectDropdown.nativeElement.value;
    this.executerType.emit({ exeucterType: 'styleSheet', type: 'fontsize', font: this.selectDropdown.nativeElement.value });
  }
  fontSizeFamily(event: any) {
    this.executionService.formatPainterEnable = false;
    this.defaultFontFamily = this.selectFontFamilyDropdown.nativeElement.value;
    console.log(this.defaultFontFamily);
    this.executerType.emit({ exeucterType: 'styleSheet', type: 'fontfamily', font: this.selectFontFamilyDropdown.nativeElement.value });
  }
  insertColor(color: string, type: string, event: any) {
    this.executionService.formatPainterEnable = false;
    this.defaultColor = color;
    if (this.colorChange.nativeElement)
      this.colorChange.nativeElement.style.color = this.defaultColor;
    this.updateColor.emit(color);
  }
  executerEvent(type: string) {
    let obj: any = { type: type, exeucterType: 'styleSheet', };
    if (type === 'center' || type === 'left' || type === 'right') {
      obj['align'] = type;
      this.defaultTextAlign = type;
    }
    this.executerType.emit(obj);
  }

  selecTableOption(type: string) {
    this.tableService.selectTableOption(this.cbpService.selectedTable, type,
      this.executionService.formatPainterEnable, this.tableService.selectedRowNum, this.tableService.selectedCol);
    if (this.executionService.formatPainterEnable) {
      let item = JSON.parse(JSON.stringify(this.tableService.selectedRow[this.tableService.selectedRow.length - 1]));
      this.tableService.selectedRow.length = 1;
      this.tableService.selectedRow[0] = item;
      this.executionService.formatPainterEnable = false;
    }
    this.parentEvent.emit();
  }
  selectCell() {
    this.cbpService.selectCellEnabled = !this.cbpService.selectCellEnabled;
    this.excuterMenuBar.emit({ executerType: 'selectCell', value: this.cbpService.selectCellEnabled });
  }
  formatPainter() {
    this.executionService.formatPainterEnable = !this.executionService.formatPainterEnable;
    if (this.executionService.selectedNewEntry) {
      this.executionService.formatStyle = JSON.parse(JSON.stringify(this.executionService.selectedNewEntry['styleSet']));
    }
    this.cdr.detectChanges();
    this.excuterMenuBar.emit({ executerType: 'formatPainter', value: this.executionService.formatPainterEnable });
  }
  selectdAnnotation(item: any) {
    let text = this.cbpService.getSelectionText();
    let typeValue = text !== '' ? 'add' : 'notFound';
    console.log('menubar select annotation method', text);
    this.annotate.emit({ selectedType: this.selecedAnnotate, type: typeValue });
    this.selecedAnnotate = '';
  }

  removeAnnotation() {
    let text = this.cbpService.getSelectionText();
    let typeValue = text !== '' ? 'remove' : 'notFound';
    this.annotate.emit({ selectedType: this.selecedAnnotate, type: typeValue });
  }
  toggleProtectData() {
    this.executionService.isDataProtected = !this.executionService.isDataProtected;
    this.cdr.detectChanges();
  }
  copyMsWordEvent() {
    // console.log("fff", this.selectedItem.children[0].dataType)
    this.selectedItem.children.forEach((item: any) => {
      if (item.dataType == "table" && item.dgType == "Form") {
        this.tableExists = true
      }
    })
    if (this.tableExists) {
      this.copyFromWordEvent.emit({ executerType: 'copyFromWord', value: this.executionService.wordData });
      this.cdr.detectChanges();
    }
  }
  notifyExecuterParent(type: MenuBarEventType) {
    this.tableService.enableDeleteRow = true;
    let obj: Request_Executor_Msg = { eventType: type };
    this.notifyEventToExecuter.emit(obj);
  }

  ngOnDestroy(): void {
    this.table_subscription?.unsubscribe();
    this.windowSizesubscription?.unsubscribe();
    this.selectElement$?.unsubscribe();
    this.updateTextView$?.unsubscribe();
    this.menuBarFields$?.unsubscribe();
    this.enableAnnotationSub$.unsubscribe();
    this.enableViewModeSub.unsubscribe();
    this.timerStepSubscription.unsubscribe();
  }
}
