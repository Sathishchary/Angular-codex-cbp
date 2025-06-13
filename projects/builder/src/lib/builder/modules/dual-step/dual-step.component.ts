import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';

@Component({
  selector: 'app-dual-step',
  templateUrl: './dual-step.component.html',
  styleUrls: ['./dual-step.component.css']
})
export class DualStepComponent implements OnInit, OnChanges {

  @Input() styleLevelObj:any;
  @Input() childObj:any;
  @Input() dualStepObj:any;
  @Output() deleteStep: EventEmitter<any> = new EventEmitter();
  @Output() emitParent: EventEmitter<any> = new EventEmitter();
  DgTypes: typeof DgTypes = DgTypes;

  constructor(public builderService: BuilderService, public cbpService:CbpService) { }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.childObj && this.childObj) {
      this.childObj = changes.childObj.currentValue;
    } 
    if (changes.dualStepObj && this.dualStepObj) {
      this.dualStepObj = changes.dualStepObj.currentValue;
    } 
  }
  ngOnInit(): void {
    if(this.cbpService.selectedElement.stepType === 'DualStepAlignment'){
      
    }
  }
  
   
  selecteItem(item:any){
    this.emitParent.emit(item);
  }
  _deleteStep() {
    this.deleteStep.emit();
  }

  getLinkSection(e:any){

  }

   //Track by for Performance
   trackDgUniqueID(index: number, item: any): any {
    if(item){
      return item.dgUniqueID;
    }
  }

  dataEntryDrop(event:any, obj:any, i:number){

  }
  
}
