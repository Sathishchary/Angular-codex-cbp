import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { CodeValue } from '../executer/models';

@Injectable({ providedIn: 'root' })
export class DataWrapperService {

  codeValueService: CodeValue = new CodeValue;
  loggedInUserId!: string;
  documentFileId!: string;
  accessToken!: string;
  loggedInUserName!: any;
  emailId: any;
  apiUrl!: string;
  companyID!: string;
  productCode: string = '';
  // instanceid!: string;
  // packagefileid!: string;
  // locationid!:string;
  oauthURL: any;
  constructor(public http: HttpClient, public domSanitizer: DomSanitizer) {
    this.setCodeValues();
  }

  // //Rising Events
  // private executorEventSource = new BehaviorSubject<Request_Msg>({});
  // eventMessageFromPlugin = this.executorEventSource.asObservable();
  // sendMessageFromLibToOutside(msg: Request_Msg) {
  //     this.executorEventSource.next(msg);
  // }

  // //Retriving Events
  // private retriveEventSource = new BehaviorSubject<Resp_Msg>({});
  // receivedMessage = this.retriveEventSource.asObservable();
  // sendMessageFromOutsideToPlugin(msg: Resp_Msg) {
  //     this.retriveEventSource.next(msg);
  // }


  setCodeValues() {
    this.codeValueService = new CodeValue();
    this.codeValueService.codeName = 'COMMENT_TYPE';
    this.codeValueService.languageCode = '1000';
    this.codeValueService.productID = '6000';
    this.codeValueService.companyID = 'DGLN0000000000000001';
    this.codeValueService.userID = 'DGLN0000000000000001';
  }



  formData() {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken);
    const options = { headers: headers };
    return options;
  }
  isEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
  }
  getCodeValues(codeValue: CodeValue) {
    const url = this.apiUrl + '/e-document/getcodevalues';
    return this.http.post(url, codeValue, this.formData());
  }
  getFacilityGroupListInfo() {
    const url = '/dg-common/company-group/facilities/';
    const uRl = this.apiUrl + url + this.codeValueService.companyID;
    return this.http.get(uRl, this.formData());
  }

  getUnitGroupList(facilityID: string) {
    const url = '/dg-common/company-group/units/' + this.codeValueService.companyID + '/' + facilityID;
    const uRl = this.apiUrl + url;
    return this.http.get(uRl, this.formData());
  }

  savePinkInk(data: any) {
    let id = this.documentFileId ? this.documentFileId : 'DGLN0000000000005146';
    let pack = { fieldName: 'PACKAGE_FILE_ID', fieldValue: id };
    data.fields.push(pack);
    data.companyId = this.companyID;
    console.log("in service DataWrapper", data)
    const url = this.apiUrl + '/e-work/otsc/createfrominstance/' + this.companyID + '/' + this.loggedInUserId;
    return this.http.post(url, data, this.formData());
  }

  saveCbpFile(formData: any) {
    const url = this.apiUrl + '/dgDocumentManager/storage/uploadEdit/DGLN0000000000000001';
    return this.http.post(url, formData, this.formData());
  }
  checkInDocument(formData: any) {
    const url = this.apiUrl + '/dgDocumentManager/document/checkinDocumentFile/' + this.loggedInUserId + '/' + this.documentFileId;
    return this.http.post(url, formData, this.formData());
  }

  getCbpUserInfo(loggedInUserId: any) {
    let urlproduct: any = '';
    if (this.productCode) { urlproduct = `&productCode=${this.productCode}`; }
    const url = `${this.apiUrl}/e-security/userprofile/edocument?userId=${loggedInUserId}&companyId=${this.codeValueService.companyID}${urlproduct}`;
    const headers = this.setHeaders();
    return this.http.get(url, headers);
  }

  securityLogin(authorization: string, body: any) {
    const url = this.oauthURL + '/oauth/token';
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', authorization)
      .set('X-TENANT-ID', 'DGLN0000000000000001');
    const options = { headers: headers };
    return this.http.post(url, body, options);
  }

  headersForm() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Bearer ' + this.accessToken);
    return headers;
  }
  setHeaders() {
    const headers = this.headersForm();
    const options = { headers: headers };
    return options;
  }
  getUserInfo() {
    const url = this.oauthURL + '/user';
    const headers = this.setHeaders();
    return this.http.get(url, headers);
  }
  getUserInfoIndividual(accessToken: any) {
    const url = this.oauthURL + '/user';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);

    return this.http.get(url, { headers: headers });
  }
  saveJsonZipFile(file: string | Blob, instanceid: any, locationid: any, packagefileid: any) {
    const formData = new FormData();
    formData.append('file', file);
    const url = this.apiUrl + '/dgDocumentManager/cbp/loadExecData/' +
      this.loggedInUserId + '?instanceId=' + instanceid + '&locationId=' +
      locationid + '&packageFileId=' + packagefileid;
    return this.http.post(url, formData, this.formData());
  }
  refreshJsonZipFile(instanceid: any) {
    const url = this.apiUrl + '/dgDocumentManager/cbp/refresh?instanceId=' + instanceid;
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.post(url, '', { headers: headers, observe: 'response', responseType: 'blob' });
  }
  sendEmail(emailObj: any) {
    const url = this.apiUrl + '/e-work/sendmail/' + this.loggedInUserId + '/' + this.companyID;
    return this.http.post(url, emailObj, this.formData());
  }

  getReferenceInfo(refid: string = '', childRef: string = '') {
    let url = `${this.apiUrl}/e-work/cbp/referenceobjects/list/${this.codeValueService.companyID}/${this.loggedInUserId}`;
    if (refid !== '') {
      url = url + '?referenceObjectId=' + refid;
      url = url.replace('/referenceobjects/', '/referenceobjectsdetails/');
    }
    if (childRef !== '') {
      url = url + '&pRefObjRelationId=' + childRef;
      url = url.replace('/referenceobjects/', '/referenceobjectsdetails/');
    }
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.post(url, {}, { headers: headers, observe: 'response' }).pipe(tap(response => { }, error => { console.log(error.headers) }));
  }
  getLinkInfo(selectedText: any) {
    let url = `${this.apiUrl}/e-work/cbp/referenceobjectsdetails/detailname/${this.codeValueService.companyID}/${this.loggedInUserId}`;
    if (selectedText !== '') {
      url = url + '?refObjDtlName=' + selectedText;
    }
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.post(url, {}, { headers: headers, observe: 'response' }).pipe(tap(response => { }, error => { console.log(error.headers) }));

  }

}
