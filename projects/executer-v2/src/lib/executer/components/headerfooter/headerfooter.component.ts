import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { CbpExeService } from '../../services/cbpexe.service';
import { DatashareService } from '../../services/datashare.service';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-exe-headerfooter',
  templateUrl: './headerfooter.component.html',
  styleUrls: ['./headerfooter.component.css']
})
export class HeaderExefooterComponent {

  @Input() hide: any;
  @Input() isDocPage = false;
  @Input() isBuilder = false;
  @Input() stopCbpExecution = false;
  DgTypes: typeof DgTypes = DgTypes;
  @Input() documentSelected = false;
  @Input() freezePage: any;
  @Input() cbpJson!: any;
  @Output() headerEvent: EventEmitter<any> = new EventEmitter();
  @Output() footerEvent: EventEmitter<any> = new EventEmitter();
  @Output() validationEvent: EventEmitter<any> = new EventEmitter();
  @Output() headerOrFooter: EventEmitter<any> = new EventEmitter();
  @Output() setEntryDataJson: EventEmitter<any> = new EventEmitter();
  isMobile: boolean | undefined = false;
  standalone :any;

  constructor(public cbpService: CbpExeService,public dataSharingService: DatashareService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentSelected && this.documentSelected) {
      this.documentSelected = changes.documentSelected.currentValue;
    }
    if (changes.cbpJson && this.cbpJson) {
      this.cbpJson = changes.cbpJson.currentValue;
    }
    if (changes.freezePage && this.freezePage) {
      this.freezePage = changes.freezePage.currentValue;
    }
  }
  ngOnInit() {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.standalone =this.cbpService.forFooterHeight;
  }
  changeHeader() {
    this.headerEvent.emit();
  }
  changeFooter() {
    this.footerEvent.emit();
  }
  setHeaderFooterObj() {
    this.headerOrFooter.emit(this.hide);
  }

  checkValidation(eventObj: any, mainObj: any, eventValue: any) {
    this.validationEvent.emit({ event: eventObj, stepObj: mainObj, value: eventValue });
  }

  getSignatureData(ev1: any, ev2: any) {

  }
  saveDataJsonItem(item: any) {
    this.setEntryDataJson.emit(item);
  }

}
