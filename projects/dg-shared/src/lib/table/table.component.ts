import { Component, Input, OnInit, SimpleChanges, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { TableService } from './table.service';

export interface TableCol {
  name:string;
  width?:string;
  color?:string;
  sorting?:string;
  size?: string;
}

@Component({
  selector: 'dg-lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [TableService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  
  @Input() tableCols: TableCol[] = [];
  @Input() tableRows: [] = [];
  @Input() theadClass:any;
  @Input() trClass:any;
  @Input() tdClass:any;
  @Input() tbodyClass:any;
  @Output() rowEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() updatePagination:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnChanges(changes: SimpleChanges){

  }


  ngOnInit(): void {
  }
  
  rowEventChecked(item:any){
    this.rowEvent.emit(item);
  }


}
