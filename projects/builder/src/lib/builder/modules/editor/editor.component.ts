import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { Actions, AuditTypes } from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';

import { AlertMessages, CbpSharedService, Dependency, DgTypes, ImagePath, SequenceTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { StyleLevel } from '../../models/style-level';
import { ControlService } from '../../services/control.service';
import { LayoutService } from '../../shared/services/layout.service';
import { StylesService } from '../../shared/services/styles.service';
import { TableService } from '../../shared/services/table.service';
import { BuilderUtil } from '../../util/builder-util';
import { HyperLinkService } from '../services/hyper-link.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class EditorComponent implements OnInit {
  @Input() section: any;
  @Input() isMaster = false;
  @Input() media: any = [];
  @Output() headerItem: EventEmitter<any> = new EventEmitter();
  @Output() getResponse: EventEmitter<any> = new EventEmitter();
  @Output() singleFigure: EventEmitter<any> = new EventEmitter();
  @Output() deleteStep: EventEmitter<any> = new EventEmitter();
  @Output() parentUpdate: EventEmitter<any> = new EventEmitter();
  @Output() dataAdded: EventEmitter<any> = new EventEmitter();
  @Output() refreshTree: EventEmitter<any> = new EventEmitter();

  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  AuditTypes: typeof AuditTypes = AuditTypes;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;
  @Input() styleLevelObj!: StyleLevel;
  subScription!: Subscription;
  subScriptionStyle !: Subscription;
  setItemSubscription!: Subscription;
  styleSubscription!: Subscription;
  @Input() dualStepAlign: boolean = false;
  @Input() windowWidth: any;
  showSticky: boolean = false;
  colorPalete: boolean = false;
  isVisible: boolean = false;
  editorStylObj: any;
  constructor(public builderService: BuilderService, public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public notifier: NotifierService, public stylesservice: StylesService, public cdr: ChangeDetectorRef,
    public controlService: ControlService, public auditService: AuditService, public hLService: HyperLinkService,
    public layoutService: LayoutService, public cbpSharedService: CbpSharedService, public tableService: TableService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];
      if (propName === 'styleLevelObj' && change.currentValue && !this.cbpService.isBackGroundDocument) {
        this.styleLevelObj = !change.currentValue ? this.cbpService.styleLevelObj : JSON.parse(JSON.stringify(change.currentValue));
        this.editorStylObj = this.setEditorStyle(this.cbpService.selectedElement);
        this.updateStyleIcons();
      }
    }
  }
  ngOnInit() {
    try {
      if (this.layoutService.indendation == undefined) {
        this.layoutService.applyLayOutChanges(this.cbpService.layOutJson.layout);
        this.cbpService.coverPage = this.layoutService.coverPage[0].coverPage;
      }
      this.cbpService.selectedElement = this.cbpService.selectedElement ?? this.cbpService.cbpJson.section[0];
      if (this.cbpService.selectedElement.dgType === DgTypes.Section ||
        this.cbpService.selectedElement.dgType === DgTypes.StepAction) {
        this.cbpService.selectedElement['children'] = this.cbpService.selectedElement?.children ?? [];
        this.builderService.stepChildren = JSON.parse(JSON.stringify(this.cbpService.selectedElement.children));
      }
      if (this.builderService.stepChildren) {
        this.builderService.selectedItem = this.builderService.stepChildren?.length > 0 ? this.builderService.stepChildren[0] : undefined;
      }
      this.section.forEach((element: any) => {
        element['selectedDgType'] = element['selectedDgType'] ? element['selectedDgType'] : element.dgType?.toString();
        element['usage'] = element['usage'] ? element['usage'] : 'Continuous';
        element['dependency'] = element['dependency'] ? element['dependency'] : 'Default';
        element['configureDependency'] = element['configureDependency'] ? element['configureDependency'] : [];
        element['dependencyChecked'] = element['dependencyChecked'] ? element['dependencyChecked'] : false;
        element['type'] = element['type'] ? element['type'] : element.dgType;
        element['dynamic_number'] = element['dynamic_number'] ? element['dynamic_number'] : 0;
        element['dynamic_section'] = element['dynamic_section'] ? element['dynamic_section'] : false;
        element['hide_section'] = element['hide_section'] ? element['hide_section'] : false;
        element['itemFontSize'] = this.stylesservice.getFontSize(element, this.cbpService.styleModel);
        element['layoutStyle'] = this.layoutService.setLayoutIndendation(element);
        element['iconStyle'] = this.stylesservice.getIconStyles(element, this.cbpService.styleModel);
        if (element.dgType === DgTypes.DualAction) {
          this.dualStepStyles(element);
        }
        const propName = (element.dgType == DgTypes.Section || element.dgType == DgTypes.DelayStep || element.dgType == DgTypes.StepInfo) ? 'title' : 'action';
        this._buildUtil.isHTMLText(element[propName]) ? element['isHtmlText'] = true : delete element['isHtmlText'];
        element = this.cbpService.setCbpUserInfo(element);
        element['componentInformation'] = element['componentInformation'] ? element['componentInformation'] : [];
        if (element?.stepType === 'StepAction') { element.stepType = 'Simple Action'; }
        if (this._buildUtil.uniqueIdIndex < Number(element.dgUniqueID)) {
          this._buildUtil.uniqueIdIndex = Number(element.dgUniqueID);
        }
      });
      this.layoutService.layoutMarginValue = this.getlayoutStyle(this.layoutService.layoutMargin[0]);
    } catch (err) {
      console.error(err);
    }
    this.styleLevelObj = this.cbpService.styleLevelObj;
    this.subScription = this.controlService.layoutupdateValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.layoutService.layoutMarginValue = this.getlayoutStyle(res[0]);
        this.section.forEach((element: any) => {
          element['layoutStyle'] = this.layoutService.setLayoutIndendation(element);
        });
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        if (this.cbpService.sectionHover) {
          this.isVisible = this.checkCount(this.cbpService.selectedElement);
        }
        this.cbpService.setCover();
      }
    })
    this.styleSubscription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        if (!this._buildUtil.cbpStandalone) {
          this.updateChangeBar();
        }
      }
    });
    this.matIconRegistry.addSvgIcon('sub-section-icon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/cbp/images/sub-section-icon.svg'));
    this.matIconRegistry.addSvgIcon('section-icon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/cbp/images/section-icon.svg'));
    this.matIconRegistry.addSvgIcon('pointer-icon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/cbp/images/pointer-icon.svg'));
  }
  setEditorStyle(item: any) {
    let styleObj;

    if (item.level === 0) {
      if (item.dataType !== 'Attachment') {
        styleObj = this.styleLevelObj.level1;
      } else {
        styleObj = this.styleLevelObj.attachment;
      }
    } else if (item.level === 1) {
      if (item?.dgType == DgTypes.Section) {
        styleObj = this.styleLevelObj.level2Section;
      } else {
        styleObj = this.styleLevelObj.level2Step;
      }
    } else if (item.level === 2) {
      if (item?.dgType == DgTypes.Section) {
        styleObj = this.styleLevelObj.level3Section;
      } else {
        styleObj = this.styleLevelObj.level3Step;
      }
    } else if (item.level === 3) {
      if (item?.dgType == DgTypes.Section) {
        styleObj = this.styleLevelObj.level4Section;
      } else {
        styleObj = this.styleLevelObj.level4Step;
      }
    } else if (item.level === 4) {
      if (item?.dgType == DgTypes.Section) {
        styleObj = this.styleLevelObj.level5Section;
      } else {
        styleObj = this.styleLevelObj.level5Step;
      }
    } else {
      styleObj = this.styleLevelObj.levelNormal;
    }
    // styleObj['fontsize'] = this.ValidateFontSize(styleObj['font-size']);
    styleObj['fontfamily'] = styleObj['font-family'];
    return styleObj;
  }
  getlayoutStyle(obj: any) {
    if (obj) {
      return { 'margin-right': obj.margin ? obj.margin + 'px' : '0px', 'margin-left': obj.margin ? obj.margin + 'px' : '0px' };
    }
    return '';
  }
  updateStyleIcons() {
    this.section.forEach((element: any) => {
      element.refresh = true;
      if (element.dgType === DgTypes.DualAction) {
        this.dualStepStyles(element);
      } else {
        element = this.setStylesss(element);
      }
      setTimeout(() => { element.refresh = false; }, 10);
    });
  }

  dualStepStyles(so: any) {
    if (so.rightDualChildren?.length > 0) {
      so.rightDualChildren.forEach((element: any) => { element = this.setStylesss(element); });
    }
    if (so.children?.length > 0) {
      so.children.forEach((element: any) => { element = this.setStylesss(element); });
    }
  }
  setStylesss(element: any) {
    element['iconStyle'] = this.stylesservice.getIconStyles(element, this.cbpService.styleModel);
    element['styleNumber'] = this.stylesservice.getNumberIconStyles(element, this.cbpService.styleModel);
    element['itemFontSize'] = this.stylesservice.getFontSize(element, this.cbpService.styleModel);
    // element['layoutStyle'] = this.layoutService.setLayoutIndendation(element);
    if (this.cbpService.styleChangeBarSession?.length > 0 || this.cbpService.styleHeadings?.length > 0) {
      if (element.dgType === DgTypes.Attachment && this.cbpService.styleChangeBarSession?.includes(DgTypes.Attachment)) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
      if (element.level == 0 && this.cbpService.styleChangeBarSession?.includes('Heading1')) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
      let obj = this.cbpService.styleHeadings.filter(item =>
        item.subLevel == element.level &&
        (item.subName == element.dgType || item.subName.toLowerCase() == element?.properties?.type?.toLowerCase())
      );
      if (obj?.length > 0) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
      if (element?.children && element?.children.length > 0 && this.cbpService.styleChangeBarSession?.includes('Normal')) {
        element.children.forEach((item: any) => {
          if (this.controlService.isDataEntry(item))
            item = this.cbpService.setUserUpdateInfo(item);
        });
      }
    }
    return element;
  }

  _deleteStep() {
    this.deleteStep.emit();
  }

  checkCount(item: any) {
    return this.cbpService.cbpJson.section.length !== 0 && (item === '1.0' || item === 1.0) ? false : true
  }
  changeHeader(node: any) {
    this.updateHeaderTime(node);
    if (this.cbpService.backgroundJson?.section) {
      let element = this._buildUtil.getElementByDgUniqueID(this.cbpService.selectedElement.dgUniqueID, this.cbpService.backgroundJson.section);
      let text = (node.dgType == DgTypes.Section || node.dgType == DgTypes.DelayStep || node.dgType == DgTypes.StepInfo) ? node.title : node.action;
      if (node.dgType == DgTypes.StepAction) {
        element.action = node.action;
        element.text = element.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
      }
      else if (node.dgType == DgTypes.Section || node.dgType == DgTypes.DelayStep || node.dgType == DgTypes.StepInfo) {
        element.title = node.title;
        element.text = element.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
      }
      this.updateHeaderTime(element);
    }
  }

  updateUser(item: any) {
    this.parentUpdate.emit(item);
  }
  onResized(event: any) {
    // console.log(event);
    this.cdr.detectChanges();
  }

  public updateHeaderTime = this.debounceTime((node: any) => {
    let text = (node.dgType == DgTypes.Section || node.dgType == DgTypes.DelayStep || node.dgType == DgTypes.StepInfo) ? node.title : node.action;
    let newText = this._buildUtil.setIconAndText(node);
    let obj = { text: newText.text, number: node.number, dgUniqueId: node.dgUniqueID, dgType: node.dgType };
    this.cbpService.headerItem = obj;
    this.cbpService.stepClicked = true;
    this.cbpService.popupDocumentSave = false;
    this.cbpService.selectedElement['updatedBy'] = this.cbpService.loggedInUserName;
    this.cbpService.selectedElement['updatedDate'] = new Date();
    this.cbpService.cbpJson.documentInfo[0].lastSectionUpdatedDate = new Date();
    this.cbpService.cbpJson.documentInfo[0].lastUpdatedSectionDgUniqueID = this.cbpService.selectedElement?.dgUniqueID?.toString();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    // this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.setHeaderFooter(false, false);
  }, 10);

  setItemHeader(node: any, item: any) {
    let text = (node.dgType == DgTypes.Section || node.dgType == DgTypes.DelayStep || node.dgType == DgTypes.StepInfo) ? node.title : node.action;
    node.text = node.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
    let newText = this._buildUtil.setIconAndText(node);
    let obj = { text: newText.text, number: node.number, dgUniqueId: node.dgUniqueID, dgType: node.dgType };
    this.cbpService.previousHeaderItem = JSON.parse(JSON.stringify(obj));
    item['updatedBy'] = this.cbpService.loggedInUserName;
    item['updatedDate'] = new Date();
    this.cbpService.cbpJson.documentInfo[0].lastSectionUpdatedDate = new Date();
    this.cbpService.cbpJson.documentInfo[0].lastUpdatedSectionDgUniqueID = item?.dgUniqueID;
    // item = this.cbpService.setUserUpdateInfo(item);
    // this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.setHeaderFooter(false, false);
  }

  debounceTime(cb: any, delay = 1000) {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args);
      }, delay)
    }
  }

  setHeaderFooter(header: boolean, footer: boolean) {
    this.cbpService.headerSelected = header;
    this.cbpService.footerSelected = footer;
  }
  setNodeStepHeader(object: any, item: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < object.length; i++) {
      if (object[i].stepNo === this.cbpService.selectedElement.number) {
        object[i].sectionHeader = item.sectionHeader;
        if (item.dgType == DgTypes.Section) {
          object[i]['title'] = item.title;
        } else {
          object[i]['title'] = item.action;
        }
      } else if (object[i].children && object[i].children.length > 0) {
        this.setNodeStepHeader(object[i].children, item);
      }
    }
  }
  validateEvent(item: any, e: any) {
    if (!e.ctrlKey) {
      this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(item));
      e.stopPropagation();
    } else {
      if (item.parentID) {
        let parent: any = this._buildUtil.getElementByNumber(item.parentID, this.cbpService.cbpJson.section);
        if (!parent['ctrlKey']) {
          if (!item['ctrlKey']) {
            if (!this._buildUtil.getElementByNumber(item.dgSequenceNumber, this.cbpService.ctrlSelectedItems)) {
              if (this.cbpService.ctrlSelectedItems.length > 0) {
                if (item.parentID == this.cbpService.ctrlSelectedItems[0].parentID) {
                  this.cbpService.ctrlSelectedItems.push(JSON.parse(JSON.stringify(item)));
                  this.selectAllChilds(item, !item['ctrlKey']);
                }
              } else {
                this.cbpService.ctrlSelectedItems.push(JSON.parse(JSON.stringify(item)));
                this.selectAllChilds(item, !item['ctrlKey']);
              }
            }
          } else {
            this.cbpService.ctrlSelectedItems = this._buildUtil.deletObject(item, this.cbpService.ctrlSelectedItems);
            this.selectAllChilds(item, !item['ctrlKey']);
          }
        }
      } else {
        if (!item['ctrlKey']) {
          if (this.cbpService.ctrlSelectedItems.length > 0) {
            if (item.parentID == this.cbpService.ctrlSelectedItems[0].parentID) {
              this.cbpService.ctrlSelectedItems.push(JSON.parse(JSON.stringify(item)));
              this.selectAllChilds(item, !item['ctrlKey']);
            }
          } else {
            this.cbpService.ctrlSelectedItems.push(JSON.parse(JSON.stringify(item)));
            this.selectAllChilds(item, !item['ctrlKey']);
          }
        } else {
          this.cbpService.ctrlSelectedItems = this._buildUtil.deletObject(item, this.cbpService.ctrlSelectedItems);
          this.selectAllChilds(item, !item['ctrlKey']);
        }
      }
    }
  }
  selectedItem(item: any) {
    if (item?.dataType === 'Attachment') {
      let attachList: any = this.cbpService?.cbpJson?.section?.filter((section: any) => section?.dataType === 'Attachment')
      const index = attachList.findIndex((i: any) => i.dgUniqueID === item.dgUniqueID);
      this.isVisible = (index !== -1 && index !== 0);
    } else {
      this.isVisible = this.checkCount(item)
    }
    this.cbpService.selectedDgType = item.dgType;
    this.cbpService.stepClicked = true;
    this.controlService.setSelectItem(item);
    this.cbpService.backSelctedItem = item;
  }

  selectAllChilds(item: any, ctrlKey: boolean) {
    item['ctrlKey'] = ctrlKey;
    if (Array.isArray(item.children)) {
      item.children.forEach((child: any) => this.selectAllChilds(child, item['ctrlKey']));
    }
  }

  //Track by for Performance
  trackDgUniqueID(index: number, item: any): any {
    if (item) {
      return item.dgUniqueID;
    }
  }

  upArrowTest(item: any, id: any) {
    this.cbpService.moveUpNumberedElements(item, id);
    // console.log(this.cbpService.backgroundJson.section);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.auditService.createEntry({}, item, Actions.Update, AuditTypes.MOVE_UP);
    this.isVisible = this.checkCount(item)
  }
  downArrowTest(item: any, id: any) {
    this.cbpService.moveDownNumberedElements(item, id);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.auditService.createEntry({}, item, Actions.Update, AuditTypes.MOVE_DOWN);
    this.isVisible = this.checkCount(item)
  }

  getLinkSection(event: any) {
    this.getResponse.emit('fromeditor');
  }

  onAnyDrop(e: any, parent: any, i: any, section: any) {
    if (this.cbpService.searchTemplate) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please close the search and try again ');
      return;
    }
    if (e.dragData === DgTypes.SingleFigure) {
      this.cbpService.selectedElement = parent;
      this.builderService.singleMedia = true;
    }
    if (e.dragData === DgTypes.StepAction) {
      let obj: any = this._buildUtil.createElement(e.dragData);
      obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
      this.cbpService.selectedUniqueId = obj['dgUniqueID'];
      obj['parentID'] = parent.parentID;
      obj['level'] = this.cbpService.selectedElement['level'] + 1;
      obj['state'] = { hidden: true };
      const parentSection = this._buildUtil.getElementByNumber(parent.parentID, this.cbpService.cbpJson.section)
      let index = parentSection.children.indexOf(parent);
      parentSection.children = this.builderService.insertObjSpecificPos(parentSection.children, index, obj);
      this._buildUtil.renameChildLevelSteps(parentSection, true, true);
      obj = this.cbpService.setNewUserInfo(obj);
      obj = this.controlService.setDualStep(this.cbpService.selectedElement, obj);
      this.cbpService.selectedElement = obj;
      this.dataAdded.emit(obj);
    }
    else {
      let obj = this.builderService.onAnyDrop(e, parent, -1);
      if (obj) {
        this.cbpService.selectedElement = obj;
        this.dataAdded.emit(obj);
        this.auditService.createEntry({}, obj, Actions.Insert);
      }
    }
    this.cbpService.popupDocumentSave = false;
    this.cdr.detectChanges();
  }

  dataEntryDrop(e: any, parent: any, position: any) {
    if (this.cbpService.searchTemplate) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please close the search and try again ');
      return;
    }
    if (e.dragData === DgTypes.SingleFigure) {
      this.cbpService.selectedElement = parent;
      this.builderService.singleMedia = true;
    } else {
      if (this.controlService.isMessageField(e.dragData) || this.controlService.isLabelPara(e.dragData) ||
        e.dragData === DgTypes.FormulaDataEntry || this.controlService.isDataEntry({ dgType: e.dragData })) {
        this.cbpService.selectedElement = parent;
      }
      let obj = this.builderService.onAnyDrop(e, parent, position);
      if (obj) {
        this.dataAdded.emit(obj);
        this.auditService.createEntry({}, obj, Actions.Insert);
      }
    }
    this.cbpService.popupDocumentSave = false;
    this.cdr.detectChanges();
  }
  onLinkDrop(e: any, item: any, i: any) {
    if (this.cbpService.searchTemplate) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please close the search and try again ');
      return;
    }
    this.hLService.hlData = e ? e.dragData : null;
    this.cbpService.triggerHyperLink = !this.cbpService.triggerHyperLink;
    this.cdr.detectChanges();
  }
  viewUpdate(item: any, change: any) {
    if (!item.isTableDataEntry) {
      if (change) {
        item = this.cbpService.setUserUpdateInfo(item);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
      }
    } else {
      let table = this._buildUtil.getElementByDgUniqueID(item.parentDgUniqueID, this.cbpService.cbpJson);
      this.cbpService.setUserUpdateInfo(table);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }
  }
  createAuditEntry(item: any, trackcalled = false) {
    let auditType: any; let propName: any;
    if (item.dgType === DgTypes.Section || item.dgType === DgTypes.DelayStep || item?.dgType == DgTypes.StepInfo) {
      auditType = AuditTypes.TITLE;
      propName = 'title';
    } else {
      auditType = AuditTypes.ACTION;
      propName = 'action';
    }
    let change;
    if (this.auditService.selectedElementSnapchat[propName] != item[propName] && this.auditService.selectedElementSnapchat?.dgType == item?.dgType && this.auditService.selectedElementSnapchat?.dgUniqueID == item?.dgUniqueID) {
      change = true;
    } else {
      change = false;
    }
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, { propName: propName });
    if (trackcalled && change) {
      this.viewUpdate(item, change);
    }
  }
  createAuditEntryDoc(auditType: AuditTypes, propName: any) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, { propName: propName });
  }
  deleteAuditEntry(item: any) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, item, Actions.Delete);
  }
  timedRepeatSteps(item: any) {
    if (item.dgType === DgTypes.Timed || item.dgType === DgTypes.Repeat) {
      let element;
      if (item.parentID) {
        element = this._buildUtil.getElementByNumber(item.parentID, this.cbpService.cbpJson.section);
        if (element.dgType === DgTypes.Timed || element.dgType === DgTypes.Repeat) { this.isTimedChildren(element.children); }
      }
      if (element) { this.timedRepeatSteps(element); }
      this.builderService.selectedItem = item;
      this.builderService.indexValue = this.builderService.stepChildren.findIndex((i: any) => i.dgUniqueID === this.builderService.selectedItem.dgUniqueID);
      this.builderService.toDisabledForUpDownArrrow();
    }
    if (item.dgType === DgTypes.DualAction) {
      item = item.children[0];
    }
    this.cbpService.stepClicked = true;
    this.controlService.setSelectItem(item);
    this.cbpService.backSelctedItem = item;
  }
  isTimedChildren(data: any) {
    for (var i = 0; i < data.length; i++) {
      data[i]['isTimedChildren'] = true;
      if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.isTimedChildren(data[i].children);
      }
    }
  }
  dependencyNumbered(step: any) {
    if (step.parentID) {
      let parentElement = this._buildUtil.getElementByNumber(step.parentID, this.cbpService.cbpJson.section);
      step.usage = parentElement.usage;
      step.dependency = parentElement.dependency;
    }
    if (!step.numberedChildren) {
      step.usage = Dependency.Information;
      step.dependency = Dependency.Independent;
    }
    return step;
  }
  //Paragraph Editor
  openParagraphEditor(item: any) {
    if (!item['editorOpened']) { item['editorOpened'] = true; }
  }
  handleUpdateEvent(event: any, item: any) {
    if (
      item?.dgType === DgTypes.Section ||
      item?.dgType === DgTypes.DelayStep ||
      item?.dgType === DgTypes.StepInfo
    ) {
      item.title = event;
      item['isHtmlText'] = this._buildUtil.isHTMLText(item.title);
    } else {
      item.action = event;
      item['isHtmlText'] = this._buildUtil.isHTMLText(item.action);
    }
    // item = this.cbpService.setUserUpdateInfo(item);
    // this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  outputhtml(event: any, item: any, propName: any) {
    propName = (item.dgType == DgTypes.Section || item.dgType == DgTypes.DelayStep || item.dgType == DgTypes.StepInfo) ? 'title' : 'action';
    item['editorOpened'] = false;
    if (propName && item[propName] !== event) {
      item[propName] = event;
      this._buildUtil.isHTMLText(item[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
      if (item['isHtmlText']) {
        item = this._buildUtil.setIconAndText(item);
        //  this.cbpService.previousHeaderItem = JSON.parse(JSON.stringify(item));
        this.createAuditEntry(item);
        item = this.cbpService.setUserUpdateInfo(item);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
        this.setItemHeader(item, item);
        setTimeout(() => { }, 1);
      }
    }
  }
  editorOpened(item: any) {
    this.selectedItem(item);
    if (!this.cbpService.isBackGroundDocument)
      item['editorOpened'] = this.cbpService.selectedElement.dgUniqueID === item.dgUniqueID ? true : false;
    this.cdr.detectChanges();
  }
  checkDgSequence(stepObj: any) {
    const indent = this.layoutService.indendation && this.layoutService.indendation[0].showIndendation ? true : false;
    return !indent && stepObj.originalSequenceType !== SequenceTypes.DGSEQUENCES ? true : false;
  }
  getIndex(item: any) {
    let element;
    let i;
    if (item?.parentID) {
      element = this._buildUtil.getElementByNumber(item.parentID, this.cbpService.cbpJson.section);
      i = element.children.findIndex((i: any) => i.dgUniqueID === item.dgUniqueID);
    } else {
      element = this.cbpService.cbpJson.section;
      i = element.findIndex((i: any) => i.dgUniqueID === item.dgUniqueID);
    }
    return i;
  }
  pasteElement() {
    try {
      if (this.cbpService.elementForCopyOrCut === undefined || this.cbpService.elementForCopyOrCut === null) {
        return;
      }
      if ((this.cbpService.elementForCopyOrCut.element.parentDgUniqueID == this.cbpService.selectedElement.dgUniqueID ||
        this.cbpService.elementForCopyOrCut.element.dgUniqueID == this.cbpService.selectedElement.dgUniqueID
      ) && this.cbpService.elementForCopyOrCut.action == 'cut') {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.notPerformAction + '   ' + 'Select different element to paste');
        return;
      }
      let auditCreated = false;
      if ((this.cbpService.elementForCopyOrCut?.element?.leftdual ||
        this.cbpService.elementForCopyOrCut?.element?.rightdual)
        && this.cbpService.selectedElement?.dualStep) {
        this.cbpService.setCutCopyMethodType('error', 'Paste action is not valid in side dual step.', true);
        this.cbpService.loading = false;
        this.cbpService.elementForCopyOrCut = null;
        return;
      }
      if (JSON.stringify(this.cbpService.elementForCopyOrCut?.element?.children)?.includes(JSON.stringify(this.cbpService.selectedElement))) {
        this.notifier.notify('error', "Paste action is not valid.");
        this.cbpService.elementForCopyOrCut = null;
        return;
      }
      let index = this.getIndex(this.cbpService.elementForCopyOrCut.element);
      if (this.cbpService.selectedElement.dgType == DgTypes.Form) {
        if (this.cbpService.rowSelectedEntry && this._buildUtil.validateHeirarchy(this.cbpService.selectedElement, this.cbpService.elementForCopyOrCut.element)) {
          let obj = this._buildUtil.changePropertiesAsNewElement(JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex(), this.cbpService.selectedElement.parentID);
          for (let i = 0; i < this.tableService.selectedRow.length; i++) {
            const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
            entrychildrens.push(obj);
          }
          if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
            this.cbpService.deleteElement(this.cbpService.elementForCopyOrCut.element, '', this.cbpService.elementForCopyOrCut);
          } else {
            this._buildUtil.paginateIndex = 1;
            this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
          }
          this.auditService.createEntry({}, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT);
          auditCreated = true;
          // this.cbpService.elementForCopyOrCut = null;
        }
        else if (!this.cbpService.elementForCopyOrCut.action) {
          this.cbpService.loading = false;
        }
        else {
          // this.cbpService.setCutCopyMethodType('error','Paste action is not valid. Please perform copy/cut before paste action',true);
          this.cbpService.loading = false;
          this.cbpService.elementForCopyOrCut = null;
        }
      }
      else if (this.cbpService.selectedElement && this.cbpService.elementForCopyOrCut &&
        this._buildUtil.validateHeirarchy(this.cbpService.selectedElement,
          this.cbpService.elementForCopyOrCut.element)) {
        let obj;
        if (this.cbpService.elementForCopyOrCut.element['number'] ||
          this.cbpService.elementForCopyOrCut.element) {
          if (!this.cbpService.elementForCopyOrCut.element.numberedSubSteps || this.cbpService.elementForCopyOrCut.element.isDataEntry !== undefined) {
            if (this.cbpService.elementForCopyOrCut.element.dgType === DgTypes.Table) {
              if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
                this.cbpService.elementForCut = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                this.cbpService.elementForCut.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                this.cbpService.selectedElement.children.push(this.cbpService.elementForCut);
                this.cbpService.selectedElement = this.cbpService.elementForCopyOrCut.element ? this.cbpService.elementForCopyOrCut.element : this.cbpService.selectedElement.children.slice(-1)[0];
                this.controlService.setSelectItem(this.cbpService.selectedElement);
              }
              else {
                let table = this.copyPasteTable(this.cbpService.elementForCopyOrCut.element);
                table.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                this.cbpService.setTableTrackChange(table);
                this.cbpService.selectedElement.children.push(table);
                this.controlService.setSelectItem(this.cbpService.selectedElement);
              }
            }
            else if (this.cbpService.elementForCopyOrCut.element.dgType === DgTypes.Figures) {
              if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
                let oldObj = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                this.cbpService.elementForCut = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                this.cbpService.elementForCut.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                this.cbpService.elementForCut = this.cbpService.setUserUpdateInfo(this.cbpService.elementForCut);
                this.cbpService.elementForCut.images.forEach((element: any) => {
                  element.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                })
                this.cbpService.selectedElement.children.push(this.cbpService.elementForCut);
                this.cbpService.selectedElement = this.cbpService.elementForCopyOrCut.element ? this.cbpService.elementForCopyOrCut.element : this.cbpService.selectedElement.children.slice(-1)[0];
                this.controlService.setSelectItem(this.cbpService.selectedElement);
                this.auditService.createEntry(oldObj, this.cbpService.elementForCopyOrCut.element, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
                auditCreated = true;
              }
              else {
                let obj: any = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                obj['state'] = { hidden: true };
                obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
                obj['parentID'] = this.cbpService.selectedElement.number;
                obj['level'] = this.cbpService.selectedElement['level'] + 1;
                obj['parentDgUniqId'] = this.cbpService.selectedElement.dgUniqueID;
                obj = this.cbpService.setUserUpdateInfo(obj);
                obj.images.forEach((element: any) => {
                  element.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                })
                this.cbpService.selectedElement.children.push(obj);
                this.controlService.setSelectItem(obj);
                this.auditService.createEntry({}, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT);
                auditCreated = true;
              }
            }
            else {
              if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
                if ((this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.Table && this.cbpService.selectedElement.dgType != DgTypes.Section) || (this.controlService.isDataEntry(this.cbpService.elementForCopyOrCut.element) && !this.controlService.isDataEntryAccept(this.cbpService.selectedElement)
                  && !(this.cbpService.selectedElement.dgType === DgTypes.Section && this.cbpService.elementForCopyOrCut.element.dgType === DgTypes.FormulaDataEntry))) {
                  this.showErrorMsg(DgTypes.Warning, this.cbpService.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.cbpService.elementForCopyOrCut.element.dgType);
                } else if (this.cbpService.selectedElement.dgType == DgTypes.Section && (this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.VerificationDataEntry ||
                  this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.SignatureDataEntry || this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.InitialDataEntry)) {
                  this.showErrorMsg(DgTypes.Warning, this.cbpService.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.cbpService.elementForCopyOrCut.element.dgType);
                } else if (this.cbpService.selectedElement.dgType === DgTypes.Section &&
                  this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Link &&
                  this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Warning && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Caution
                  && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Note && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Alara && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.LabelDataEntry
                  && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.Para && this.cbpService.elementForCopyOrCut.element.dgType !== DgTypes.FormulaDataEntry) {
                  // this.showErrorMsg(DgTypes.Warning, this.cbpService.selectedElement.dgType + '  ' + AlertMessages.cannotAccept + '  ' + this.cbpService.elementForCopyOrCut.element.dgType);
                  let oldId = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element?.dgUniqueID));
                  let obj: any = this._buildUtil.changeChildProps(this.cbpService.selectedElement, JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex());
                  obj['state'] = { hidden: true };
                  obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
                  obj['parentID'] = this.cbpService.selectedElement.number;
                  obj['level'] = this.cbpService.selectedElement['level'] + 1;
                  if (this.cbpService.elementForCopyOrCut.action == 'cut') {
                    let newId = JSON.parse(JSON.stringify(obj?.dgUniqueID));
                    this._buildUtil.updateDgUniqueID(oldId, newId);
                  }
                  // console.log(obj);
                  this.cbpService.selectedElement.children.push(obj);
                  this.controlService.setSelectItem(obj);
                  this.auditService.createEntry(this.cbpService.elementForCopyOrCut.element, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
                  auditCreated = true;
                }
                else {
                  let oldObj = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                  this.cbpService.elementForCut = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                  this.cbpService.elementForCut.parentID = JSON.parse(JSON.stringify(this.cbpService.selectedElement.dgSequenceNumber));
                  this.cbpService.selectedElement.children.push(this.cbpService.elementForCut);
                  this.cbpService.elementForCut = null;
                  this.controlService.setSelectItem(this.cbpService.elementForCopyOrCut.element);
                  this.cbpService.selectedElement = this.cbpService.elementForCopyOrCut.element;
                  this.cbpService.selectedUniqueId = this.cbpService.elementForCopyOrCut.element.dgUniqueID;
                  this.auditService.createEntry(oldObj, this.cbpService.elementForCopyOrCut.element, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
                  auditCreated = true;
                }
              }
              else {
                if ((this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.Table && this.cbpService.selectedElement.dgType != DgTypes.Section) || (this.controlService.isDataEntry(this.cbpService.elementForCopyOrCut.element) && !this.controlService.isDataEntryAccept(this.cbpService.selectedElement)
                  && !(this.cbpService.selectedElement.dgType === DgTypes.Section && this.cbpService.elementForCopyOrCut.element.dgType === DgTypes.FormulaDataEntry))) {
                  this.showErrorMsg(DgTypes.Warning, this.cbpService.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.cbpService.elementForCopyOrCut.element.dgType);
                } else if (this.cbpService.selectedElement.dgType == DgTypes.Section && (this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.VerificationDataEntry ||
                  this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.SignatureDataEntry || this.cbpService.elementForCopyOrCut.element.dgType == DgTypes.InitialDataEntry)) {
                  this.showErrorMsg(DgTypes.Warning, this.cbpService.selectedElement.dgType + '   ' + AlertMessages.cannotAccept + '   ' + this.cbpService.elementForCopyOrCut.element.dgType);
                } else {
                  if (this.cbpService.elementForCopyOrCut.element.dgType === DgTypes.Section) {
                    let obj: any = this._buildUtil.changeChildProps(this.cbpService.selectedElement, JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex(), false, false);
                    obj['state'] = { hidden: true };
                    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
                    obj['parentID'] = this.cbpService.selectedElement.number;
                    obj['level'] = this.cbpService.selectedElement['level'] + 1;
                    // console.log(obj);
                    obj = this.updatePastedImageUniqueNames(obj);
                    let objects = this._buildUtil.reUpdateTrackChanges([obj]);
                    obj = objects[0];
                    this.cbpService.selectedElement.children.push(obj);
                    this.controlService.setSelectItem(obj);
                    try {
                      this.auditService.createEntry(this.cbpService.elementForCopyOrCut.element, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
                      auditCreated = true;
                    } catch (error: any) { console.log(error); }

                  }
                  else {
                    let obj: any = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element));
                    obj['state'] = { hidden: true };
                    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
                    obj['parentID'] = this.cbpService.selectedElement.number;
                    obj['fieldName'] = obj.dgType + (obj.dgUniqueID);
                    obj['level'] = this.cbpService.selectedElement['level'] + 1;
                    let objects = this._buildUtil.reUpdateTrackChanges([obj]);
                    obj = objects[0];
                    this.cbpService.selectedElement.children.push(obj);
                    this.controlService.setSelectItem(obj);
                    this.auditService.createEntry(this.cbpService.elementForCopyOrCut.element, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
                    auditCreated = true;
                  }
                }
              }
            }
          }
          else {
            let oldId = JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element?.dgUniqueID));
            obj = this._buildUtil.changeChildProps(this.cbpService.selectedElement, JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex(), false, false, true);
            obj = this.updatePastedImageUniqueNames(obj);
            if (this.cbpService.elementForCopyOrCut.action == 'cut') {
              let newId = JSON.parse(JSON.stringify(obj?.dgUniqueID));
              this._buildUtil.updateDgUniqueID(oldId, newId); //need to work
            }
            let objects = this._buildUtil.reUpdateTrackChanges([obj]);
            obj = objects[0];
            this.cbpService.selectedElement.children.push(obj);
            this.controlService.setSelectItem(obj);
            this.cbpService.selectedElement = obj;
            this.cbpService.selectedUniqueId = obj.dgUniqueID;
            this.cbpService.copyAuditAdded({
              source: this.cbpService.elementForCopyOrCut, target: {
                actionCause: this.cbpService.elementForCopyOrCut.action == 'copy' ? 'copy' : 'cut',
                action: 'paste',
                element: JSON.parse(JSON.stringify(obj))
              }
            });
          }
          if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
            if (this.cbpService.selectedElement.dgType === DgTypes.Section && this.cbpService.elementForCopyOrCut.element.isDataEntry) {
              this.cbpService.elementForCopyOrCut = null;
              return false;
            }
            else {
              this.cbpService.media.forEach((image: { name: string | any[]; }, mindex: any) => {
                this.auditService.cutElementRestore.push(image);
              })
              this.cbpService.deleteElement(this.cbpService.elementForCopyOrCut.element, false, this.cbpService.elementForCopyOrCut);
              // console.log(this.cbpService.media);
              this.cbpService.media = [...this.auditService.cutElementRestore, ...this.cbpService.media];
              this.auditService.cutElementRestore = [];
            }
          } else {
            this._buildUtil.paginateIndex = 1;
            this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
            this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
          }

        } else {
          obj = this.changePropertiesAsNewElement(JSON.parse(JSON.stringify(this.cbpService.elementForCopyOrCut.element)), this._buildUtil.getUniqueIdIndex(), this.cbpService.selectedElement.dgSequenceNumber);
          this.cbpService.selectedElement.children.push(obj);
          if (this.cbpService.elementForCopyOrCut && this.cbpService.elementForCopyOrCut.action == 'cut') {
            this.cbpService.deleteElement(this.cbpService.elementForCopyOrCut.element, '', this.cbpService.elementForCopyOrCut);
          } else {
            this._buildUtil.paginateIndex = 1;
            this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
          }
        }
        try {
          if (!this.cbpService.elementForCopyOrCut.element?.isDataEntry && !auditCreated) {
            this.auditService.createEntry(this.cbpService.elementForCopyOrCut.element, obj, Actions.Insert, AuditTypes.PASTE_ELEMENT, { actionCause: this.cbpService.elementForCopyOrCut.action, index: index });
            auditCreated = true;
          }
        } catch (err: any) { console.error(err); }

        this.refreshTree.emit();

        //  this.cbpService.elementForCopyOrCut = null;
      } else if (!this.cbpService.elementForCopyOrCut.action) {
        this.cbpService.loading = false;
      } else {
        this.cbpService.setCutCopyMethodType('error', 'Paste action is not valid. Please perform copy/cut before paste action', true);
        this.cbpService.loading = false;
        this.cbpService.elementForCopyOrCut = null;
      }
      this.cbpService.elementForCopyOrCut = null;
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    } catch (error) {
      console.log(error);
      this.cbpService.setCutCopyMethodType('error', error, true);
      this.cbpService.elementForCopyOrCut = null;
    }
  }
  renameTableChild(obj: any, indexUniqueId: any) {
    this.updateTableEntriesDgUniqueIds(obj, indexUniqueId);
  }
  copyPasteTable(item: any) {
    let entryObj, object
    let rowdata = item.calstable[0].table.tgroup.tbody[0].row;
    for (let l = 0; l < rowdata.length; l++) {
      entryObj = rowdata[l].entry;
      for (let m = 0; m < entryObj.length; m++) {
        if (entryObj[m]) {
          object = item.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
          item['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();

          for (let k = 0; k < object.children.length; k++) {
            object.children[k]['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
            if (object.children[k].dgType === DgTypes.Table) {
              object.children[k]['fieldName'] = 'Column'+object.children[k]['column']+ this._buildUtil.getUniqueIdIndex();
              object.children[k].dgUniqueID = this._buildUtil.getUniqueIdIndex();
              this.copyPasteTable(object.children[k]);
            }
          }
        }
      }
    }
    return item;
  }
  updateTableEntriesDgUniqueIds(obj: any, indexUniqueId: any) {
    try {
      for (let i = 0; i < obj.calstable.length; i++) {
        if (obj.calstable[i]) {
          const colsObj = obj.calstable[i].table.tgroup.tbody;
          for (let j = 0; j < colsObj.length; j++) {
            if (colsObj[j]) {
              const tableObj = colsObj[j].row;
              for (let k = 0; k < tableObj.length; k++) {
                if (tableObj[k]) {
                  const entryObj = tableObj[k].entry;
                  for (let l = 0; l < entryObj.length; l++) {
                    if (entryObj[l]) {
                      const object = obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children;
                      for (let m = 0; m < object.length; m++) {
                        obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m]['fieldName'] = "Column" + object[m]['column'] + this._buildUtil.getUniqueIdIndex();
                        obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m].dgUniqueID = this._buildUtil.getUniqueIdIndex();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }
  changePropertiesAsNewElement(obj: any, uniqueIdIndex: any, parentID: any) {
    obj.dgUniqueID = this._buildUtil.getUniqueIdIndex();
    obj['parentID'] = parentID;
    obj['isEmbededObject'] = false;
    if (obj.dgType === DgTypes.Table) {
      this.renameTableChild(obj, this._buildUtil.getUniqueIdIndex());
    }
    return obj;
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
  setField(event: any) {
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
      propName = 'title'
    }
    let text = event[propName] ? event[propName].slice(0, 25) : '';
    element.title = event[propName];
    element.text = element.number + ' ' + text + (text.length > 25 ? '...' : '');
    element[propName] = event[propName];
    let newText = this._buildUtil.setIconAndText(element);
    let obj = { text: newText.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
    this.cbpService.headerItem = obj;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.createAuditEntry(this.cbpService.selectedElement);
    this.cdr.detectChanges();
  }
  ngOnDestroy() {
    this.subScription?.unsubscribe();
    this.subScriptionStyle?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
    this.styleSubscription?.unsubscribe();
  }
  setSticky(eventObj: any) {
    if (eventObj.changed) {
      this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    }
    this.cbpService.selectedElement.stickyNote = eventObj?.stickyNote;
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }

  updatePastedImageUniqueNames(obj: any): any {
    let children = obj?.children;
    if (children) {
      for (let i = 0; i < children?.length; i++) {
        let img = children[i];
        if (img.dgType == DgTypes.Figures && img.dataType == "image") {
          let newMediaList = [];
          for (let j = 0; j < img.images?.length; j++) {
            let newImg = img.images[j];
            let imgName = newImg?.fileName;
            const extensionIndex = imgName.lastIndexOf('.');
            const imageName = imgName.substring(0, extensionIndex);
            const extension = imgName.substring(extensionIndex + 1);
            let unique = new Date().getTime().toString();
            let existImg = this.cbpService.media.filter((item: any) => item.name == imgName || item.name == ('media/' + imgName));
            newImg.fileName = imageName + unique + '.' + extension;
            newImg.dgUniqueID = this._buildUtil.getUniqueIdIndex();
            newImg.name = imageName + unique + '.' + extension;
            newMediaList.push(new File(existImg, newImg.fileName, { type: existImg[0]?.type }));
          }
          this.cbpService.media = [...this.cbpService.media, ...newMediaList];
          this.cdr.detectChanges();
        }
        if (img?.children) {
          this.updatePastedImageUniqueNames(img);
        }
      }
    }
    return obj;
  }

  updateChangeBar() {
    this.section.forEach((element: any) => {
      if (element.dgType === DgTypes.Attachment && this.cbpService.styleChangeBarSession?.includes(DgTypes.Attachment)) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
      if (element.level == 0 && this.cbpService.styleChangeBarSession?.includes('Heading1')) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
      let obj = this.cbpService.styleHeadings.filter(item => item.subLevel == (element.level) && (item.subName == element.dgType || item.subName.toLowerCase() == element?.properties?.type?.toLowerCase()));
      if (obj?.length > 0) {
        element = this.cbpService.setUserUpdateInfo(element);
      }
    });
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
