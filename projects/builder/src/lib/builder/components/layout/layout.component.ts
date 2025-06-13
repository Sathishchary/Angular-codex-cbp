import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CbpSharedService } from 'cbp-shared';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { LayoutService } from '../../shared/services/layout.service';
const layoutJson = require('src/assets/cbp/json/default-layout.json');
/* @author: Sathish Kotha ; contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, OnDestroy {
  selectedLayout: any = 'default';
  showIcon = true;
  showIndendation = false;
  disableCircle = false;
  disableNumber = false;
  layoutSnapchat: any;
  styleObjGetData: any = [];
  coverPage = true;
  isCoverPage = true
  @Output() saveInfo: EventEmitter<any> = new EventEmitter<any>();
  footerList = [{ type: 'Reset' }, { type: 'Apply' }, { type: 'Cancel' }]
  marginTop: number = 50;
  marginBottom: number = 50;
  enableAutoScroll = false;
  enableDataProtection = false;

  constructor(public cbpService: CbpService, public notifier: NotifierService,
    public layoutService: LayoutService, private controlService: ControlService, public sharedService: CbpSharedService) { }

  onChange(event: any) {
    this.checkLayout();
    this.selectedLayout = event;
  }
  onIconChange(event: any) {
    this.checkLayout();
    this.showIcon = event;
  }
  onIndendationChange(event: any) {
    this.checkLayout();
    this.showIndendation = event;
  }
  onDisableCircleChange(event: any) {
    this.checkLayout();
    this.disableCircle = event;
  }
  onDisableNumberChange(event: any) {
    this.checkLayout();
    this.disableNumber = event;
  }
  onCoverPageChang(event: any) {
    this.coverPage = event;
  }
  onMarginTopChange(event: any) {
    this.checkLayout();
    this.marginTop = event;
  }
  onMarginBottomChange(event: any) {
    this.checkLayout();
    this.marginBottom = event;
  }
  onEnableAutoScrollChange(event: any) {
    this.checkLayout();
    this.enableAutoScroll = event;
  }
  onEnableDataProtectionChange(event: any) {
    this.checkLayout();
    this.enableDataProtection = event;
  }
  checkLayout() {
    if (!this.cbpService.layOutJson) { this.cbpService.layOutJson = []; }
    if (!this.cbpService.layOutJson['layout']) { this.cbpService.layOutJson.layout = []; }
  }
  setDefault() {
    this.cbpService.layOutJson = JSON.parse(JSON.stringify(layoutJson));
  }

  ngOnInit() {
    this.cbpService.defaultLayOutJson = JSON.parse(JSON.stringify(layoutJson));
    if (this.cbpService.layOutJson === undefined) {
      this.setDefault();
    }
    if (typeof this.cbpService.layOutJson === 'string') {
      this.setDefault();
    }
    if (this.cbpService.layOutJson['length'] === 0) {
      this.setDefault();
    }
    if (this.cbpService.layOutJson === undefined) {
      this.cbpService.defaultLayOutJson = JSON.parse(JSON.stringify(layoutJson));
      this.setDefault();
    } else {
      if (this.cbpService.layOutJson) {
        if (!this.cbpService.layOutJson.layout[5]) { this.cbpService.layOutJson.layout[5] = [{ name: 'coverPage', coverPage: true }] }
        if (!this.cbpService.layOutJson.layout[4]) { this.cbpService.layOutJson.layout[4] = [{ name: 'disableNumber', disableNumber: false }] }
        if (!this.cbpService.layOutJson.layout[3]) { this.cbpService.layOutJson.layout[3] = [{ name: 'disableCircle', disableCircle: false }] }
        if (!this.cbpService.layOutJson.layout[6]) { this.cbpService.layOutJson.layout[6] = { name: 'marginTop', marginTop: 50 } }
        if (!this.cbpService.layOutJson.layout[7]) { this.cbpService.layOutJson.layout[7] = { name: 'marginBottom', marginBottom: 50 } }
        if (!this.cbpService.layOutJson.layout[8]) { this.cbpService.layOutJson.layout[8] = { name: 'enableAutoScroll', enableAutoScroll: false } }
        if (!this.cbpService.layOutJson.layout[9]) { this.cbpService.layOutJson.layout[9] = { name: 'enableDataProtection', enableDataProtection: false } }
        this.setLayOutSettings();
      } else {
        this.setLayOutSettings();
      }
    }
    this.sharedService.openModalPopup('layoutModel');
  }
  setLayOutSettings() {
    this.onChange(this.cbpService.layOutJson.layout[0].margin);
    this.onIconChange(this.cbpService.layOutJson.layout[1].showIcons);
    this.onIndendationChange(this.cbpService.layOutJson.layout[2].showIndendation);
    this.onDisableCircleChange(this.cbpService.layOutJson.layout[3].disableCircle);
    this.onDisableNumberChange(this.cbpService.layOutJson.layout[4].disableNumber);
    this.onCoverPageChang(this.cbpService.layOutJson.layout[5].coverPage)
    this.onMarginTopChange(this.cbpService.layOutJson.layout[6].marginTop);
    this.onMarginBottomChange(this.cbpService.layOutJson.layout[7].marginBottom);
    this.onEnableAutoScrollChange(this.cbpService.layOutJson.layout[8].enableAutoScroll);
    this.onEnableDataProtectionChange(this.cbpService.layOutJson.layout[9].enableDataProtection);
  }

  save() {
    let styleObj: any = [];
    styleObj.push({ name: 'margin', margin: this.selectedLayout });
    styleObj.push({ name: 'showhideicons', showIcons: this.showIcon });
    styleObj.push({ name: 'showIndendation', showIndendation: this.showIndendation });
    styleObj.push({ name: 'disableCircle', disableCircle: this.disableCircle });
    styleObj.push({ name: 'disableNumber', disableNumber: this.disableNumber });
    styleObj.push({ name: 'coverPage', coverPage: this.coverPage });
    styleObj.push({ name: 'marginTop', marginTop: this.marginTop });
    styleObj.push({ name: 'marginBottom', marginBottom: this.marginBottom });
    styleObj.push({ name: 'enableAutoScroll', enableAutoScroll: this.enableAutoScroll });
    styleObj.push({ name: 'enableDataProtection', enableDataProtection: this.enableDataProtection });
    this.cbpService.coverPage = this.coverPage;
    if (!this.cbpService.layOutJson['layout']) { this.cbpService.layOutJson.layout = []; }
    this.cbpService.layOutJson.layout = styleObj;
    this.saveLayoutStyles(styleObj, 'Layout saved successfully');
    this.layoutService.applyLayOutChanges(styleObj);
    this.cbpService.coverPage = this.layoutService.coverPage[0].coverPage;
    this.controlService.setlayoutItem(this.cbpService.layOutJson.layout);
    this.saveInfo.emit();
  }
  saveLayoutStyles(styleObj: any, mesg: string) {
    this.notifier.hideAll();
    this.notifier.notify('success', mesg);
  }

  hide() {
    this.cbpService.islayoutOpen = false;
    this.sharedService.closeModalPopup('layoutModel');
  }
  ngOnDestroy() {
    this.hide();
  }
  resetLayout() {
    this.selectedLayout = 'default';
    this.showIcon = true;
    this.showIndendation = false;
    this.disableCircle = false;
    this.disableNumber = false;
    this.coverPage = false;
    this.save();
    this.layoutService.applyLayOutChanges(this.cbpService.layOutJson.layout);
  }
}
