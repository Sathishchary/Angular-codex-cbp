import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuConfig } from '../../ExternalAccess/menuconfig';

export interface MenuBar {
  displayName?: any;
  name?: any;
  checked?: any;
  marginTop?: any;
  marginBottom?: any;
}

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Input() propertyDocument: any;
  @Input() menuConfig: any = new MenuConfig();
  @Input() standalone: any;
  showOption = { info: true, option: false }
  menuBarItems: MenuBar[] = [];
  footerlist = [{ type: 'Cancel' }];
  sessionConfig: any[] = [];
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.propertyDocument);
    this.menuBarItems = [
      { name: 'isNavigation', displayName: 'Show Navigation', checked: this.menuConfig.isNavigation },
      { name: 'isPageHeader', displayName: 'Page Header', checked: this.menuConfig.isPageHeader },
      { name: 'isPageFooter', displayName: 'Page Footer', checked: this.menuConfig.isPageFooter },
      { name: 'isDisableCircle', displayName: 'Disable Circle / Slash', checked: this.menuConfig.isDisableCircle },
      { name: 'isShowSectionStepIcon', displayName: 'Show Section/Step Icon', checked: this.menuConfig.isShowSectionStepIcon },
      { name: 'isIndendationEnabled', displayName: 'Show / Hide Indendation', checked: this.menuConfig.isIndendationEnabled },
      { name: 'isPreProcessorEnabled', displayName: 'Enable Pre Processor', checked: this.menuConfig.isPreProcessorEnabled },
      { name: 'isLocationEnabled', displayName: 'Enable Location', checked: this.menuConfig.isLocationEnabled },
      { name: 'isCollapsibleViewEnabled', displayName: 'Enable Collapsible View', checked: this.menuConfig.isCollapsibleViewEnabled },
      { name: 'isDataProtected', displayName: 'Enable Data Protection', checked: this.menuConfig.isDataProtected },
      { name: 'isAutoScrollEnabled', displayName: 'Enable Auto Scroll (Paging)', checked: this.menuConfig.isAutoScrollEnabled },
      { name: 'marginTop', displayName: 'Margin Top', marginTop: this.menuConfig.marginTop },
      { name: 'marginBottom', displayName: 'Margin Bottom', marginBottom: this.menuConfig.marginBottom },
      { name: 'showUpdates', displayName: 'Show Updates', checked: this.menuConfig.showUpdates },
      { name: 'disableAutoStepNavigation', displayName: 'Disable Auto Step Navigation', checked: this.menuConfig.disableAutoStepNavigation }
    ];
    if (this.standalone) {
      this.menuBarItems.splice(13, 1);
    }
    this.sessionConfig = JSON.parse(JSON.stringify(this.menuBarItems));
  }
  itemChange(item: any, i: number) {
    this.sessionConfig[i].checked = item.checked;
  }
  marginBottomChange(item: any, i: number) {
    this.sessionConfig[i].marginBottom = item.marginBottom;
  }
  marginTopChange(item: any, i: number) {
    this.sessionConfig[i].marginTop = item.marginTop;
  }
  closeModal(type: string) {
    this.closeEvent.emit(false);
    this.activeModal.close();
  }
  updateSave(type: string) {
    this.sessionConfig.forEach((item: any, i: number) => {
      if (item.name != 'marginTop' && item.name != 'marginBottom') {
        this.menuConfig[item.name] = item.checked;
      } else if (item.name == 'marginTop') {
        this.menuConfig.marginTop = item.marginTop;
      } else if (item.name == 'marginBottom') {
        this.menuConfig.marginBottom = item.marginBottom;
      }
    })
    this.closeEvent.emit({ typeValue: type, 'menuConfig': this.menuConfig });
    this.activeModal.close();
  }
  changeTabs(inf: boolean, op: boolean) {
    this.showOption.info = inf; this.showOption.option = op;
    this.footerlist = inf ? [{ type: 'Cancel' }] : [{ type: 'Update' }, { type: 'Cancel' }];
  }
}
