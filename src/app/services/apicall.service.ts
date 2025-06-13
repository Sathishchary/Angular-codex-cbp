import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {
  oauthURL: string = '';
  apiUrl: string = '';
  accessToken: any = '';
  companyID: any = 'DGLN0000000000000001';
  constructor(public http: HttpClient) { }
  securityLogin(authorization: string, body: any) {
    const url = this.oauthURL + '/oauth/token';
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', authorization)
      .set('X-TENANT-ID', 'DGLN0000000000000001');
    const options = { headers: headers };
    return this.http.post(url, body, options);
  }
  getUserInfoIndividual(accessToken: any) {
    const url = this.oauthURL + '/user';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);

    return this.http.get(url, { headers: headers });
  }
  getCbpUserInfo(loggedInUserId: any) {
    const url = this.apiUrl + '/e-security/userprofile/edocument?userId=' + loggedInUserId + '&companyId=' + this.companyID;
    const headers = this.setHeaders();
    return this.http.get(url, headers);
  }
  setHeaders() {
    const headers = this.headersForm();
    const options = { headers: headers };
    return options;
  }
  headersForm() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Bearer ' + this.accessToken);
    return headers;
  }
  getPenInkJson() {
    const url = 'assets/cbp/json/penink.json';
    return this.http.get(url);
  }
  getAuthenicatorJson() {
    const url = 'assets/client-config/authenticator.json';
    return this.http.get(url);
  }
}
