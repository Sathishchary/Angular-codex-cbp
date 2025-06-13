import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { Security } from '../../models';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { TableService } from '../../shared/services/table.service';

@Component({
  selector: 'app-role-qual',
  templateUrl: './role-qual.component.html',
  styleUrls: ['./role-qual.component.css', '../../util/modal.css']
})
export class RoleQualComponent implements OnInit {
  rolesList: any = [];
  qualList: any[] = [];
  qualGrpList: any[] = [];
  loading = false;
  qualGroupName: any;
  qualName: any;
  roleArray: any[] = [];
  qualArray: any[] = [];
  qualGrpArray: any[] = [];
  documentInfo: any[] = [];
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();

  //AUDIT & UNDO
  activeTab = 0;
  roleRestoreSnapchat: Array<any> = [];
  qualRestoreSnapchat: Array<any> = [];
  qualGroupRestoreSnapchat: Array<any> = [];
  roleAuditJSON: Array<any> = [];
  qualAuditJSON: Array<any> = [];
  qualGroupAuditJSON: Array<any> = [];
  tableTempObj: any;
  footerList = [{ type: 'Reset', disabled: true }, { type: 'Cancel' }, { type: 'Ok', disabled: true }]
  constructor(public cbpService: CbpService, private builderService: BuilderService,
    public controlService: ControlService, public sharedService: CbpSharedService,
    public tableService: TableService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('Role-Qual');
    this.getRoleList();
    this.getQualList();
    this.getQualGrpList();
  }
  save() {
    if (this.cbpService.selectedTableCol) {
      this.setTableRoleQual('save');
    } else {
      if (this.cbpService.selectedElement !== null) {
        if (this.cbpService.selectedElement.dgType === DgTypes.Form) {
          this.cbpService.tableDataEntrySelected.Security = new Security();
        } else {
          this.cbpService.selectedElement.Security = new Security();
        }
      } else {
        this.cbpService.cbpJson.documentInfo[0].Security = new Security();
      }
      this.rolesList.forEach((value: any) => {
        if (value.isChecked) {
          if (this.cbpService.selectedElement !== null) {
            if (this.cbpService.selectedElement.dgType === DgTypes.Form) {
              this.cbpService.tableDataEntrySelected.Security.Role.push({ code: value.roleCode, role: value.role });
            } else {
              this.cbpService.selectedElement.Security.Role.push({ code: value.roleCode, role: value.role });
            }
          } else {
            this.cbpService.cbpJson.documentInfo[0].Security.Role.push({ code: value.roleCode, role: value.role });
          }
        }
      });
      this.qualList.forEach((value: any) => {
        if (value.isChecked) {
          if (this.cbpService.selectedElement !== null) {
            if (this.cbpService.selectedElement.dgType === DgTypes.Form) {
              this.cbpService.tableDataEntrySelected.Security.Qualification.push({ code: value.qualCode, role: value.qual });
            } else {
              this.cbpService.selectedElement.Security.Qualification.push({ code: value.qualCode, role: value.qual });
            }
          } else {
            this.cbpService.cbpJson.documentInfo[0].Security.Qualification.push({ code: value.qualCode, role: value.qual });
          }
        }
      });
      this.qualGrpList.forEach((value: any) => {
        if (value.isChecked) {
          if (this.cbpService.selectedElement !== null) {
            if (this.cbpService.selectedElement.dgType === DgTypes.Form) {
              this.cbpService.tableDataEntrySelected.Security.QualificationGroup.push({ code: value.qualGruopCode, role: value.qualGroup });
            } else {
              this.cbpService.selectedElement.Security.QualificationGroup.push({ code: value.qualGruopCode, role: value.qualGroup });
            }
          } else {
            this.cbpService.cbpJson.documentInfo[0].Security.QualificationGroup.push({ code: value.qualGruopCode, role: value.qualGroup });
          }
        }
      });
    }
    this.cbpService.selectedElement = this.viewUpdateTrack(this.cbpService.selectedElement);
    this.controlService.setSelectItem(this.cbpService.selectedElement);
    this.hide();
  }
  getRoleList() {
    this.loading = true;
    this.builderService.getRoles().subscribe((result: any) => {
      this.loading = false;
      if (result) {
        this.rolesList = result;//._embedded.roleDToes;
        this.rolesList['isChecked'] = false;
        this.updateListIds();
      }
    },
      (error) => {
        this.loading = false;
        console.log(error);
      });
  }
  setTableRoleQual(type: string) {
    const tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    const tableHead = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    tableHead[this.tableService.selectedRow[0].col]['SecurityRole'] = true;
    this.cbpService.colSelectedEntry = tablerows;
    for (let j = 0; j < tablerows.length; j++) {
      for (let k = 0; k < tablerows[j].entry.length; k++) {
        let col = this.tableService.selectedRow[0].col;
        if (col === k) {
          const children = tablerows[j].entry[k].children;
          for (let m = 0; m < children.length; m++) {
            if (!children[m]?.Security) { children[m].Security = new Security(); }
            if (type == 'save') {
              let rolesList = this.rolesList.filter((item: any) => item?.isChecked);
              rolesList.forEach((value: any) => {
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[j].entry[k].children[m].Security.Role.push({ code: value.roleCode, role: value.role });
              })
              let qualList = this.qualList.filter(item => item?.isChecked);
              qualList.forEach(value => {
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[j].entry[k].children[m].Security.Qualification.push({ code: value.qualCode, role: value.qual });
              })
              let qualGrpList = this.qualGrpList.filter(item => item?.isChecked);
              qualGrpList.forEach(value => {
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[j].entry[k].children[m].Security.QualificationGroup.push({ code: value.qualGruopCode, role: value.qualGroup });
              })
            }
          }
        }
      }
    }
  }
  searchQualName(event: any) {
    if (event.keyCode === 13) {
      this.getQualList();
    }
  }
  getQualList() {
    this.loading = true;
    this.qualName = this.qualName ?? '';
    this.builderService.getQual(this.qualName).subscribe((result: any) => {
      this.loading = false;
      if (result) {
        this.qualList = result;//._embedded.qualDToes;
        this.updateListIds();
      }
    },
      (error) => {
        this.loading = false;
        console.log(error);
      });
  }

  getQualGrpList() {
    this.loading = true;
    this.qualGroupName = this.qualGroupName ?? '';
    this.builderService.getQualGrp(this.qualGroupName).subscribe((result: any) => {
      this.loading = false;
      if (result) {
        this.qualGrpList = result;//?._embedded?.qualGroupDToes;
        this.updateListIds();
      }
    },
      (error) => {
        this.loading = false;
        console.log(error);
      });
  }
  searchQualGroupName(event: any) {
    if (event.keyCode === 13) {
      this.getQualGrpList();
    }
  }
  updateListIds() {
    this.rolesList.forEach((item: any) => { item.isChecked = false; });
    this.qualList.forEach((item: any) => { item.isChecked = false; });
    this.qualGrpList.forEach((item: any) => { item.isChecked = false; });
    if (this.cbpService.selectedElement?.Security === undefined) {
      this.cbpService.selectedElement['Security'] = new Security();
    }
    let element: any;
    if (this.cbpService.selectedElement !== null) {
      element = this.cbpService.selectedElement.dgType === DgTypes.Form ? this.cbpService.tableDataEntrySelected : this.cbpService.selectedElement;
    } else {
      element = this.cbpService.cbpJson.documentInfo[0];
    }
    if (element?.Security?.Role?.length > 0) {
      const result = this.rolesList.filter((o1: any) => element.Security.Role.some((o2: any) => o1.roleCode === o2.code));
      result.forEach((item: any) => { item.isChecked = true; });
      this.roleRestoreSnapchat = JSON.parse(JSON.stringify(element.Security.Role));
    }
    if (element?.Security?.Qualification?.length > 0) {
      const result = this.qualList.filter((o1: any) => element.Security.Qualification.some((o2: any) => o1.qualCode === o2.code));
      result.forEach((item: any) => { item.isChecked = true; });
      this.qualRestoreSnapchat = JSON.parse(JSON.stringify(element.Security.Qualification));
    }
    if (element?.Security?.QualificationGroup?.length > 0) {
      const result = this.qualGrpList.filter((o1: any) => element.Security.QualificationGroup.some((o2: any) => o1.qualGruopCode === o2.code));
      result.forEach((item: any) => { item.isChecked = true; });
      this.qualGroupRestoreSnapchat = JSON.parse(JSON.stringify(element.Security.QualificationGroup));
    }
  }

  viewUpdateTrack(selectedElement: any) {
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    return selectedElement;
  }
  reset() {
    this.qualName = '';
    this.qualGroupName = '';
    if (this.cbpService.selectedElement !== null) {
      if (this.activeTab == 0) {
        this.resetRoles(this.cbpService.selectedElement);
      }
      if (this.activeTab == 1) {
        this.resetQualList(this.cbpService.selectedElement);
      }
      if (this.activeTab == 2) {
        this.resetQualGroup(this.cbpService.selectedElement);
      }
    } else {
      if (this.activeTab == 1) {
        this.rolesList.forEach((item: any) => { item.isChecked = false; });
        this.cbpService.cbpJson.documentInfo[0].Security.Role = JSON.parse(JSON.stringify(this.roleRestoreSnapchat));
      }
      if (this.activeTab == 2) {
        this.qualList.forEach((item: any) => { item.isChecked = false; });
        this.cbpService.cbpJson.documentInfo[0].Security.Qualification = JSON.parse(JSON.stringify(this.qualRestoreSnapchat));
      }
      if (this.activeTab == 3) {
        this.qualGrpList.forEach((item: any) => { item.isChecked = false; });
        this.cbpService.cbpJson.documentInfo[0].Security.QualificationGroup = JSON.parse(JSON.stringify(this.qualGroupRestoreSnapchat));
      }
    }
    this.updateBtns();
    this.updateListIds();
  }
  resetQualGroup(selectedElement: any) {
    this.qualGrpList.forEach((item: any) => { item.isChecked = false; });
    this.cbpService.selectedElement.Security.QualificationGroup = JSON.parse(JSON.stringify(this.qualGroupRestoreSnapchat));
  }
  resetQualList(selectedElement: any) {
    this.qualList.forEach((item: any) => { item.isChecked = false; });
    selectedElement.Security.Qualification = JSON.parse(JSON.stringify(this.qualRestoreSnapchat));
  }
  resetRoles(Security: any) {
    this.rolesList.forEach((item: any) => { item.isChecked = false; });
    Security.Security.Role = JSON.parse(JSON.stringify(this.roleRestoreSnapchat));
    if (Security.Security.Role.length > 0) {
      const result = this.rolesList.filter((o1: any) => Security.Security.Role.some((o2: any) => o1.roleCode === o2.code));
      result.forEach((item: any) => { item.isChecked = true; });
    }
  }

  hide() {
    this.sharedService.closeModalPopup('Role-Qual');
    this.closeEvent.emit({ item: this.cbpService.selectedElement });
  }
  updateBtns(event: any = null, listPropName: string = '', index: number = 0) {
    if (!!event) {
      (this as any)[listPropName][index].isChecked = event;
    }
    const hasCheckedItem = ['rolesList', 'qualList', 'qualGrpList'].some(listName => (this as any)[listName]?.some((item: any) => item.isChecked));
    this.footerList = [{ type: 'Reset', disabled: !hasCheckedItem }, { type: 'Cancel' }, { type: 'Ok', disabled: !hasCheckedItem }];
    const unhasCheckedItem = ['rolesList', 'qualList', 'qualGrpList'].some(listName => (this as any)[listName]?.some((item: any) => !item.isChecked));
    this.footerList = [{ type: 'Reset', disabled: !unhasCheckedItem }, { type: 'Cancel' }, { type: 'Ok', disabled: !unhasCheckedItem }];
  }
}
