import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CbpSharedService } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { EventType, Event_resource, Request_Msg, Resp_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId } from '../../models';
import { ImageModal } from '../../models/Image';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrls: ['./upload-media.component.css'],
})
export class UploadMediaComponent implements OnInit, OnDestroy {
  type!: string;
  @Input() selectedStep!: any;
  @Input() currentStep!: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  uploadMedia: any = [];
  selectedItemFile: ImageModal = new ImageModal();
  isMobile: boolean = false;
  subscrption: Subscription | undefined;
  source = Event_resource.uploadRef;
  empty!: Resp_Msg;
  mediaBlobs: any[] = []
  selectedItemcaption = '';
  constructor(public domSanitizer: DomSanitizer, public cbpService: CbpExeService,
    private dataSharingService: DatashareService,
    public executionService: ExecutionService, public sharedviewService: SharedviewService,
    private cdref: ChangeDetectorRef, public dataJsonService: DataJsonService,
    public sharedService: CbpSharedService) {
  }

  ngOnInit() {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.sharedService.openModalPopup('mediaUpload');
    if (this.isMobile)
      this.subscrption = this.dataSharingService.receivedMessage.subscribe((res: Resp_Msg) => {
        if (res && res.source == Event_resource.uploadRef) {
          if (res.eventType == EventType.fireMediaEditEvent)
            this.setMedia(res.msg);
          if (res.eventType == EventType.fireCameraEvent)
            this.setVideo(res.msg);
        }
      });
  }
  selectedItem(item: any) {
    this.selectedItemFile = item;
  }
  selectedChange(event: any) {
    this.selectedItemFile = event;
    // this.selectedItemcaption = '';
  }
  changeEvent(event: string) {
    this.selectedItemFile = !this.selectedItemFile ? this.uploadMedia[0] : this.selectedItemFile;
    this.selectedItemFile.caption = event;
    this.selectedItemFile = JSON.parse(JSON.stringify(this.selectedItemFile));
  }
  closeModal() {
    this.sharedService.closeModalPopup('mediaUpload');
    this.closeEvent.emit(false);
  }
  removeChangeRequestItem(index: any) {
    this.uploadMedia.splice(index, 1);
  }
  changeRequestAddedFiles(event: any) {
    let mediaObjArray = this.executionService.uploadMedia(event, this.uploadMedia, this.cbpService.media, this.cbpService.maxDgUniqueId);
    this.uploadMedia = [...this.uploadMedia, ...mediaObjArray.mediaFiles];
    this.cbpService.maxDgUniqueId = mediaObjArray.maxid;
    this.mediaBlobs = [...this.mediaBlobs, ...mediaObjArray.mediaArray];
    this.selectedItemFile = this.uploadMedia[0];
    this.dataJsonService.setMediaItem(this.cbpService.media);
    this.uploadMedia.forEach((item: any) => { item['isExecuter'] = false; });
    this.uploadMedia = JSON.parse(JSON.stringify(this.uploadMedia));
    this.cdref.detectChanges();
  }
  byPassVideo(fileObject: any) {
    if (this.isMobile) {
      if (fileObject) {
        return this.dataSharingService.getMediaPath() + fileObject.name;
      }
    }
    else {
      if (fileObject) {
        const objectURL = fileObject && fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
        const url = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
        return url;
      }
    }
  }
  removeItem(item: any, id: any) {
    this.uploadMedia.splice(id, 1);
  }
  savedataInfos() {
    this.uploadMedia.forEach((item: any) => {
      delete item['baseUrl'];
      delete item['imageUrl'];
      item['isExecuter'] = true;
    });
    const dataInfo = this.sharedviewService.storeMediaUpload(this.uploadMedia, 'multipleImages',
      this.currentStep, new Date().getTime());
    this.closeEvent.emit({ dataInfo: dataInfo, media: this.mediaBlobs, type: 'upload' });
    this.uploadMedia = [];
  if (this.isMobile) { this.dataSharingService.sendMessageFromOutsideToPlugin(this.empty); }
  }
  async deleteMediaFiles(eventObj: any) {
    this.uploadMedia = this.uploadMedia.filter((i: any) => i.fileName != eventObj.imageObj.fileName);
    this.uploadMedia = [...this.uploadMedia];
    const indexValueUrl = this.mediaBlobs.findIndex((item: any) => item.name === eventObj.imageObj.fileName);
    this.mediaBlobs.splice(indexValueUrl, 1);
    this.mediaBlobs = [...this.mediaBlobs];
  }

  cancel() {
    this.removeMediaFiles();
    this.closeModal();
    this.uploadMedia = [];
    if (this.isMobile) { this.dataSharingService.sendMessageFromOutsideToPlugin(this.empty); }
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }

  removeMediaFiles() {
    this.uploadMedia.forEach((simg: any) => {
      if (simg?.isExecuter === false) {
        this.mediaBlobs.splice(this.mediaBlobs.findIndex((item: any) => item.name === simg.fileName), 1);
      }
    });
  }
  ngOnDestroy(): void {
    this.closeModal();
    this.subscrption?.unsubscribe();
    this.uploadMedia = [];
  }

  //Tablet changes
  openImageChange() {
    let evt: Request_Msg = { eventType: EventType.fireMediaEvent, msg: { 'event': 'media' }, eventFrom: Event_resource.uploadRef };
    this.dataSharingService.sendMessageFromLibToOutside(evt);
  }
  playVideoEvent(item: any, i: any) {
    let evt: Request_Msg = { eventType: EventType.fireVideoPlayEvent, msg: { 'event': 'media' }, eventFrom: Event_resource.uploadRef };
    this.dataSharingService.sendMessageFromLibToOutside(evt);
  }
  captureMedia() {
    let evt: Request_Msg = { eventType: EventType.fireCameraEvent, msg: { 'event': 'media' } };
    this.dataSharingService.sendMessageFromLibToOutside(evt);
  }

  setMedia(fileName: any) {
    let imageObj = new ImageModal();
    imageObj.fileName = fileName;
    imageObj['name'] = fileName;
    imageObj['fileType'] = 'Image';
    imageObj['action'] = ActionId.AddMedia;
    // imageObj.caption ='' ;
    imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    imageObj['dgUniqueID'] = 'data-' + (new Date().getTime());
    this.uploadMedia.push(imageObj);
    this.cdref.detectChanges();
    // this.selectedItemFile = this.uploadMedia[0];
    this.uploadMedia = JSON.parse(JSON.stringify(this.uploadMedia));
    this.selectedItemFile = this.uploadMedia[0]
    this.cdref.detectChanges();
  }
  setVideo(fileName: any) {
    let imageObj = new ImageModal();
    imageObj.fileName = fileName;
    imageObj['name'] = fileName;
    imageObj['fileType'] = 'Video';
    imageObj['action'] = ActionId.AddMedia;
    imageObj.caption = '';
    imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    this.uploadMedia.push(imageObj);
    this.cdref.detectChanges();
    this.selectedItemFile = this.uploadMedia[0];
    this.uploadMedia = JSON.parse(JSON.stringify(this.uploadMedia));
    // this.selectedItemFile=this.uploadMedia[this.uploadMedia.length-1]
    this.cdref.detectChanges();
  }
  b64toBlob(dataURI: any) {
    const byteString = atob(dataURI);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }
  blobToFile(theBlob: Blob, fileName: string): File {
    return new File([theBlob], fileName);
  }

  saveMediaFilesEvent() {
    let videoFiles = this.uploadMedia.map((i: any) => { return { path: 'media/' + i.name } });
    if (videoFiles.length > 0) {
      let evt: Request_Msg = { eventType: EventType.fireSaveMediaEvent, msg: videoFiles };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
      this.uploadMedia = [];
    }
  }
  cancelMediaFilesEvent() {
    let videoFiles = this.uploadMedia.map((i: any) => { return { path: 'media/' + i.name } });
    if (videoFiles?.length > 0) {
      let ev2: Request_Msg = { eventType: EventType.fireCancelMediaEvent, msg: videoFiles };
      this.dataSharingService.sendMessageFromLibToOutside(ev2);
    }
  }

  mediaUpdateFile(eventObj: any) {
    this.mediaBlobs.splice(eventObj.index, 1, eventObj.file);
    this.mediaBlobs = [...this.mediaBlobs];
  }

}
