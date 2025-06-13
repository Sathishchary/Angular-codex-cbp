
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';

import { CustomSearchUtills } from './CustomSearchUtils';
import { Sort } from './sort';

import { CbpSharedService } from 'cbp-shared';
import { Pagination, PaginationService } from 'dg-shared';
import { Actions, AuditTypes, SelectCategory } from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css', '../../util/modal.css']
})
export class SelectTemplateComponent implements OnInit, OnDestroy {
  documentCat: SelectCategory = new SelectCategory();
  loading = false;
  checkDocumentAllValue = false;
  categoryNames: any;
  catname: '' = "";
  typename = '';
  subName = '';
  facility: '' = "";
  typeNames: any[] = [];
  subTypeNames: any[] = [];
  listOfFacilities: any[] = [];
  customListData: any[] = [];
  selectedItems: any[] = [];
  edocumentPagi: any;
  documentCategory = '';
  documentType = '';
  documentSubType = '';
  facilityType: string = '';
  fileList: any;
  edocument_pagCall = false;
  edocumentlistPagi: Pagination = new Pagination();
  @Output()
  embededProcedure: EventEmitter<any> = new EventEmitter();
  @Output()
  fileOpen: EventEmitter<any> = new EventEmitter();
  fieldCustomdata!: { 'companyID': any; 'loggedInUserID': any; 'searchID': string; 'customSearchFields': any[]; 'searchFieldName': any; };
  docName: any;
  status: any;
  documentlistSorting: Sort = new Sort();
  document_sort_value = "";
  /* For sorting orders */
  sortOrder = 'desc'; // Collection sort order by default desc;
  selectedSort = 'createdDate'; // For sorting the Collection by default CreatedDate.
  rowsSize = 12; // Default row size;
  selectedDoc: any;

  constructor(public cbpService: CbpService, public builderService: BuilderService,
    public notifier: NotifierService, public sanitizer: DomSanitizer,
    public auditService: AuditService, public paginationService: PaginationService, public sharedService: CbpSharedService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('Select-template');
    this.getCategoryNames();
    this.getListOfFacilities();
    this.getCustomList();
  }
  hide() {
    this.cbpService.istemplateOpen = false;
    this.cbpService.isEmbedOpen = false;
    this.cbpService.isEdocLink = false;
    this.sharedService.closeModalPopup('Select-template');

  }
  addSelectTemplate() {
    if (this.documentCat.category === undefined || this.documentCat.category === null
      || this.documentCat.category === '') {

      return false;
    }
    if (this.documentCat.type === undefined || this.documentCat.type === null
      || this.documentCat.type === '') {

      return false;
    }
    if (this.documentCat.subtype === undefined || this.documentCat.subtype === null
      || this.documentCat.subtype === '') {

      return false;
    }
    if (this.documentCat.facility === undefined || this.documentCat.facility === null
      || this.documentCat.facility === '') {

      return false;
    }
    this.builderService.addTemplateGrp().subscribe((result: any) => {
      this.loading = false;
      if (result.statusCode === 207) {
        alert('warning');
      } else if (result.statusCode === 200) {
        alert('success');
      } else {
        alert('warning');
      }
    },
      (error: any) => {
        console.log('error', 'Data miss match');
        this.loading = false;
      });
  }
  getCategoryNames() {
    this.loading = true;
    this.builderService.getContentNames().subscribe((result: any) => {
      this.loading = false;
      this.categoryNames = result;
    },
      (error) => {
        this.loading = false;
        this.notifier.notify('error', 'Data mismatch');
      });
  }
  categoryChange(id: any) {
    let categoryObj = this.categoryNames.find((item: any) => item.id === id);
    this.catname = categoryObj ? categoryObj?.name : '';
    if (this.catname !== '') {
      this.getTypeNames(this.catname);
    } else {
      this.typename = '';
      this.subName = '';
      this.facility = '';
      this.subTypeNames = [];
      this.typeNames = [];
      this.listOfFacilities = [];
    }
    this.documentCat.type = '';
    this.documentCat.subtype = '';
  }
  renderEmbededProcedure() {
    this.cbpService.selectedElement.property.documentNumber = this.selectedDoc.documentNumber;
    this.cbpService.selectedElement.property['documentTitle'] = this.selectedDoc.documentTitle;
    this.cbpService.selectedElement.property['documentID'] = this.selectedDoc.documentID;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.EMBEDED_DOC_NUM, { propName: 'documentNumber' })
    this.embededProcedure.emit({
      versionId: this.selectedDoc.documentVersionId,
      uri: this.cbpService.selectedElement.property.documentNumber,
      status: this.status
    });
    this.hide();
  }
  renderEdocumentConfigure() {
    this.cbpService.selectedElement.uri = this.docName;
    this.cbpService.selectedElement.edocObject = this.selectedDoc;
    this.embededProcedure.emit({ docObj: this.selectedDoc, uri: this.cbpService.selectedElement.uri, status: this.status });
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.PROPERY_LINK_DOC, { propName: 'uri' })
    this.hide();
  }
  getTypeNames(name: any) {
    this.loading = true;
    const nameOne = {
      'name1': name
    };
    this.builderService.getTypeNames(nameOne).subscribe((result: any) => {
      this.loading = false;
      this.typeNames = result;
      this.typename = '';
      this.subName = '';
      this.facility = '';
    },
      (error) => {
        this.loading = false;
        this.notifier.notify('error', 'Data mismatch');
      });
  }
  typeChange(id: any) {
    let typeObj = this.typeNames.find(item => item.id == id);
    this.typename = typeObj ? typeObj?.name : '';
    if (this.typename !== '') {
      this.getSubTypeNames(this.typename);
    } else {
      this.subName = '';
      this.facility = '';
      this.documentCat.subtype = '';
      this.subTypeNames = [];
      this.listOfFacilities = [];
    }
  }
  getSubTypeNames(name: any) {
    this.loading = true;
    const nameTwo = {
      'name1': this.catname,
      'name2': name
    };
    this.builderService.getSubTypeNames(nameTwo).subscribe((result: any) => {
      this.loading = false;
      this.subTypeNames = result;
      this.subName = '';
      this.facility = '';
    },
      (error) => {
        this.loading = false;
        this.notifier.notify('error', 'Data mismatch');
      });
  }
  getListOfFacilities() {
    this.builderService.getFacilityGroupListInfo().subscribe((result: any) => {
      this.listOfFacilities = result;
    },
      (error) => {
        this.loading = false;
        console.log(error);
      });
  }
  searchDocumentNumber(event: any) {
    if (event.keyCode === 13) {
      this.getCustomList();
    }
  }
  clear() {
    this.documentCat = new SelectCategory();
    this.subName = '';
    this.catname = '';
    this.facility = '';
    this.typename = '';
    this.documentCat.documentNumber = '';
    this.getCustomList();
  }
  subTypeChange(id: any) {
    let subTypeObj = this.subTypeNames.find(item => item.id == id);
    this.subName = subTypeObj ? subTypeObj?.name : '';
  }
  sortOrderClick(name: string) {
    if (name === 'statusdate') {
      this.documentlistSorting.isSortEnabled = !this.documentlistSorting.isSortEnabled;
      this.document_sort_value = this.documentlistSorting.isSortEnabled ? 'DGC_DOCUMENT_STATUS_DATE,asc' : 'DGC_DOCUMENT_STATUS_DATE,desc';
    }
    if (name === 'document') {
      this.documentlistSorting.isSortEnabled = !this.documentlistSorting.isSortEnabled;
      this.document_sort_value = this.documentlistSorting.isSortEnabled ? 'DGC_DOCUMENT_NBR,asc' : 'DGC_DOCUMENT_NBR,desc';
    }
    this.getCustomList();
  }
  facilityChange(event: any) {
    let facilityObj = this.listOfFacilities.find(item => item?.id === event.target.value);
    this.facility = facilityObj ? facilityObj.name : '';
  }
  getCustomList() {
    let jsonCustomData = [];
    jsonCustomData = CustomSearchUtills.prepareCustomSearchForSelectTemplateDailog(this.catname, this.typename, this.subName, this.documentCat.documentNumber, this.facility,this.cbpService.docID);
    this.fieldCustomdata = {
      'companyID': this.cbpService.companyId,
      'loggedInUserID': this.cbpService.loggedInUserId,
      'searchID': 'DGLN0000000000000003',
      'customSearchFields': jsonCustomData,
      'searchFieldName': 'DOCUMENT'
    };
    this.loading = true;
    // this.builderService.getCustomSearchItems(this.fieldCustomdata, 0, 12, this.documentCat.category, this.documentCat.type, this.documentCat.subtype, this.documentCat.facility, this.documentCat.documentNumber).subscribe((responce: any) => {
    this.builderService.getCustomSearchItems(this.fieldCustomdata, 0, this.rowsSize, '', this.document_sort_value).subscribe((responce: any) => {
      this.loading = false;
      if (responce.body.page.totalElements === 0) {
        this.customListData = [];
        this.notifier.hideAll();
        this.notifier.notify('info', 'No records are available');
        this.edocumentlistPagi = this.paginationService.setPaginationData(0, 0, this.edocumentlistPagi);
      } else {
        this.customListData = responce.body._embedded.dGEDocumentListDToes;
        if (this.cbpService.isEmbedOpen)
          this.customListData = this.customListData.filter(item => item.fileType == 'CBP');
        this.edocument_pagCall = true;
        let docId = this.cbpService.docFileStatus;
        if(docId){
         this.customListData = this.customListData.filter((item: any) => item.documentID !== docId);
       }
        this.edocumentlistPagi =
          this.paginationService.setPaginationData(responce.body.page.size, responce.body.page.totalElements, this.edocumentlistPagi);
      }
    },
      (error: any) => {
        this.notifier.notify('warning', 'Data mismatch');
        this.loading = false;
      });
  }
  showPage(event: any) {
    if (this.edocument_pagCall) {
      this.loadSelectedPageData(event);
    }
  }
  loadSelectedPageData(pageNumber: number) {
    this.loading = true;
    this.builderService.customSearchResultPagination(this.fieldCustomdata, pageNumber, this.sortOrder, this.rowsSize)
      .subscribe((result: any) => {
        this.loading = false;
        this.customListData = result.body._embedded.dGEDocumentListDToes;
        if (this.cbpService.isEmbedOpen)
          this.customListData = this.customListData.filter(item => item.fileType == 'CBP');
        this.edocumentlistPagi = this.paginationService.setPaginationData(result.body.page.size, result.body.page.totalElements, this.edocumentlistPagi);
      },
        (error: any) => {
          this.loading = false;
          this.notifier.notify('error', 'Server Error! try again after some time.');
        });
  }
  checkDocumentIds(id: any, event: any, docObj: any, i: number) {
    this.selectedDoc = docObj;
    if (event.target.checked) {
      this.customListData.forEach((item: any) => { item.isChecked = false });
      this.customListData[i].isChecked = true;
      this.selectedItems.push(this.customListData[i].documentID);
      // this.docName = this.customListData[i].documentNumber;
      this.docName = this.customListData[i].documentVersionId;
      this.status = this.customListData[i].status;
    } else {
      this.customListData.forEach((item: any) => { item.isChecked = false });
    }
  }
  edocumentCBP(fileblob: any) {
    var file = new File([fileblob], 'sample.cbp');
    this.fileList = [];
    this.fileList.push(file)
    this.fileOpen.emit(this.fileList)
  }
  downloadocFile() {
    if (this.selectedDoc.status === 1000 || this.selectedDoc.status === 10000) {
      this.builderService.documentCbpFileDown(this.selectedDoc.documentVersionId).subscribe((result: any) => {
        // console.log(result);
        this.edocumentCBP(result.body);
        this.hide();

      }, error => {
        this.loading = false;
        this.notifier.notify('error', 'Something went wrong');
        console.error(error)
      });
    } else {
      this.loading = false;
      this.notifier.notify('error', 'Can not open this file');
    }
  }


  addSelectTemp() {
    if (!this.cbpService.isEmbedOpen && !this.cbpService.isEdocLink) {
      this.downloadocFile();
    }
    else if (this.cbpService.isEmbedOpen) {
      this.renderEmbededProcedure();
    }
    else if (this.cbpService.isEdocLink) {
      this.renderEdocumentConfigure();
    }
  }

  ngOnDestroy() {
    this.hide();
  }

}
