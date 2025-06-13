import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CbpSharedService } from 'cbp-shared';
import { Actions, AuditTypes } from '../../models';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { TableService } from '../../shared/services/table.service';
@Component({
  selector: 'app-dropdown-items',
  templateUrl: './dropdown-items.component.html',
  styleUrls: ['./dropdown-items.component.scss']
})
export class DropdownItemsComponent implements OnInit, OnDestroy {
  filedDropDownName = '';
  @Input() dropDownItems: any = [];
  @Output()
  setDropValues: EventEmitter<any> = new EventEmitter();
  updateArray: any[] = [];
  updateArrayItem: any;
  updateModalPopup = false;
  editeditem = -1;
  error = false;
  constructor(public cbpService: CbpService, public controlService: ControlService,
    public tableService: TableService, public auditService: AuditService,
    public sharedService: CbpSharedService) { }
  ngOnInit() {
    this.sharedService.openModalPopup('largeModal2');
    if (this.tableService.isTableDropDown) {
      if (!this.tableService.isTableColumDropDown || this.tableService.isTableColumDropDown) {
        this.dropDownItems = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected.choice));
        this.updateItems();
      }
    } else {
      this.dropDownItems = JSON.parse(JSON.stringify(this.cbpService.selectedElement.choice));
      this.updateItems();
    }
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dropDownItems, event.previousIndex, event.currentIndex);
  }
  public onDragStart(event: CdkDragStart<any[]>) {
  }
  addItems() {
    this.error = false;
    if (!this.dropDownItems) {
      this.dropDownItems = [];
    }
    if (this.filedDropDownName != '' || this.filedDropDownName != undefined) {
      return;
    }
    const exist = this.itemExists(this.dropDownItems, this.filedDropDownName);
    if (!exist) {
      this.dropDownItems.push(this.filedDropDownName);
      this.filedDropDownName = '';
      this.updateItems();
    } else {
      this.error = true;
    }
  }
  enterKeyAdd(event: { keyCode: number; }) {
    if (event.keyCode === 13) {
      if (this.filedDropDownName != '' && this.filedDropDownName != undefined) {
        this.addOrUpdateItems();
      } else {
        return
      }

    }
  }
  updateItems() {
    this.updateArray = [];
    if (this.dropDownItems !== undefined) {
      this.dropDownItems.forEach((result: any) => {
        this.updateArray.push(result);
      });
    }
  }

  fielddataUp(i: number) {
    this.updateArray.forEach((e, n) => {
      if (n == i && i != 0) { this.setItemInfo(i - 1, i); }
    });
    this.reverseUpdateInItems();

  }
  fielddataDown(i: number) {
    this.updateArray.forEach((e, n) => {
      if (n == i && this.updateArray.length - 1 != i) { this.setItemInfo(i + 1, i); }
    });
    this.reverseUpdateInItems();
  }

  setItemInfo(item: number, i: number) {
    let temp = this.updateArray[item];
    this.updateArray[item] = this.updateArray[i];
    this.updateArray[i] = temp;
  }

  reverseUpdateInItems() {
    this.dropDownItems = this.updateArray;
  }

  deleteItem(item: any, pos: any) {
    this.dropDownItems.splice(pos, 1);
  }

  UpdateItem(item: any, pos: any, newdata: any) {
    this.updateModalPopup = true;
    this.editeditem = pos;
    this.filedDropDownName = item;
  }

  addOrUpdateItems() {
    this.error = false;
    if (!this.dropDownItems) {
      this.dropDownItems = [];
    }
    if (this.filedDropDownName == '' || this.filedDropDownName == undefined) {
      return;
    }
    const exist = this.itemExists(this.dropDownItems, this.filedDropDownName);
    if (!exist) {
      this.editeditem == -1 ? this.dropDownItems.push(this.filedDropDownName) : this.dropDownItems[this.editeditem] = this.filedDropDownName;
      this.filedDropDownName = ''
      this.updateItems();
    } else {
      if (this.editeditem == -1) { this.error = true }
      if (!(this.dropDownItems[this.editeditem] == this.filedDropDownName)) {
        this.error = true
      } else {
        this.filedDropDownName = '';
      }
    }
    if (this.editeditem != -1) {
      this.updateModalPopup = false;
      this.editeditem = -1;
    }
  }

  itemExists(arr: any[], item: string) {
    return arr.some((el: any) => el === item);
  }
  saveDropdownItems() {
    if (this.tableService.isTableDropDown) {
      if (!this.tableService.isTableColumDropDown || this.tableService.isTableColumDropDown) {
        if (this.cbpService.tableDataEntrySelected)
          this.cbpService.tableDataEntrySelected.choice = this.dropDownItems;
      }
      if (this.updateArray?.length != this.cbpService.tableDataEntrySelected?.choice?.length) {
        this.viewUpdateTrack(this.cbpService.tableDataEntrySelected);
      }
      this.hide();
      if (this.cbpService.tableDataEntrySelected)
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, AuditTypes.PROPERY_TABLE_DROPDOWN_VALUE, { index: this.cbpService.tableDataEntrySelected.choice.length - 1 })
    }
    else {
      if (!this.cbpService.selectedElement.choice) {
        this.cbpService.selectedElement.choice = [];
      }
      if (this.updateArray?.length != this.cbpService.selectedElement?.choice?.length) {
        this.viewUpdateTrack(this.cbpService.selectedElement);
      }
      if (this.cbpService.selectedElement?.choice)
        this.cbpService.selectedElement.choice = this.dropDownItems;
      this.hide();
      if (this.cbpService.selectedElement?.choice)
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.PROPERY_DROPDOWN_VALUE, { index: this.cbpService.selectedElement.choice.length - 1 })
    }
  }
  viewUpdateTrack(selectedElement: any) {
    // selectedElement = this.cbpService.setUserUpdateInfo(selectedElement);
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  saveItemes() {
    this.setDropValues.emit(this.dropDownItems);
  }
  ngOnDestroy(): void {

  }
  hide() {
    this.cbpService.dropItems = false;
    this.tableService.isTableDropDown = false;
    if (!this.tableService.isTableProperties) {
      if (this.tableService.isTableColumDropDown) {
        this.sharedService.closeModalPopup('largeModal2');
      } else {
        this.sharedService.closeModalPopup('largeModal2');
      }
    }
    if (this.tableService.isTableProperties) {
      this.sharedService.hideModal('largeModal2');
    }
    this.tableService.isTableColumDropDown = false;
  }
  saveDropdown() {
    if (this.tableService.isTableDropDown || this.tableService.isTableColumDropDown) {
      this.saveItemes();
    }
    this.saveDropdownItems();
  }
}
