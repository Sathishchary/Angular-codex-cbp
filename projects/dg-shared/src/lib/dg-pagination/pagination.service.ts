import { Injectable } from '@angular/core';
import { Pagination } from './pagination';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
 
  constructor() { }
  setPaginationData(maxSize: number, collectionSize: number, pagination: Pagination) {
    pagination.maxSize = maxSize;
    pagination.collectionSize = collectionSize;
    return pagination;
  }
}
