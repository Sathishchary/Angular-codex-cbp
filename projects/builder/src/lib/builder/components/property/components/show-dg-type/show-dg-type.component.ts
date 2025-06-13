import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';

@Component({
  selector: 'app-show-dg-type',
  templateUrl: './show-dg-type.component.html',
  styleUrls: ['./show-dg-type.component.css']
})
export class ShowDgTypeComponent implements OnInit {
  @Input() dgType: any;
  @Input() disabled = false;
  @Input() showAll = false;
  allElements:any[] = [];
  dataEntries = ['TextDataEntry', 'TextAreaDataEntry', 'NumericDataEntry', 'DateDataEntry', 'CheckboxDataEntry', 'DropDataEntry',
     'BooleanDataEntry', 'Para', 'LabelDataEntry','FormulaDataEntry' ];
  dragElements = [DgTypes.LabelDataEntry, DgTypes.Warning,DgTypes.Caution, DgTypes.Note,
  DgTypes.Para, DgTypes.TextDataEntry, DgTypes.TextAreaDataEntry,DgTypes.FormulaDataEntry, DgTypes.NumericDataEntry, DgTypes.DateDataEntry,
  DgTypes.BooleanDataEntry, DgTypes.CheckboxDataEntry, DgTypes.DropDataEntry, DgTypes.Table, DgTypes.Figures,
  DgTypes.Link,DgTypes.Independent,DgTypes.Concurrent,DgTypes.QA,DgTypes.Peer,DgTypes.SignatureDataEntry, DgTypes.InitialDataEntry];
  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dgType && this.dgType) { 
      this.setFields();
     } 
  }

  ngOnInit() {
    this.setFields();
  }
  setFields(){
    if(this.showAll){ this.allElements = this.dragElements;} else {
      if(!this.dataEntries.includes(this.dgType)) { this.dataEntries.push(this.dgType); }
      this.allElements = this.dataEntries; 
   }
  }

  setDgType(event:any){
    this.dgType = event;
  }
}
