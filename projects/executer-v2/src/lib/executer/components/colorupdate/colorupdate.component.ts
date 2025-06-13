import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { CbpSharedService } from 'cbp-shared';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { TableService } from '../../shared/services/table.service';

@Component({
  selector: 'app-colorupdate',
  templateUrl: './colorupdate.component.html',
  styleUrls: ['./colorupdate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorupdateComponent implements OnInit {
  @Output() closeColor: EventEmitter<any> = new EventEmitter();
  setColor!:string;
  title = 'Set Color';
  @Input() documentInfo:any;
  defaultColor = '#000000';
  constructor(public cbpService: CbpExeService, public cdref: ChangeDetectorRef,
    public sharedService: CbpSharedService, public executionService: ExecutionService,
    public tableService: TableService) { }

  ngOnInit(): void {
    this.sharedService.openModalPopup('colorUpdate');
    this.documentInfo['color'] = this.documentInfo['color'] ?? '#000000';
    this.defaultColor =  this.documentInfo['color'];
    this.setColor = this.documentInfo['color'];
    if(this.setColor !== '#000000' && this.setColor !== '#00FF00' && this.setColor !== '#ff0000' &&
     this.setColor !== '#0000ff'){
     this.setCustom(this.setColor)
    }
   }

  ngAfterViewInit(){
    this.title = JSON.parse(JSON.stringify(this.title));
    this.cdref.markForCheck();

  }
  update(color:any){
    this.sharedService.closeModalPopup('colorUpdate');
    this.closeColor.emit(color);
  }

  cancel(){
    this.sharedService.closeModalPopup('colorUpdate');
    this.closeColor.emit(false);
  }
  setCustom(event:any){
   this.defaultColor = event;
  }


}
