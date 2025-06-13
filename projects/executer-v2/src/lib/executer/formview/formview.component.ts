import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
// models
import { AlertMessages, Dependency, DgTypes, ImagePath, LinkTypes, SequenceTypes } from 'cbp-shared';
import { Acknowledgement, ActionId, DataInfo, StepAction, StepOption, StepTypes } from '../models';
// services
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { MenuConfig } from '../ExternalAccess';
import { CbpExeService } from '../services/cbpexe.service';
import { DataJsonService } from '../services/datajson.service';
import { ExecutionService } from '../services/execution.service';
import { SharedviewService } from '../services/sharedview.service';
import { AntlrService } from '../shared/services/antlr.service';
import { LayoutService } from '../shared/services/layout.service';
import { TableService } from '../shared/services/table.service';
// extra variables
declare const $: any, swal: any;
const findAnd = require('find-and');

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-formview',
  templateUrl: './formview.component.html',
  styleUrls: ['./formview.component.css']
})
export class FormviewComponent implements AfterViewInit, OnInit {
  @Input() section!: any;
  @Input() pagination!: any;
  @Input() menuConfig: MenuConfig = new MenuConfig();
  @Input() documentObj!: any;
  @Output() notifyFormExectution: EventEmitter<any> = new EventEmitter();
  @Output() linkViewEmit: EventEmitter<any> = new EventEmitter();
  @Output() deleteImageEvent: EventEmitter<any> = new EventEmitter();

  currentStepAction: any;
  currentSection: any;
  dgType = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  Dependency: typeof Dependency = Dependency;
  currentNotApplicableArray: any = [];
  disableSelectedStep = false;
  selectedObj: any;
  storeMessages: any = [];
  stepTypes = StepTypes;
  sideMenuInfo: any = [];
  sectionSideMenuInfo: any = [];

  acknowledgeValidation: boolean = false;
  stepFieldValidation: boolean = false;
  stepActionValidation: boolean = false;
  alertsValidation: boolean = false;
  isAlertMessage: boolean = false;
  childStepValidation: boolean = false;
  childHoldValidation: boolean = false;
  whileRuleCondition: boolean = false;
  depedencyValidation: boolean = false;
  isChilcAvailable: boolean = false;
  sectionStepValidation: boolean = false;
  whileRuleMessage: any;
  dependencyArray: string = '';

  // stylejson
  @Input() customUsers!: any;
  @Input() isDetailTabEnabled!: any;
  @Input() freezePage: boolean = false;
  @Input() isMaster: boolean = true;
  @Input() repeatTimes: any;
  @Input() isRepeatStep: any;
  @Input() isTimerOnStep: any;
  @Input() showPaginationButtons: any;

  @Output() freezePageChange: EventEmitter<any> = new EventEmitter();
  @Output() isTimerOnStepChange: EventEmitter<any> = new EventEmitter();
  @Output() isRepeatStepChange: EventEmitter<any> = new EventEmitter();
  @Output() repeatTimesChange: EventEmitter<any> = new EventEmitter();
  @Output() setDataJson: EventEmitter<any> = new EventEmitter();
  @Output() errorMessageEvent: EventEmitter<any> = new EventEmitter();
  @Output() protectSection: EventEmitter<any> = new EventEmitter();
  @Output() refObj: EventEmitter<any> = new EventEmitter();

  dataJson_subscription!: Subscription;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;
  mobileView: boolean = false;
  updateTextView$!: Subscription;
  currentPageStartIndex = 0;
  protectData_subscription!: Subscription;
  lastStepObject: any;
  gotoRuleExecute: boolean = false;
  lastCompletedStepObject: any;
  timerStepStartValidation: boolean = false;
  repeatStepStartValidation!: boolean;
  timerStepSubscription!: Subscription;
  conditionalRuleValidation!: boolean;
  applicabilityRuleValidation!: boolean;

  constructor(public cbpService: CbpExeService, public antlrService: AntlrService,
    public executionService: ExecutionService, public layoutService: LayoutService,
    public sharedviewService: SharedviewService,
    public tableService: TableService, private cdref: ChangeDetectorRef,
    public notifier: NotifierService, public dataJsonService: DataJsonService) {
    this.sideMenuInfo = this.cbpService.sideMenuInfo;
    this.sectionSideMenuInfo = this.cbpService.sectionSideMenuInfo;

  }

  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.mobileView = window.innerWidth < 550 ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.repeatTimes && changes.repeatTimes) {
      this.repeatTimes = changes.repeatTimes.currentValue;
    }
    if (this.isTimerOnStep && changes.isTimerOnStep) {
      this.isTimerOnStep = changes.isTimerOnStep;
    }
    if (this.menuConfig && changes.menuConfig) {
      this.menuConfig = changes.menuConfig.currentValue;
    }
    if (changes.showPaginationButtons) {
      this.showPaginationButtons = changes.showPaginationButtons.currentValue;
    }
  }

  ngOnInit() {
    this.section?.forEach((s: any) => { s['isInView'] = false; });
    this.executionService.tablefreeze = this.freezePage;
    this.timerStepSubscription = this.executionService.timerStepChangeEvent.subscribe((res: any) => {
      if (res !== undefined) {
        if (res?.dgType === DgTypes.Timed) {
          if (res.type !== 'start') {
            this.isTimerOnStep = false;
          }
          this.freezePage = false;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.protectData_subscription = this.dataJsonService.protectDataValue.subscribe((res: any) => {
      if (res.source == 'signature' || res.source == 'initial') {
        if (this.cbpService.selectedElement) {
          this.cbpService.protectOrUnProtectData(this.cbpService.selectedElement.children, true);
          this.sharedviewService.detectAll = true;
          this.protectSection.emit({ protect: true, item: this.cbpService.selectedElement });
        }
      }
    });
    const self = this;
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    })
    let obj = findAnd.returnFound(this.section, { paginateIndex: this.cbpService.startIndex });
    if (obj && Array.isArray(obj)) { obj = obj[0]; }
    this.cdref.detectChanges();
  }

  detach() {
    this.cdref.detach();
  }
  reattach() {
    this.cdref.reattach();
    this.cdref.detectChanges();
  }
  setIsCheckedValues(stepObject: any) {
    try {
      const indexStep = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === stepObject.dgUniqueID);
      if (indexStep !== -1) { this.cbpService.stepActionArray[indexStep] = stepObject; }
      const indexSeq = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgUniqueID === stepObject.dgUniqueID);
      if (indexSeq !== -1) { this.cbpService.stepSequentialArray[indexSeq] = stepObject; }
    } catch (error) { console.log('ischecked not available'); }
  }

  sectionExecution(obj: any) {
    if (obj !== undefined) {
      try {
        this.currentSection = obj;
        this.gotoRuleExecute = false;
        if (typeof (obj.applicabilityRule) !== 'undefined' && obj.applicabilityRule.length > 0 && !obj['isAppExecuted']) {
          obj = this.applicabilityRule(obj);
          if (obj && Array.isArray(obj.rule) && obj.rule !== undefined && obj.rule.length > 0) {
            obj = this.executeRules(obj, 'notcompleted');
            obj['isConditionalRuleApplied'] = true;
          }
          if (obj && this.sharedviewService.hasAnyAlertMessages(obj)) { this.currentSection = undefined; }
        } else {
          if (obj && obj !== undefined && typeof (obj.rule) !== 'undefined' && Array.isArray(obj.rule) && obj.rule.length > 0) {
            obj = this.executeRules(obj, 'notcompleted');
            obj['isConditionalRuleApplied'] = true;
          } else {
            if (obj && obj !== undefined && (obj.dgType === DgTypes.Section || obj.dgType === DgTypes.StepInfo)
              && (obj.acknowledgementReqd === true || this.sharedviewService.hasAnyAlertMessages(obj))) {
              this.currentSection = undefined;
            } else {
              if (obj && obj !== undefined) { if (!this.checkObjHasLock(obj)) { obj = this.increaseObject(obj); } }
            }
          }
        }
        this.setStepObjectRules(obj)
      } catch (error) { }
    }
  }
  setStepObjectRules(obj: any) {
    if (obj && obj !== undefined) {
      if (this.checkObjHasLock(obj)) { this.setSectionExecutions(obj); } else { this.executeSections(obj); }
    } else {
      this.checkStepActionUndo(this.lastCompletedStepObject);
    }
  }

  checkStepActionUndo(object: any) {
    if (object && this.executionService.stepActionCondition(object)) {
      if (object?.isChecked) {
        this.notifyParenFormPage('LastStepCompleted', object, object.dgUniqueID, false);
      }
    }
  }
  checkObjHasLock(obj: any) { return obj.showLockIcon; }
  checkTimedStep(obj: any) { return obj.dgType === DgTypes.Timed || obj.dgType == DgTypes.Repeat ? true : false; }
  executeSections(obj: any) {
    if (this.currentSection === obj) { this.currentSection = undefined; obj = this.increaseObject(obj); }
    const exec = (obj.dgType === DgTypes.Section || obj.dgType === DgTypes.StepInfo) ? this.setSectionExecutions(obj)
      : this.executeStepActions(obj);
  }
  setSectionExecutions(obj: any) {
    const isTrue = this.sharedviewService.hasAnyAlertMessages(obj);
    const val = (obj.acknowledgementReqd === true || isTrue || this.checkObjHasLock(obj) || (obj?.hasDataEntry) || obj['isConditionalRuleApplied'] ?
      this.setNewStepObject(obj) : this.sectionExecution(obj));
  }
  stepActionExecutions(obj: any) {
    const isTrue = this.sharedviewService.hasAnyAlertMessages(obj);
    const val = obj.acknowledgementReqd === true || isTrue || this.checkObjHasLock(obj) ? this.setNewStepObject(obj) :
      this.checkStepHasChildrenSteps(obj);
  }
  executeStepActions(obj: any) {
    this.currentStepAction = obj;
    if (obj.applicabilityRule !== undefined && obj.applicabilityRule.length > 0) {
      obj = this.applicabilityRule(obj);
      if (obj && obj !== undefined) { this.stepActionExecutions(obj); }
    } else {
      this.checkStepHasChildrenSteps(obj);
    }
  }
  checkRolesQualifications(obj: any) {
    obj['stepRoleQualRequired'] = true;
    this.setNewStepObject(obj);
    return undefined;
  }
  checkStepHasChildrenSteps(obj: any) {
    if (obj.dgType === this.dgType.Repeat || obj.dgType === this.dgType.Timed) {
      this.notifyParenFormPage('RepeatOrTimedStepChild', obj, obj.dgUniqueID, true);
      this.setNewStepObject(obj);
    }
    this.setChildStepSelect(obj, false);
  }
  setChildStepSelect(obj: any, isFromRepeat: boolean = false) {
    const getChildren = this.sharedviewService.getChildrenSteps(obj);
    const isTrue = this.sharedviewService.hasAnyAlertMessages(obj);
    const notChecked = this.executionService.stepActionCondition(obj);
    let isFirstChildIgnored: any = false;
    if (getChildren?.length > 0) {
      isFirstChildIgnored = (getChildren[0]?.options?.hold || getChildren[0]?.options?.notApplicable || getChildren[0]?.options.skip) ? true : false;
    }
    if (getChildren.length > 0 && !isTrue && notChecked && (!this.checkTimedStep(obj) || isFromRepeat) && !isFirstChildIgnored) {
      this.executeStepActions(getChildren[0]);
    } else {
      if (obj?.options?.skip) {
        let nextObj = this.increaseObject(obj)
        if (nextObj && nextObj.parentDgUniqueID == obj?.parentDgUniqueID) {
          this.checkStepHasChildrenSteps(nextObj);
          this.setNewStepObject(nextObj);
        } else {
          let parentStep: any = this.cbpService.stepActionArray.find((parent: any) => parent?.dgUniqueID == obj?.parentDgUniqueID)
          if (parentStep) {
            parentStep = this.getValidStep(parentStep)
            if (parentStep) {
              this.setNewStepObject(parentStep);
            }
          } else {
            let nextObj: any = this.getNextValidStep(obj);
            if (nextObj) {
              this.setNewStepObject(nextObj);
            }
          }
        }
      } else {
        this.setNewStepObject(obj);
      }
    }
  }
  getValidStep(step: any): any {
    if (!step?.options?.skip) {
      return step;
    }
    return this.getNextStep(step);
  }

  getNextValidStep(obj: any): any {
    const currentIndex = this.cbpService.stepActionArray.indexOf(obj);
    if (currentIndex === -1) {
      return null;
    }
    const nextObj = this.cbpService.stepActionArray[currentIndex + 1];
    if (nextObj && !nextObj?.options?.skip) {
      return nextObj;
    }
    return this.getNextStep(obj);
  }
  getNextStep(obj: any) {
    let nextStep: any = obj;
    let parentStepPosition = this.cbpService.stepActionArray.indexOf(obj);
    for (let i = parentStepPosition; i < this.cbpService.stepActionArray?.length; i++) {
      if (!(this.cbpService.stepActionArray[i]?.options?.skip)) {
        nextStep = this.cbpService.stepActionArray[i];
        break;
      }
    }
    return nextStep;
  }
  setNewStepObject(obj: any) {
    try {
      if (obj !== undefined) {
        this.cbpService.currentStep = obj.dgUniqueID;
        this.cbpService.selectedElement = JSON.parse(JSON.stringify(obj));
        let autoScroll = 0;
        if ((obj.paginateIndex >= (this.cbpService.startIndex + this.cbpService.pageSize))) {
          autoScroll = 3;
        }
        if (obj.paginateIndex < this.cbpService.startIndex) {
          autoScroll = 0;
        }
        setTimeout(() => {
          // if (obj.dgUniqueID != "1")
          this.gotoCurrentDiv('section' + obj.dgUniqueID, autoScroll);
          this.executionService.isClickedCurrentStep = false;
          this.fillDerivedSteps(obj);
          this.notifyParenFormPage('execution', obj, obj.dgUniqueID, true);
          // if (this.checkTimedStep(obj)) {
          //   this.notifyParentFormExecutionPage('timedStep', obj);
          // }
          this.cdref.detectChanges();
        }, 1000);
      }
    } catch (error) { console.log(error); }
  }
  changeActivePage(selectedElement: any) {
    this.notifyParenFormPage('storeDataJson', {}, {}, true);
    this.cbpService.startIndex = selectedElement.paginateIndex;
    this.cbpService.startIndex = selectedElement.paginateIndex ? ((Math.floor(selectedElement.paginateIndex / this.cbpService.pageSize) * this.cbpService.pageSize)) + 1 : 1;
    if (this.cbpService.startIndex <= 12) { this.cbpService.startIndex = 1; }
  }

  checkPreviousAlerts(currentObj: any, stepSequentialArray: any) {
    this.setValidationFields();
    const index = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === currentObj.dgUniqueID);
    for (let j = 0; j < index; j++) {
      const object = stepSequentialArray[j];
      if (currentObj !== object) {
        if (object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo ||
          this.executionService.stepActionCondition(object)) {
          if ((this.executionService.stepActionCondition(object)) &&
            (!object.isChecked && object.isTapped !== 2 && !object?.options?.complete && !object.hide_section)) {
            this.stepActionValidation = true;
            break;
          }
          if ((object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo)
            && object.acknowledgementReqd && !object.isChecked && !object.hide_section && !object?.options?.skip && !object?.options?.notApplicable) {
            this.acknowledgeValidation = true;
            break;
          }
          if (!object.hide_section) {
            if (this.sharedviewService.hasAnyAlertMessages(object)) { break; }
          }
        }
      }
    }
  }
  stepDropMenu(obj: any, type: any) {
    this.cbpService.selectedElement = obj;
    this.executionService.showPopupItem = undefined;
    switch (type) {
      case this.stepTypes.CompleteStep:
        if (obj.dgType === DgTypes.Repeat && !this.executionService.repeatStepEnable) {
          this.checkValidFormData('Please start the Repeat Step');
          break;
        }
        if (obj.dgType === DgTypes.Timed && !this.isTimerOnStep) {
          this.checkValidFormData('Please start the Timed Step');
          break;
        }
        let value = this.checkTimerStep(obj, 'complete');
        if (!value) {
          this.showTimerOrRepeatMesg();
          break
        };
        this.currentStepExecute(obj, true);
        break;
      case this.stepTypes.SkipStep:
        let value1 = this.checkTimerStep(obj, 'skip');
        if (!value1) {
          this.showTimerOrRepeatMesg();
          break;
        }
        if (obj.dgType === DgTypes.Repeat && this.executionService.repeatStepEnable) {
          this.checkValidFormData('Repeat step won\'t skip while it\'s in progress');
          break;
        }
        if (obj.dgType === DgTypes.Timed && this.isTimerOnStep) {
          this.checkValidFormData('Timed step won\'t skip while it\'s in progress');
          break;
        }
        obj['options'] = new StepOption();
        this.isStepOnSkip(obj);
        break;
      case this.stepTypes.HoldStep:
        let value2 = this.checkTimerStep(obj, 'hold');
        if (!value2) {
          this.showTimerOrRepeatMesg();
          break;
        };
        if (obj.dgType === DgTypes.Repeat && this.executionService.repeatStepEnable) {
          this.checkValidFormData('Repeat step won\'t hold while it\'s in progress');
          break;
        }
        if (obj.dgType === DgTypes.Timed && this.isTimerOnStep) {
          this.checkValidFormData('Timed step won\'t hold while it\'s in progress');
          break;
        }
        obj['options'] = new StepOption();
        this.isStepOnHold(obj);
        break;
      case this.stepTypes.NotApplicableStep:
        let value3 = this.checkTimerStep(obj, 'notapplicable');
        if (!value3) {
          this.showTimerOrRepeatMesg();
          break;
        };
        if (obj.dgType === DgTypes.Repeat && this.executionService.repeatStepEnable) {
          this.checkValidFormData('Repeat step won\'t NotApplicable while it\'s in progress');
          break;
        }
        if (obj.dgType === DgTypes.Timed && this.isTimerOnStep) {
          this.checkValidFormData('Timed step won\'t NotApplicable while it\'s in progress');
          break;
        }
        this.storeDataObject(obj, this.stepTypes.NotApplicableStep);
        obj['isChecked'] = true;
        obj['options'] = new StepOption();
        obj['options']['notApplicable'] = true;
        obj = this.sharedviewService.setUserAndDateInfo(obj);
        this.sharedviewService.applyColorToNode(obj, undefined);
        this.setNotApplicable(obj.children, obj, this.stepTypes.NotApplicableStep);
        obj = this.protectOrUnProtectDataEntries(obj, true, true);
        obj = this.reuseNotApplicable(obj);
        let undoStep = this.checkUndoStep(obj);
        this.executionService.setMenuBarField({ event: 'disabledUndo', obj: undoStep })
        if (obj.dgType == DgTypes.Timed) {
          this.isTimerOnStep = false;
          this.executionService.setTimerStep({ dgType: DgTypes.Timed, type: 'stop' });
        }
        this.gotoNextStepObject(obj, 'ddds');
        break;
      case this.stepTypes.InProgressStep:
        let value4 = this.checkTimerStep(obj, 'inprogress');
        if (!value4) {
          this.showTimerOrRepeatMesg();
          break;
        };
        if (obj.dgType === DgTypes.Timed && this.isTimerOnStep) {
          this.checkValidFormData('Can\'t make in progress while timer step is in progress');
          break;
        }
        if (obj.dgType === DgTypes.Repeat && this.executionService.repeatStepEnable) {
          this.checkValidFormData('Can\'t make in progress while repeat step is in progress');
          break;
        }
        this.tappedNumber(obj, true);
        break;
      case this.stepTypes.ProtectData:
        this.cbpService.protectOrUnProtectData(this.cbpService.selectedElement.children, true);
        this.sharedviewService.detectAll = true;
        this.protectSection.emit({ protect: true, item: this.cbpService.selectedElement });
        break;
      case this.stepTypes.UnProtectData:
        this.cbpService.protectOrUnProtectData(this.cbpService.selectedElement.children, false);
        this.sharedviewService.detectAll = true;
        this.protectSection.emit({ protect: false, item: this.cbpService.selectedElement });
        break;
      case this.stepTypes.Option:
        this.notifyFormExectution.emit({ type: 'usageOption', object: obj });
        break;
      default:
        this.executionService.showPopupItem = undefined;
        break;
    }
    this.updateViewPage();
  }
  checkTimerStep(obj: any, type: string) {
    if (obj?.isParentTimedStep && !this.isTimerOnStep) {
      this.timerStepStartValidation = true;
      return false;
    }
    if (obj?.isParentRepeatStep && !this.executionService.repeatStepEnable && !obj?.options?.skip) {
      this.repeatStepStartValidation = true;
      return false;
    }
    if (this.isTimerOnStep && !obj.isParentTimedStep) {
      if (obj.dgType == DgTypes.Timed) {
        return true;
      }
      return false;
    }
    if (this.executionService.repeatStepEnable && (!obj.isParentRepeatStep)) {
      if (obj.dgType == DgTypes.Repeat) {
        return true;
      }
      return false;
    }
    if ((this.isTimerOnStep || this.executionService.repeatStepEnable) && (type !== 'hold' && type !== 'skip')) {
      let element = this.executionService.getElementByNumber(obj.dgSequenceNumber, this.cbpService.selectedTimerRepeatStep.children)
      if (element) return true;
      return false;
    }
    return true;
  }
  updateViewPage() {
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
  }
  protectionInfo(event: any) {
    this.protectSection.emit(event);
  }
  tappedNumber(obj: any, value: any) {
    const section = obj.parentID === null ? obj : this.getSelectedSectionParentObj(obj.parentDgUniqueID);
    if (section.dependency === Dependency.SectionStep) {
      if (this.sharedviewService.hasConfigureDependencyCompleted(section, this.cbpService.stepSequentialArray)) {
        this.tapNumberReuse(section, obj, value);
      } else {
        this.showMessage();
      }
    } else {
      this.tapNumberReuse(section, obj, value);
    }
    this.updateViewPage();
  }

  tapNumberReuse(section: any, obj: any, value: any) {
    if (isNaN(obj.isTapped) || obj.isTapped === undefined) {
      obj.isTapped = 0;
    }
    if (section.usage === undefined) { section.usage = Dependency.Continuous }
    if (section.usage === Dependency.Continuous) {
      // this.stepValidCheck(obj, value);
      this.referenceTapped(obj, value);
      return;
    }
    if (section.usage === Dependency.Reference) {
      this.referenceTapped(obj, value);
      return;
    }
    if (section.usage === Dependency.Information) {
      this.callCurrentStep(obj, value);
      return;
    }
  }

  stepValidCheck(obj: any, value: any) {
    this.isStepActionValid(obj) ? this.callCurrentStep(obj, value) : this.showMessage();
  }
  referenceTapped(obj: any, value: any) {
    if (obj.isTapped === 0) {
      obj = this.setObjTapped(obj);
      if (obj.isTapped === 1) {
        this.storeDataObject(obj, this.stepTypes.InProgressStep);
        let isStepSkipped = obj?.options?.skip ? obj?.options?.skip : false;
        this.sharedviewService.setDropDownValues(obj, true, false, false, false, false);
        if (isStepSkipped) {
          obj = this.protectOrUnProtectDataEntries(obj, false, false);
          if (obj?.isChecked) {
            obj.isChecked = false;
            this.dataJsonService.setSelectItem({ item: obj });
          };
        }
      }
      return;
    }
    if (obj.isTapped === 1) {
      if (this.isStepActionValid(obj)) {
        obj = this.setObjTapped(obj);
        this.stepActionComplete(obj, value);
        return;
      }
      return this.showMessage();
    }
  }
  setObjTapped(obj: any) {
    obj.isTapped = ++obj.isTapped;
    this.cbpService.currentStep = obj.dgUniqueID;
    return obj;
  }

  callCurrentStep(obj: any, value: any) {
    obj.isTapped = ++obj.isTapped;
    this.cbpService.currentStep = obj.dgUniqueID;
    if (obj.isTapped === 1) {
      let isStepSkipped = obj?.options?.skip ? obj?.options?.skip : false;
      if (isStepSkipped && obj?.isChecked) {
        obj.isChecked = false;
        this.dataJsonService.setSelectItem({ item: obj });
      }
      obj = this.sharedviewService.setDropDownValues(obj, true, false, false, false, false);
      this.isProgressStep(obj);
    }
    if (obj.isTapped === 2 && (!obj.isChecked)) {
      this.currentStepExecute(obj, value);
    }
  }

  currentStepExecute(stepObject: any, event: any) {
    if (stepObject?.options?.skip) {
      this.checkValidFormData('Please make the step as inprogress before completing it');
      return;
    }
    const isRepeatType = stepObject?.dgType === DgTypes.Repeat;
    if (isRepeatType && stepObject['isProcessing']) return;
    stepObject['isProcessing'] = isRepeatType;
    try {
      if (this.isStepActionValid(stepObject)) {
        this.stepActionComplete(stepObject, event);
      } else {
        this.stepActionValidations(stepObject, event);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isRepeatType) {
        setTimeout(() => stepObject.isProcessing = false, 200);
      }
    }
  }
  stepActionComplete(stepObject: any, event: any) {
    stepObject = this.setStepObjectComplete(stepObject);
    stepObject = this.protectOrUnProtectDataEntries(stepObject, true);
    let obj: any; let isGotoRuleEnable = false;
    let type = this.stepTypes.CompletedStep;
    this.cbpService.executionClicked = true;
    if (stepObject.dgType === DgTypes.Timed || stepObject.dgType === DgTypes.Repeat) {
      let dgType = stepObject.dgType === DgTypes.Timed ? 'stepTimerStart' : 'repeatStepStart';
      stepObject[dgType] = false;
      this.freezePage = false;
      this.setFreeze();
      if (stepObject.children.length > 0) {
        for (let i = 0; i < stepObject.children.length; i++) {
          if (stepObject.children[i].dgType === DgTypes.StepAction || stepObject.children[i].dgType === DgTypes.StepInfo) {
            stepObject.children[i][dgType] = false;
          }
        }
      }
    }
    this.setIsCheckedValues(stepObject);
    this.sharedviewService.applyColorToNode(stepObject, undefined);
    if (stepObject.dgType === DgTypes.Repeat) { this.repeatStepFinish(stepObject, event); }
    if (stepObject.dgType === DgTypes.Timed) { this.isTimerOnStep = false; this.setisTimerOnStep(); }
    if (stepObject.dgType === this.dgType.StepAction || stepObject.dgType === this.dgType.DelayStep) {
      this.storeDataObject(stepObject, this.stepTypes.CompletedStep);
    }
    if ((stepObject.rule !== undefined && stepObject.rule.length > 0)) {
      const isGoToRule = stepObject.rule.filter((item: any) => item.DisplayValue.indexOf('GOTO') > -1);
      const isEndRule = stepObject.rule.filter((item: any) => item.DisplayValue.indexOf('END') > -1);
      const isTimedRule = stepObject.rule.filter((item: any) => item.DisplayValue.indexOf('Timed') > -1);
      const isRepeatRule = stepObject.rule.filter((item: any) => item.DisplayValue.indexOf('Repeat') > -1);
      if (isGoToRule.length > 0) {
        obj = this.goToRules(isGoToRule);
        type = this.stepTypes.executeRules;
        this.sharedviewService.detectAll = true;
        isGotoRuleEnable = true;
        this.setNewStepObject(obj);
      } else if (isEndRule.length > 0) {
        // console.log('End Execution');
      } else if (isTimedRule.length > 0 || isRepeatRule.length > 0) {
        if (isRepeatRule.length > 0) { this.repeatStepFinish(stepObject, event); }
        if (isTimedRule.length > 0) { this.isTimerOnStep = false; this.setisTimerOnStep(); }
      } else {
        obj = this.executeRules(stepObject, this.stepTypes.CompletedStep);
        this.sharedviewService.detectAll = true;
        if (obj === stepObject) { obj = this.increaseObject(obj); }
        stepObject = obj;
        type = this.stepTypes.executeRules;
      }
    }
    if (!this.isRepeatStep && !isGotoRuleEnable) {
      const parentObj = this.getSelectedParentObj(stepObject.parentDgUniqueID);
      if (parentObj !== null && parentObj !== undefined) {
        if (parentObj !== null && parentObj.children.length > 0 && parentObj.dgType !== DgTypes.Section) {
          const childrenSteps = parentObj.children.filter((item: any) => {
            if (this.executionService.stepActionCondition(item)) { return true; } else { return false; }
          });
          if (childrenSteps.length > 0) {
            const notChecked = this.childrenStepChecked(childrenSteps);
            if (notChecked.length > 0) {
              stepObject = notChecked[0];
              type = this.stepTypes.executeRules;
            } else {
              if (this.executionService.stepActionCondition(parentObj)) {
                if (this.cbpService.disableAutoStep && stepObject?.rule?.length == 0) {
                  type = this.stepTypes.CompletedStep;
                } else {
                  type = this.stepTypes.executeRules;
                  stepObject = parentObj;
                }
              }
            }
          }
        }
      }
      this.gotoNextStepObject(stepObject, type);
    }
    if (this.isRepeatStep && ((stepObject.dgType === this.dgType.StepAction ||
      (stepObject.dgType === this.dgType.Repeat) && stepObject?.currentRepeatTimes == (Number(stepObject.repeatTimes))))) {
      const parentObj = this.getSelectedParentObj(stepObject.parentDgUniqueID);
      if (parentObj !== null && parentObj !== undefined) {
        if (parentObj !== null && parentObj.children.length > 0 && parentObj.dgType !== DgTypes.Section) {
          const childrenSteps = parentObj.children.filter((item: any) => {
            if (this.executionService.stepActionCondition(item)) { return true; } else { return false; }
          });
          if (childrenSteps.length > 0) {
            const notChecked = this.childrenStepChecked(childrenSteps);
            if (notChecked.length > 0) {
              stepObject = notChecked[0];
              type = this.stepTypes.executeRules;
            } else {
              if (this.executionService.stepActionCondition(parentObj)) {
                stepObject = parentObj;
                type = this.stepTypes.executeRules;
              }
            }
          }
        }
      }
      this.isRepeatStep = false;
      this.gotoNextStepObject(stepObject, type);
    }
  }
  setFreeze() {
    this.freezePageChange.emit(this.freezePage);
  }
  setisTimerOnStep() {
    this.storeDataObject(this.cbpService.selectedElement, this.stepTypes.CompletedStep);
    this.isTimerOnStepChange.emit(this.isTimerOnStep);
  }
  setisRepeatStep() {
    this.isRepeatStepChange.emit(this.isRepeatStep);
  }
  setRepeatTimesComplete(stepObject: any) {
    this.notifyFormExectution.emit({ type: 'repeatTimesComplete', 'repeatCount': this.repeatTimes, 'object': stepObject });
  }
  childrenStepChecked(objArray: any) { return objArray.filter((item: any) => !item.isChecked); }

  repeatStepFinish(stepObject: any, event: any) {
    if ((stepObject?.currentRepeatTimes === (Number(stepObject.repeatTimes) - 1))) {
      this.executionService.repeatStepEnable = false;
      this.cbpService.selectedElement['currentRepeatTimes'] = stepObject.repeatTimes;
      this.executionService.setTimerStep({ dgType: DgTypes.Repeat, repeatStepEnable: false });
      this.storeDataObject(stepObject, this.stepTypes.CompletedStep);
    } else {
      this.notifyFormExectution.emit({ type: 'repeatTimesComplete', 'repeatCount': this.repeatTimes, 'object': stepObject });
      setTimeout(() => {
        if (event.target) { event.target.checked = false; }
        stepObject.isChecked = false;
        stepObject['options'] = new StepOption();
        stepObject.isTapped = 0;
        this.setChildStepSelect(stepObject, true);
      }, 200);
    }
  }
  stepActionValidations(stepObject: any, event: any) {
    if (stepObject?.isTapped !== 0 &&
      (!this.timerStepStartValidation && !this.repeatStepStartValidation
        && !this.isTimerOnStep && !this.executionService.repeatStepEnable)) { stepObject.isTapped = 0; }
    if (event?.target) { event.target.checked = false; }
    stepObject.isChecked = false;
    if (this.hasAnyAlerts()) {
      this.showMessage();
      return true;
    }
    return false;
  }
  showMessage() {
    if (this.hasAnyAlerts()) {
      const mesg = this.getSwitchMessage();
      this.setValidationFields();
      if (mesg !== undefined) { this.checkValidFormData(mesg); }
    }
  }
  async checkValidFormData(mesg: any) {
    const { value: userConfirms, dismiss } = await this.cbpService.showSwalDeactive(mesg, 'warning', 'Ok');
    if (!dismiss && userConfirms) { return true; }
  }
  getSwitchMessage() {
    let mesg: any;
    switch (true) {
      case this.stepActionValidation:
        mesg = AlertMessages.previousStepMessage;
        break;
      case this.stepFieldValidation:
        mesg = AlertMessages.allDataRequiredMesage;
        break;
      case this.alertsValidation || this.isAlertMessage:
        mesg = AlertMessages.allAlertMessage;
        break;
      case this.childStepValidation:
        mesg = AlertMessages.childAlertMessage;
        break;
      case this.childHoldValidation:
        mesg = AlertMessages.holdMessage;
        break;
      case this.acknowledgeValidation:
        mesg = AlertMessages.acknowlegeMessage;
        break;
      case this.whileRuleCondition:
        mesg = this.whileRuleMessage;
        break;
      case this.depedencyValidation:
        mesg = AlertMessages.dependencyMessage + this.dependencyArray;
        break;
      case this.timerStepStartValidation:
        mesg = 'Please start the timer step';
        break;
      case this.repeatStepStartValidation:
        mesg = 'Please start the repeat step';
        break;
      case this.applicabilityRuleValidation:
        mesg = 'Please select parent step to validate applicability Rules';
        break;
      case this.conditionalRuleValidation:
        mesg = 'Please select parent step to validate conditional Rules';
        break;
      default:
        mesg = undefined;
        break;
    }
    return mesg;
  }

  hasAnyAlerts() {
    if (this.stepActionValidation || this.childStepValidation || this.alertsValidation
      || this.stepFieldValidation || this.timerStepStartValidation || this.repeatStepStartValidation ||
      this.acknowledgeValidation || this.childHoldValidation || this.isAlertMessage
      || this.depedencyValidation || this.applicabilityRuleValidation || this.conditionalRuleValidation) {
      return true;
    }
    return false;
  }
  setValidationFields() {
    this.acknowledgeValidation = false;
    this.stepFieldValidation = false;
    this.stepActionValidation = false;
    this.alertsValidation = false;
    this.isAlertMessage = false;
    this.childStepValidation = false;
    this.childHoldValidation = false;
    this.whileRuleCondition = false;
    this.depedencyValidation = false;
    this.timerStepStartValidation = false;
    this.repeatStepStartValidation = false;
    this.applicabilityRuleValidation = false;
    this.conditionalRuleValidation = false;
  }

  setStepObjectComplete(stepObject: any) {
    stepObject.isTapped = 2;
    stepObject.statusDate = new Date();
    stepObject.createdBy = this.executionService.selectedUserName;
    stepObject.isChecked = true;
    stepObject = this.sharedviewService.setDropDownValues(stepObject, false, false, false, true, false);
    return stepObject;
  }
  protectOrUnProtectDataEntries(stepObject: any, bol: boolean, isSkip: any = null) {
    if (stepObject?.children?.length > 0) {
      if (this.sharedviewService.hasAnyAlertMessages(stepObject)) {
        this.alertsValidation = true;
        if (isSkip != null && isSkip) {
          let alerts = stepObject.children.filter((obj: any) => this.executionService.messageCondition(obj));
          alerts?.forEach((alert: any) => {
            alert.options.skip = true;
          });
        } else {
          if (isSkip !== 'userRoles')
            return false;
        }
      }
      for (let i = 0; i < stepObject.children.length; i++) {
        if (this.executionService.checkDataEntryDgTypes(stepObject.children[i]) || stepObject.children[i].dgType === DgTypes.SignatureDataEntry
          || stepObject.children[i].dgType === DgTypes.InitialDataEntry) {
          stepObject.children[i]['disableField'] = bol;
        }
        if (stepObject.children[i].dgType === DgTypes.Form) {
          let typeInfo = { type: 'protectDataEntries', value: bol };
          this.cbpService.setDefaultCBPTableChanges(stepObject.children[i], typeInfo);
        }
        if (isSkip && stepObject.children[i].dgType === DgTypes.StepInfo) {
          stepObject.children[i].options.skip = true;
        }
      }
    }
    return stepObject;
  }
  isStepActionValid(stepObject: any, isTimerOrRepeat: boolean = false) {
    if (stepObject?.isParentRepeatStep) {
      let parentObj = this.getSelectedParentObj(stepObject?.parentDgUniqueID);
      let lastParent = parentObj;
      while (lastParent?.hasOwnProperty('isParentRepeatStep')) {
        lastParent = this.getSelectedParentObj(lastParent?.parentDgUniqueID);
      }
      if (lastParent && !lastParent?.hasOwnProperty('isParentRepeatStep') && lastParent?.dgType != DgTypes.Repeat) {
        delete stepObject.isParentRepeatStep;
      }
    }
    if (stepObject.children.length > 0) {
      if (stepObject?.isParentTimedStep && !this.isTimerOnStep) {
        this.timerStepStartValidation = true;
        return false;
      }
      if (stepObject?.isParentRepeatStep && !this.executionService.repeatStepEnable) {
        this.repeatStepStartValidation = true;
        return false;
      }
      if (this.sharedviewService.hasAnyAlertMessages(stepObject)) {
        if ((stepObject.dgType == DgTypes.Repeat || stepObject.dgType == DgTypes.Timed) && (!this.isTimerOnStep && !this.executionService.repeatStepEnable)) {
          return true;
        }
        this.alertsValidation = true; return false;
      }
      for (let i = 0; i < stepObject.children.length; i++) {
        if (this.executionService.checkDataEntryDgTypes(stepObject.children[i])) {
          if ((stepObject.children[i].required && (stepObject.children[i].storeValue === '' || !stepObject.children[i].storeValue) ||
            (stepObject.children[i].storeValue === '' && stepObject.children[i].dgType === DgTypes.VerificationDataEntry)) && !isTimerOrRepeat) {
            this.stepFieldValidation = true;
            return false;
          }
        }
        if (((stepObject.children[i]?.storeValue === '' || !stepObject.children[i]?.storeValue) &&
          stepObject.children[i].dgType === DgTypes.VerificationDataEntry && !isTimerOrRepeat)) {
          this.stepFieldValidation = true;
          return false;
        }
        if (stepObject.children[i].dgType === DgTypes.SignatureDataEntry) {
          if (stepObject.children[i].required && (
            (!stepObject.children[i].promptDisplay && (stepObject.children[i].signatureValue === '' || stepObject.children[i].signatureValue == undefined)) ||
            (!stepObject.children[i].namePromptDisplay && stepObject.children[i].signatureName === '') ||
            ((stepObject.children[i].datePromptDispaly && (stepObject.children[i].signatureDate === 'mm/dd/yyyy' || stepObject.children[i].signatureDate === 'mm/dd/yyyy HH:MM')) ||
              (stepObject.children[i].timePromptDisplay && (stepObject.children[i].signatureDate === ' HH:MM' || stepObject.children[i].signatureDate === 'HH:MM'))) ||
            (!stepObject.children[i].initialPromptDispaly && (stepObject.children[i].initial === '' || stepObject.children[i].initial == undefined)) ||
            (!stepObject.children[i].userIdPromptDisplay && stepObject.children[i].signatureUserId === '') ||
            (!stepObject.children[i].notesPromptDispaly && stepObject.children[i].signatureNotes === ''))) {
            if ((stepObject.dgType == DgTypes.Repeat || stepObject.dgType == DgTypes.Timed) && (!this.isTimerOnStep && !this.executionService.repeatStepEnable)) {
              return true;
            }
            this.stepFieldValidation = true;
            return false;
          }
        }
        if (stepObject.children[i].dgType === DgTypes.InitialDataEntry) {
          if (stepObject.children[i].required &&
            ((!stepObject.children[i].nameDisplay && stepObject.children[i].initialName === '') ||
              (stepObject.children[i].required && (stepObject.children[i].initialStore === '' || stepObject.children[i].initialStore == undefined)))) {
            if ((stepObject.dgType == DgTypes.Repeat || stepObject.dgType == DgTypes.Timed) && (!this.isTimerOnStep && !this.executionService.repeatStepEnable)) {
              return true;
            }
            this.stepFieldValidation = true;
            return false;
          }
        }
        if (this.executionService.stepActionCondition(stepObject.children[i]) && !isTimerOrRepeat) {
          if (!stepObject.children[i].isChecked) {
            this.childStepValidation = true;
            return false;
          }
        }
        if (stepObject.children[i].dgType === DgTypes.Table) {
          this.checkTableRequired(stepObject.children[i]);
          if (this.stepFieldValidation) {
            return false;
          }
        }
      }
    }
    if (stepObject.rule && stepObject.rule.length > 0) {
      const isWhileRule = stepObject.rule.filter((item: any) => item.DisplayValue.indexOf('while') > -1);
      if (isWhileRule.length > 0) {
        const result = this.antlrService.executeExpression(isWhileRule[0].ParsedValue);
        let value: any;
        if (result === true) {
          this.whileRuleCondition = true;
          value = false;
        } else if (result === undefined || result === null || result === false) {
          value = true;
          this.whileRuleCondition = false;
        } else {
          this.whileRuleCondition = true;
          this.whileRuleMessage = result;
          value = false;
        }
        return value;
      }
    }
    if (stepObject?.isParentTimedStep && !this.isTimerOnStep) {
      this.timerStepStartValidation = true;
      return false;
    }
    if (stepObject?.isParentRepeatStep && !this.executionService.repeatStepEnable && !stepObject?.options?.skip) {
      this.repeatStepStartValidation = true;
      return false;
    }
    let value = this.checkTimerStep(stepObject, 'complete');
    if (!value) {
      this.showTimerOrRepeatMesg();
      return false
    };
    return this.isStepActionValidTest(stepObject);
  }
  showTimerOrRepeatMesg() {
    let mesg = this.isTimerOnStep ? 'timer' : 'repeat';
    this.checkValidFormData(`Please complete in progress ${mesg} step`);
  }


  fieldRequiredEntry(dataEntry: any) {
    if (this.executionService.checkDataEntryDgTypes(dataEntry)) {
      if (dataEntry.required && dataEntry.storeValue === '' ||
        (dataEntry.storeValue === '' && dataEntry.dgType === DgTypes.VerificationDataEntry)) {
        this.stepFieldValidation = true;
        return false;
      }
    }
    if (dataEntry.dgType === DgTypes.SignatureDataEntry) {
      const authConfig = this.executionService.authenticatorConfig?.signature;
      if (dataEntry.required && ((dataEntry.signatureName === '' && authConfig?.authConfig?.username_iseditable == 1) && dataEntry.signatureUserId === '') ||
        (dataEntry.required && !dataEntry?.signatureValue)) {
        this.stepFieldValidation = true;
        return false;
      }
    }
    if (dataEntry.dgType === DgTypes.InitialDataEntry) {
      const authConfig = this.executionService.authenticatorConfig?.initial;
      if (dataEntry.required && !dataEntry?.initialStore ||
        (dataEntry.required && ((dataEntry.initialName === '' && authConfig?.username_iseditable == 1) && dataEntry.initialUserId === ''))) {
        this.stepFieldValidation = true;
        return false;
      }
    }
  }

  checkTableRequired(obj: any) {
    const tableObj = obj.calstable[0].table.tgroup.tbody[0].row;
    for (let k = 0; k < tableObj.length; k++) {
      if (tableObj[k]) {
        const entryObj = tableObj[k].entry;
        for (let l = 0; l < entryObj.length; l++) {
          if (entryObj[l]) {
            const object = entryObj[l].children;
            for (let m = 0; m < object.length; m++) {
              let required = this.fieldRequiredEntry(object[m]);
            }
          }
        }
      }
    }
  }
  getSelectedParentObj(dgUniqueID: any) {
    const parentIndex = this.cbpService.stepSequentialArray.findIndex((el: any) => el.dgUniqueID == dgUniqueID);
    return this.cbpService.stepSequentialArray[parentIndex];
  }
  getSelectedParentObjByUniqueID(dgUniqueID: any) {
    const parentIndex = this.cbpService.stepSequentialArray.findIndex((el: any) => el.dgUniqueID == dgUniqueID);
    return this.cbpService.stepSequentialArray[parentIndex];
  }
  increaseObject(obj: any) {
    try {
      return this.cbpService.stepSequentialArray[this.cbpService.stepSequentialArray.indexOf(obj) + 1];
    } catch (err) { console.error(err); }
  }

  increaseRepeatObject(obj: any) {
    try {
      const object = this.cbpService.stepSequentialArray[this.cbpService.stepSequentialArray.indexOf(obj) + 1];
      return object;
    } catch (err) { console.error(err); }
  }
  applicabilityRule(obj: any) {
    try {
      if (obj.applicabilityRule !== undefined && obj.applicabilityRule.length > 0) {
        let rules = [...obj.applicabilityRule];
        for (let i = 0; i < rules?.length; i++) {
          rules[i].ParsedValue = this.updateRuleCase(rules[i].ParsedValue);
          let value = this.antlrService.executeExpression(rules[i].ParsedValue);
          if (value === true) {
            obj['isAppExecuted'] = true;
            break;
          } else {
            if (this.executionService.sectionAndStep(obj)) {
              obj['isAppExecuted'] = true;
              this.setNotSetApplicable(obj, 'applicability')
              const condition = obj?.children !== undefined && obj?.children?.length > 0;
              if (condition)
                this.getLastObject(obj?.children);
            }
          }
        }
      }
      return obj;
    } catch (error) { console.log(error); }
  }
  checkORRule(parsedValue: any, value: boolean, type: string) {
    let split = parsedValue.split(type);
    // const splitNext = split[split.length - 1].split(/{(.*)/s);
    const splitNext = split[split.length - 1].split(/{([\s\S]*)/); //  for removing the above s flag error  
    for (let i = 0; i < split?.length; i++) {
      let expression = '';
      expression += (i == 0) ? '' : 'if ';
      expression += split[i];
      expression += (i == split.length - 1) ? '' : ('{ ' + splitNext[1]);
      console.log('expression:', expression);
      value = this.antlrService.executeExpression(expression);
      if (value && type == 'OR') {
        return value;
      }
      if (!value && type != 'OR') {
        return value;
      }
    }
    return value;
  }
  updateRuleCase(text: string) {
    text = text.replace('IF', 'if');
    return text;
  }

  setStepSectionNotApplicable(condition: any, obj: any) {
    if (condition) {
      this.setNotSetApplicable(obj);
    } else {
      this.storeDataObject(obj, this.stepTypes.NotApplicableStep);
      obj.isChecked = true;
      obj = this.sharedviewService.setDropDownValues(obj, false, true, false, false, false);
      obj = this.increaseObject(obj);
    }
    return obj;
  }

  setNotSetApplicable(obj: any, ruleType: any = null) {
    this.storeDataObject(obj, this.stepTypes.NotApplicableStep);
    obj['isChecked'] = true;
    obj['options']['notApplicable'] = true;
    this.setNotApplicable(obj.children, obj, this.stepTypes.NotApplicableStep);
    obj = this.reuseNotApplicable(obj);
    this.gotoNextStepObject(obj, ruleType ? ruleType : 'ddds');
  }

  reuseNotApplicable(obj: any) {
    this.currentNotApplicableArray = [];
    this.getLastObject(obj.children);
    if (this.currentNotApplicableArray.length > 0) { obj = this.currentNotApplicableArray.pop(); }
    this.currentNotApplicableArray = [];
    return obj;
  }
  setNotApplicable(object: any, obj = {}, type: any) {
    for (let i = 0; i < object.length; i++) {
      if (this.executionService.stepActionCondition(object[i])) {
        if (!object[i]?.options?.complete && !object[i]?.options?.skip) {
          object[i] = this.sharedviewService.setUserAndDateInfo(object[i]);
          this.setIsCheckedValues(object[i]);
          if (type === this.stepTypes.NotApplicableStep) {
            this.storeDataObject(object[i], this.stepTypes.NotApplicableStep);
            object[i] = this.sharedviewService.setDropDownValues(object[i], false, true, false, false, false);
          }
          if (type === this.stepTypes.InProgressStep) {
            object[i].isChecked = false;
            this.storeDataObject(object[i], this.stepTypes.InProgressStep);
            object[i] = this.sharedviewService.setDropDownValues(object[i], true, false, false, false, false);
          }
          if (type === this.stepTypes.HoldStep) {
            object[i].isChecked = false;
            this.storeDataObject(object[i], this.stepTypes.HoldStep);
            object[i] = this.sharedviewService.setDropDownValues(object[i], false, false, true, false, false);
          }
          if (type === this.stepTypes.SkipStep) {
            object[i].isChecked = true;
            this.storeDataObject(object[i], this.stepTypes.SkipStep);
            object[i] = this.sharedviewService.setDropDownValues(object[i], false, false, false, false, true);
          }
        }
      }
      if (object[i].dgType === DgTypes.Section) {
        object[i]['options'] = new StepOption();
        object[i]['options'].notApplicable = true;
        if (object[i].children.length > 0) {
          object[i].children.forEach((item: any) => {
            if (this.executionService.messageCondition(item)) {
              item = this.sharedviewService.setUserAndDateInfo(item);
              item = this.checkNotApplicableData(item, type);
            }
          });
        }
      }
      if (this.executionService.messageCondition(object[i])) {
        object[i] = this.sharedviewService.setUserAndDateInfo(object[i]);
        object[i] = this.checkNotApplicableData(object[i], type);
      }
      if (Array.isArray(object[i].children) && object[i].children.length > 0) {
        this.setNotApplicable(object[i].children, obj, type);
      }
    }
    return obj;
  }

  checkNotApplicableData(item: any, type: any) {
    item['options'] = new StepOption();
    if (type === this.stepTypes.NotApplicableStep) {
      item['notApplicable'] = true;
      item['options'].notApplicable = true;
    }
    if (type === this.stepTypes.HoldStep) {
      item['hold'] = true;
      item.isChecked = false;
      item['options'].hold = true;
    }
    if (type === this.stepTypes.SkipStep) {
      item['skip'] = true;
      item['options'].skip = true;
    }
    if (type === this.stepTypes.InProgressStep) {
      item['inProgess'] = true;
      if (!this.executionService.messageCondition(item)) { item.isChecked = false; }
      item['options'].inProgess = true;
    }
    return item;
  }
  getLastObject(object: any) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (this.executionService.checkAllSteps(object[i])) {
          this.currentNotApplicableArray.push(object[i]);
        }
        if (object[i].children) {
          this.getLastObject(object[i].children);
        }
      }
    }
  }
  goToRules(gotoList: any) {
    let gotoObj;
    for (let i = 0; i < gotoList.length; i++) {
      gotoObj = this.getSelectedParentObjByUniqueID(gotoList[i].ParsedValue);
    }
    return gotoObj;
  }
  executeRules(obj: any, type: any) {
    let gotoDgUniqueId = this.conditionalRule(obj);
    gotoDgUniqueId = Array.isArray(gotoDgUniqueId) ? gotoDgUniqueId[gotoDgUniqueId?.length - 1] : gotoDgUniqueId;
    if (gotoDgUniqueId !== undefined) {
      let gotobj = this.cbpService.stepSequentialArray.find((item: any) => {
        const id = item.dgUniqueID;
        return typeof id === 'number' ? id === Number(gotoDgUniqueId) : id === gotoDgUniqueId;
      });
      if (gotobj !== undefined) {
        if (type === this.stepTypes.CompletedStep) { obj = this.increaseObject(obj); }
        if (!this.gotoRuleExecute && obj) {
          const start = this.cbpService.stepSequentialArray.indexOf(obj);
          const last = this.cbpService.stepSequentialArray.indexOf(gotobj);
          for (let j = start; j < last; j++) {
            this.storeDataObject(this.cbpService.stepSequentialArray[j], this.stepTypes.NotApplicableStep);
            this.cbpService.stepSequentialArray[j]['isChecked'] = true;
            this.cbpService.stepSequentialArray[j]['notApplicable'] = true;
            this.sharedviewService.setDropDownValues(this.cbpService.stepSequentialArray[j], false, true, false, false, false);
            for (let k = 0; k < this.cbpService.stepSequentialArray[j].children.length; k++) {
              if (this.executionService.messageCondition(this.cbpService.stepSequentialArray[j].children[k])) {
                this.cbpService.stepSequentialArray[j].children[k]['isChecked'] = true;
                this.cbpService.stepSequentialArray[j].children[k]['notApplicable'] = true;
                this.storeDataObject(this.cbpService.stepSequentialArray[j].children[k], this.stepTypes.NotApplicableStep);
                this.sharedviewService.setDropDownValues(this.cbpService.stepSequentialArray[j].children[k], false, true, false, false, false);
              }
            }
          }
        }
        obj = gotobj;
      }
    }
    return obj;
  }
  conditionalRule(obj: any) {
    let value: any; let storeValue: any;
    if (obj.rule !== undefined && obj.rule.length > 0) {
      for (let i = 0; i < obj.rule.length; i++) {
        let displayValue: any = obj.rule[i].DisplayValue.toLowerCase();
        if (displayValue.indexOf('timed') > -1 || displayValue.indexOf('end') > -1) {
        } else if (displayValue.indexOf('goto') > -1) {
          value = obj.rule[i].ParsedValue;
          this.gotoRuleExecute = true;
        } else {
          obj.rule[i].ParsedValue = this.updateRuleCase(obj.rule[i].ParsedValue);
          value = this.antlrService.executeExpression(obj.rule[i].ParsedValue);
          if (value) { storeValue = value; }
        }
      }
    }
    if (storeValue) { value = storeValue };
    return value;
  }

  notApplicable(obj: any) {
    this.storeDataObject(obj, this.stepTypes.NotApplicableStep);
    obj = this.sharedviewService.setUserAndDateInfo(obj);
    this.sharedviewService.applyColorToNode(obj, undefined);
    obj = this.sharedviewService.setDropDownValues(obj, false, true, false, false, false);
    this.gotoNextStepObject(obj, this.stepTypes.NotApplicableStep);
    this.notifyParenFormPage('currentSelected', obj, obj.dgUniqueID, true);
  }
  isProgressStep(obj: any) {
    this.sharedviewService.applyColorToNode(obj, 'lightblue');
    this.storeDataObject(obj, this.stepTypes.InProgressStep);
    obj = this.sharedviewService.setDropDownValues(obj, true, false, false, false, false);
    this.gotoNextStepObject(obj, this.stepTypes.InProgressStep);
  }
  isStepOnHold(obj: any) {
    this.sharedviewService.applyColorToNode(obj, 'yellow');
    this.storeDataObject(obj, this.stepTypes.HoldStep);
    obj = this.sharedviewService.setDropDownValues(obj, false, false, true, false, false);
    this.gotoNextStepObject(obj, this.stepTypes.HoldStep);
  }
  isStepOnSkip(obj: any) {
    this.notifyFormExectution.emit({ type: 'skipVerification', data: obj });
  }

  isStepSkipSuccess(obj: any, skipverify: any) {
    this.storeSkipDataObject(obj, this.stepTypes.SkipStep, skipverify);
    this.setIsCheckedValues(obj);
    obj.isChecked = true;
    if (obj.dgType === DgTypes.Timed) {
      this.executionService.setTimerStep({ dgType: DgTypes.Timed, type: 'stop' });
    }
    if (obj.dgType === DgTypes.Repeat) {
      this.executionService.setTimerStep({ dgType: DgTypes.Repeat, repeatStepEnable: false });
    }
    if (obj?.options?.inProgress || obj['isTapped'] != 0) { obj.options.inProgress = false; obj['isTapped'] = 0 }
    obj = this.sharedviewService.setDropDownValues(obj, false, false, false, false, true);
    if (obj?.children?.length > 0) {
      obj = this.protectOrUnProtectDataEntries(obj, true, true);
      obj.children = this.setChildSteps(obj.children, 'skip', skipverify);
    }
    if (this.cbpService.disableAutoStep) {
      this.dataJsonService.setSelectItem({ item: obj });
    }
    this.gotoNextLevelObj(obj);
  }
  setChildSteps(steps: any, type: string, skipverify: string) {
    for (let i = 0; i < steps.length; i++) {
      if (this.executionService.sectionAndStep(steps[i])) {
        if (type == 'skip') {
          if (!(steps[i]?.options?.notApplicable || steps[i]?.options?.complete)) {
            steps[i].isChecked = true;
            if (steps[i]?.options?.inProgress || steps[i]['isTapped'] != 0) { steps[i].options.inProgress = false; steps[i]['isTapped'] = 0 }
            this.storeSkipDataObject(steps[i], this.stepTypes.SkipStep, skipverify);
            this.setIsCheckedValues(steps[i]);
            this.sharedviewService.setDropDownValues(steps[i], false, false, false, false, true);
            steps[i] = this.protectOrUnProtectDataEntries(steps[i], true, true);
          }
        }
      }
      if (steps[i]?.children && steps[i].children?.length) {
        this.setChildSteps(steps[i]?.children, type, skipverify);
      }
    }
    return steps;
  }

  gotoNextStepObject(obj: any, type: any) {
    if (type !== 'executeRules') {
      if (obj.children.length > 0) {
        if (this.sharedviewService.isStepOptionsValid(type)) {
          this.setNotApplicable(obj.children, obj, type);
        }
        obj = this.reuseNotApplicable(obj);
      }
      let newobj = this.increaseObject(obj);
      if (newobj === undefined) {
        this.checkStepActionUndo(obj);
      } else {
        this.lastCompletedStepObject = obj;
        if (newobj.dgUniqueID == obj?.parentDgUniqueID || newobj.parentDgUniqueID == obj?.parentDgUniqueID) {
          obj = newobj;
        } else {
          let parentStep: any = this.getParentStepIfAny(obj, type);
          if (parentStep) {
            obj = parentStep
          } else {
            obj = newobj;
          }
        }
      }
      this.sharedviewService.detectAll = true;
    }
    if (obj && type !== this.stepTypes.InProgressStep &&
      (!this.cbpService.disableAutoStep || ((type == 'executeRules') || type == 'applicability'))) { this.gotoNextLevelObj(obj); }
    if (this.cbpService.disableAutoStep && (type !== 'executeRules' && type !== 'applicability')) {
      this.checkStepActionUndo(this.lastCompletedStepObject);
    }
    this.notifyParenFormPage('UpdateStepCompletionCount', obj, obj?.dgUniqueID, false);
  }

  getParentStepIfAny(obj: any, type: any): any {
    const parentStep = this.cbpService.stepActionArray.find((parent: any) => parent?.dgUniqueID === obj?.parentDgUniqueID);
    if (parentStep && ((!parentStep?.options?.notApplicable && type === 'ddds') || (!parentStep?.options?.hold && type === this.stepTypes.HoldStep))) {
      return parentStep;
    }
    if (parentStep) {
      return this.getParentStepIfAny(parentStep, type);
    }
    return null;
  }
  gotoNextLevelObj(obj: any) {
    if (obj !== undefined) {
      if (this.documentObj.usage === null) { this.documentObj.usage = DgTypes.Continuous; }
      if (this.documentObj.usage === DgTypes.Continuous || this.documentObj.usage === DgTypes.Reference || this.documentObj.usage === DgTypes.Information) {
        if (obj.dgType === DgTypes.Section && obj?.hasDataEntry) {
          this.setNewStepObject(obj);
        } else if (obj && (obj.dgType === DgTypes.Section || obj.dgType === DgTypes.StepInfo)) {
          this.sectionExecution(obj);
        } else {
          if (!obj.isChecked && (!obj?.options?.notApplicable)) {
            this.executeStepActions(obj);
          } else {
            if (this.storeMessages?.length > 0) { this.callMessages(this.storeMessages); }
          }
        }
      } else { this.setNewStepObject(obj); }
    }
  }
  // skip step store
  storeSkipDataObject(stepObject: any, status: any, skpData: any) {
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction(status, user, new Date(), user, new Date(), '', stepObject.dgType, stepObject.dgUniqueID, this.sharedviewService.setStepActionValue(status));
    stepAction['verifiedMethod'] = skpData.object.loginType;
    if (stepAction['verifiedMethod'] === 'signature') {
      stepAction['signatureUserName'] = skpData.object.signatureUserName;
      stepAction['signatureUserId'] = skpData.object.signatureUserId;
    }
    if (stepAction['verifiedMethod'] === 'login') {
      if (stepAction['reviewerUserId'])
        delete stepAction['reviewerUserId'];
      if (stepAction['userId']) {
        stepAction['signatureUserId'] = stepAction['userId'];
        delete stepAction['userId'];
      }
      if (stepAction['reviewerName']) {
        stepAction['signatureUserName'] = stepAction['reviewerName'];
        delete stepAction['reviewerName'];
      }
      stepAction['signatureUserName'] = skpData.object.signatureUserName;
      stepAction['signatureUserId'] = skpData.object.signatureUserId;
    }
    if (stepAction['comment']) {
      stepAction['notes'] = skpData.object?.comment;
    } else {
      stepAction['notes'] = skpData.object?.notes;
    }
    if (skpData.object?.signatureDate) {
      stepAction['signatureDate'] = skpData.object?.signatureDate;
    } else {
      stepAction['signatureDate'] = this.executionService.formatDate(new Date(), `${this.cbpService.documentInfo?.dateFormatNew} h: i a`);
    }
    stepAction = { ...stepAction, ...this.sharedviewService.setUserInfoObj(stepAction.action) };
    stepAction['action'] = stepAction['action']?.toString();
    if (stepObject?.isParentRepeatStep) {
      stepAction['isParentRepeatStep'] = stepObject?.isParentRepeatStep;
      let repeatTimes = this.repeatTimes ? (Number(this.repeatTimes) + 1)?.toString() : '1';
      stepAction['repeatTime'] = repeatTimes;
      stepAction['totalRepeatTimes'] = this.cbpService?.selectedTimerRepeatStep ? this.cbpService.selectedTimerRepeatStep['repeatTimes'] : '0';
    }
    this.storeDataJsonObjFromExecution(stepAction);
  }

  // storing the data.json file
  storeDataObject(stepObject: any, status: any) {
    let user = this.executionService.selectedUserName;
    let stepAction: any = new StepAction(status, user, new Date(), user, new Date(), '', stepObject.dgType, stepObject.dgUniqueID, this.sharedviewService.setStepActionValue(status));
    stepAction = { ...stepAction, ...this.sharedviewService.setUserInfoObj(stepAction.action) };
    if (stepObject?.isParentRepeatStep) {
      stepAction['isParentRepeatStep'] = stepObject?.isParentRepeatStep;
      stepAction['repeatTime'] = this.repeatTimes ? (Number(this.repeatTimes) + 1)?.toString() : 0;
      stepAction['totalRepeatTimes'] = this.cbpService?.selectedTimerRepeatStep ? this.cbpService.selectedTimerRepeatStep['repeatTimes'] : '0';
    }
    if (stepObject?.dgType == DgTypes.Repeat && stepObject?.repeatStepStarted) {
      stepAction['repeatTime'] = stepObject.repeatTimes;
    }
    this.storeDataJsonObjFromExecution(stepAction);
  }
  checkValidation(item: any, stepObj: any, value: any) {
    stepObj.oldValue = stepObj?.oldValue ? stepObj.oldValue : '';
    this.storeMessages = [];
    this.cbpService.updatedDateTime = new Date();
    if (stepObj['alarm'] && stepObj.alarm.length > 0 && stepObj['valueType'] != DgTypes.Derived) {
      if (stepObj.dgType === DgTypes.CheckboxDataEntry) stepObj.storeValue = value;
      if (stepObj.storeValue || stepObj.dgType === DgTypes.CheckboxDataEntry || stepObj.dgType === DgTypes.BooleanDataEntry) {
        this.antlrService.callBackObject.initExecution(stepObj.dgUniqueID, this.clearHtmlText(stepObj, stepObj.storeValue));
      }
      stepObj.alarm.forEach((alarmData: any) => {
        const valueValid = this.antlrService.executeExpression(alarmData.ParsedValue);
        if (valueValid === 'true') { this.storeMessages.push(alarmData['AlarmMessage']); }
      });
    }
    this.antlrService.callBackObject.dateFormat = this.cbpService.documentInfo['formatPlaceHolder'];
    const dataObjLength = JSON.parse(JSON.stringify(this.cbpService?.dataJson?.dataObjects?.length));
    this.storeItemOfEnter(stepObj, value);
    if (this.cbpService.isTextOrNumericInput(stepObj?.dgType) && dataObjLength != this.cbpService?.dataJson?.dataObjects?.length) {
      stepObj['oldValue'] = value;
    }
    this.setDerivedValuesIfAny();
    if (this.storeMessages?.length > 0) { this.callMessages(this.storeMessages); }
    this.reattach();
  }
  clearHtmlText(step: any, text: any) {
    if (step.dgType === DgTypes.TextAreaDataEntry || step.dgType === DgTypes.TextDataEntry || step.dgType == DgTypes.NumericDataEntry || step.dgType == DgTypes.DateDataEntry) {
      let newtext: any = typeof text == 'string' ? text.replace(/<[^>]*>/g, '') : undefined;
      newtext = newtext === undefined ? text : newtext;
      newtext = step.dgType == DgTypes.NumericDataEntry ? newtext?.toString()?.replace(/[^0-9.-]/g, '') : this.cbpService.isValidNumber(newtext) ? newtext : newtext.replace(/\./g, '');
      if (step.dgType == DgTypes.NumericDataEntry && newtext == '') {
        newtext = "0";
      }
      return newtext;
    }
    return text;
  }
  setDerivedValuesIfAny() {
    if (this.cbpService.selectedElement) {
      if (this.cbpService.selectedElement?.children) {
        const getDerivedItems = this.cbpService.selectedElement?.children.filter((item: any) => item.valueType === DgTypes.Derived);
        if (getDerivedItems.length > 0) { this.fillDerivedSteps(this.cbpService.selectedElement); }
      }
    }
  }
  fillDerivedSteps(stepObj: any, isFormView: any = true) {
    this.selectedObj = stepObj;
    let filDerivedChecked = false;
    if (Array.isArray(stepObj.children) && stepObj.children.length > 0) {
      for (let i = 0; i < stepObj.children.length; i++) {
        const derived = stepObj.children[i];
        if (derived['valueType'] === DgTypes.Derived && derived.ParsedValue !== '') {
          if (derived?.ParsedValue?.toString()?.includes('undefined')) {
            let reverseTempMapUniqueID = new Map();
            this.cbpService.tempMapUniqueID.forEach((value, key) => reverseTempMapUniqueID.set(value?.toString(), key));
            this.cbpService.validateDerivedRuleWithDgUniqueIDs(derived, reverseTempMapUniqueID);
          }
          if (this.cbpService.isDgUniqueIdPresentInAntlr(derived.ParsedValue, this.antlrService.callBackObject)) {
            const storeData = this.antlrService.executeExpression(derived.ParsedValue);
            if (derived.dgType === DgTypes.TextDataEntry) {
              filDerivedChecked = true;
              if (storeData !== undefined && storeData !== null) {
                let value = Array.isArray(storeData) ? storeData[0] : storeData;
                derived.storeValue = isNaN(value) ? value : this.cbpService.roundOffValue(value, null, derived.dgType);
                if (derived.storeValue == '<<DG_EMPTY>>') { derived.storeValue = ''; }
                this.storeItemOfEnter(derived, derived.storeValue);
                this.derivedAlarm(derived);
              }
            }
            if (derived.dgType === DgTypes.NumericDataEntry) {
              filDerivedChecked = true;
              if (storeData !== undefined && storeData !== null) {
                let newValue = Array.isArray(storeData) ? storeData[0] : storeData;
                if (this.cbpService.isStrictlyNumeric(newValue)) {
                  newValue = isNaN(newValue) ? newValue : this.cbpService.roundOffValue(newValue, derived?.decimal, derived.dgType);
                  derived.storeValue = (derived.decimal > 0) ? newValue?.toFixed(derived.decimal) : newValue;
                  this.storeItemOfEnter(derived, derived.storeValue);
                }
                this.derivedAlarm(derived);
              }
            }
          }
        }
      }
    }
    if (this.storeMessages?.length > 0 && !isFormView) { this.callMessages(this.storeMessages); }
    if (filDerivedChecked) {
      this.updateViewPage();
    }
  }
  derivedAlarm(stepObj: any) {
    if (stepObj['alarm'] && stepObj.alarm.length > 0) {
      if (stepObj.storeValue) { this.antlrService.callBackObject.initExecution(stepObj.dgUniqueID, this.clearHtmlText(stepObj, stepObj.storeValue)); }
      let reverseTempMapUniqueID = new Map();
      this.cbpService.tempMapUniqueID.forEach((value, key) => reverseTempMapUniqueID.set(value?.toString(), key));
      stepObj.alarm.forEach((alarmData: any) => {
        alarmData.ParsedValue = this.cbpService.validateDerivedRuleWithDgUniqueIDs(alarmData, reverseTempMapUniqueID, true);
        const valueValid = this.antlrService.executeExpression(alarmData.ParsedValue);
        if (valueValid === 'true') { this.storeMessages.push(alarmData.AlarmMessage); }
      });
    }
  }
  callMessages(messages: any) {
    const messageQue: any = [];
    messages.forEach((item: any, i: any) => {
      messageQue.push({ title: messages[i], customClass: 'swal-wide swal-height', showCancelButton: false, confirmButtonText: 'OK' });
    });
    swal.queue(messageQue);
    this.storeMessages = [];
  }
  storeItemOfEnter(stepObject: any, value: any) {
    if (value || value == '') { this.antlrService.callBackObject.initExecution(stepObject.dgUniqueID, this.clearHtmlText(stepObject, value)); }
    let obj: any = this.sharedviewService.storeDataObj(stepObject, value);
    if (obj?.styleSet === undefined) { obj['styleSet'] = {}; }
    if (Object.keys(obj?.styleSet).length === 0 && stepObject?.dgType == DgTypes.TextDataEntry) {
      obj.styleSet['fontcolor'] = stepObject.color;
    }
    if (stepObject.dgType === DgTypes.SignatureDataEntry) {
      obj['signatureValue'] = stepObject.signatureValue;
      obj['signature'] = stepObject.storeValue;
      obj['signatureDate'] = stepObject.signatureDate;
      obj['signatureName'] = stepObject.signatureName;
      obj['initial'] = stepObject.initial;
      this.dataJsonChangeNew(false);
    } else if (stepObject.dgType === DgTypes.InitialDataEntry) {
      obj['initial'] = stepObject.initial;
      obj['initialStore'] = stepObject.initialStore;
      obj['initialName'] = stepObject.initialName;
      this.dataJsonChangeNew(false)
    } else {
      this.storeDataJsonObjFromExecution(obj);
    }
  }

  storeDataJsonObjFromExecution(dataInfoObj: any) {
    this.executionService.showPopupItem = undefined;
    this.cbpService.updatedDateTime = new Date();
    const dataObjLength = JSON.parse(JSON.stringify(this.cbpService?.dataJson?.dataObjects?.length));
    this.cbpService.dataJsonStoreChange(dataInfoObj);
    if (dataObjLength != this.cbpService?.dataJson?.dataObjects?.length)
      this.dataJsonChangeNew(false)
  }
  gotoCurrentDiv(number: any, autoScroll = 0) {
    if ($('#' + number).length !== 0) {
      $('#' + number)[0].scrollIntoView({ behavior: autoScroll ? 'instant' : 'smooth', block: autoScroll == 3 ? 'start' : 'start', inline: 'center' });
    }
  }
  disableTopButtons(item: any) {
    this.disableSelectedStep = this.executionService.stepActionCondition(item) ? this.getDisableResponse(item) : false;
  }
  openPopup(obj: any, event: any) {
    if (this.executionService.showPopupItem === obj.dgUniqueID) {
      this.executionService.showPopupItem = undefined;
    } else {
      this.executionService.showPopupItem = obj.dgUniqueID;
    }
    this.updateViewPage();
    event.stopPropagation();
  }
  getCurrentSection(event: any, item: any, e: any) {
    this.tableService.selectedRow = [];
    this.cbpService.selectedTable = undefined;
    $('.popuptext').css("display", "none");
    if (this.executionService.showPopupItem !== item.dgUniqueID) { this.executionService.showPopupItem = undefined; }
    this.disableSelectedStep = false;
    if (!this.sharedviewService.isLinkSelected && !this.freezePage) {
      if (this.cbpService.currentStep !== event) {
        this.cbpService.selectedTable = undefined;
        if (this.menuConfig.isCollapsibleViewEnabled) {
          this.executionService.toggleDisplaySections(item, this.section, 0)
        }
        this.cbpService.currentStep = event;
        this.cbpService.selectedElement = item;
        this.executionService.selectedNewEntry = undefined;
        this.dataJsonService.setSelectItem({ item: item });
        this.executionService.selectedField({ stepItem: {}, stepObject: {}, showMenuText: false });
        this.setStepInfo(event);
        let isUdoStepDisabled = true;
        isUdoStepDisabled = this.checkUndoStep(item);
        this.notifyParenFormPage('currentSelected', item, event, isUdoStepDisabled);
      }
    }
    this.sharedviewService.isLinkSelected = false;
    if (typeof (item?.applicabilityRule) !== 'undefined' && this.cbpService.disableAutoStep &&
      item?.applicabilityRule?.length > 0 && !item['isAppExecuted']) {
      this.checkPreviousAlerts(item, this.cbpService.stepSequentialArray)
      if (!this.hasAnyAlerts()) {
        this.applicabilityRule(item);
      }
    }
    this.updateViewPage();
    this.notifyParenFormPage('refreshMenuBar', {}, 0, false);
  }
  checkUndoStep(item: any) {
    let isUdoStepDisabled = true; let nextStepObj: any;
    if (this.executionService.stepActionCondition(item)) {
      let getIndex = this.cbpService.stepActionArray.findIndex((it: any) => it.dgUniqueID === item.dgUniqueID);
      let parentIndex = this.cbpService.stepActionArray.findIndex((it: any) => it.dgSequenceNumber === item.parentID);
      if (this.cbpService.stepActionArray[parentIndex]?.isChecked) {
        isUdoStepDisabled = (this.cbpService.stepActionArray[parentIndex]?.dgType == DgTypes.Section && item?.isChecked) ? false : true;
      } else {
        nextStepObj = this.checknextObjectIsChild(this.cbpService.stepActionArray[getIndex + 1], item, getIndex + 1);
        ((item.isChecked && (item.options.complete || item.options.notApplicable)) &&
          (!nextStepObj?.options?.complete && !nextStepObj?.options?.notApplicable)) ? isUdoStepDisabled = false : isUdoStepDisabled = true;
      }
    } else {
      if (item.dgType == DgTypes.StepInfo || item.dgType === DgTypes.Section) {
        let getIndex = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgUniqueID === item.dgUniqueID);
        let parentIndex = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgSequenceNumber === item.parentID);
        if (this.cbpService.stepSequentialArray[parentIndex]?.isChecked) {
          isUdoStepDisabled = true;
        } else {
          nextStepObj = this.checknextObjectIsChild(this.cbpService.stepSequentialArray[getIndex + 1], item, getIndex + 1);
          ((item.isChecked && (item.options.complete || item.options.notApplicable)) &&
            (!nextStepObj?.options?.complete && !nextStepObj?.options?.notApplicable)) ? isUdoStepDisabled = false : isUdoStepDisabled = true;
        }
      }
    }
    return isUdoStepDisabled;
  }
  checknextObjectIsChild(nextObj: any, currentObj: any, nextIndext: any): any {
    if (nextObj?.parentID === currentObj?.dgSequenceNumber) {
      return this.checknextObjectIsChild(this.cbpService.stepActionArray[nextIndext + 1], nextObj, nextIndext + 1);
    } else {
      let parentIndex = this.cbpService.stepActionArray.findIndex((it: any) => it.dgSequenceNumber === nextObj?.parentID);
      if (this.cbpService.stepActionArray[parentIndex]?.isChecked) {
        return this.checknextObjectIsChild(this.cbpService.stepActionArray[nextIndext + 1], nextObj, nextIndext + 1);
      }
      return nextObj;
    }
  }

  setStepInfo(event: any) {
    this.cbpService.currentStep = event;
    this.executionService.isClickedCurrentStep = true;
    this.cbpService.executionClicked = false;
  }
  getParentObj(stepObject: any) {
    let parentObj = (stepObject.parentID === null || stepObject.parentID === undefined) ? stepObject : this.getSelectedSectionParentObj(stepObject.parentDgUniqueID);
    return parentObj;
  }
  isStepActionValidTest(stepObject: any) {
    const continuous = Dependency.Continuous;
    const information = Dependency.Information;
    const reference = Dependency.Reference;
    this.dependencyArray = '';
    let parentObj = this.getParentObj(stepObject);
    if (parentObj['configureDependency'] && parentObj['configureDependency'].length > 0 &&
      !this.sharedviewService.hasConfigureDependencyCompleted(parentObj, this.cbpService.stepSequentialArray)) {
      parentObj['configureDependency'].forEach((element: any) => {
        this.dependencyArray = this.dependencyArray + ' ' + element.number;
      });
      this.depedencyValidation = true;
      return false;
    }
    if (parentObj['dependency'] === Dependency.Default) {
      if (this.checkDependency(parentObj, continuous)) {
        let obj = stepObject.parentDgUniqueID === null || stepObject.parentDgUniqueID === undefined ? stepObject : this.getSelectedParentObj(stepObject.parentDgUniqueID);
        return this.getStepActionValidElsePart(stepObject, obj);
      }
      if (this.checkDependency(parentObj, reference) || this.checkDependency(parentObj, information)) {
        let isValid = this.sharedviewService.isContinuousWithIndependentStepsValid(stepObject, parentObj);
        if (!isValid && this.sharedviewService.stepActionValidation) { this.stepActionValidation = true; }
        if (!isValid && this.sharedviewService.isAlertMessage) { this.alertsValidation = true; }
        return isValid;
      }
    }
    if (parentObj['dependency'] === Dependency.Independent) {
      return true;
    }
    if (parentObj['dependency'] === Dependency.SectionStep) {
      if (this.sharedviewService.hasConfigureDependencyCompleted(parentObj, this.cbpService.stepSequentialArray)) {
        return this.dependencyValidation(parentObj, stepObject, continuous, reference, information);
      } else {
        parentObj['configureDependency'].forEach((element: any) => {
          this.dependencyArray = this.dependencyArray + ' ' + element.number;
        });
        this.depedencyValidation = true;
        return false;
      }
    }
    return true;
  }
  dependencyValidation(parentObj: any, stepObject: any, continuous: any, reference: any, information: any) {
    if (this.checkDependency(parentObj, continuous)) {
      return this.sharedviewService.isContinuousStepValid(stepObject, parentObj, this.cbpService.stepSequentialArray);
    }
    if (this.checkDependency(parentObj, reference)) {
      return this.sharedviewService.isContinuousStepValid(stepObject, parentObj, this.cbpService.stepSequentialArray);
    }
    if (this.checkDependency(parentObj, information)) {
      return true;
    }
  }
  checkDependency(parentObj: any, dependency: any) {
    return parentObj.usage === dependency ? true : false
  }

  getSelectedStepObj(uniqueID: any) {
    const parentIndex = this.cbpService.stepSequentialArray.findIndex((el: any) => el.dgUniqueID === uniqueID);
    return this.cbpService.stepSequentialArray[parentIndex];
  }
  getSelectedStepTimedParentObj(dgUniqueID: any): any {
    let newObject = JSON.parse(JSON.stringify(this.getSelectedParentObj(dgUniqueID)));
    if (newObject.dgType !== DgTypes.Timed) {
      return this.getSelectedSectionParentObj(newObject.parentDgUniqueID);
    }
    return JSON.parse(JSON.stringify(newObject));
  }

  getSelectedSectionParentObj(dgUniqueID: any): any {
    let newObject = JSON.parse(JSON.stringify(this.getSelectedParentObj(dgUniqueID)));
    if (this.executionService.stepActionCondition(newObject)) {
      return this.getSelectedSectionParentObj(newObject.parentDgUniqueID);
    }
    return JSON.parse(JSON.stringify(newObject));
  }
  getLastStepActionObj(dgUniqueID: any, dgSequenceNumber: any, selectStepNumber: any) {
    if (selectStepNumber.toString().includes(dgSequenceNumber.toString())) {
      let findObject = this.getSelectedParentObj(dgUniqueID);
      if (selectStepNumber.toString().includes(findObject.dgSequenceNumber.toString()) && this.executionService.stepActionCondition(findObject)) {
        this.lastStepObject = JSON.parse(JSON.stringify(findObject));
        this.getLastStepActionObj(this.lastStepObject.parentDgUniqueID, this.lastStepObject.dgSequenceNumber, selectStepNumber);
      }
    }
  }
  getPreviousObject(obj: any) {
    const index = this.cbpService.stepActionArray.findIndex((item: any) => item.dgUniqueID === obj.dgUniqueID);
    return this.cbpService.stepActionArray[index - 1];
  }
  getStepActionValidElsePart(stepObject: any, parentObj: any) {
    this.getLastStepActionObj(stepObject.dgUniqueID, stepObject.dgSequenceNumber, stepObject.dgSequenceNumber);
    this.checkPreviousAlerts(this.lastStepObject, this.cbpService.stepSequentialArray);
    let isValid = true;
    isValid = this.stepPreviousElementChecked(stepObject);
    if (isValid) {
      this.checkPreviousAlerts(this.lastStepObject, this.cbpService.stepSequentialArray);
      if (this.stepActionValidation) { isValid = false; }
    }
    if (!isValid) {
      if (!this.stepActionValidation) {
        if (this.conditionalRuleValidation || this.applicabilityRuleValidation) {
          this.stepActionValidation = false;
          this.alertsValidation = false;
        } else { this.stepActionValidation = true; }
      } else {
        this.stepActionValidation = true;
      }
    }
    if (this.sharedviewService.isAlertMessage) { this.alertsValidation = true; return false; }
    const index = this.cbpService.stepActionArray.findIndex((el: any) => el.dgUniqueID === stepObject.dgUniqueID);
    if (index !== 0 && !isValid) {
      return this.getSwitchMessage() === undefined ? true : false;
    }
    return true;
  }
  stepPreviousElementChecked(obj: any) {
    let isValid = true;
    this.getLastStepActionObj(obj.dgUniqueID, obj.dgSequenceNumber, obj.dgSequenceNumber);
    let parentObj = (obj.parentID === null || obj.parentID === undefined) ? obj : this.getSelectedSectionParentObj(obj.parentDgUniqueID);
    if (parentObj.usage === Dependency.Continuous) {
      isValid = false;
      this.checkPreviousAlerts(parentObj, this.cbpService.stepSequentialArray);
      this.cbpService.stepActionArray = this.cbpService.stepActionArray.filter(item => !item.hide_section);
      let getIndex = this.cbpService.stepActionArray.findIndex((item: any) => item.dgUniqueID == obj.dgUniqueID);
      if (!this.stepActionValidation) {
        let getPreStepElement = this.cbpService.stepActionArray[getIndex - 1];
        isValid = getPreStepElement ? ((getPreStepElement?.isChecked || getPreStepElement?.options?.skip || getPreStepElement?.options?.notApplicable) ? true : false) : true;
        let getIndentSteps = this.cbpService.stepActionArray.filter((item, i) => (item?.level == obj?.level && i < getIndex && (!item?.isChecked && !item?.options?.skip && !item?.options?.notApplicable)))
        isValid = parentObj?.dgUniqueID === obj?.parentDgUniqueID ? true : false;
        isValid = getIndentSteps?.length == 0 ? true : false;
      } else {
        let currentObjLevelSteps = this.cbpService.stepActionArray.filter((item, i) => (item.dgUniqueID !== obj.dgUniqueID && item.level === obj.level && i < getIndex && (!item?.isChecked && !item?.options?.skip && !item?.options?.notApplicable)))
        let parentObjLevelSteps = this.cbpService.stepActionArray.filter((item, i) => (item.dgUniqueID !== parentObj.dgUniqueID && item.level === parentObj.level && i < getIndex && (!item?.isChecked && !item?.options?.skip && !item?.options?.notApplicable)))
        let lastObjLevelSteps = this.cbpService.stepActionArray.filter((item, i) => (item.dgUniqueID !== this.lastStepObject.dgUniqueID && item.level === this.lastStepObject?.level && i < getIndex && (!item?.isChecked && !item?.options?.skip && !item?.options?.notApplicable)))
        isValid = parentObj?.dgUniqueID === obj?.parentDgUniqueID &&
          (currentObjLevelSteps?.length == 0 &&
            parentObjLevelSteps?.length == 0 && lastObjLevelSteps?.length == 0) ? true : false;
        if (parentObj.parentID === null || parentObj.parentID === undefined && isValid) {
          this.checkPreviousAlerts(parentObj, this.cbpService.stepSequentialArray);
          isValid = (this.stepActionValidation || this.acknowledgeValidation) ? false : true
        }
      }
      if (this.cbpService.disableAutoStep && parentObj?.applicabilityRule?.length > 0 && !parentObj['isAppExecuted']) {
        isValid = false;
        this.applicabilityRuleValidation = true;
      }
    }
    return isValid;
  }

  getDisableResponse(obj: any) {
    this.setValidationFields();
    return !this.isStepActionValidTest(obj);
  }
  openReferenceInLinkTab(stepObject: any) {
    if (stepObject['source'] === LinkTypes.Local) {
      this.sharedviewService.isLinkSelected = true;
      const index = this.cbpService.stepSequentialArray.findIndex((el: any) => el.dgUniqueID == stepObject.sectiondgUniqueId);
      const targetStep = this.cbpService.stepSequentialArray[index];
      this.setNewStepObject(targetStep);
      return false;
    } else {
      this.linkViewEmit.emit(stepObject);
    }
  }
  acknowledgeNew(event: any) {
    this.setValidationFields();
    if (this.checkChildStepAck(event.object)) {
      this.checkPreviousAlerts(event.object, this.cbpService.stepSequentialArray);
    }
    if (this.isAlertMessage) { this.alertsValidation = true; }
    if (this.childStepValidation || this.alertsValidation || this.acknowledgeValidation || this.stepActionValidation) {
      this.stepActionValidations(event.object, false);
    } else {
      const ackObj: any = new Acknowledgement();
      ackObj.acknowledgedBy = this.executionService.selectedUserName;
      ackObj.dgUniqueID = event.object.dgUniqueID;
      event.object['acknowledgementReqd'] = true;
      event.object.options.complete = true;
      ackObj['action'] = ActionId.Acknowledged;
      event.object = this.sharedviewService.setUserAndDateInfo(event.object);
      this.setIsCheckedValues(event.object);
      let dataInfo: DataInfo = new DataInfo();
      dataInfo.statusBy = this.executionService.selectedUserName;
      dataInfo.createdDate = new Date();
      dataInfo.createdBy = this.executionService.selectedUserName;
      dataInfo.statusDate = new Date();
      let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...ackObj };
      if (event.object['isParentRepeatStep']) {
        dataInfoObj['isParentRepeatStep'] = event.object['isParentRepeatStep'];
      }
      this.storeDataJsonObjFromExecution(dataInfoObj);
      this.gotoNextStepObject(this.increaseObject(event.object), 'executeRules');
    }
  }
  checkChildStepAck(item: any) {
    let isUdoStepDisabled = true;
    if (item.dgType == DgTypes.StepInfo || item.dgType === DgTypes.Section) {
      let parentIndex = this.cbpService.stepSequentialArray.findIndex((it: any) => it.dgSequenceNumber === item.parentID);
      isUdoStepDisabled = parentIndex != -1 ? true : false;
    }
    return isUdoStepDisabled;
  }
  dataJsonChangeNew(event: any) {
    this.setDataJson.emit(event);
  }
  trackByName(index: any, instructor: any) { return instructor.dgUniqueID; }
  TimerStep(obj: any) {
    if (this.isTimerOnStep) {
      this.stepActionValidation = true;
      this.showMessage();
      return false;
    }
    this.checkPreviousAlerts(obj, this.cbpService.stepSequentialArray);
    let isValid = true;
    isValid = this.stepPreviousElementChecked(obj);
    let parentObj = this.getParentObj(obj);
    if ((parentObj.usage == Dependency.Reference || parentObj.usage == Dependency.Information) && parentObj['dependency'] === Dependency.Independent) {
      isValid = true;
    }
    if (this.stepActionValidation && isValid) { this.stepActionValidation = false } // special case
    if (!isValid) { this.stepActionValidation = true; };
    if (!this.stepActionValidations(obj, false) && this.isStepActionValid(obj, true) && isValid) {
      if (obj.dgType === DgTypes.DelayStep) {
        obj['originalDelayTime'] = obj?.delayTime;
        this.notifyParentFormExecutionPage('delayTimer', obj);
      } else {
        if (obj.dgType === DgTypes.Repeat) {
          this.executionService.repeatStepEnable = true;
          obj['repeatStepStarted'] = true;
          this.repeatStepStart(obj);
          this.storeDataObject(obj, StepTypes.InProgressStep);
          this.executionService.setTimerStep({ dgType: DgTypes.Repeat, repeatStepEnable: true, object: obj });
        }
        this.cbpService.selectedTimerRepeatStep = obj;
        let dgType = obj.dgType === DgTypes.Timed ? 'stepTimerStart' : 'repeatStepStarted';
        obj[dgType] = true;
        if (obj.children.length > 0) {
          obj = this.cbpService.notifyRepeatOrTimedStepChilds(dgType, obj);
        }
        if (obj.dgType === DgTypes.Timed) {
          this.clearTimer(true);
          this.notifyParentFormExecutionPage('timedStep', obj);
        }
        if (obj.dgType == DgTypes.Repeat) {
          this.setChildStepSelect(obj, true);
        }
      }
    } else {
      this.stepActionValidations(obj, {});
    }
  }
  repeatStepStart(object: any) {
    if (!this.cbpService.selectedElement['repeatTimes']) { this.cbpService.selectedElement['repeatTimes'] = 1; }
    if (!this.cbpService.selectedElement['currentRepeatTimes']) { this.cbpService.selectedElement['currentRepeatTimes'] = 0; }
    if (this.cbpService.selectedElement['repeatTimes'] && !this.cbpService.selectedElement['isChecked']) {
      this.repeatTimes = this.cbpService.selectedElement['currentRepeatTimes'];
      this.isRepeatStep = true;
      this.executionService.repeatStepEnable = true;
      this.cbpService.selectedElement['options']['inProgress'] = true;
    } else {
      this.isRepeatStep = false;
      this.executionService.repeatStepEnable = false;
    }
  }

  clearTimer(value: boolean) {
    this.freezePage = value;
    this.isTimerOnStep = value;
    this.setFreeze();
  }
  openVerification(stepObject: any) {
    this.notifyFormExectution.emit({ type: 'verification', data: stepObject });
  }
  gettingInfoFromViewForm(event: any) { this.notifyFormExectution.emit(event); }

  getLinkEvent(event: any) { this.linkViewEmit.emit(event); }

  notifyParentFormExecutionPage(stepType: any, obj: any) {
    this.selectedObj = obj;
    this.notifyFormExectution.emit({
      'type': stepType,
      'selectedDgUniquId': obj.dgUniqueID,
      'selectedNode': obj.number,
      'object': obj
    });
  }
  notifyParenFormPage(stepType: any, stepObject: any, selectedId: any, isUndo: any) {
    this.selectedObj = stepObject;
    this.notifyFormExectution.emit({
      'type': stepType,
      'selectedDgUniquId': selectedId,
      'object': stepObject,
      'selectedNode': stepObject?.number,
      'undoComment': isUndo
    });
  }
  existingSecurityUser(item: any, typeValue: any) {
    this.notifyFormExectution.emit({
      type: 'securityVerify',
      user: item,
      securityType: typeValue
    });
  }
  alertViewOutput(obj: any) {
    if (this.executionService.stepActionCondition(obj)) {
      this.executeStepActions(obj.object);
    } else {
      if (!this.sharedviewService.hasAnyAlertMessages(obj.object))
        this.gotoNextLevelObj(this.increaseObject(obj.object));
    }
  }

  toggleDisplaySections(obj: any, section: any, type = 0) {
    this.executionService.toggleDisplaySections(obj, section, type);
    this.gotoCurrentDiv('section' + obj.dgUniqueID);
    this.notifyParenFormPage('currentSelected', obj, {}, false);
  }

  fetchRefObj(refObj: any) {

  }

  deleteImageObj(event: any) {
    this.deleteImageEvent.emit(event);
  }
  deleteMediChild(event: any, step: any, index: number) {
    step.children.splice(index, 1);
    let dataEntryEnabled = step?.children.filter((dataentry: any) => this.executionService.isDataEntry(dataentry));
    step['dataEntryEnabled'] = dataEntryEnabled?.length > 0 ? true : false;
    this.cdref.detectChanges();
  }
  _stickyNoteChange(event: any) {
    this.cbpService.setStickyChange(event);
  }

  showCrComment(step: any, type: string) {
    this.notifyFormExectution.emit({ type: 'CrComment', typeOf: type, object: step });
  }

  //Track by for Performance
  trackDgUniqueID(index: number, item: any): any {
    if (item) {
      return item.dgUniqueID;
    }
  }

  updateMediaFiles(files: any) {
    this.cbpService.mediaEditChangeUpdate(files);
  }

  ngOnDestroy() {
    this.dataJson_subscription?.unsubscribe();
    this.protectData_subscription?.unsubscribe();
    this.dataJsonService.errorMessage = false;
    this.updateTextView$?.unsubscribe();
    this.timerStepSubscription?.unsubscribe();
  }
}


