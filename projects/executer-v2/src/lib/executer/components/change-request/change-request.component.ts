import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CbpSharedService, DgTypes, PropertyDocument } from 'cbp-shared';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { EventType, Event_resource, Request_Msg, Resp_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, ChangeRequest, DataInfo, DataJson, ImageModal } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';

@Component({
  selector: 'app-change-request',
  templateUrl: './change-request.component.html',
  styleUrls: ['./change-request.component.css'],
  providers: [DeviceDetectorService]
})
export class ChangeRequestComponent implements OnInit, OnDestroy, OnChanges {

  @Input() selectedStepSectionInfo: any;
  @Input() isChangeUpdate: any;
  @Input() selectedCRIndex = 0;
  deviceInfo: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;
  selectedCommentIndex = 0;
  @Input() changeRequest: ChangeRequest = new ChangeRequest();
  propertyDocument: PropertyDocument = new PropertyDocument;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  mediaFiles: any = [];
  loading = false;
  dgUniqueID: any;
  selectedStep = { dgUniqueID: '', dgSequenceNumber: '' };
  selectedItemFile: ImageModal = new ImageModal();
  numbers: any[] = [];
  CRmedia_arrvalues: any = [];
  @Input() cbpJson!: any;
  @Input() dataJson: DataJson = new DataJson();
  @Input() currentSelectedNumber: any;
  @Input() crArrayData: any[] = [];
  @Input() tempCrData: any[] = [];
  @Output() mediaChange: EventEmitter<any> = new EventEmitter();
  @Output() crArrayDataChange: EventEmitter<any> = new EventEmitter();
  @Output() dataJsonChange: EventEmitter<any> = new EventEmitter();
  web_subscription: Subscription | undefined;
  Cr_subscription: Subscription | undefined;
  source = Event_resource.crRef;
  isMobileSDk = false;
  empty!: Resp_Msg;
  @Input()
  codeValue: any[] = [];
  @Input()
  reasonValues: any[] = [];
  @Input()
  typeValues: any[] = [];
  @Input()
  listOfFacilities: any[] = [];
  @Input()
  listOfUnits: any[] = [];
  @Input()
  listOfDecipline: any[] = [];
  @Output() sendDataJson: EventEmitter<any> = new EventEmitter();
  footerList = [{ type: 'Cancel' }];
  @Input() media: any[] = []
  deleteItems: string[] = [];
  getFacilityList = false ;
  constructor(private deviceService: DeviceDetectorService, public dataJsonService: DataJsonService,
    public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService, private dataSharingService: DatashareService,
    private cdref: ChangeDetectorRef, public sharedService: CbpSharedService) {
    this.deviceInformation();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.crArrayData && this.crArrayData) {
      this.crArrayData = changes.crArrayData.currentValue;
    }
    if (changes.reasonValues && this.reasonValues) {
      this.reasonValues = changes.reasonValues.currentValue;
    }
    if (changes.typeValues && this.typeValues) {
      this.typeValues = changes.typeValues.currentValue;
    }
    if (changes.listOfFacilities && this.listOfFacilities) {
      this.listOfFacilities = changes.listOfFacilities.currentValue;
    }
    if (changes.media && this.media) {
      this.media = changes.media.currentValue;
    }
  }

  ngOnInit() {
    this.isMobileSDk = this.dataSharingService.getMenuConfig()?.isMobile;
    this.setCommentCrDropdowns();
    this.selectedStep = JSON.parse(JSON.stringify({ dgUniqueID: this.cbpService.selectedElement.dgUniqueID, dgSequenceNumber: this.currentSelectedNumber }));
    this.dgUniqueID = this.cbpService.selectedElement.dgUniqueID;
    if (this.isChangeUpdate) {
      this.getChangeRequest(this.changeRequest, this.selectedCRIndex);
      if (this.changeRequest.facility && this.listOfFacilities.length == 0) {
        this.getFacilityList = true;
        this.getFacility()
      }
    }
    else {
      this.openCr();
      if (this.cbpJson.documentInfo !== undefined) {
        this.propertyDocument = this.cbpJson.documentInfo[0];
        this.changeRequest.documentInfo = this.propertyDocument.documentNo;
      } else {
        this.propertyDocument = new PropertyDocument();
        this.changeRequest.documentInfo = this.propertyDocument.documentNo;
      }
    }
    this.setNumber(this.cbpJson.section);


    if (this.isChangeUpdate) {
      let obj = [{ type: 'Delete' }, { type: 'Update' }]
      this.footerList.unshift(...obj);
    } else {
      this.footerList.unshift({ type: 'Save' });
    }
    this.Cr_subscription = this.dataSharingService.mediaCr.subscribe(event => {
      console.log("setMedia called", event);
      this.setMedia(event.msg);
    });
    if(this.changeRequest.reasonCode != ''){
      this.changeRequest.reasonCode= Number(this.changeRequest.reasonCode);
    }
  }

  ngAfterViewInit() {
    if (!this.web_subscription) {
    this.web_subscription = this.dataSharingService.receivedMessage.subscribe((res: Resp_Msg) => {
      //if(res && res.source===Event_resource.crRef)
      if (res?.eventType == EventType.setUnitFacility_success) {
        if(this.getFacilityList){
          this.setUnit(res.msg)
        }
      }
      // if(res.eventType==EventType.fireMediaEditEvent)
      // this.setMedia(res.msg);

      if (res.eventType == EventType.fireCameraEvent)
        this.setVideo(res.msg);

      if (res && res.eventType === EventType.setCodeValues_success) {
        this.setCodeValues(res.msg);
      }
      if (res && res.eventType === EventType.setReasonCodeValues_success) {
        this.setReasonCodeValues(res.msg);
      }
      if (res && res.eventType === EventType.setFacilityValues_success) {
       if(this.getFacilityList){
        this.setFacility(res.msg);
       }
      }
    });
  }
  }

  setNumber(object: any) {
    if (object.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].number !== undefined && object[i].number !== null && !object[i]?.hide_section &&
          this.executionService.checkAllSteps(object[i])) {
          this.numbers.push({ 'number': object[i].number, 'dgUniqueId': object[i].dgUniqueID, title: object[i].text });
        }
        if (object[i].children) { this.setNumber(object[i].children); }
      }
    }
  }

  selectCommentObj() {
    if (this.changeRequest.number !== this.selectedStep.dgSequenceNumber) {
      const object = this.executionService.getElementByNumber(this.changeRequest.number, this.cbpJson.section);
      if (object) { this.dgUniqueID = object.dgUniqueID; }
    }
  }

  getFacility() {
    let evt: Request_Msg = { eventType: EventType.setUnitFacility, msg: this.changeRequest.facility, eventFrom: Event_resource.crRef };
    this.dataSharingService.sendMessageFromLibToOutside(evt);
    //this.loading = true
  }
  changeEvent(item: any) {
    if (item.type === 'Cancel') { this.cancel(); }
    if (item.type === 'Update') { this.updateChangeRequest(this.changeRequest) }
    if (item.type === 'Save') { this.saveChangeRequest(); }
    if (item.type === 'Delete') { this.deleteChangeRequest(this.changeRequest) }
  }

  updateView() {
    this.cdref.detectChanges();
  }
  getUnit() {
    // pending work
  }
  openCr() {
    this.changeRequest = new ChangeRequest();
    this.changeRequest.number = this.currentSelectedNumber;
    this.sharedService.openModalPopup('CRModal');
    this.changeRequest.crType = null;
    this.changeRequest.crNewType = "";
    this.changeRequest.reasonCode = "";
    this.changeRequest.facility = "";
    this.changeRequest.unit = "";
    this.media = [];
  }

  deviceInformation() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  getChangeRequest(item: ChangeRequest, i: any) {
    this.selectedCRIndex = i;
    this.isChangeUpdate = true;
    this.changeRequest = item;
    this.changeRequest.crNewType = this.changeRequest.requestType
    this.openChangeRequest(item);
    this.setTypeObject();
  }

  ngDoCheck(): void {
    if (this.isChangeUpdate && this.typeValues?.length > 0 && this.changeRequest.crNewType == undefined) {
      this.setTypeObject();
    }
  }
  setTypeObject() {
    const types = this.typeValues.filter((item: any) => item.cdvalDisplay === this.changeRequest.crNewType);
    if (types?.length > 0) {
      this.changeRequest.crType = types[0];
      if (this.isChangeUpdate)
        this.changeRequest.crNewType == types[0].cdvalDisplay;
    }

  }
   selectedChange(event: any) {
    this.selectedItemFile = JSON.parse(JSON.stringify(event));
    this.cdref.detectChanges();
    // this.selectedItemcaption = '';
  }
  selectedItem(item: any) {
    this.selectedItemFile = item;
  }
  setTypeUpdate(event: any) {
    this.setTypeObject()
  }
  openChangeRequest(item: any) {
    if (this.changeRequest.media.length > 0) {
      if (item.dgType == "ChangeRequest") {
        this.mediaFiles = [...this.mediaFiles, ...this.changeRequest.media]
      }
      this.changeRequest.media.forEach((itemImage: any) => {
        let obj: any = this.media.filter((item: any) => item.name === itemImage.name);
        if (obj.length === 0) { obj = this.media.filter((item: any) => item.name === 'media/' + itemImage.name); }
        if (obj.length > 0) {
          let imageObj = new ImageModal();
          imageObj.fileName = obj[0]['name'].replace("media/", "");
          imageObj.caption = itemImage['caption'];
          imageObj['file'] = obj[0];
          imageObj['dgUniqueID'] = this.executionService.loggedInUserId + '_' + (new Date().getTime());
          imageObj.fileType = this.executionService.checkFileType(imageObj['file']);
          imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
          this.mediaFiles.push(imageObj);
        }
      });
      this.mediaFiles = this.cbpService.removeDuplicates(this.mediaFiles, 'fileName');
    }
    this.sharedService.openModalPopup('CRModal');
  }

  changeRequestAddedFiles(event: any) {
    let mediaObjArray = this.executionService.uploadMedia(event, this.mediaFiles, [], this.cbpService.maxDgUniqueId);
    this.mediaFiles = [...this.mediaFiles, ...mediaObjArray.mediaFiles];
    for (let i = 0; i < this.mediaFiles.length; i++) {
      this.mediaFiles[i] = { ...this.mediaFiles[i], ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) };
      this.mediaFiles[i].dgType = DgTypes.Figure;
      this.mediaFiles[i].TxnId = this.mediaFiles[i].TxnId + i;
    }
    this.cbpService.maxDgUniqueId = mediaObjArray.maxid;
    this.media = [...this.media, ...mediaObjArray.mediaArray];
    this.selectedItemFile = this.mediaFiles[0];
    this.cdref.detectChanges();
  }
  removeChangeRequestItem(index: any) {
    this.mediaFiles.splice(index, 1);
  }
  saveChangeRequest() {
    this.changeRequest.media = this.mediaFiles;
    this.changeRequest.media.forEach(item => {
      delete item['baseUrl'];
      item['isExecuter'] = true;
    })
    this.mediaChange.emit({ mediaBlob: this.media, mediaFiles: this.mediaFiles });
    this.storeCRObjects();
    this.closeEvent.emit({
      dgType: 'ChangeRequest', dgUniqueID: this.dgUniqueID, 'crData': this.crArrayData,
      media: this.media
    });
    if (this.isMobile) {
      this.dataSharingService.sendMessageFromOutsideToPlugin(this.empty);
    }
  }
  getMediaObject(item: any) {
    let mediaObj = new ImageModal();
    mediaObj['name'] = item.fileName;
    mediaObj['fileName'] = item.fileName;
    mediaObj.caption = item.caption;
    mediaObj.fileType = item.fileType;
    mediaObj = { ...mediaObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    mediaObj['dgUniqueID'] = this.executionService.loggedInUserId + '_Media_' + (new Date().getTime());
    return mediaObj;
  }
  updateChangeRequest(item: any) {
    this.crArrayData[this.selectedCRIndex] = item;
    item['action'] = 7000;
    item.media = [];
    this.mediaFiles.forEach((itemMedia: any) => {
      const valueObj = this.getMediaObject(itemMedia);
      item.media.push(valueObj);
    });
    // this.cbpService.media = [...this.cbpService.media, ...this.media];
    this.updateTypes();
    this.updateReason();
    this.storeDatJsonObects(item);
    this.closeEvent.emit({
      dgType: 'UpdateChangeRequest', crObj: item,
      deleteItems: this.deleteItems,
      dgUniqueID: this.dgUniqueID, 'crData': this.crArrayData, media: this.media
    });
    if (this.isMobile) {
      this.dataSharingService.sendMessageFromOutsideToPlugin(this.empty);
    }
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }
  async deleteChangeRequest(item: any) {
    // tslint:disable-next-line:no-shadowed-variable
    const { value: userConfirms } = await this.cbpService.showCustomSwal('Do you want to delete the message?', 'warning', 'No', 'Yes');
    let isDeleted = userConfirms ? true : false;
    if (isDeleted) {
      const removeIndex = this.crArrayData.map((itemV: any) => itemV.dgUniqueID).indexOf(item.dgUniqueID);
      this.crArrayData.splice(removeIndex, 1);
      item['action'] = 7100;
      item['dgType'] = "deleteChangeRequest";
      let deleteDgId: any;
      this.numbers.filter((num: any) => {
        if (num.number == item.number) {
          deleteDgId = num.dgUniqueId;
        }
      });
      let crLength: any = [];
      this.crArrayData.filter((cr: any) => { if (cr.number == item.number) { crLength.push(cr); } });
      let isCR = crLength.length > 0 ? true : false;
      this.setCrData();
      let deleteItems: string[] = []
      this.mediaFiles.forEach((itemMedia: any) => {
        deleteItems.push(itemMedia.fileName);
        const indexValueUrl = this.media.findIndex((item: any) => item.name === itemMedia.fileName);
        this.media.splice(indexValueUrl, 1);
      });
      this.storeDatJsonObects(item);
      this.closeEvent.emit({
        dgType: 'deleteChangeRequest', changeRequest: item,
        dgUniqueID: deleteDgId, isCR: isCR,
        deleteItems: deleteItems,
        'crData': this.crArrayData, media: this.media
      });
    }
    this.cdref.detectChanges();
  }
  updateTypes() {
    this.changeRequest.requestType = this.changeRequest.crNewType ? this.changeRequest.crNewType : '';
    // this.changeRequest.cdValue = this.changeRequest.crType ? this.changeRequest.crType.cdValue : '1000';
  }
  updateReason() {
    if (this.changeRequest?.reasonCode) {
      let reasonItem = this.reasonValues.find(item => item.cdValue === this.changeRequest.reasonCode);
      this.changeRequest.reasonType = reasonItem.cdvalDisplay? reasonItem.cdvalDisplay: '';
    }
  }
  updateMedia(eventObj: any) {
    let getIndex = this.media.findIndex((item: any) => item.name === 'media/' + eventObj.file.name || item.name == eventObj.file.name)
    this.media.splice(getIndex, 1, eventObj.file);
    this.media = [...this.media];
    eventObj['action'] = 7000;
    eventObj['dgType'] = "UpdateFigure";
    eventObj = { ...eventObj, ...this.sharedviewService.setUserInfoObj(ActionId.Update) };
    this.storeDatJsonObects(eventObj)
    this.mediaFiles = JSON.parse(JSON.stringify(this.mediaFiles));
    this.cdref.detectChanges();
  }
  storeCRObjects() {
    const crArray = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dynamicUniqueCRId);
    if (crArray) { crArray.length = ++crArray.length; }
    this.changeRequest.status = 'completed';
    this.changeRequest.createdDate = new Date();
    this.changeRequest.createdBy = this.executionService.loggedInUserName;
    this.updateTypes();
    this.updateReason();
    this.changeRequest.locationInfo = '';
    this.changeRequest.dgType = 'ChangeRequest';
    // this.changeRequest.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID;
    (this.cbpService.selectedElement.dgUniqueID == this.dgUniqueID) ? (this.changeRequest.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID):(this.changeRequest.selectedStepDgUniqueId = this.dgUniqueID);
    this.changeRequest.companyGroup = this.changeRequest.unit ? this.changeRequest.unit : (this.changeRequest.facility ? this.changeRequest.facility : '')
    this.changeRequest.dynamicUniqueCRId = 'dynamicUniqueCRId' + (crArray.length ? crArray.length : 0);
    this.changeRequest.dgUniqueID = this.executionService.loggedInUserId + '_' + (new Date().getTime());
    if (!this.crArrayData) { this.crArrayData = []; }
    this.crArrayData.push(this.changeRequest);
    this.setCrData();
    this.storeDatJsonObects(this.changeRequest);
  }
  setCrData() {
    this.tempCrData = this.crArrayData;
    this.crArrayDataChange.emit(this.crArrayData);

  }
  async deleteMediaFiles(eventObj: any) {
    console.log("Inside ")
    const indexFileUrl = this.cbpService.dataJson.dataObjects.findIndex((item: any) => item.fileName === eventObj.imageObj.fileName);
    if (indexFileUrl != -1)
      this.cbpService.dataJson.dataObjects.splice(indexFileUrl, 1);
    this.deleteItems.push(eventObj.imageObj.fileName);
    this.mediaFiles = this.mediaFiles.filter((i: any) => i.fileName != eventObj.imageObj.fileName);
    const indexValueUrl = this.media.findIndex((item: any) => item.name === eventObj.imageObj.fileName || item.name == "media/" + eventObj.imageObj.fileName);
    this.media.splice(indexValueUrl, 1);
    this.media = [...this.media];
    this.cdref.detectChanges();
  }
  storeDatJsonObects(obj: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.location = obj.location
    delete obj.crNewType;
    if (!this.isChangeUpdate) {
      dataInfo.dgUniqueID = this.executionService.loggedInUserId + '_' + (new Date().getTime());
      dataInfo.action = 8200;
    }
    if (this.isChangeUpdate) {
      dataInfo.dgUniqueID = obj.dgUniqueID;
      dataInfo.action = 7000;
    }
    if (this.isChangeUpdate && obj.action == 7100) {
      dataInfo.dgUniqueID = obj.dgUniqueID;
      dataInfo.action = 7100;
    }
    let dataInfoObj = { ...dataInfo, ...obj, ...this.sharedviewService.setUserInfoObj(dataInfo.action) };
    dataInfoObj.location = obj.location
    this.sendDataJsonToParent(dataInfoObj);
  }
  sendDataJsonToParent(event: any) {
    this.cbpService.dataJson.dataObjects.push(event);
    console.log("in CR Component", this.cbpService.dataJson.dataObjects);
  }

  setCaptionFile(fileObj: any) {
    const index = this.mediaFiles.findIndex((item: any) => item.fileName === fileObj.fileName)
    this.mediaFiles[index].caption = fileObj.caption;
    this.cdref.detectChanges();
  }
  closeModal() {
    // this.executionService.isEditMediaFormExecution = false;
    this.sharedService.closeModalPopup('CRModal');
    this.closeEvent.emit(false);
  }
  cancel() {
    this.removeMediaFiles();
    this.closeModal();
    this.listOfUnits = [];
    this.listOfFacilities = [];
  }

  removeMediaFiles() {
    if (!this.isChangeUpdate) {
      this.mediaFiles.forEach((simg: any) => {
        if (simg?.isExecuter === false) {
          this.media.splice(this.media.findIndex((item: any) => item.name === simg.fileName), 1);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.closeModal();
    this.web_subscription?.unsubscribe();
    this.Cr_subscription?.unsubscribe();
  }

  setCommentCrDropdowns() {
    let evtCode: Request_Msg = { eventType: EventType.CodeValues, msg: '', eventFrom: Event_resource.crRef };
    this.dataSharingService.sendMessageFromLibToOutside(evtCode);

    let evtReason: Request_Msg = { eventType: EventType.setReasonCodeValues, msg: '', eventFrom: Event_resource.crRef };
    this.dataSharingService.sendMessageFromLibToOutside(evtReason);

    let evtFacility: Request_Msg = { eventType: EventType.setFacilityValues, msg: '' };
    this.dataSharingService.sendMessageFromLibToOutside(evtFacility);

    let evtCrCode: Request_Msg = { eventType: EventType.crOpened, msg: '', eventFrom: Event_resource.crRef };
    this.dataSharingService.sendMessageFromLibToOutside(evtCrCode);
  }

  setMedia(fileName: any) {
    console.log("set media call from tablet***", fileName);
    let imageObj = new ImageModal();
    imageObj.fileName = fileName;
    imageObj['name'] = fileName;
    imageObj['fileType'] = 'Image';
    imageObj.caption = '';
    imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    this.mediaFiles.push(imageObj);
    this.cdref.detectChanges();
  }
  setVideo(fileName: any) {
    console.log("set media call from tablet***");
    let imageObj = new ImageModal();
    imageObj.fileName = fileName;
    imageObj['name'] = fileName;
    imageObj['fileType'] = 'Video';
    imageObj.caption = '';
    imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    this.mediaFiles.push(imageObj);
    this.cdref.detectChanges();
  }
  setCodeValues(data: any) {
    this.typeValues = data;
  }
  setReasonCodeValues(data: any) {
    this.reasonValues = data;
  }
  setFacility(data: any) {
    this.listOfFacilities = JSON.parse(JSON.stringify(data));
    this.cdref.detectChanges();
  }
  setUnit(data: any) {
    this.listOfUnits = JSON.parse(JSON.stringify(data));
    this.getFacilityList = false ;
    this.cdref.detectChanges();

  }
  setDecipline(data: any) {
    this.listOfDecipline = data;
  }
}
