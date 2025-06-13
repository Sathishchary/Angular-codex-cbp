import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AlertMessages,
  CbpSharedService,
  Dependency,
  DgTypes,
  LinkTypes,
  PropertyDocument,
  SequenceTypes,
  VerificationType,
  waterMarkOptions
} from 'cbp-shared';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Actions, Audit, AuditModes, AuditTypes, StepAction } from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { DataSharingService } from '../../services/data-sharing.service';
import { TableService } from '../../shared/services/table.service';
import { BuilderUtil } from '../../util/builder-util';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css', '../../formbuild/formbuild.component.css'],
})
export class PropertyComponent implements OnInit, OnChanges, OnDestroy {
  dgType = DgTypes;
  SequenceTypes: typeof SequenceTypes = SequenceTypes;
  @Input() section: any;
  @Input() propertyDocument = new PropertyDocument();
  @Input() editorType: any;
  fileproperties: any;
  @Output() embededProcedure: EventEmitter<any> = new EventEmitter();
  @Output() setOrUnSetNodeIcon: EventEmitter<any> = new EventEmitter();
  @Output() type: EventEmitter<any> = new EventEmitter();
  attachedLocalFileName = '';
  fileData: any = [];
  sourceList = [LinkTypes.Local, LinkTypes.Attach, LinkTypes.URL, LinkTypes.eDocument];
  headerValue = 'CONFIDENTIAL INFORMATION';
  footerValue = 'FOR INTERNAL USE ONLY';
  tempsectionnumbers: any[] = [];
  tempMapNumberAndUniqueid = new Map();
  showDateOnCondition = true;
  element: any;
  watermarkApplied: boolean = false;
  class = "card bg-light p-0 w-sticky";
  classcard = "card-body bg-light p-0 w-sticky br-solid";
  typearrayList = [{ type: DgTypes.Section, display: 'Section' }, { type: DgTypes.StepAction, display: 'Step' }]
  typeList = [VerificationType.QA, VerificationType.Independent, VerificationType.Concurrent, VerificationType.Peer];
  selectedLinkItem: any;
  _subscription: any = Subscription;
  myValue = 'Simple Action'
  oldValue = 'Simple Action'
  storeOld: any;
  currentDate = new Date();
  typetextarraList = [{ type: DgTypes.TextDataEntry, display: 'Text' }, { type: DgTypes.TextAreaDataEntry, display: 'TextArea' }, { type: DgTypes.NumericDataEntry, display: 'Numeric' }]
  //AUDIT RELATED
  AuditTypes: typeof AuditTypes = AuditTypes;
  setItemSubscription!: Subscription;
  propertyAlert: any;
  actionstypes = [{ type: 'Simple Action', name: 'Action' }, { type: 'StepInfo', name: 'Information' }];
  refreshTab = true;
  documentSelected = false;
  constructor(
    public cbpService: CbpService, private controlService: ControlService, private cdr: ChangeDetectorRef,
    private propertyaChangeService: DataSharingService, private _buildUtil: BuilderUtil,
    public cbpSharedService: CbpSharedService, public builderService: BuilderService,
    public tableService: TableService, public auditService: AuditService) {
    this.auditService.undoAudit_reso.pipe(takeUntil(this.auditService.undoAudit)).subscribe((audit: Audit) => {
      this.postProcessUndo(audit);
    });
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.propertyDocument = this.cbpService.docInfo;
    if (this.propertyDocument === undefined) {
      this.propertyDocument = new PropertyDocument();
    }
    if (this.cbpService.cbpJson.documentInfo[0].waterMarkOptions?.text) {
      this.cbpService.waterMarkValue = this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text;
      this.watermarkApplied = true;
    }
    if (!this.cbpService.cbpJson.documentInfo[0]?.dateFormat) {
      this.cbpService.cbpJson.documentInfo[0]['dateFormat'] = 'm/j/Y';
    }
    this.callStepSectionInfo();
    this._subscription = this.auditService.undoAudit_reso.subscribe((audit: Audit) => {
      this.postProcessUndo(audit);
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        this.cbpService.selectedElement = result;
      }
    });
    this.propertyAlert = this.controlService.setStyles(this.cbpService.styleModel['levelWarning']);
  }

  updateImageView(image: any) {
    this.propertyaChangeService.changeImageProperties(image);
  }
  keyPressEvent(event: any) {
    if (Number(event?.target?.value) < 0) {
      event.target.value = 0;
    }
    if (Number(event?.target?.value) > 100) {
      event.target.value = 100;
    }
  }
  updateMedia(mediaObj: any) {
    if (!mediaObj['modifiedHeight']) { mediaObj['modifiedHeight'] = 500 / (100 / mediaObj.height); }
    this.propertyaChangeService.mediaObjecProperties(mediaObj);
  }
  updateWidth(image: any) {
    this.propertyaChangeService.updateProperties(image);
  }
  checkVerificationsAddedOrNot(verificationtype: string) {
    if ((this.cbpService.selectedElement.dgType = DgTypes.StepAction)) {
      const verification = new Set();
      try {
        if (this.cbpService.selectedElement.children) {
          this.cbpService.selectedElement.children.forEach(
            (element: { VerificationType: unknown; }) => {
              verification.add(element.VerificationType);
            }
          );
          switch (verificationtype) {
            case DgTypes.Independent:
              this.cbpService.selectedElement.requiresIV = true;
              break;
            case DgTypes.Concurrent:
              this.cbpService.selectedElement.requiresCV = true;
              break;
            case DgTypes.QA:
              this.cbpService.selectedElement.requiresQA = true;
              break;
            case DgTypes.Peer:
              this.cbpService.selectedElement.requiresPC = true;
              break;
          }
        }
        this.viewUpdateTrack();
      } catch (error) { }
      return verification.has(verificationtype);
    }
    return false;
  }
  onNewFileSelected(e: any) {
    let files: any = (e.target as HTMLInputElement)?.files;
    if (files?.length > 0) {
      this.cbpService.attachment.push(files[0]);
      this.cbpService.selectedElement.uri = files[0].name;
      this.createAuditEntry(AuditTypes.AUDIT_DEFAULT, { propName: 'uri' });
    } else {
      // console.log('No Media Found');
    }
  }
  changeUI(source: string) {
    if (source === 'Local') {
      this.cbpService.selectedElement.action = 'Execute';
      this.callStepSectionInfo();
    } else if (source === 'Attach') {
      this.setUpdates('Reference', '');
      this.cbpService.selectedElement.target = '';
    } else if (source === 'URL' || source === 'eMedia') {
      this.setUpdates('N/A', '');
    } else if (source === 'eDocument') {
      this.setUpdates('Execute', '');
      this.cbpService.selectedElement.target = '';
    }
    this.viewUpdateTrack();
    this.controlService.setStyleModelItem(this.cbpService.styleModel);
    this.updateLink();
  }
  setUpdates(action: string, uri: string) {
    this.cbpService.selectedElement.action = action;
    this.cbpService.selectedElement.uri = uri;
  }
  checkSectionStepCount() {
    this.callStepSectionInfo();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'section' && !changes.section.firstChange) {
        this.callStepSectionInfo();
      }
    }
  }
  setLinkLocal() {
    this.selectedLinkItem = this.tempMapNumberAndUniqueid.get(this.cbpService.selectedElement.sectiondgUniqueId);
    if (!this.selectedLinkItem || this.selectedLinkItem != undefined) {
      this.selectedLinkItem = '1.0';
      this.cbpService.selectedElement.sectiondgUniqueId = 1;
      this.cbpService.selectedElement.number = '1.0';
      this.cbpService.selectedElement.sectionNumber = '1.0';
    }
    this.viewUpdateTrack();
  }
  changeVerificationUi(VerificationTypes: String) {
    this.cbpService.selectedElement.prompt = 'Requires ' + VerificationTypes + ' Verification';
    this.cbpService.selectedElement.prompt = 'Requires ' + VerificationTypes + ' Verification';
    this.viewUpdateTrack();
  }
  updateVerify() {
    this.cbpService.isViewUpdated = true;
  }
  dropItemsDelete(i: any) {
    this.viewUpdateTrack();
    this.cbpService.selectedElement.choice.splice(i, 1);
  }
  renderEmbededProcedure() {
    this.embededProcedure.emit(
      this.cbpService.selectedElement.property.documentNumber
    );
    if (this.auditService.currentMode == AuditModes.AUDIT) {
      this.createAuditEntry(AuditTypes.EMBEDED_DOC_NUM, { propName: 'documentNumber' });
    }
  }
  removeStaticContent() {
    this.type.emit(this.cbpService.selectedElement.property.type);
    this.cbpService.embeddedType = this.cbpService.selectedElement.property.type === 'Dynamic' ? true : false;
    if (this.cbpService.selectedElement.children && this.cbpService.selectedElement.children.length > 0) {
      this.cbpService.selectedElement.children.forEach((element: any) => {
        this.setProcedurePropertyType(element, this.cbpService.selectedElement.property.type);
      });
    }
    if (this.auditService.currentMode == AuditModes.AUDIT) {
      this.createAuditEntry(AuditTypes.EMBEDED_TYPE, { propName: 'type' });
    }
  }
  setProcedurePropertyType(obj: any, procedureType = 'Static') {
    if (!obj['property']) { obj['property'] = {}; }
    obj['property']['type'] = procedureType;
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((element: any) => {
        this.setProcedurePropertyType(element, obj.property.type);
      });
    }
  }
  renderEdocumentConfigure() {
    this.embededProcedure.emit(this.cbpService.selectedElement.uri);
  }

  validateIndent() {
    if (this.cbpService.selectedElement.number.match(/[a-z]/i) && this.cbpService.selectedElement.parentID) {
      const temp = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
      if (temp.parentID) {
        const parent = this._buildUtil.getElementByNumber(temp.parentID, this.cbpService.cbpJson.section);
        const index = parent.children.findIndex((i: { number: any; }) => i.number === temp.number);
        if (index > 0) {
          let maxIndex: any;
          for (let k = 0; k < index; k++) {
            if (parent.children[k].number) {
              maxIndex = k;
            }
          }
          const newParent = parent.children[maxIndex];
          if (newParent) {
            try {
              this.checkHierarchy(newParent, temp);
              newParent.children.push(temp);
            } catch (e) {
              this.cbpService.showSwal(e, '', '');
            }
          }
        }
        this._buildUtil.deleteStep(this.cbpService.selectedElement, this.cbpService.cbpJson.section);
      }
    }

  }
  checkHierarchy(newParent: any, temp: any) {
    switch (temp.dgType) {
      case DgTypes.Section:
        if (newParent.dgType === DgTypes.Section) {
          return true;
        } else {
          throw new Error(newParent.dgType + ' cannot accept ' + temp.dgType);
        }
      case DgTypes.StepAction:
        if (newParent.dgType === DgTypes.Section || newParent.dgType === DgTypes.StepAction) {
          return true;
        } else {
          throw new Error(newParent.dgType + ' cannot accept ' + temp.dgType);
        }
      case DgTypes.StepInfo:
        if (newParent.dgType === DgTypes.Section || newParent.dgType === DgTypes.StepAction) {
          return true;
        } else {
          throw new Error(newParent.dgType + ' cannot accept ' + temp.dgType);
        }
      default:
        break;
    }
  }

  checkAndChangesNumberedSteps(event: any) {
    this.cbpService.selectedElement.numberedChildren = event.target.checked;
    if (event.target.checked) {
      this.cbpService.selectedElement.usage = this.cbpService.docUsage;
      if (this.cbpService.docUsage === Dependency.Information) {
        this.cbpService.selectedElement.dependency = Dependency.Independent;
      } else {
        this.cbpService.selectedElement.dependency = Dependency.Default;
      }
      this._buildUtil.numberedSteps(this.cbpService.selectedElement, this.cbpService.cbpJson.section);
    } else {
      this.cbpService.selectedElement.usage = Dependency.Information;
      this.cbpService.selectedElement.dependency = Dependency.Independent;
      this._buildUtil.unNumberedSteps(this.cbpService.selectedElement, this.cbpService.cbpJson.section);
    }
    this.createAuditEntry(AuditTypes.PROPERTY_NUMBERED_STEPS, { propName: 'numberedChildren' });
    this.viewUpdateTrack();
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
  }

  stepActionStructure() {
    if (this.cbpService.backgroundJson?.section) {
      this.codeSubTypeForBack();
    }
    this.cbpService.selectedElement.dgType = DgTypes.StepAction;
    this.steptypeReuseCode();
    this.cbpService.selectedElement.stepType = 'Simple Action';
    this.cbpService.selectedElement.selectedDgType = DgTypes.StepAction;
    this.cbpService.selectedDgType = DgTypes.StepAction;
    this.cbpService.selectedElement.numberedChildren = true;
    this.cbpService.selectedElement.isCritical = false;
    delete this.cbpService.selectedElement.type;
    delete this.cbpService.selectedElement.numberedSteps;
  }
  stepActionStructureBack(selectElement: any) {
    selectElement.dgType = DgTypes.StepAction;
    this.steptypeReuseCodeBack(selectElement);
    selectElement.stepType = 'Simple Action';
    this.cbpService.selectedDgType = DgTypes.StepAction;
    selectElement.numberedChildren = true;
    selectElement.isCritical = false;
    delete selectElement.type;
    delete selectElement.numberedSteps;
  }
  stepInfotoStepStructure() {
    this.steptypeReuseCode();
    this.cbpService.selectedElement.applicabilityRule = [];
    this.cbpService.selectedElement.rule = [];
    this.cbpService.selectedElement.alarm = [];
    delete this.cbpService.selectedElement.para;
    delete this.cbpService.selectedElement.dealyTime;
    delete this.cbpService.selectedElement.allowedtoStop;
  }
  stepInfoStepStructureBack(stepObjct: any) {
    this.steptypeReuseCodeBack(stepObjct);
    stepObjct.applicabilityRule = [];
    stepObjct.rule = [];
    stepObjct.alarm = [];
    delete stepObjct.para;
    delete stepObjct.dealyTime;
    delete stepObjct.allowedtoStop;
  }
  sectionStructure() {
    this.stepsReuseCode();
    if (this.cbpService.backgroundJson?.section) {
      this.codeSubTypeForBack();
    }
    this.cbpService.selectedElement.dgType = DgTypes.Section;
    delete this.cbpService.selectedElement.stepType;
    this.cbpService.selectedElement.selectedDgType = DgTypes.Section;
    this.cbpService.selectedElement.numberedChildren = true;
    this.cbpService.selectedElement.numberedSteps = true;
    this.cbpService.selectedElement.acknowledgementReqd = null;
  }
  sectionSubStructureBack(stepBack: any) {
    this.stepsReuseCodeBack(stepBack);
    stepBack.dgType = DgTypes.Section;
    stepBack.stepType;
    stepBack.selectedDgType = DgTypes.Section;
    stepBack.numberedChildren = true;
    stepBack.numberedSteps = true;
    stepBack.acknowledgementReqd = null;
  }
  stepInfoStructure() {
    this.stepsReuseCode();
    delete this.cbpService.selectedElement.applicabilityRule;
    delete this.cbpService.selectedElement.rule;
    delete this.cbpService.selectedElement.alarm;
    delete this.cbpService.selectedElement.numberedChildren;
    delete this.cbpService.selectedElement.Security;
  }
  stepInfoStrucBack(stepObjcet: any) {
    this.stepsReuseCodeBack(stepObjcet);
    delete stepObjcet.applicabilityRule;
    delete stepObjcet.rule;
    delete stepObjcet.alarm;
    delete stepObjcet.numberedChildren;
    delete stepObjcet.Security;
  }
  steptypeReuseCode() {
    this.cbpService.selectedElement.requiresIV = false;
    this.cbpService.selectedElement.requiresCV = false;
    this.cbpService.selectedElement.requiresQA = false;
    this.cbpService.selectedElement.requiresPC = false;
    this.cbpService.selectedElement.holdPointStart = false;
    this.cbpService.selectedElement.holdPointEnd = false;
    this.cbpService.selectedElement.numberedChildren = true;
    this.cbpService.selectedElement.componentInformation = [];
    this.cbpService.selectedElement.criticalLocation = '';
    this.cbpService.selectedElement.action = this.cbpService.selectedElement.title ? this.cbpService.selectedElement.title : this.cbpService.selectedElement.action;
    delete this.cbpService.selectedElement.title;
    delete this.cbpService.selectedElement.acknowledgementReqd;
    this.viewUpdateTrack();
  }
  steptypeReuseCodeBack(stepObject: any) {
    stepObject.requiresIV = false;
    stepObject.requiresCV = false;
    stepObject.requiresQA = false;
    stepObject.requiresPC = false;
    stepObject.holdPointStart = false;
    stepObject.holdPointEnd = false;
    stepObject.numberedChildren = true;
    stepObject.componentInformation = [];
    stepObject.criticalLocation = '';
    stepObject.action = stepObject.title ? stepObject.title : stepObject.action;
    delete stepObject.title;
    delete stepObject.acknowledgementReqd;
    this.viewUpdateTrack();
  }
  stepsReuseCode() {
    delete this.cbpService.selectedElement.requiresIV;
    delete this.cbpService.selectedElement.requiresCV;
    delete this.cbpService.selectedElement.requiresQA;
    delete this.cbpService.selectedElement.requiresPC;
    delete this.cbpService.selectedElement.holdPointStart;
    delete this.cbpService.selectedElement.holdPointEnd;
    delete this.cbpService.selectedElement.numberedSubSteps;
    delete this.cbpService.selectedElement.criticalLocation;
    delete this.cbpService.selectedElement.isCritical;
    delete this.cbpService.selectedElement.componentInformation;
    this.cbpService.selectedElement.title = this.cbpService.selectedElement.action ? this.cbpService.selectedElement.action : this.cbpService.selectedElement.title;
    delete this.cbpService.selectedElement.action;
    this.viewUpdateTrack();
  }
  stepsReuseCodeBack(stepObjcet: any) {
    delete stepObjcet.requiresIV;
    delete stepObjcet.requiresCV;
    delete stepObjcet.requiresQA;
    delete stepObjcet.requiresPC;
    delete stepObjcet.holdPointStart;
    delete stepObjcet.holdPointEnd;
    delete stepObjcet.numberedSubSteps;
    delete stepObjcet.criticalLocation;
    delete stepObjcet.isCritical;
    delete stepObjcet.componentInformation;
    stepObjcet.title = stepObjcet.action ? stepObjcet.action : stepObjcet.title;
    delete stepObjcet.action;
    this.viewUpdateTrack();
  }
  getSectionInfo(children: any) {
    const isvalidSection = children.filter((res: { dgType: DgTypes; }) => res.dgType === DgTypes.Section);
    return isvalidSection.length > 0 ? true : false;
  }
getChildernInfo(children: any) {
    const isvalidSectionAction = children.filter((res: { dgType: DgTypes; }) => (res.dgType === DgTypes.TextAreaDataEntry) || (res.dgType === DgTypes.TextDataEntry)
      || (res.dgType === DgTypes.NumericDataEntry) || (res.dgType === DgTypes.DateDataEntry) || (res.dgType === DgTypes.BooleanDataEntry)
      || (res.dgType === DgTypes.CheckboxDataEntry) || (res.dgType === DgTypes.DropDataEntry)
      || (res.dgType === DgTypes.VerificationDataEntry) || (res.dgType === DgTypes.SignatureDataEntry) || (res.dgType === DgTypes.InitialDataEntry));
    return isvalidSectionAction.length > 0 ? true : false;
  }
  getStepSectionTypeChanges(object: any) {
    if (this.cbpService.selectedElement.dgType === DgTypes.Section && this.getSectionInfo(object)) {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotPerfomSection);
      setTimeout(() => {
        this.cbpService.selectedDgType = DgTypes.Section;
        this.cbpService.selectedElement.selectedDgType = DgTypes.Section;
      }, 3);
      return false;
    } else if (this.cbpService.selectedElement.dgType === DgTypes.Section && !this.getSectionInfo(object)) {
      this.stepActionStructure();
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.StepAction && this.getChildernInfo(object)) {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.stepDataEntry);
      setTimeout(() => {
        this.cbpService.selectedDgType = DgTypes.StepAction;
        this.cbpService.selectedElement.selectedDgType = DgTypes.StepAction;
      }, 3);
    } else {
      this.sectionStructure();
    }
  }
  getStepSectionTypeChangesBack(selectElement: any, backObject: any) {
    if (selectElement.dgType === DgTypes.Section && this.getSectionInfo(backObject)) {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotPerfomStepaction);
      setTimeout(() => {
        this.cbpService.selectedDgType = DgTypes.Section;
      }, 3);
      return false;
    } else if (selectElement.dgType === DgTypes.Section && !this.getSectionInfo(backObject)) {
      this.stepActionStructureBack(selectElement);
    }
    else if (selectElement.dgType === DgTypes.StepAction && this.getChildernInfo(backObject)) {
      this.showErrorMsg(DgTypes.Warning, AlertMessages.stepDataEntry);
      setTimeout(() => {
        this.cbpService.selectedDgType = DgTypes.StepAction;
      }, 3);
    } else {
      this.sectionSubStructureBack(selectElement);
    }
  }
  changeSubType(type: any) {
    this.primaryCodeSubType(type);
  }
  primaryCodeSubType(type: any) {
    if (this.cbpService.selectedElement !== undefined) {
      if (this.cbpService.selectedElement.parentID && this.cbpService.selectedElement.dgType === DgTypes.StepAction) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
        if (element.dgType === DgTypes.Timed) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.Timed;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        }
        if (element.dgType === DgTypes.DelayStep) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.DelayStep;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        }
        if (element.dgType === DgTypes.StepAction) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.StepAction;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        } else if (element.dgType === DgTypes.Section && this.cbpService.selectedElement.children.length == 0) {
          this.sectionStructure();
        } else if (element.dgType === DgTypes.Section && this.cbpService.selectedElement.children.length > 0) {
          this.getStepSectionTypeChanges(this.cbpService.selectedElement.children);
        }
      } else if (this.cbpService.selectedElement.parentID && this.cbpService.selectedElement.dgType === DgTypes.Section) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
        if (element.dgType === DgTypes.Section && this.cbpService.selectedElement.children.length == 0) {
          this.stepActionStructure();
        } else if (element.dgType === DgTypes.Section && this.cbpService.selectedElement.children.length > 0) {
          this.getStepSectionTypeChanges(this.cbpService.selectedElement.children);
        }
      }
      if (this.auditService.currentMode == AuditModes.AUDIT)
        this.createAuditEntry(AuditTypes.PROPERTY_TYPE, { propName: 'dgType' });
    }
  }
  codeSubTypeForBack() {
    let stepBack = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpService.backgroundJson.section);
    if (stepBack !== undefined) {
      if (stepBack.parentID && stepBack.dgType === DgTypes.StepAction) {
        const element = this._buildUtil.getElementByNumber(stepBack.parentID, this.cbpService.backgroundJson.section);
        if (element.dgType === DgTypes.Timed) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.Timed;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        }
        if (element.dgType === DgTypes.DelayStep) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.DelayStep;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        }
        if (element.dgType === DgTypes.StepAction) {
          setTimeout(() => {
            this.cbpService.selectedDgType = DgTypes.StepAction;
          }, 3);
          this.showErrorMsg(DgTypes.Warning, AlertMessages.convertSectionDataEntry);
        } else if (element.dgType === DgTypes.Section && stepBack.children.length == 0) {
          this.sectionSubStructureBack(stepBack);
        } else if (element.dgType === DgTypes.Section && stepBack.children.length > 0) {
          this.getStepSectionTypeChangesBack(stepBack, stepBack.children);
        }
      }
      else if (stepBack.parentID && stepBack.dgType === DgTypes.Section) {
        const element = this._buildUtil.getElementByNumber(stepBack.parentID, this.cbpService.backgroundJson.section);
        if (element.dgType === DgTypes.Section && stepBack.children.length == 0) {
          this.stepActionStructureBack(stepBack);
        } else if (element.dgType === DgTypes.Section && stepBack.children.length > 0) {
          this.getStepSectionTypeChangesBack(stepBack, stepBack.children);
        }
      }
      if (this.auditService.currentMode == AuditModes.AUDIT)
        this.createAuditEntry(AuditTypes.PROPERTY_TYPE, { propName: 'dgType' });
    }
  }
  setpInfoValidations() {
    this.cbpService.selectedElement.dgType = DgTypes.StepInfo;
    this.cbpService.selectedElement.stepType = DgTypes.StepInfo;
    delete this.cbpService.selectedElement.allowedtoStop;
    delete this.cbpService.selectedElement.dealyTime;
    this.cbpService.selectedElement.acknowledgementReqd = false;
    this.stepInfoStructure();
  }
  stepInfoValidationsBack(stepObject: any) {
    stepObject.dgType = DgTypes.StepInfo;
    stepObject.stepType = DgTypes.StepInfo;
    delete stepObject.allowedtoStop;
    delete stepObject.dealyTime;
    stepObject.acknowledgementReqd = false;
    this.stepInfoStrucBack(stepObject);
  }
  delayStepValidations() {
    this.cbpService.selectedElement.dgType = DgTypes.DelayStep;
    this.cbpService.selectedElement.stepType = DgTypes.DelayStep;
    delete this.cbpService.selectedElement.acknowledgementReqd;
    delete this.cbpService.selectedElement.para;
    this.cbpService.selectedElement.dealyTime = 1;
    this.cbpService.selectedElement.allowedtoStop = false;
    this.stepInfoStructure();
  }
  delayStepValidationsBack(stepObjcet: any) {
    stepObjcet.dgType = DgTypes.DelayStep;
    stepObjcet.stepType = DgTypes.DelayStep;
    delete stepObjcet.acknowledgementReqd;
    delete stepObjcet.para;
    stepObjcet.dealyTime = 1;
    stepObjcet.allowedtoStop = false;
    this.stepInfoStrucBack(stepObjcet);
  }
  onChange(type: any) {
    if (this.cbpService.selectedElement.dgType == 'Timed' && type !== 'Timed') {
      this.cbpService.selectedElement['children'] = this.removeOrAddTimedStepParentVar(this.cbpService.selectedElement?.children, 'delete', 'isParentTimedStep');
    }
    if (this.cbpService.selectedElement.dgType == 'Repeat' && type !== 'Repeat') {
      this.cbpService.selectedElement['children'] = this.removeOrAddTimedStepParentVar(this.cbpService.selectedElement?.children, 'delete', 'isParentRepeatStep');
    }
    if (type == 'Timed' || type == 'Repeat') {
      let itsContain = this.hasTimedOrDelayOrRepeatStepsInChildren(this.cbpService.selectedElement?.children);
      if (itsContain) {
        this.cbpService.selectedElement.stepType = this.oldValue;
        this.showErrorMsg(DgTypes.Warning, `${"Invalid Conversion:" + `${this.cbpService.selectedElement.stepType}` + " step contains Delay, Timed, or Repeat steps."}`);
        return;
      }
      let key = type == 'Timed' ? 'isParentTimedStep' : 'isParentRepeatStep';
      this.cbpService.selectedElement['children'] = this.removeOrAddTimedStepParentVar(this.cbpService.selectedElement?.children, 'add', key);
    }
    this.cbpService.selectedElement.stepType = type;
    this.oldValue = type;
    if (this.oldValue === 'Repeat' || this.oldValue === 'Timed') {
      this.storeOld = this.oldValue;
    }
    if (type === 'DualStepAlignment' || type === 'DualStepFreeForm') {
      this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.parentDgUniqueID, this.cbpService.cbpJson.section);
      this.cbpService.selectedElement.stepType = type;
      this.cbpService.selectedElement['dualStepType'] = type;
      if (this.cbpService.selectedElement.dgType === DgTypes.DualAction) {
        this.cbpService.selectedElement.rightDualChildren[0]['stepType'] = type;
        this.cbpService.selectedElement.children[0]['stepType'] = type;
      }
      if (type === 'DualStepAlignment') {
        let obj1 = JSON.parse(JSON.stringify(this.cbpService.selectedElement.children[0]));
        let obj2 = JSON.parse(JSON.stringify(this.cbpService.selectedElement.rightDualChildren[0]));

        if (JSON.stringify(obj1) != JSON.stringify(obj2)) {
          for (let i = 0; i < obj2.children.length; i++) {
            let objchild = JSON.parse(JSON.stringify(obj2.children[i]));
            objchild.dgUniqueID = this._buildUtil.getUniqueIdIndex();
            this.cbpService.selectedElement.children[0].children.push(objchild);
          }
          for (let i = 0; i < obj1.children.length; i++) {
            let objrightchild = JSON.parse(JSON.stringify(obj1.children[i]));
            objrightchild.dgUniqueID = this._buildUtil.getUniqueIdIndex();
            this.cbpService.selectedElement.rightDualChildren[0].children.push(objrightchild);
          }
        }
      }
      // this.setDualStepType(this.cbpService.selectedElement.children, this.cbpService.selectedElement.rightDualChildren, type);
      // this.cdr.detectChanges();
    }
    if (type === 'Simple Action') {
      this.cbpService.selectedElement.dgType = DgTypes.StepAction;
      this.cbpService.selectedElement.stepType = 'Simple Action';
      delete this.cbpService.selectedElement.timeInMinutes;
      delete this.cbpService.selectedElement.repeatTimes;
      this.stepInfotoStepStructure();
    } else if (type === DgTypes.Timed) {
      this.cbpService.selectedElement.dgType = DgTypes.Timed;
      this.cbpService.selectedElement.stepType = DgTypes.Timed;
      this.cbpService.selectedElement.timeInMinutes = 1;
      delete this.cbpService.selectedElement.repeatTimes;
      this.stepInfotoStepStructure();
    } else if (type === DgTypes.Repeat) {
      this.cbpService.selectedElement.dgType = DgTypes.Repeat;
      this.cbpService.selectedElement.stepType = DgTypes.Repeat;
      this.cbpService.selectedElement.repeatTimes = 1;
      delete this.cbpService.selectedElement.timeInMinutes;
      this.stepInfotoStepStructure();
    } else if (type === DgTypes.StepInfo) {
      if (this.cbpService.selectedElement.children.length === 0) {
        this.setpInfoValidations();
      } else if (this.cbpService.selectedElement.children.length > 0) {
        let isInValid = this.cbpService.selectedElement.children.filter((item: any) => (this.controlService.isMessageField(item.dgType)
          || this.controlService.isDataEntry(item)));
        if (isInValid?.length == 1) {
          if (isInValid[0].dgType === DgTypes.Table && isInValid[0]?.referenceOnly) {
            isInValid.length = 0;
          }
        }
        if (isInValid.length == 0) {
          this.cbpService.selectedElement.children.forEach((result: { dgType: DgTypes; }) => {
            if (result.dgType === DgTypes.LabelDataEntry || result.dgType === DgTypes.Para || result.dgType === DgTypes.Table) {
              this.setpInfoValidations();
            } else {
              this.setOnChangeValues(type);
            }
          });
        } else {
          this.setOnChangeValues(type);
        }
      }
    } else if (type === DgTypes.DelayStep) {
      if (this.cbpService.selectedElement.children.length === 0) {
        this.delayStepValidations();
      } else if (this.cbpService.selectedElement.children.length > 0) {
        let isInValid = this.cbpService.selectedElement.children.filter((item: any) => (this.controlService.isMessageField(item.dgType) || this.controlService.isDataEntry(item)));
        if (isInValid.length == 0) {
          this.cbpService.selectedElement.children.forEach((result: { dgType: DgTypes; }) => {
            if (result.dgType === DgTypes.LabelDataEntry || result.dgType === DgTypes.Para) {
              this.delayStepValidations();
            } else {
              if (this.cbpService.selectedElement.dgType === DgTypes.StepAction) {
                this.cbpService.selectedElement.stepType = 'Simple Action';
                this.cbpService.selectedElement.dgType === DgTypes.StepAction;
                this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
              }
              else if (this.cbpService.selectedElement.dgType === DgTypes.Timed) {
                this.cbpService.selectedElement.stepType = 'Timed';
                this.cbpService.selectedElement.dgType === DgTypes.Timed
                this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
              }
              else if (this.cbpService.selectedElement.dgType === DgTypes.Repeat) {
                this.cbpService.selectedElement.stepType = 'Repeat';
                this.cbpService.selectedElement.dgType === DgTypes.Repeat
                this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
              }
              this.setOnChangeValues(type);
            }
          });
        } else {
          this.setOnChangeValues(type);
        }
      }
    }
    if (this.auditService.currentMode == AuditModes.AUDIT) {
      this.createAuditEntry(AuditTypes.PROPERTY_STEP_TYPE, { propName: 'stepType' });
    }
    if (this.cbpService.backgroundJson?.section) {
      this.codeReuseForBack(type);
    }
    // this.viewUpdateTrack();
    this.refreshTab = false;
    setTimeout(() => {
      this.refreshTab = true;
    }, 10);
  }
  removeOrAddTimedStepParentVar(data: any, type: any, key: string) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty(key) && type == 'delete') {
        delete data[i][key];
      } else {
        data[i][key] = true;
      }
      if (data[i]?.dgType == DgTypes.Form) {
        let castable: any = data[i].calstable[0].table.tgroup.tbody[0].row
        this.updateRepeatStepEntriesForTable(castable, type, key);
      }
      if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        data[i].children = this.removeOrAddTimedStepParentVar(data[i].children, type, key);
      }
    }
    return data;
  }
  updateRepeatStepEntriesForTable(obj: any, type: any, key: string) {
    if (obj && !Array.isArray(obj) && obj?.hasOwnProperty('isTableDataEntry')) {
      if (obj?.hasOwnProperty(key) && type == 'delete') {
        delete obj[key];
      } else {
        obj[key] = true;
      }
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
  hasTimedOrDelayOrRepeatStepsInChildren(data: any): boolean {
    for (let i = 0; i < data.length; i++) {
      const { dgType, children } = data[i];
      if (dgType === DgTypes.Timed || dgType === DgTypes.Repeat || dgType === DgTypes.DelayStep) {
        return true;
      }
      if (Array.isArray(children) && children?.length > 0) {
        if (this.hasTimedOrDelayOrRepeatStepsInChildren(children)) {
          return true;
        }
      }
    }
    return false;
  }
  setOnChangeValues(type: string) {
    if (this.cbpService.selectedElement.dgType === DgTypes.StepAction) {
      this.setDgTypeInfo(DgTypes.StepAction, 'Simple Action');
    } else if (this.cbpService.selectedElement.dgType === DgTypes.Timed) {
      this.setDgTypeInfo(DgTypes.Timed, 'Timed');
    } else if (this.cbpService.selectedElement.dgType === DgTypes.Repeat) {
      this.setDgTypeInfo(DgTypes.Repeat, 'Repeat');
    }
    let typeInf = this.getType(type);
    this.showErrorMsg(DgTypes.Warning, 'Invalid Conversion: Step Cannot be converted to ' + typeInf + ' Step.');
  }
  setDgTypeInfo(dgType: DgTypes, type: string) {
    this.cbpService.selectedElement.stepType = type;
    this.cbpService.selectedElement.dgType = dgType;
  }
  getType(type: string) {
    if (type === 'DelayStep') {
      return 'Delay';
    }
    if (type === 'StepInfo') {
      return 'Information';
    } else {
      return type;
    }
  }

  codeReuseForBack(type: any) {
    let stepBack = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpService.backgroundJson.section);
    stepBack.stepType = type;
    this.oldValue = type;
    if (this.oldValue === 'Repeat' || this.oldValue === 'Timed') {
      this.storeOld = this.oldValue;
    }
    if (type === 'Simple Action') {
      stepBack.dgType = DgTypes.StepAction;
      stepBack.stepType = 'Simple Action';
      delete stepBack.timeInMinutes;
      delete stepBack.repeatTimes;
      this.stepInfoStepStructureBack(stepBack);
    } else if (type === DgTypes.Timed) {
      stepBack.dgType = DgTypes.Timed;
      stepBack.stepType = DgTypes.Timed;
      stepBack.timeInMinutes = 1;
      delete stepBack.repeatTimes;
      this.stepInfoStepStructureBack(stepBack);
    } else if (type === DgTypes.Repeat) {
      stepBack.dgType = DgTypes.Repeat;
      stepBack.stepType = DgTypes.Repeat;
      stepBack.repeatTimes = 1;
      delete stepBack.timeInMinutes;
      this.stepInfoStepStructureBack(stepBack);
    } else if (type === DgTypes.StepInfo) {
      if (stepBack.children.length === 0) {
        this.stepInfoValidationsBack(stepBack);
      } else if (stepBack.children.length > 0) {
        stepBack.children.forEach((result: { dgType: DgTypes; }) => {
          if (result.dgType === DgTypes.LabelDataEntry || result.dgType === DgTypes.Para) {
            this.stepInfoValidationsBack(stepBack);
          } else {
            if (stepBack.dgType === DgTypes.StepAction) {
              stepBack.stepType = !this.storeOld ? 'Simple Action' : this.storeOld;
              stepBack.dgType = DgTypes.StepAction;
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotConvertInfo);
            } else if (stepBack.dgType === DgTypes.Timed) {
              stepBack.stepType = this.storeOld;
              stepBack.dgType = DgTypes.Timed
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotConvertInfo);
            } else if (stepBack.dgType === DgTypes.Repeat) {
              stepBack.stepType = this.storeOld;
              stepBack.dgType = DgTypes.Repeat
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotConvertInfo);
            }
          }
        });
      }
    } else if (type === DgTypes.DelayStep) {
      if (stepBack.children.length === 0) {
        this.delayStepValidationsBack(stepBack);
      } else if (stepBack.children.length > 0) {
        stepBack.children.forEach((result: { dgType: DgTypes; }) => {
          if (result.dgType === DgTypes.LabelDataEntry || result.dgType === DgTypes.Para) {
            this.delayStepValidationsBack(stepBack);
          } else {
            if (stepBack.dgType === DgTypes.StepAction) {
              stepBack.stepType = !this.storeOld ? 'Simple Action' : this.storeOld;
              stepBack.dgType === DgTypes.StepAction;
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
            } else if (stepBack.dgType === DgTypes.Timed) {
              stepBack.stepType = this.storeOld;
              stepBack.dgType === DgTypes.Timed
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
            } else if (stepBack.dgType === DgTypes.Repeat) {
              stepBack.stepType = this.storeOld;
              stepBack.dgType === DgTypes.Repeat
              this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotDelayStep);
            }
          }
        });
      }
    }
    if (this.auditService.currentMode == AuditModes.AUDIT) {
      this.createAuditEntry(AuditTypes.PROPERTY_STEP_TYPE, { propName: 'stepType' });
    }
    this.viewUpdateTrack();
  }
  changeType() {
    const parent = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    if (parent.dgType === DgTypes.StepAction) {
      if (this.cbpService.selectedElement.dgType === DgTypes.Section) {
        this.cbpService.selectedElement.dgType = DgTypes.StepInfo;
        return;
      }
    }
    if (this.cbpService.selectedElement.dgType === DgTypes.StepAction) {
      const step = this._buildUtil.build(new StepAction(), this.cbpService.selectedElement.number, this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.dgSequenceNumber,
        this.cbpService.selectedElement.parentID);
      step.action = this.cbpService.selectedElement.title;
      step.text = this.cbpService.selectedElement.text;
      const index = parent.children.findIndex((i: { dgUniqueID: any; }) => i.dgUniqueID === this.cbpService.selectedElement.dgUniqueID);
      step.children = this.cbpService.selectedElement.para;
      parent.children[index] = step;
      this.cbpService.selectedElement = step;
    }
    if (this.cbpService.selectedElement.dgType === DgTypes.Section) {
      this.cbpService.selectedElement.children = JSON.parse(JSON.stringify(this.cbpService.selectedElement.para));
      this.cbpService.selectedElement.para = [];
    }
    this.viewUpdateTrack();
  }

  setDualStepType(children: any, rigthDualChildren: any, type: string) {
    this.dualStepTypeChange(children, type, 'left');
    this.dualStepTypeChange(rigthDualChildren, type, 'right');
  }

  dualStepTypeChange(object: any, dualForm: string, type: string) {
    for (let i = 0; i < object.length; i++) {
      if (object[i]['dualStepType']) {
        object[i]['dualStepType'] = dualForm;
        if (dualForm === 'DualStepAlignment') {
          let element = this._buildUtil.getElementByNumber(object[i].number, this.cbpService.cbpJson.section);
          if (element?.length == 1 || !Array.isArray(element)) {
            let newSteps = this._buildUtil.getElementByNumber(object[i].parentID, this.cbpService.cbpJson.section);
            if (newSteps?.length === 2) {
              if (type === 'left') {
                let obj = JSON.parse(JSON.stringify(newSteps[0].children[0]));
                obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
                newSteps[1].children.push(obj);
              } else {
                let obj = JSON.parse(JSON.stringify(newSteps[1].children[0]));
                obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
                newSteps[0].children.push(obj);
              }
            }
            if (newSteps?.length === 3) {
              if (type === 'left') {
                let obj = JSON.parse(JSON.stringify(newSteps[1].children[0]));
                obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
                newSteps[2].children.push(obj);
              } else {
                let obj = JSON.parse(JSON.stringify(newSteps[2].children[0]));
                obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
                newSteps[1].children.push(obj);
              }
            }
          }
        }
      }
      if (object[i]?.children?.length > 0) {
        this.dualStepTypeChange(object[i]?.children, dualForm, type);
      }
    }
  }
  getHeaderAndFooter(type: any) {
    if (type === 'header') { this.cbpService.cbpJson.documentInfo[0].header.title = this.headerValue; } else {
      this.cbpService.cbpJson.documentInfo[0].footer.title = this.footerValue;
    }
  }
  setWaterMark(selectedElement: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.watermarkApplied = true;
    this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.backgroundRepeat = 'no-repeat';
    this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text = this.cbpService.waterMarkValue;
    this.cbpService.propertyDocument = this.cbpService.cbpJson.documentInfo[0];
    this.updateOptions({ text: this.cbpService.waterMarkValue });
    this.createAuditEntry(auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.waterMarkValue));
  }
  clearWaterMark() {
    this.watermarkApplied = true;
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = new waterMarkOptions();
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'] = true;
    this.cbpService.waterMarkValue = '';
    // this.updateOptions(new waterMarkOptions());(commented becaus it is removing the Watermark from index)
    this.cbpService.selectedUniqueId = -3;
    this.documentSelected = false;
    this.cbpService.documentSelected = false;
    this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text = '';
    this.cbpService['selectedElement'] = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'];
    this.controlService.setSelectItem(this.cbpService['selectedElement']);
    this.cdr.detectChanges();
  }
  waterMarkDelete() {
    this.watermarkApplied = false;
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'] =
      !this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'];
    if (!this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled']) {
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = new waterMarkOptions();
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'] = false;
      this.cbpService.waterMarkValue = '';
      this.cbpService['selectedElement'] = this.cbpService.cbpJson.section[0];
      this.cdr.detectChanges();
    }
  }
  private updateOptions(_obj: any) {
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = Object.assign({},
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'], _obj);
  }
  callStepSectionInfo() {
    this.tempsectionnumbers = [];
    this.tempMapNumberAndUniqueid = new Map();
    this.getStepSectionNumbers(this.cbpService.cbpJson.section);
  }
  getStepSectionNumbers(object: any) {
    if (object !== undefined) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section || object[i].dgType === DgTypes.StepInfo
          || object[i].dgType === DgTypes.Timed
          || object[i].dgType === DgTypes.DelayStep || object[i].dgType === DgTypes.Repeat) {
          this.tempsectionnumbers.push({
            number: object[i].dgSequenceNumber,
            dgUniqueID: object[i].dgUniqueID, title: object[i].title, text: object[i].text
          });
          this.tempMapNumberAndUniqueid.set(object[i].dgSequenceNumber, object[i].dgUniqueID);
        }
        if (object[i].dgType === DgTypes.StepAction) {
          this.tempsectionnumbers.push({
            number: object[i].dgSequenceNumber,
            dgUniqueID: object[i].dgUniqueID, title: object[i].action, text: object[i].text
          });
          this.tempMapNumberAndUniqueid.set(object[i].dgSequenceNumber, object[i].dgUniqueID);
        }
        if (object[i].children) {
          this.getStepSectionNumbers(object[i].children);
        }
      }
    }
  }
  sectionId(item: any) {
    this.selectedLinkItem = item;
    const selected = this.tempsectionnumbers.filter(it => it.number === item);
    this.cbpService.selectedElement.sectiondgUniqueId = selected[0].dgUniqueID;
    this.cbpService.selectedElement.sectionNumber = item;
  }
  setOrUnSetIcon() {
    this.viewUpdateTrack();
    this.cbpService.selectedElement = this._buildUtil.setIconAndText(this.cbpService.selectedElement);
    this.setOrUnSetNodeIcon.emit(this.cbpService.selectedElement);
    this.createAuditEntry(AuditTypes.PROPERTY_IS_CRITICAL, { propName: 'isCritical' });
  }

  getSequenceType(): SequenceTypes {
    return this._buildUtil.getSequenceType(this.cbpService.selectedElement);
  }
  checkNameExistOrnot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.selectedElement.dgUniqueID);
    if (this.cbpService.selectedElement.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.selectedElement.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.selectedElement.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Data Field already exist at Step' + stepNumber.parentID);
        return;
      } else {
        this.cbpService.selectedElement.fieldNameUpdated = true;
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }
  updateLink() {
    this.cbpService.isViewUpdated = true;
  }
  updateLinkRequired() {
    this.cbpService.isViewUpdated = true;
    this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
    this.controlService.setSelectItem(this.cbpService.selectedElement);
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  onFocusEventTable() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
  }
  enableLabel(event: any) {
    this.cbpService.tableDataEntrySelected.labelSide = event.target.checked ? 'left' : 'right';

  }
  checkMaxValue(val: any) {
    if (val.maximum != null && val.minimum == null) {
      this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Minimum value');
    }
    // if (val.maximum == null && val.minimum != null) {
    // this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Maximum value');
    // }
    if (val.maximum != null && val.minimum != null) {
      if (val.maximum == 0 && val.minimum == 1) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
      }
      else if ((val.maximum) < (val.minimum)) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
      }
    }
    if (val.minimum && val.defaultValue) {
      if (val.defaultValue >= val.minimum) {
      } else {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Defalut Value should be greater than or equal to minimum');
      }
    }
    if (val.maximum && val.defaultValue) {
      if (val.defaultValue <= val.maximum) {
      } else {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Defalut Value should be less than or equal to maximum');
      }
    }
  }
  unitValue(val: any) {
    if (val.unitsRequired === true && !val.units) {
      this.updateLink();
      this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Unit value');
      return false;
    }
  }
  decimalValid(value: any) {
    if (!value.decimal) {
      value.defaultValue = Math.floor(value.defaultValue);
    }
  }
  checkMaxDate(val: any) {
    if (val.isTimeDisplayOpen === true || val.isDateDisplayOpen === true) {
      const minDate = val.minimum;
      const maxDate = val.maximum;
      if (val.maximum === '' || val.minimum === '') {
        this.showDateOnCondition = false;
        setTimeout(() => { this.showDateOnCondition = true; }, 10);
        return;
      } else {
        if (val.minimum !== '') {
          this.createAuditEntry(AuditTypes.PROPERTY_MIN, { propName: 'minimum' });

        }
        else if (val.maximum !== '') {
          if (minDate > maxDate) {
            this.showErrorMsg(DgTypes.ErrorMsg, 'Max date should be greater than Min date');
            this.createAuditEntry(AuditTypes.PROPERTY_MAX, { propName: 'maximum' })
            return;
          }
        }
      }
    }

  }
  showDate() {
    this.showDateOnCondition = false;
    setTimeout(() => { this.showDateOnCondition = true; }, 10);
    this.updateLinkRequired();
  }
  changeDerivedType() {
    if (this.cbpService.selectedElement.valueType === 'Derived') {
      this.cbpService.selectedElement.unitsRequired = false;
      this.cbpService.selectedElement.required = false;
    }
  }
  valueTypeRequired(value: any) {
    if (value === 'Derived') {
      if (this.cbpService.tableDataEntrySelected) {
        this.cbpService.tableDataEntrySelected.required = false;
      } else {
        this.cbpService.selectedElement.required = false;
      }
    }
  }
  updateCheckBox(type: any, isTable: any) {
    if (isTable) {
      this.cbpService.tableDataEntrySelected.selected = (type == 'Selected') ? true : false;
      this.tablePropertyCreateAuditEntry(AuditTypes.PROPERTY_TABLE_CHECK_VALUE, { propName: 'valueType' });
    } else {
      this.cbpService.selectedElement.selected = (type == 'Selected') ? true : false;
      this.createAuditEntry(AuditTypes.PROPERTY_CHECK_VALUE, { propName: 'valueType' });
    }
    this.updateLink();
  }
  storeFieldName(name: any) {
    this.tableService.selectedFieldName = name;
  }
  checkBoxAuditv2(event: any) {
    this.cbpService.selectedElement[event.optionalParams.propName] = event?.event?.target?.checked;
    this.viewUpdateTrack();
    this.createAuditEntry(event.auditType, event.optionalParams)
  }
  //AUDIT RELATED

  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.viewUpdateTrack();
    this.createAuditEntry(auditType, optionalParams)
  }
  checkBoxTableAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.tableDataEntrySelected[optionalParams.propName] = event.event.target.checked;
    //  this.updateLink();
    this.updateLinkRequired();
    this.tablePropertyCreateAuditEntry(auditType, optionalParams);
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    // this.viewUpdateTrack();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  tablePropertyCreateAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.updateLink();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
  }

  postProcessUndo(audit: Audit) {
    if (audit !== undefined && audit) {
      if (audit.AuditType === AuditTypes.PROPERTY_TYPE) {
        this.changeSubType(audit.OldText);
      } else if (audit.AuditType === AuditTypes.PROPERTY_STEP_TYPE) {
        this.onChange(audit.OldText);
      }
      else if (audit.AuditType === AuditTypes.PROPERTY_DGTYPE) {
        this.changeEntryType(audit.OldText);
      }
      else if (audit.AuditType === AuditTypes.PROPERTY_TABLE_DGTYPE) {
        this.changeTableEntryType(audit.OldText, audit);
      }
      else if (audit.AuditType === AuditTypes.TABLE_DELETE_HEADER) {
        //  this.restoreHeader(audit);
      }
      else if (audit.AuditType === AuditTypes.TABLE_DELETE_FOOTER) {
        //  this.restoreFooter(audit);
      }
      else if (audit.headerTab && audit.AuditType === AuditTypes.TABLE) {
        this.headerTableDelete();
      }
      else if (audit.AuditType === AuditTypes.TABLE_ENTRY_HEADER_ADD) {
        this.removeHeaderChildData();
      }
      else if (audit.AuditType === AuditTypes.TABLE_ENTRY_FOOTER_ADD) {
        this.removeFooterChildData();
      }
    }
  }
  restoreHeader(audit: any) {
    let element = this.auditService.elementsRestoreHeader[this.auditService.elementsRestoreHeader.length - 1];
    if (element) {
      this.cbpService.cbpJson.documentInfo[0].header.children.push(element);
      this.cbpService.selectedElement = element ? element : this.cbpService.selectedElement.children.slice(-1)[0];
      this.controlService.setSelectItem(this.cbpService.selectedElement);
      this.auditService.elementsRestoreHeader = [];
    }
  }
  restoreFooter(audit: any) {
    let element = this.auditService.elementsRestoreHeader[this.auditService.elementsRestoreHeader.length - 1];
    if (element) {
      this.cbpService.cbpJson.documentInfo[0].footer.children.push(element);
      this.cbpService.selectedElement = element ? element : this.cbpService.selectedElement.children.slice(-1)[0];
      this.controlService.setSelectItem(this.cbpService.selectedElement);
      this.auditService.elementsRestoreHeader = [];
    }
  }
  modifyDependency(array: any) {
    let modifiedArray: any[] = [];
    array.forEach((item: any) => {
      modifiedArray.push(item.number);
    });
    return modifiedArray.toString();
  }
  checkTableNameExistOrnot() {
    if (!this.tableService.checkTableNameExistOrnot()) {
      this.createAuditEntry(AuditTypes.TABLE_NAME, { propName: 'tableName' });
    }
  }
  fieldNameExistOrNot(fieldName: any) {
    if (!this.tableService.fieldNameExistOrNot(fieldName)) {
      this.createAuditEntry(AuditTypes.TABLE_FIELD_NAME, {
        propName: 'fieldName', row: this.tableService.tableRowPosition, column: this.tableService.tableColumnPosition,
        OldText: this.tableService.selectedFieldName, NewText: this.tableService.columntableProperty.fieldName
      });
    }
  }
  setCheckBoxSide(type: any) {
    this.cbpService.tableDataEntrySelected.checkboxSide = type;
    this.updateLinkRequired();

  }
  setDynamicSection(event: any, e: number) {
    this.cbpService.selectedElement.dynamic_section = event.target.checked ? true : false;
    this.cbpService.selectedElement.hide_section = false;
    this.cbpService.selectedElement.dynamic_number = 1;
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    // write logic to set dynamic sections
    this.protectStepSectionChildren(this.cbpService.selectedElement?.children, event.target.checked);
    this.protectParentSteps(this.cbpService.selectedElement.parentID, event.target.checked);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  setDynamicHideSection(event: any, e: number) {
    this.cbpService.selectedElement.hide_section = event.target.checked ? true : false;
    this.cbpService.selectedElement.dynamic_number = event.target.checked ? 0 : 1;
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
  }
  protectStepSectionChildren(steps: any, bol: boolean) {
    for (let i = 0; i < steps.length; i++) {
      if (this.controlService.checkStepSection(steps[i])) {
        steps[i]['protectDynamic'] = bol;
        steps[i]['dynamic_section'] = false;
      }
      if (steps[i].children && steps[i].children.length > 0) {
        this.protectStepSectionChildren(steps[i].children, bol);
      }
    }
  }
  protectParentSteps(parentID: string, bol: boolean) {
    if (parentID) {
      const step = this._buildUtil.getElementByNumber(parentID, this.cbpService.cbpJson);
      step.dynamic_section = false;
      if (!bol) {
        let findSteps = step.children.filter((st: any) => st?.dynamic_section);
        step['protectDynamic'] = findSteps?.length > 0 ? true : false;
        this.protectParentSteps(step?.parentID, bol);
      } else {
        step['protectDynamic'] = bol;
        this.protectParentSteps(step.parentID, bol);
      }
    }
  }
  tablefieldNameExistOrNot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.tableDataEntrySelected.dgUniqueID);
    if (this.cbpService.tableDataEntrySelected.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.tableDataEntrySelected.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.tableDataEntrySelected.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Table Data Field already exist at Step' + stepNumber.parentID);
        this.cbpService.tableDataEntrySelected.fieldName = res;
        return;
      } else {
        this.cbpService.fieldsMaps.set(this.cbpService.tableDataEntrySelected.dgUniqueID, this.cbpService.tableDataEntrySelected.fieldName);
      }
    }
  }
  changeEntryType(type: string | undefined) {
    this.cbpService.selectedElement.dgType = type;
    if (this.cbpService.selectedElement !== undefined) {
      if (this.cbpService.selectedElement.parentID || this.cbpService.selectedElement.dgType === DgTypes.TextDataEntry || this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry || this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
        if (element.dgType === DgTypes.StepAction) {
          this.dataEntrySturcture();
        }
      }
    }
  }
  dataEntrySturcture() {
    this.EntryReuseCode();
    if (this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.NumericDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.NumericDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.TextAreaDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.TextAreaDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.TextDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.TextDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.TextDataEntry + (++this.cbpService.dataFieldNumber);
      this.cbpService.selectedElement.valueType = 'Entered';
    }
  }
  EntryReuseCode() {
    if (this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry) {
      delete this.cbpService.selectedElement.valueType;
      delete this.cbpService.selectedElement.fieldName;
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
      delete this.cbpService.selectedElement.fieldName;
    }
  }
  changeTableEntryType(type: any, audit?: Audit) {
    this.cbpService.tableDataEntrySelected.dgType = type;
    if (this.cbpService.tableDataEntrySelected !== undefined) {
      if (this.cbpService.tableDataEntrySelected.parentID || this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextDataEntry || this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry || this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.tableDataEntrySelected.parentID, this.cbpService.cbpJson.section);
        if (element?.dgType === DgTypes.StepAction || element?.dgType === DgTypes.Section) {
          this.dataTableEntrySturcture(audit)
        }
      }
    }
  }
  headerTableDelete() {
    if (this.tableService.selectedTable['header']) {
      this.cbpService.cbpJson.documentInfo[0].header.children = [];
      this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].header;
      this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].header;
    } else if (this.tableService.selectedTable['footer']) {
      this.cbpService.cbpJson.documentInfo[0].footer.children = [];
      this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].footer;
      this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].footer;
    }
  }
  removeHeaderChildData() {
    if (this.cbpService.tableDataEntrySelected.headerTableItem) {
      let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.documentInfo[0].header.children);
      this.subtableHeaderStep(table, this.cbpService.tableDataEntrySelected);
      this.controlService.setSelectItem(table);
      this.cbpService.tableDataEntrySelected = '';
    }
    // else{
    //   let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.documentInfo[0].footer.children);
    //   this.subtableHeaderStep(table, this.cbpService.tableDataEntrySelected);
    //   this.controlService.setSelectItem(table);
    //   this.cbpService.tableDataEntrySelected = '';
    // }
  }
  removeFooterChildData() {
    if (this.cbpService.tableDataEntrySelected.footerTableItem) {
      let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.documentInfo[0].footer.children);
      this.subtableHeaderStep(table, this.cbpService.tableDataEntrySelected);
      this.controlService.setSelectItem(table);
      this.cbpService.tableDataEntrySelected = '';
    }

  }
  subtableHeaderStep(table: any, tableDataEntrySelected: any) {
    let entryObj, object
    if (table.calstable) {
      let rowdata = table.calstable[0].table.tgroup.tbody[0].row;
      for (let l = 0; l < rowdata.length; l++) {
        entryObj = rowdata[l].entry;
        for (let m = 0; m < entryObj.length; m++) {
          if (entryObj[m]) {
            object = table.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
            object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != tableDataEntrySelected.dgUniqueID);
            for (let k = 0; k < object.children.length; k++) {
              if (object.children[k].dgType === DgTypes.Table) {
                this.subtableHeaderStep(object.children[k], tableDataEntrySelected);
              }
            }
          }
        }
      }
      return object;
    }
  }
  dataTableEntrySturcture(audit: Audit | undefined) {
    this.EntryTableReuseCode();
    if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.NumericDataEntry;
      this.updateLinkRequired();
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.NumericDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.TextAreaDataEntry;
      this.updateLinkRequired();
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.TextAreaDataEntry + (++this.cbpService.dataFieldNumber);
      if (audit !== undefined) {
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.TextDataEntry;
      this.updateLinkRequired()
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.TextDataEntry + (++this.cbpService.dataFieldNumber);
      this.cbpService.tableDataEntrySelected.valueType = 'Entered';
      if (audit !== undefined) {
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
    }
  }
  EntryTableReuseCode() {
    if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry) {
      delete this.cbpService.tableDataEntrySelected.valueType;
      delete this.cbpService.tableDataEntrySelected.fieldName;
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
      delete this.cbpService.tableDataEntrySelected.fieldName;
    }
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }
  closeModal() {
    this.setErrorMesg('', '', false);
    this.cbpSharedService.closeModalPopup('error-modal');
  }
  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  validText(event: { keyCode: any; }) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8);
  }
  inputValidator(event: any) {
    const pattern = /^[a-zA-Z0-9 ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    }
    if (event.target.value.trim() == '') {
      this.watermarkApplied = false;
    }
    if (event.target.value.length > 0) {
      this.watermarkApplied = false;
    }

  }
  configureOpen() {
    this.cbpService.configureDependency = true
    this.cbpService.isViewUpdated = true;
  }

  ngOnDestroy(): void {
    this.auditService.undoAudit.next();
    this.auditService.undoAudit.complete();
    this._subscription.unsubscribe();
    this.setItemSubscription.unsubscribe();
  }

}

