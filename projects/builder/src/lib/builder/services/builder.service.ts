import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertMessages, DgTypes } from 'cbp-shared';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Section } from '../models/section.model';
import { TableService } from '../shared/services/table.service';
import { BuilderUtil } from '../util/builder-util';
import { CbpService } from './cbp.service';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  generateDOCXUrl: any;
  currentStep: any;
  formObect: any;
  currentStepArrayIndex: any;
  selectedIndex: any;
  selectedElement: any;
  propertyType = 'document';
  currentSelectedStep: any;
  numberShow = false;
  dateId = false;
  areaId = false;
  textData = false;
  dropId = false;
  languageCode = '1000';
  productID = '6000';
  // disabled up & down arrow
  disableUpArrow = true;
  disableDownArrow = false;
  stepChildren = [];
  selectedItem: any;
  indexValue: any;
  singleMedia = false;
  displayMsg: string | undefined | any;
  //undo Broadcaster
  dragElements: any = [DgTypes.LabelDataEntry, DgTypes.Warning, DgTypes.Caution, DgTypes.Note, DgTypes.Alara,
  DgTypes.Para, DgTypes.TextDataEntry, DgTypes.TextAreaDataEntry, DgTypes.FormulaDataEntry,
  DgTypes.NumericDataEntry, DgTypes.DateDataEntry, , DgTypes.Figures, DgTypes.SingleFigure,
  DgTypes.BooleanDataEntry, DgTypes.CheckboxDataEntry, DgTypes.DropDataEntry, DgTypes.Table,
  DgTypes.Link, DgTypes.Independent, DgTypes.Concurrent, DgTypes.QA, DgTypes.Peer, DgTypes.SignatureDataEntry,
  DgTypes.InitialDataEntry
  ];

  splChars = [';', ':', '"', "'", '+', '=', '>', '<', '?', '~', '`', '!', '@', '#', ' ', '/', '-',
    '$', '%', '^', '&', '*', '(', ')', '{', '}', '.', ',', '|', '\\', '[', ']'];
  tag: any;

  constructor(public http: HttpClient, public cbpService: CbpService,
    private _buildUtil: BuilderUtil, public tableService: TableService) {
    this.generateDOCXUrl = this.cbpService.eTimeApiURL + '/storage/generateDOCX?documentFileId=';
  }

  private dataSave = new Subject<any>();
  data_reso = this.dataSave.asObservable();
  setItem(obj: any) {
    this.dataSave.next(obj);
  }
  isEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
  }

  onAnyDrop(e: any, parent: any, pos: any) {
    let isItemVaild = true;
    if (e.dragData === DgTypes.Table) {
      this.cbpService.selectedElement = parent;
      if (this.cbpService.selectedElement.dgType === DgTypes.StepAction || this.cbpService.selectedElement.dgType === DgTypes.Section
        || this.cbpService.selectedElement.dgType === DgTypes.Repeat || this.cbpService.selectedElement.dgType === DgTypes.Timed) {
        this.tableService.isTableAdded = true;
      } else if (this.cbpService.selectedElement.dgType === DgTypes.StepInfo) {
        this.tableService.isTableAdded = true;
        this.cbpService.selectedElement.referenceOnly = true;
      } else {
        isItemVaild = false
        this.cbpService.showSwalDeactive(AlertMessages.sectionOrStepSelection, 'warning', 'OK');
      }
    } else {
      let obj: any = this._buildUtil.createElement(e.dragData);

      if (this.cbpService.selectedElement.dgType !== DgTypes.Section
        && this.cbpService.selectedElement.dgType !== DgTypes.StepAction
        && this.cbpService.selectedElement.dgType !== DgTypes.StepInfo
        && this.cbpService.selectedElement.dgType !== DgTypes.DelayStep
        && this.cbpService.selectedElement.dgType !== DgTypes.Timed
        && this.cbpService.selectedElement.dgType !== DgTypes.Repeat
        && this.cbpService.selectedElement.dgType !== DgTypes.LabelDataEntry
        && this.cbpService.selectedElement.dgType !== DgTypes.Para) {
        this.cbpService.showSwalDeactive(AlertMessages.sectionOrStepSelection, 'warning', 'OK');
        return;
      }

      parent.children ? parent.children : parent.children = [];
      if (obj) {
        obj = this.cbpService.setNewUserInfo(obj);
        if (parent.dgType === DgTypes.Section) {
          if (obj.dgType === DgTypes.Alara
            || obj.dgType === DgTypes.Warning
            || obj.dgType === DgTypes.Note
            || obj.dgType === DgTypes.Caution
            || obj.dgType === DgTypes.Para
            || obj.dgType === DgTypes.LabelDataEntry
            || obj.dgType === DgTypes.FormulaDataEntry
            || obj.dgType === DgTypes.Acknowledgement
            || obj.dgType === DgTypes.Figures
            || obj.dgType === DgTypes.Link) {
            if (obj.dgType === DgTypes.Figures) {
              obj['mediaType'] = 'multipleImages';
            }
            if (pos === -1) {
              parent.children.push(obj);
            } else {
              obj = this.cbpService.setNewUserInfo(obj);
              parent.children = this.insertObjSpecificPos(parent.children, pos, obj);
            }
          } else {
            isItemVaild = false;
            if (obj.dgType != DgTypes.VerificationDataEntry || obj.dgType != DgTypes.InitialDataEntry || obj.dgType != DgTypes.SignatureDataEntry) {
              this.dataSave.next(obj);
            }
            if (obj.dgType === DgTypes.VerificationDataEntry || obj.dgType === DgTypes.InitialDataEntry || obj.dgType === DgTypes.SignatureDataEntry) {
              isItemVaild = false;
              this.dataSave.next(obj);
            }
          }
        } else if (parent.dgType === DgTypes.StepInfo || parent.dgType === DgTypes.DelayStep) {
          if (obj.dgType === DgTypes.Para || obj.dgType === DgTypes.LabelDataEntry) {
            if (this.cbpService.isBackGroundDocument) {
              obj.dgUniqueID = 'b' + obj.dgUniqueID;
            }
            parent.children.push(obj);
          } else {
            if (obj.dgType === DgTypes.VerificationDataEntry || obj.dgType === DgTypes.InitialDataEntry || obj.dgType === DgTypes.SignatureDataEntry) {
              isItemVaild = false;
              this.dataSave.next(obj);
            }
            if (obj.dgType === DgTypes.Link || obj.dgType === DgTypes.Figures) {
              isItemVaild = false;
              this.dataSave.next(obj);
            }
            if (obj.dgType === DgTypes.Warning || obj.dgType === DgTypes.Caution || obj.dgType === DgTypes.Note || obj.dgType === DgTypes.Alara) {
              isItemVaild = false;
              this.dataSave.next(obj);
            }
            if (obj.dgType === DgTypes.TextDataEntry || obj.dgType === DgTypes.TextAreaDataEntry || obj.dgType === DgTypes.FormulaDataEntry || obj.dgType === DgTypes.NumericDataEntry
              || obj.dgType === DgTypes.DateDataEntry || obj.dgType === DgTypes.BooleanDataEntry
              || obj.dgType === DgTypes.DropDataEntry || obj.dgType === DgTypes.CheckboxDataEntry || obj.dgType === DgTypes.Table) {
              isItemVaild = false;
              this.dataSave.next(obj);
            }
          }
        } else {
          if (parent.dgType === DgTypes.StepAction && obj.dgType === DgTypes.VerificationDataEntry) {
            switch (obj.VerificationType) {
              case DgTypes.QA:
                parent.requiresQA = true;
                break;
              case DgTypes.Independent:
                parent.requiresIV = true;
                break;
              case DgTypes.Concurrent:
                parent.requiresCV = true;
                break;
              case DgTypes.Peer:
                parent.requiresPC = true;
                break;
              default:
                break;
            }
          }
          if (obj.dgType === DgTypes.Figures) {
            obj['mediaType'] = 'multipleImages';
          }
          if (pos === -1) { parent.children.push(obj); } else {
            parent.children = this.insertObjSpecificPos(parent.children, pos, obj);
          }
        }
        if (parent.dualStep) {
          obj['dualStep'] = true;
        }
        if (parent.rightdual || parent['rightdualchild']) {
          obj['rightdualchild'] = true;
        }
        if (parent.leftdual || parent['leftdualchild']) {
          obj['leftdualchild'] = true;
        }
        if (parent.dualStepType) {
          obj['dualStepType'] = parent.dualStepType;
        }
        obj['parentDgUniqueID'] = parent.dgUniqueID;
        obj['state'] = { hidden: true };
        obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
        if (this.cbpService.isBackGroundDocument) {
          obj.dgUniqueID = 'b' + obj.dgUniqueID;
        }
        obj['parentID'] = parent.dgSequenceNumber;
        obj['level'] = this.cbpService.selectedElement['level'] + 1;
        obj = this.cbpService.setParentStepInfo(obj, parent);
        if (isItemVaild) {
          this.cbpService.selectedElement = obj;
          this.cbpService.selectedUniqueId = obj['dgUniqueID'];
        }
        return obj;
      }
    }
  }

  getElement(parentID = '1.0', step: any) {
    switch (step.dgType) {
      case 'Section':
        return new Section();
        break;
      default:
        break;
    }
  }
  headersJson() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    const options = { headers: headers };
    return options;
  }

  checkNameEvent(event: any) {
    if (this.splChars.indexOf(event.key) > -1) {
      event.preventDefault();
    }
  }
  checkPasteEvent(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    const hasInvalidChars = this.splChars.some(char => pastedText.includes(char));

    if (hasInvalidChars) {
      event.preventDefault();
    }
  }
  addTemplateGrp() {
    const url = this.cbpService.eDocumentApiUrl + '/storage/group/details?companyID=' + this.cbpService.companyId;
    return this.http.get(url, this.headersJson());
  }
  getContentNames() {
    return this.http.get(this.categoryUrl('l1'), this.headersJson());
  }
  getTypeNames(name: any) {
    return this.typesReuseApi('l2', name)
  }
  getSubTypeNames(name: any) {
    return this.typesReuseApi('l3', name);
  }
  typesReuseApi(level: string, name: any) {
    return this.http.post(this.categoryUrl(level), name, this.headersJson());
  }
  categoryUrl(level: string) {
    return `${this.cbpService.eDocumentApiUrl}/categories/${level}/` + this.cbpService.companyId;
  }
  getFacilityGroupListInfo() {
    const url = '/company-group/facilities/';
    const uRl = this.cbpService.apiUrl + url + this.cbpService.companyId;
    return this.http.get(uRl, this.headersJson());
  }
  getCustomSearchCategoryItems(data: any, pageNumber: number, size: number, documentCategory: any = '', documentType: any = '', documentSubType: any = '', facility: any = '', documentNumber: any = '') {
    const params = `page=${pageNumber}&size=${size}&documentCategory=${documentCategory}&documentType=${documentType}&documentSubType=${documentSubType}&facility=${facility}&documentNumber=${documentNumber}`;
    const url = `${this.cbpService.eDocumentApiUrl}/customsearchresult` + params;
    return this.reuseAPIMethod(url, data);
  }
  formData() {
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.cbpService.accessToken) };
  }
  getEmbeddedDoc(docNbr: any) {
    const url = '/cbp/getByDocumentNbr';
    const uRl = this.cbpService.eTimeApiURL + url + '?documentNbr=' + docNbr;
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    return this.http.get(uRl, { headers: headers, observe: 'response', responseType: 'blob' });
  }

  getFunctionGroupNames() {
    return this.apiMethod('function');
  }
  getActionGroupNames() {
    return this.apiMethod('action');
  }
  getConditionGroupNames() {
    return this.apiMethod('condition');
  }
  apiMethod(urlName: string) {
    const url = this.cbpService.eDocumentApiUrl + '/cbp/document/' + urlName + '?companyID=' + this.cbpService.companyId;
    return this.http.get(url, this.formData());
  }

  cbpFileListData(docId: string) {
    const url = this.cbpService.eDocumentApiUrl + '/document/files/' + this.cbpService.companyId + '/' + docId;
    const headers = this.getAuthHeader();
    return this.http.get(url, {
      headers: headers, observe: 'response'
    }).pipe(tap(response => console.log('header', response.headers), error => {
      console.log(error.headers)
    }))
  }
  getAuthHeader() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cbpService.accessToken)
      .set('content-type', 'application/json');
    return headers;
  }
  downloadFile(url: any, authorization: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    return this.http.get(url, { headers: headers, observe: 'response', responseType: 'blob' });
  }

  documentCbpFileDown(docvid: any) {
    const url = this.cbpService.eTimeApiURL + '/storage/checkout?documentVersionId=' + docvid + '&userId=' + this.cbpService.loggedInUserId;
    const headers = this.getAuthHeader();
    return this.http.get(url, {
      headers: headers, observe: 'response', responseType: 'blob'
    }).pipe(tap(response => console.log('header', response.headers), error => {
      console.log(error.headers)
    }))
  }

  getRoles() {
    const url = this.cbpService.clientUrl + '/dg-common/roleData?companyID=' + this.cbpService.companyId + '&loggedInUserId=' + this.cbpService.loggedInUserId + '&status=0' + '&role&sort&order';
    return this.http.get(url, this.formData());
  }
  getQual(obj: any) {
    const url = this.cbpService.clientUrl + '/dg-common/qualiList?companyID=' + this.cbpService.companyId +
      '&loggedInUserId=' + this.cbpService.loggedInUserId + '&qual=' + obj + '&status=0' + '&sort&order';
    return this.http.get(url, this.formData());
  }
  getQualGrp(obj: any) {
    const url = this.cbpService.clientUrl + '/dg-common/qualgList?companyID=' + this.cbpService.companyId +
      '&loggedInUserId=' + this.cbpService.loggedInUserId + '&qualGruop=' + obj + '&status=0' + '&sort&order';
    return this.http.get(url, this.formData());
  }

  customSearchResultPagination(data: any, pageNumber: number, sort: any, size: number) {
    const params = `page=${pageNumber}&size=${size}`;
    const url = `${this.cbpService.eDocumentApiUrl}/customsearchresult?` + params;
    return this.reuseAPIMethod(url, data);
  }

  getCustomSearchItems(data: any, pageNumber: number, size: number, documentNumber: any, sort: any) {
    const params = `page=${pageNumber}&size=${size}&documentNumber=${documentNumber}&sort=${sort}`;
    const url = `${this.cbpService.eDocumentApiUrl}/customsearchresult?` + params;
    return this.reuseAPIMethod(url, data);
  }

  getReferenceInfo(refid: string = '', childRef: string = '') {
    let url = `${this.cbpService.eWorkURL}/cbp/referenceobjects/list/${this.cbpService.companyId}/${this.cbpService.loggedInUserId}`;
    if (refid !== '') {
      url = url + '?referenceObjectId=' + refid;
      url = url.replace('/referenceobjects/', '/referenceobjectsdetails/');
    }
    if (childRef !== '') {
      url = url + '&pRefObjRelationId=' + childRef;
      url = url.replace('/referenceobjects/', '/referenceobjectsdetails/');
    }
    const headers = this.getAuthHeader();
    return this.http.post(url, {}, { headers: headers, observe: 'response' }).pipe(tap(response => { }, error => { console.log(error.headers) }));
  }


  reuseAPIMethod(url: string, data: any) {
    const headers = this.getAuthHeader();
    return this.http.post(url, data, { headers: headers, observe: 'response' }).pipe(tap(response => { }, error => { console.log(error.headers) }));
  }
  // ASSETS & COLLECTION API

  buildSearchObject(userId: any, companyId: any, type: any) {
    const obj: any = { companyID: companyId, loggedInUserID: userId, customSearchFields: [] };
    if (type == 'ASSETS') { obj['searchID'] = 'DGLN0000000000000001'; }
    if (type == 'COLLECTION') { obj['searchFieldName'] = type; }
    return obj;
  }

  customSearch(userId: any, companyId: any, apiUrl: any, accessToken: any, type: any) {
    const restCall = 'customsearchresult?sort=createdDate,desc';
    const url = `${apiUrl}/${restCall}`;
    const headers = this.getAuthHeader();
    return this.http.post(url, this.buildSearchObject(userId, companyId, type), { headers: headers });
  }

  getCbpUserInfo(loggedInUserId: any) {
    const url = this.cbpService.apiSecurity + '/userprofile/edocument?userId=' + loggedInUserId;
    const headers = this.setHeaders();
    return this.http.get(url, headers);
  }
  downloadWord(url: string, authorization: string) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    return this.http.get(url, { headers: headers, observe: 'response', responseType: 'blob' });
  }

  headersForm() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    return headers;
  }
  setHeaders() {
    const headers = this.headersForm();
    const options = { headers: headers };
    return options;
  }
  getUserInfo() {
    const url = this.cbpService.oauthURL + '/user';
    const headers = this.setHeaders();
    return this.http.get(url, headers);
  }
  getUserInfoIndividual(accessToken: any) {
    const url = this.cbpService.oauthURL + '/user';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);
    return this.http.get(url, { headers: headers });
  }

  getWordDocumentBlob(documentid: string) {
    if (this.cbpService.accessToken == undefined) {
      try {
        let currentUser: any = localStorage.getItem('currentUser');
        if (typeof currentUser === 'string' && currentUser !== null)
          this.cbpService.accessToken = JSON.parse(currentUser)['access_token']
      } catch (error) {
        console.log(error);
      }
    }
    let url = this.cbpService.eTimeApiURL + '/storage/generateDOCX?documentFileId=' + documentid;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cbpService.accessToken);
    return this.http.get(url, { headers: headers, observe: 'response', responseType: 'blob' });
  }


  toDisabledForUpDownArrrow() {
    if (this.indexValue !== -1) {
      this.getIndex(this.stepChildren, this.selectedItem.dgUniqueID);
    } else {
      if (this.cbpService?.cbpJson?.section) {
        const element = this._buildUtil.getElementByNumber(this.selectedItem.parentID, this.cbpService.cbpJson.section);
        if (element && element.children) {
          this.getIndex(element.children, this.selectedItem.dgUniqueID);
        };
      }
    }
  }
  getIndex(selectedElement: any, id: any) {
    const i = selectedElement.findIndex((i: any) => i.dgUniqueID === id);
    this.disableUpArrow = i != 0 ? false : true;
    this.disableDownArrow = selectedElement.length - 1 != i ? false : true;
  }

  insertObjSpecificPos(arr: any, index: any, newItem: any) {
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
  }
  getPropertiesData() {
    const url = this.cbpService.clientUrl + '/dg-common/cbp-property/cbp-prop?userID=' + this.cbpService.loggedInUserId +
      '&companyID=' + this.cbpService.companyId;
    return this.http.get(url, this.formData());
  }

  getDocumentInfoDataCP(data: any, docId: any) {
    const url = `${this.cbpService.clientUrl}/e-work/edms/documentinfo/${this.cbpService.loggedInUserId}/${this.cbpService.companyId}/${docId}`;
    return this.http.post(url, data, this.formData()).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }


  getDropDownValues(data: any, pageSize: any) {
    const url = `${this.cbpService.eWorkURL}/package/attribute/data/${this.cbpService.loggedInUserId}?pageSize=${pageSize}`;
    return this.http.post(url, data, this.formData()).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }
}

