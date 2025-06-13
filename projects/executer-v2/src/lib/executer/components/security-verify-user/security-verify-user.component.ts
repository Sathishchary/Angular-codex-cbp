import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ExecutionService } from '../../services/execution.service';
import { NotifierService } from 'angular-notifier';
import { SecurityVerify , DataInfo } from '../../models';
import { SharedviewService } from '../../services/sharedview.service';
import { CbpExeService } from '../../services/cbpexe.service';
import { DgTypes } from 'cbp-shared';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatashareService } from '../../services/datashare.service';
import { Subscription } from 'rxjs';
import { EventType, Request_Msg, Resp_Msg } from '../../ExternalAccess/medaiEventSource';
import { CbpSharedService } from 'cbp-shared';

@Component({
  selector: 'app-security-verify-user',
  templateUrl: './security-verify-user.component.html',
  styleUrls: ['./security-verify-user.component.css']
})
export class SecurityVerifyUserComponent implements OnInit, OnDestroy {
  @Input() userType = 'New User';
  @Output() closeEvent: EventEmitter<any> =  new EventEmitter();
  dgType = DgTypes;
  loading!: boolean;
  @Input() isVerifyUser = false;
  @Input() userInfo: any;
  @Input() customUsers:any;
  @Input() userCbpInfo: any;
  securityUser: SecurityVerify = new SecurityVerify();
  disableSwitchUser = false;
  isMobile = false;
  web_subscription! : Subscription;
  @Output() sendDataEntryJson: EventEmitter<any> = new EventEmitter();
  userDetails = [{type: 'Name', fieldName: 'name'},
                 {type: 'Role', fieldName: 'role'},
                 {type: 'Qualification', fieldName: 'qualification'},
                 {type: 'Qualification Group', fieldName: 'qualificationGroup'}];

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
              public deviceService: DeviceDetectorService,private datashareServiceata:DatashareService,
              public notifier: NotifierService, public sharedviewService: SharedviewService,
              public dataWrapperService: DatashareService, public sharedService: CbpSharedService ) {
  }

  ngOnInit() {
    this.isMobile=this.datashareServiceata.getMenuConfig()?.isMobile;
     if (this.isVerifyUser) { this.userType = 'Verify User'; this.getUserInfoFormDataJson(); }
     this.sharedService.openModalPopup('security-verify-user');
     this.web_subscription = this.dataWrapperService.receivedMessage.subscribe((res: Resp_Msg)=>{
      console.log('send email status:::',res);
      if(res && res?.eventType == EventType.verifyLoginSecurity_success){
        this.executionService.setCurrentUser(res.msg);
        this.userInfo = res.msg;
        // this.getUserInfoToCheckRole(res.msg);
        this.loading = false;
      }
      if(res && res?.eventType == EventType.userCBPInfo_success){
        this.setCBPInfo(res.msg, this.userInfo);
        this.loading = false;
      }
    });
  }
  validationCheck(userName:any, password:any) {
    if (userName==undefined || password==undefined ) {
      this.loading = false;
      this.notifier.notify('error', 'Please Enter valid credentials');
      return;
    }

    if(userName?.toLocaleLowerCase() === this.executionService?.selectedUserName?.toLocaleLowerCase()){
      this.loading = false;
      this.notifier.notify('error', 'Current user is not valid to verify');
      return;
    } else {
      let evt:Request_Msg={eventType:EventType.verifyLoginSecurity,msg: {username: userName, pwd: password}};
      this.dataWrapperService.sendMessageFromLibToOutside(evt);
    }
  }
  getUserInfoFormDataJson() {
    if (this.userInfo.userName !== 'New User') {
      this.securityUser.name = this.userInfo.userName;
      this.executionService.setCurrentUser(this.userInfo);
      // this.getUserInfoToCheckRole(this.userInfo);
    }
  }

  getUserInfoToCheckRole(userInfo: any) {
    this.userInfo = userInfo;
    let evt:Request_Msg={eventType:EventType.userCBPInfo,msg: {userId:userInfo.userId }};
    this.dataWrapperService.sendMessageFromLibToOutside(evt);
  }

  setCBPInfo(result:any, userInfo:any){
    this.userCbpInfo = result;
    if (result.qualification.length !== 0) {
        if (!this.securityUser.qualification) { this.securityUser.qualification = ''; }
        result.qualification.forEach((item :any)=> {
        this.securityUser.qualification = this.securityUser.qualification + item.display + ' ';
      });
    }
    if (result.qualificationGroup.length !== 0) {
        if (!this.securityUser.qualificationGroup) { this.securityUser.qualificationGroup = ''; }
        result.qualificationGroup.forEach((item :any)=> {
        this.securityUser.qualificationGroup = this.securityUser.qualificationGroup + item.display + ' ';
      });
    }
    if (result.role.length !== 0) {
        if (!this.securityUser.role) { this.securityUser.role = ''; }
        result.role.forEach((item :any)=> { this.securityUser.role = this.securityUser.role + item.display + ' '; });
    }
    this.isSecurityAvailable();
    // As ashok said..switch user should work even if user does not have roles

    if(userInfo){
    this.securityUser.name = userInfo.userName;
    }
  }

  isSecurityAvailable() {
    if (!this.securityUser.role) { this.securityUser.role = ''; }
    if (!this.securityUser.qualification) { this.securityUser.qualification = ''; }
    if (!this.securityUser.qualificationGroup) { this.securityUser.qualificationGroup = ''; }

  }
  switchUser(userInfo:any) {
    this.executionService.selectedUserName = this.userInfo.userName;
    this.executionService.selectedUserId = this.userInfo.userId;
    this.executionService.selectedUserEmail = this.userInfo.email ? this.userInfo.email : this.userInfo.userName + '@gmail.com';
    this.customUsers.unshift({userName: userInfo.name,
      userId: this.executionService.selectedUserId,
      emailId: this.executionService.selectedUserEmail});
    this.customUsers = this.cbpService.removeDuplicates(this.customUsers, 'userName');
    userInfo['userRoleQualInfo'] = this.userCbpInfo;
    this.storeDataJsonObject(userInfo);
    this.closeEvent.emit({switchUser: userInfo, customUsers: this.customUsers });
  }
  storeDataJsonObject(obj:any){
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.dgUniqueID = (++this.cbpService.lastSessionUniqueId).toString();
    dataInfo.action = this.userType === 'New User' ? 30000 : 31000;
    let dataInfoObj = {...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj};
    this.sendDataEntryJson.emit(dataInfoObj);
   }

  closeModal() {
    this.sharedService.closeModalPopup('security-verify-user');
    this.closeEvent.emit(false);
  }

  ngOnDestroy(): void {
    this.closeModal();
    this.web_subscription.unsubscribe();
  }
}
