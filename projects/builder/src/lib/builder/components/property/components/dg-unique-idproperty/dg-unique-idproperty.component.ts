import { Component, EventEmitter, Input, OnChanges, OnInit, Output,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dg-unique-idproperty',
  templateUrl: './dg-unique-idproperty.component.html',
  styleUrls: ['./dg-unique-idproperty.component.css']
})
export class DgUniqueIdpropertyComponent implements OnInit,OnChanges{
  @Input() dgUniqueID: any;
  @Input() disabled = true;
  @Input() coverPageDgUniqueId: any;
  @Input() isCoverPage: any;
  @Input() name = 'UniqueID';
  @Output() dgUniqueIDChange: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dgUniqueID){  
     this.dgUniqueID =  changes.dgUniqueID.currentValue !== undefined? changes.dgUniqueID.currentValue:"0";
     //console.log(this.dgUniqueID);
    }
   }
  ngOnInit(): void {
    this.change()
  }
  change() {
    if (!this.isCoverPage) {
      this.dgUniqueIDChange.emit(this.dgUniqueID)
    } else {
      this.dgUniqueID = this.coverPageDgUniqueId !== '' ? this.coverPageDgUniqueId : this.dgUniqueID;
      this.dgUniqueIDChange.emit(this.coverPageDgUniqueId)
    }
  }


}
