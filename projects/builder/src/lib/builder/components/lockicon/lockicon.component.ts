import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
@Component({
  selector: 'lib-lockicon',
  templateUrl: './lockicon.component.html',
  styleUrls: ['./lockicon.component.css']
})
export class LockiconComponent implements OnInit {
  @Input() selectedElement: any;
  @Input() type: string = '';
  dataTypeItem:any;
  dgType = DgTypes;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
     for (let propName in changes) {
    let change = changes[propName];
     if (propName === 'selectedElement' && change.currentValue) {
     this.selectedElement= change.currentValue;
     }
    }
    }

  ngOnInit(): void {
    this.dataTypeItem = [this.dgType.SignatureDataEntry, this.dgType.InitialDataEntry];
  }


}
