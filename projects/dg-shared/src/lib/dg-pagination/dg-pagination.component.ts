import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from './pagination';
@Component({
  selector: 'app-pagination',
  template: `
  <ngb-pagination [collectionSize]="pagination.collectionSize" [class.hidden]="pagination.collectionSize===0"
    [(page)]="pagination.page" [maxSize]="5" [rotate]="true" [pageSize]="pagination.maxSize"
    [boundaryLinks]="true" (pageChange)="notifyParent($event)"></ngb-pagination>
  `,
  styles: [
    `.hidden {
      display: none !important;
    }`
  ]
})
export class DgPaginationComponent implements OnInit {

  @Input() page = 1;
  @Input() collectionSize!: number;
  @Input() maxSize!: number;
  @Input() pagination: Pagination = new Pagination();
  @Output() pageNumber: EventEmitter<number>;

  constructor() {
    this.pageNumber = new EventEmitter();
   }

  ngOnInit() {
  }

  notifyParent(event:any) {
    this.pageNumber.emit((event - 1));
  }

}
