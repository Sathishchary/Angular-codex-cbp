import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { MenuConfig } from '../../ExternalAccess';
import { EventType, Event_resource, Resp_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, CodeValue, CommentData, DataInfo, ImageModal } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  loading = true;
  @Input() commentObject: CommentData = new CommentData();
  @Input() selectedCommentIndex: any;
  @Input() isCommentUpdate = false;
  @Input() menuConfig!: MenuConfig;
  @Input() cbpJson!: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  codeValue!: CodeValue;
  mediaFiles: any = [];
  selectedItemFile: ImageModal = new ImageModal();
  dgUniqueID: any;
  selectedStep = { dgUniqueID: '', dgSequenceNumber: '' };
  numbers: any = [];
  Commentmedia_arrvalues: any = [];
  @Input() comments: any[] = [];
  @Output() commentsChange: EventEmitter<any> = new EventEmitter();
  @Input() currentSelectedNumber: any;
  @Output() mediaChange: EventEmitter<any> = new EventEmitter();
  source = Event_resource.commentsRef;
  isMobile: boolean | undefined = false;
  subscrption: Subscription | undefined;
  commentSubscrption: Subscription | undefined
  @Output() sendDataJson: EventEmitter<any> = new EventEmitter();
  @Output() updateMediaFiles: EventEmitter<any> = new EventEmitter();
  empty!: Resp_Msg;
  viewUpdates: boolean = true;
  disabledField = false;
  commentData: any;
  filedName: any;
  footerList = [{ type: 'Cancel' }];
  @ViewChild('galleryView') child: any;
  @Input() media: any[] = [];
  selectedCommentType = '';

  constructor(public cbpService: CbpExeService, public domSanitizer: DomSanitizer,
    public executionService: ExecutionService, public sharedviewService: SharedviewService,
    private dataSharingService: DatashareService, public dataJsonService: DataJsonService,
    private cdref: ChangeDetectorRef, public sharedService: CbpSharedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.media && this.media) {
      this.media = changes.media.currentValue;
    }
  }
  ngOnInit() {
    this.commentData = this.commentObject?.comments;
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.selectedStep = JSON.parse(JSON.stringify({ dgUniqueID: this.cbpService.selectedElement.dgUniqueID, dgSequenceNumber: this.currentSelectedNumber }));
    this.dgUniqueID = this.selectedStep.dgUniqueID;
    this.callComments();
    this.setNumber(this.cbpJson?.section);
    this.subscrption = this.dataSharingService.receivedMessage.subscribe((res: Resp_Msg) => {
      if (res.eventType == EventType.fireMediaEditEvent && res.source == Event_resource.commentsRef)
        this.setMedia(res.msg);
      if (res.eventType == EventType.fireCameraEvent && res.source == Event_resource.commentsRef)
        this.setVideo(res.msg);
    });
    this.commentSubscrption = this.dataSharingService.mediaComment.subscribe(event => {
      console.log(event);
      this.setMedia(event.msg);
    });
    if (!this.isCommentUpdate) {
      this.commentObject.commentType = '';
      this.media = [];
    }
    if (this.menuConfig.isEwpExecuter) {
      this.cbpService.codeValues = [{
        cdValue: 1000, cdvalDisplay: "General Comment",
        codeDescription: "Comment Type - General", codeVlaueID: null
      }]
    }
    if (this.isCommentUpdate) {
      let obj = [{ type: 'Delete', disabled: !this.isCommentUpdate }, { type: 'Update' }]
      this.footerList.unshift(...obj);
    } else {
      this.footerList.unshift({ type: 'Save' });
    }
  }
  updateView() {
    this.cdref.detectChanges();
  }
  commentEvent(item: any) {
    if (item.type === 'Cancel') { this.cancel(); }
    if (item.type === 'Update') { this.updateComments(this.commentObject); }
    if (item.type === 'Save') { this.storeComments(); }
    if (item.type === 'Delete') { this.deleteComment(this.commentObject); }
  }

  ngAfterViewInit(): void {
  }
  setMedia(fileName: any) {
    console.log("set media call********");
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
    console.log("set media call********");
    let imageObj = new ImageModal();
    imageObj.fileName = fileName;
    imageObj['name'] = fileName;
    imageObj['fileType'] = 'Video';
    imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
    imageObj.caption = '';
    this.mediaFiles.push(imageObj);
    this.cdref.detectChanges();
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
  callComments() {
    if (this.isCommentUpdate) {
      this.getComment(this.commentObject, this.selectedCommentIndex);
      this.commentObject.commentNewType = this.commentObject.type;
      this.setTypeObject()
    } else {
      this.openComments();
    }
  }
  ngDoCheck(): void {
    if (this.isCommentUpdate && this.cbpService.codeValues?.length > 0 && this.commentObject.commentNewType == undefined) {
      this.setTypeObject();
    }
  }
  setTypeObject() {
    const types = this.cbpService.codeValues.filter((item: any) => item.cdvalDisplay === this.commentObject.commentNewType);
    if (types?.length > 0) {
      this.commentObject.commentType = types[0];
      if (this.isCommentUpdate)
        this.commentObject.commentNewType = types[0].cdvalDisplay;
      console.log('setTypeMethod called', this.commentObject);
    }

  }

  selectCommentObj() {
    if (this.commentObject.number !== this.selectedStep.dgSequenceNumber) {
      const object = this.executionService.getElementByNumber(this.commentObject.number, this.cbpJson?.section);
      if (object) { this.dgUniqueID = object.dgUniqueID; }
    }
  }
  getComment(item: CommentData, i: any) {
    this.selectedCommentIndex = i;
    this.isCommentUpdate = true;
    this.currentSelectedNumber = item.number;
    this.commentObject = item;
    if (this.commentObject.media.length > 0) {
      this.commentObject.media.forEach((itemImage) => {
        if (item.dgType == "Comment") {
          this.mediaFiles = [...this.mediaFiles, ...this.commentObject.media]
        }
        let obj = this.media.filter((item: any) => item.name === itemImage.name);
        if (obj.length === 0 && this.mediaFiles.length === 0) { obj = this.media.filter((item: any) => item.name === 'media/' + itemImage.name); }
        if (obj.length > 0) {
          let imageObj = new ImageModal();
          imageObj.fileName = obj[0]['name'];
          imageObj.caption = itemImage['caption'];
          imageObj['file'] = obj[0];
          imageObj['dgUniqueID'] = this.executionService.loggedInUserId + '_' + (new Date().getTime());
          imageObj.fileType = this.executionService.checkFileType(imageObj['file']);
          imageObj = { ...imageObj, ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) }
          this.mediaFiles.push(imageObj);
        }
      });
      this.mediaFiles = this.cbpService.removeDuplicates(this.mediaFiles, 'fileName');
      this.selectedItemFile = this.mediaFiles[0];
    }
    this.selectedCommentType = item.cdValue;
    this.sharedService.openModalPopup('commentsModal');
  }
  changeRequestAddedFiles(event: any) {
    let mediaObjArray = this.executionService.uploadMedia(event, this.mediaFiles, [], this.cbpService.maxDgUniqueId);
    this.mediaFiles = [...this.mediaFiles, ...mediaObjArray.mediaFiles];
    for (let i = 0; i < this.mediaFiles.length; i++) {
      this.mediaFiles[i] = { ...this.mediaFiles[i], ...this.sharedviewService.setUserInfoObj(ActionId.AddMedia) };
      this.mediaFiles[i].dgType = DgTypes.Figure;
      this.mediaFiles[i].TxnId = this.mediaFiles[i].TxnId + i;
    }
    this.media = [...this.media, ...mediaObjArray.mediaArray];
    this.selectedItemFile = this.mediaFiles[0];
    this.mediaFiles.forEach((item: any) => { item['isExecuter'] = false; });
    this.cdref.detectChanges();
  }
  selectedChange(event: any) {
    this.selectedItemFile = JSON.parse(JSON.stringify(event));
    this.cdref.detectChanges();
    // this.selectedItemcaption = '';
  }
  openComments() {
    this.commentObject = new CommentData();
    this.isCommentUpdate = false;
    this.commentObject.number = this.currentSelectedNumber;
    this.sharedService.openModalPopup('commentsModal');
  }
  selectedItem(item: any) {
    this.selectedItemFile = item;
    this.cdref.detectChanges();
  }
  storeComments() {
    this.mediaFiles.forEach((item: any) => {
      item['isExecuter'] = true;
    });
    this.commentObject.media = this.mediaFiles;
    this.storeCommentById();
    this.mediaChange.emit({ mediaBlob: this.media, mediaFiles: this.mediaFiles });
    this.closeEvent.emit({
      dgType: 'Comment', dgUniqueID: this.dgUniqueID, comments: this.comments,
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

  storeCommentById() {
    const commentsArray = this.cbpService.dataJson.dataObjects.filter((item: any) => item.dynamicUniqueCommentId);
    commentsArray.length = commentsArray ? ++commentsArray.length : 0;
    this.commentObject.status = 'completed';
    this.updateTypes();
    this.commentObject.dgType = DgTypes.Comment;
    this.commentObject.media.forEach((item: any) => {
      delete item['baseUrl'];
      item['isExecuter'] = true;
    });
    // this.commentObject.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID;
    (this.cbpService.selectedElement.dgUniqueID == this.dgUniqueID) ? (this.commentObject.selectedStepDgUniqueId = this.cbpService.selectedElement.dgUniqueID):(this.commentObject.selectedStepDgUniqueId = this.dgUniqueID);
    this.commentObject.createdDate = new Date();
    this.commentObject.createdBy = this.executionService.selectedUserName;
    this.commentObject.dynamicUniqueCommentId = 'dynamicCommentId' + commentsArray.length;
    this.commentObject.dgUniqueID = this.executionService.loggedInUserId + '_' + (new Date().getTime());
    this.storeDatJsonObects(JSON.parse(JSON.stringify(this.commentObject)), 8000);
    if (!this.comments) { this.comments = []; }
    this.comments.push(JSON.parse(JSON.stringify(this.commentObject)));
  }
  updateTypes() {
    if (this.commentObject.commentType === undefined || this.commentObject.commentType === '') {
      const types = this.cbpService.codeValues.filter((item: any) => item.cdvalDisplay === 'General Comment');
      this.commentObject.commentType = types[0];
    }
    this.commentObject.type = this.commentObject.commentType ? this.commentObject.commentType.cdvalDisplay : '';
    this.commentObject.cdValue = this.commentObject.commentType ? this.commentObject.commentType.cdValue : '';
  }
  storeDatJsonObects(Obj: any, action: any) {
    Obj['action'] = action;
    this.storeDataJsonObject(Obj);
  }
  updateComments(item: any) {
    if (!this.selectedCommentIndex) {
      this.comments.forEach((citem: any, index) => {
        if (citem.dgUniqueID === item.dgUniqueID)
          this.selectedCommentIndex = index
      })
    }
    this.comments[this.selectedCommentIndex] = item;
    // this.cbpService.media = [...this.media];
    this.updateTypes();
    item['action'] = 7000;
    item.media = [];
    this.mediaFiles.forEach((itemMedia: any) => { item.media.push(this.getMediaObject(itemMedia)); });
    this.storeDatJsonObects(item, item['action']);
    this.closeEvent.emit({
      dgType: 'updateComment',
      dgUniqueID: this.dgUniqueID,
      comments: this.comments,
      deleteItems: this.deleteItems,
      media: this.media
    });
    if (this.isMobile) {
      this.dataSharingService.sendMessageFromOutsideToPlugin(this.empty);
    }
    this.cdref.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }
  setCaptionFile(fileObj: any) {
    const index = this.mediaFiles.findIndex((item: any) => item.fileName === fileObj.fileName);
    this.mediaFiles[index].caption = fileObj.caption;
    this.cdref.detectChanges();
  }
  storeDataJsonObject(obj: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    delete obj.commentNewType;
    if (!this.isCommentUpdate) {
      dataInfo.dgUniqueID = this.executionService.loggedInUserId + '_' + (new Date().getTime());
      dataInfo.action = 8000
    }
    if (this.isCommentUpdate && obj.action == 7000) {
      dataInfo.dgUniqueID = obj.dgUniqueID;
      dataInfo.action = 7000;
    }
    if (this.isCommentUpdate && obj.action == 7100) {
      dataInfo.dgUniqueID = obj.dgUniqueID;
      dataInfo.action = 7100;
    }
    let dataInfoObj = { ...dataInfo, ...obj, ...this.sharedviewService.setUserInfoObj(dataInfo.action) };
    this.sendDataJsonToParent(dataInfoObj);
  }
  sendDataJsonToParent(event: any) {
    this.cbpService.dataJson.dataObjects.push(event);
  }
  async deleteComment(item: any) {
    // tslint:disable-next-line:no-shadowed-variable
    const { value: userConfirms } = await this.cbpService.showCustomSwal('Do you want to delete the message?', 'warning', 'No', 'Yes');
    let isDeleted = userConfirms ? true : false;
    console.log(isDeleted);
    if (isDeleted) {
      const removeIndex = this.comments.map((itemV: any) => itemV.dgUniqueID).indexOf(item.dgUniqueID);
      this.comments.splice(removeIndex, 1);
      item['action'] = 7100;
      item['dgType'] = 'DeleteComment';
      this.storeDatJsonObects(item, 7100);
      let deleteDgId: any;
      this.numbers.filter((num: any) => {
        if (num.number == item.number) {
          deleteDgId = num.dgUniqueId;
        }
      });
      let comLength: any = [];
      this.comments.filter((com: any) => {
        if (com.number == item.number) {
          comLength.push(com);
        }
      });
      let isComment = comLength.length > 0 ? true : false;
      let deleteItems: string[] = []
      this.mediaFiles.forEach((itemMedia: any) => {
        deleteItems.push(itemMedia.fileName);
        const indexValueUrl = this.media.findIndex((item: any) => item.name === itemMedia.fileName);
        this.media.splice(indexValueUrl, 1);
      });
      this.closeEvent.emit({
        dgType: 'DeleteComment',
        comment: item, dgUniqueID: deleteDgId, isComment: isComment,
        comments: this.comments, media: this.media,
        deleteItems: deleteItems
      });
      this.closeModal()
    }
  }
  deleteItems: string[] = [];

  async deleteMediaFiles(eventObj: any) {
    this.deleteItems.push(eventObj.imageObj.fileName);
    this.mediaFiles = this.mediaFiles.filter((i: any) => i.fileName != eventObj.imageObj.fileName);
    const indexValueUrl = this.media.findIndex((item: any) => item.name === eventObj.imageObj.fileName);
    if (indexValueUrl != -1) {
      this.media.splice(indexValueUrl, 1);
    }
    this.media = [...this.media];
    this.cdref.detectChanges();
  }

  updateMedia(eventObj: any) {
    let getIndex = this.media.findIndex((item: any) => item.name === 'media/' + eventObj.file.name || item.name === eventObj.file.name)
    this.media.splice(getIndex, 1, eventObj.file);
    this.media = [...this.media];
    this.mediaFiles = JSON.parse(JSON.stringify(this.mediaFiles));
    this.cdref.detectChanges();
  }

  removeCommentItem(index: any) {
    this.mediaFiles.splice(index, 1);
  }

  closeModal() {
    this.sharedService.closeModalPopup('commentsModal');
    this.closeEvent.emit(false);
  }
  cancel() {
    this.removeMediaFiles();
    this.closeModal();
  }

  removeMediaFiles() {
    if (!this.isCommentUpdate) {
      this.mediaFiles.forEach((simg: any) => {
        if (simg?.isExecuter === false) {
          this.media.splice(this.media.findIndex((item: any) => item.name === simg.fileName), 1);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.closeModal();
    this.subscrption?.unsubscribe();
    this.commentSubscrption?.unsubscribe();
  }
}
