import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Event_resource, EventType, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, DataInfo, ImageModal } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-media-view',
  templateUrl: './media-view.component.html',
  styleUrls: ['./media-view.component.css']
})
export class MediaViewComponent implements OnInit {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  @Output() setDataEntryJson: EventEmitter<any> = new EventEmitter();
  @Output() deleteSingleMedia: EventEmitter<any> = new EventEmitter();
  @Output() updateFiles: EventEmitter<any> = new EventEmitter();
  @Output() deleteImageEvent: EventEmitter<any> = new EventEmitter();
  lg: any;
  mediaFiles: any;
  isMobile = false;
  coverPageImage: boolean = false;
  galleryId: any = 'executer-gallery';
  refresh = true;
  media: any[] = [];
  mediaSubscription!: Subscription;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService, public sanitizer: DomSanitizer,
    public cdr: ChangeDetectorRef, public dataSharingService: DatashareService,
    public dataJsonService: DataJsonService) {
  }
  ngOnInit() {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.mediaFiles = JSON.parse(JSON.stringify(this.stepObject.images));
    // this.mediaFiles.forEach((element:any) => {
    //   if(!element?.isExecuter ){
    //     this.cbpService.mediaBuilderObjects.push(element);
    //   }
    // });
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'stepObject' && changes.stepObject) {
        this.stepObject = changes.stepObject.currentValue;
        this.mediaFiles = JSON.parse(JSON.stringify(this.stepObject.images));
      }
      for (let i = 0; i < this.mediaFiles.length; i++) {
        if (this.mediaFiles[i].mediaUrl === 'assets/cbp/images/DataGlancePng.png') {
          this.coverPageImage = true;
          return true;
        }
      }
    }
  }
  setLoader(event: any) {
    event.target.src = 'assets/cbp/images/loader.gif';
  }
  setCaptionDesc(i: any, baseUrl: any) {
    const caption = this.mediaFiles[i]['caption'] ? this.mediaFiles[i]['caption'] : '';
    const desc = this.mediaFiles[i]['description'] ? this.mediaFiles[i]['description'] : '';
    return { src: baseUrl, thumb: baseUrl, subHtml: "<div><h4>" + caption + "</h4><p>" + desc + "</p></div>" };
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  editImage(item: any, i: any) {
    this.cbpService.imageUrlShow = false;
    this.cbpService.mediaFile = item;
    this.cbpService.imageUrlShow = true;
  }
  saveCaptionMedia(item: any) {
    const obj = this.getMediaObject(item);
    this.storeDatJsonObects(obj);
    const img = this.stepObject.images.find((x: any) => x.fileName == item.fileName);
    if (img) {
      obj.caption = item.caption;
    }
  }
  getMediaObject(item: any) {
    const mediaObj: any = new ImageModal();
    mediaObj['name'] = item.fileName;
    mediaObj['fileName'] = item.fileName;
    mediaObj.caption = item.caption;
    mediaObj['dgType'] = 'UpdateFigure';
    mediaObj['action'] = 7000;
    mediaObj.fileType = item.fileType;
    if (item?.height && item?.width) {
      mediaObj['height'] = item.height;
      mediaObj['width'] = item.width;
    }
    mediaObj['dgUniqueID'] = item.dgUniqueID;
    this.cbpService.lastSessionUniqueId = ++this.cbpService.lastSessionUniqueId;
    return mediaObj;
  }
  deleteImage(itemObj: any, stepObject: any, i: any) {
    if (this.cbpService.media) {
      this.cbpService.media = this.cbpService.removeDuplicates(this.cbpService.media, 'name');
      const value = this.cbpService.media.findIndex((media: any) => media.name.includes(itemObj.name));
      if (value != -1) {
        this.cbpService.media.splice(value, 1);
      }
    }
    this.stepObject.images.splice(i, 1);
    this.stepObject = JSON.parse(JSON.stringify(this.stepObject));
    this.mediaFiles.splice(i, 1);
    this.mediaFiles = JSON.parse(JSON.stringify(this.mediaFiles));
    this.deleteImageEvent.emit(itemObj.name);
    this.storeDatajsonValues(itemObj, 'DeleteFigure');
    this.cdr.detectChanges();
  }
  storeDatajsonValues(itemObj: any, dgType: string) {
    itemObj['action'] = 7100;
    itemObj['dgUniqueID'] = itemObj.dgUniqueID;
    itemObj['dgType'] = dgType;
    if (dgType == 'DeleteFigure')
      itemObj = { ...itemObj, ...this.sharedviewService.setUserInfoObj(ActionId.Delete) };
    if (dgType == 'UpdateFigure')
      itemObj = { ...itemObj, ...this.sharedviewService.setUserInfoObj(ActionId.Update) };
    this.cbpService.lastSessionUniqueId = ++this.cbpService.lastSessionUniqueId;
    if (itemObj['baseUrl']) { delete itemObj.baseUrl; }
    this.storeDatJsonObects(itemObj);
  }

  storeDatJsonObects(obj: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.dgUniqueID = obj.dgUniqueID;
    obj.dgUniqueID = 'm_' + ++this.cbpService.uniqueIdIndex;
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(obj.action), ...obj };
    if (dataInfoObj['mediaUrl']) {
      delete dataInfoObj.mediaUrl;
    }
    this.setDataEntryJson.emit(dataInfoObj);
    if (this.stepObject.images.length == 0) {
      this.deleteSingleMedia.emit(this.stepObject);
    }
  }
  refreshView() {
    this.cdr.detectChanges();
  }

  mobileEvent(event: any) {
    if (event.type === 'remove') {
      this.cbpService.mediaExecutorObjects = this.cbpService.mediaExecutorObjects.filter((item) => item.name !== event.file.fileName);
      this.cbpService.media = this.cbpService.media.filter((item) => item.name !== event.file.fileName);
      this.stepObject.images = this.stepObject.images.filter((item: any) => item.name !== event.file.fileName);
      this.storeDatajsonValues(event.file, 'DeleteFigure');
      this.cdr.detectChanges();
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireMeadiaRemove, msg: event.file.name };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    }
    if (event.type === 'editImage') {
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireMediaEditEvent, msg: event.file };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    }
  }

  ngAfterViewInit(): void {
    this.mediaSubscription = this.dataJsonService.mediaUpdateValue.subscribe(result => {
      if (!this.executionService.isEmpty(result) && result && result !== undefined) {
        if (result?.length > 0) {
          result.forEach((file: any) => {
            if (file.size > 0) {
              this.media = [...[file], ...this.media];
            }
          });
          this.cbpService.media = result;
          this.cbpService.media = this.cbpService.removeDuplicates(this.cbpService.media, 'name');
        }
        this.cdr.detectChanges();
        this.mediaFiles = JSON.parse(JSON.stringify(this.mediaFiles));
      }
    })
  }

  updateMediaFiles(event: any) {
    if (event?.file) {
      this.cbpService.media = this.cbpService.removeDuplicates(this.cbpService.media, 'name');
      const fileIndex = this.cbpService.media.findIndex((x: any) => x.name.includes(event?.file.name) &&
        this.cbpService.checkFileNameExist(event?.file.name, x.name));
      if (fileIndex != -1)
        this.cbpService.media.splice(fileIndex, 1, event?.file);
      this.updateFiles.emit(event);
      this.storeDatajsonValues(event.mediaFile, 'UpdateFigure');
      this.cdr.detectChanges();
    }
    if (event?.eventType == 'resize') {
      if (event?.item) {
        const mediaFile = this.mediaFiles.find((x: any) => x.name.includes(event?.item.name));
        if (mediaFile) {
          mediaFile['height'] = event?.item?.height;
          mediaFile['width'] = event?.item?.width;
          mediaFile['caption'] = event?.item?.caption;
          mediaFile['resized'] = event?.item?.resized;
          mediaFile['resolution'] = event?.item?.resolution;
        }
        this.updateFiles.emit(event);
        this.cdr.detectChanges();
      }
      this.saveCaptionMedia(event.item);
    }
  }

  ngOnDestroy() {
    for (let i = 0; i < this.mediaFiles.length; i++) {
      if (this.mediaFiles[i]['baseUrl']) delete this.mediaFiles[i]['baseUrl'];
    }
    this.mediaSubscription.unsubscribe();
  }
}
