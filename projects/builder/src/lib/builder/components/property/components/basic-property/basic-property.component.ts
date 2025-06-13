import { Component, Input,OnInit, EventEmitter, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';

export interface BasicProperty{
  title?:string,
  dgType?:string,
  dgUniqueID?:any,
  fieldName?:any,
}

@Component({
  selector: 'lib-basic-property',
  templateUrl: './basic-property.component.html',
  styleUrls: ['./basic-property.component.css']
})

export class BasicPropertyComponent implements OnInit {
 
 @Input() property!:BasicProperty;
 @Input() field!:any;
 @Output() onFousEvent: EventEmitter<any> = new EventEmitter<any>();
 @Output() nameExistEvent: EventEmitter<any> = new EventEmitter<any>();
 
 constructor(public builderService: BuilderService, public cbpService: CbpService) {}

  ngOnInit(): void {
    if(this.field.dgType === DgTypes.FormulaDataEntry){
      this.property.fieldName = this.field.fieldName;
    }
  }

  checkNameExistOrnot(){
    this.nameExistEvent.emit();
  }
  onFocusEvent(){
    this.onFousEvent.emit();

  }
}
