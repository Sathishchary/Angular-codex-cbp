import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CbpService } from '../../services/cbp.service';
import { BuilderService }  from '../../services/builder.service';
import { DgTypes } from 'cbp-shared';
import { StylesService } from '../../shared/services/styles.service';
import { TableService } from '../../shared/services/table.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-headerfooter',
  templateUrl: './headerfooter.component.html',
  styleUrls: ['./headerfooter.component.css']
})
export class HeaderfooterComponent implements OnInit {

  @Input() hide: any;
  @Input() isDocPage = false;
  @Input() isBuilder = false;
  DgTypes: typeof DgTypes = DgTypes;
  @Input() cbpJson!: any;
  @Output() headerEvent: EventEmitter<any> = new EventEmitter();
  @Output() footerEvent: EventEmitter<any> = new EventEmitter();
  default="col-xs-12 col-md-12 col-lg-12";
  msgType: any;

  constructor(public cbpService: CbpService, public stylesService: StylesService,
     public tableService: TableService, public builderService: BuilderService) { }

  ngOnInit() {
  }
  changeHeader(){
    this.headerEvent.emit();
  }
  changeFooter(){
    this.footerEvent.emit();
  }

  onDrop(e:any, type:string){
    if(e.dragData === DgTypes.Table){ 
      this.tableService.isTableAdded = true;
      if(type === 'header'){
        this.cbpService.headerSelected = true;
        this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].header;
      //  this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].header;
      } else {
        this.cbpService.footerSelected = true;
        this.cbpService.selectedFooterElement = this.cbpService.cbpJson.documentInfo[0].footer;
       // this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].footer;
      }
    } else {
      // if(e.dragData === DgTypes.SignatureDataEntry){
      //   this.msgType = 'Signature';
      //   this.cbpService.showSwalDeactive('Header does not accept '+ this.msgType, 'warning', 'OK');
      // }
      // else if(e.dragData === DgTypes.InitialDataEntry){
      //   this.msgType = 'Initial';
      //   this.cbpService.showSwalDeactive('Header does not accept '+ this.msgType, 'warning', 'OK');
      // }
      // else {
      //   this.cbpService.showSwalDeactive('Header does not accept '+ e.dragData, 'warning', 'OK');
      // }
      this.cbpService.showSwalDeactive('Please select column or drag into correct position','warning', 'OK');
    }
  }
}
