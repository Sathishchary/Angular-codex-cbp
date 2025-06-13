import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { DataSharingService } from '../../../services/data-sharing.service';
import { SharedService } from '../../../shared/services/shared.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html'
})
export class MediaComponent implements OnInit {
  @Input() field: any = {};
  @Input() media: any[] = [];
  @Input() hideTrackUi = false;
  @Input() form!: FormGroup;
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Input() rowcolInfo!: any;
  @Input() isCoverPage: any;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  validMediaFiles = false;
  refreshView = false;
  setItemSubscription!: Subscription;
  imgpropertiessubscription!: Subscription;
  mediaUpdateSubscription!: Subscription;
  mediaSubscription!: Subscription;
  viewValSubscription!: Subscription;
  mediaCaptionSubscription!: Subscription;
  viewVal!: boolean;
  CoverPageView!: boolean;
  captionChanged: any;
  currentField: any;
  constructor(private propertyaChangeService: DataSharingService, public sharedService: SharedService,
    private cd: ChangeDetectorRef, public sanitizer: DomSanitizer, public cbpService: CbpService,
    private cbpSharedService: CbpSharedService, public auditService: AuditService,
    public controlService: ControlService, private builderUtil: BuilderUtil,
    public tableService: TableService) { }

  ngOnInit() {
    const self = this;
    this.currentField = JSON.parse(JSON.stringify(this.field));
    if (this.field?.images?.length == 0) {
      this.cbpService.fileproperties = undefined;
    }
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cd.detectChanges();
      }
    });
    this.imgpropertiessubscription = this.propertyaChangeService.imageproperties.subscribe(
      (res) => {
        if (res !== '' && res !== undefined) {
          const index = self.field.images.findIndex((i: any) => i.dgUniqueID == res?.dgUniqueID);
          if (index > -1) {
            if (self.field.images[index].caption != res.caption || self.field.images[index].align != res.align || self.field.images[index].description != res.description) {
              this.viewUpdate();
            }
            self.field.images[index].caption = res.caption;
            self.field.images[index].align = res.align;
            self.field.images[index].description = res.description;
            // updating the caption and img align from property section
            const obj: any = { img: self.field.images[index] };
            self.captionChanged = JSON.parse(JSON.stringify(obj));
            this.refreshView = !this.refreshView;
            self.cd.detectChanges();
          }
        }
      });
    this.mediaUpdateSubscription = this.propertyaChangeService.mediaObjectUpdateChange.subscribe(
      (res) => {
        if (res !== '' && res !== undefined) {
          // console.log(res);
        }
      });
    this.mediaSubscription = this.controlService.mediaUpdateValue.subscribe(result => {
      if (!this.controlService.isEmpty(result) && result && result !== undefined) {
        if (result?.length > 0 && Array.isArray(result)) {
          this.media = result;
          this.cbpService.media = [...this.cbpService.media, ...result];
          this.cbpService.media = this.cbpService.removeDuplicates(this.cbpService.media, 'name');
          this.cd.detectChanges();
        }
      }
    });

    this.mediaCaptionSubscription = this.cbpSharedService.imageCaptionSub.subscribe((result: any) => {
      if (!this.controlService.isEmpty(result) && result && result !== undefined) {
        if (this.field.dgUniqueID == result.dgUniqueID) {
          if (this.field && this.field.images && this.field.images.length > 0 && this.field.images[result.index]) {
            if (self.field?.images[result.index]?.caption != result?.caption) {
              this.viewUpdate();
            }
            this.field.images[result.index].caption = result?.caption;
            if (this.cbpService.selectedElement.dgType === DgTypes.Figures) {
              this.cbpService.selectedElement.images[result.index].caption = result?.caption;
            }
            if (this.cbpService.selectedElement.dgType === DgTypes.Figure) {
              this.cbpService.selectedElement.caption = result?.caption;
            }
          }
        }
      }
      if (!this.controlService.isEmpty(result) && result) {
        this.cbpSharedService.setMediaCaption({});
      }
    });
    this.viewValSubscription = this.controlService.coverPageViewVal.subscribe((result: any) => {
      this.viewVal = result;
    });

  }
  isImage(item: any) {
    return (item.fileType === 'Image' || item.fileName.indexOf('.png') > -1 ||
      item.fileName.indexOf('.jpg') > -1 || item.fileName.indexOf('.PNG') > -1 ||
      item.fileName.indexOf('.JPG') > -1);
  }
  selectedForTable(event: any) {
    this.cbpService.tableDataEntrySelected = this.field;
    if (event['shiftKey']) { this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false; } else {
      this.rowcolInfo['shiftKey'] = false;
    }
    this.tableEvent.emit(this.rowcolInfo);
  }
  mediaPropertiesRemove() {
    this.cbpService.fileproperties.name = '';
    this.cbpService.fileproperties.caption = '';
    this.cbpService.fileproperties.source = '';
  }

  onChangeNewlyAddedFilesTest(event: any) {
    let mediaFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      let fileBlob = event.target.files[i];
      let filetype: any;
      if (event.target.files[i].type.indexOf('image') > -1) {
        filetype = 'Image';
        let isValidImage = this.field.images.filter((item: any) => item.fileName === event.target.files[i].name);
        let isValidImageMedia = this.cbpService.media.filter((item: any) => item.name === event.target.files[i].name);
        if (isValidImage.length > 0 || isValidImageMedia.length > 0) {
          let fileValue = event.target.files[i].name.split('.');
          fileBlob = new File([event.target.files[i]], fileValue[0] + new Date().getTime().toString().substring(8, 12) + '.' + fileValue[1],
            { type: event.target.files[i].type });
        }
        const singleImage: any = {
          fileName: fileBlob.name,
          dgUniqueID: String(this.builderUtil.getUniqueIdIndex()),
          dgType: DgTypes.Figure,
          name: fileBlob.name,
          source: 'Local',
          caption: '',
          fileType: filetype,
          action: 8100,
          type: 'builder'
        };
        this.field.images.push(singleImage);
        // console.log("idd",String(this.builderUtil.uniqueIdIndex))
        // this.cbpService.mediaBlobs.push({fileName: fileBlob.name, showFile: true});
        mediaFiles.push(fileBlob);
        this.propertyaChangeService.changeImageProperties(singleImage);
        this.viewUpdate();
        // this.auditService.elementsRestoreSnapChats.push(JSON.parse(JSON.stringify(this.field)));
        // this.createAuditEntry(AuditTypes.MEDIA_FILE, { propName: 'fileName', index: (this.field.images.length - 1) })
      }
    }
    // console.log(this.field.images);
    this.trackViewUpdate();
    this.cbpService.media = [...this.cbpService.media, ...mediaFiles];
    this.controlService.setMediaItem(this.cbpService.media);
    this.sharedService.mediaFilesStorageItem(this.field.images);
    this.cd.detectChanges();
  }
  copyImage(item: any) {
    if (item.type === 'copy') {
      this.cbpService.copyElement();
    } else if (item.type === 'cut') {
      this.cbpService.cutElement();
    } else {
      this.cbpService.elementForCopyOrCut = null;
    }
  }
  selectedImage(image: any) {
    if (image['isTableDataEntry']) {
      this.cbpService.tableDataEntrySelected = image;
    } else {
      this.cbpService.selectedElement = image;
    }
    this.propertyaChangeService.changeImageProperties(image);
  }
  singleElement(imageField: any) {
    let field = imageField.field;
    if (field.isTableDataEntry) {
      const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.rowcolInfo.row - 1].entry[this.rowcolInfo.col - 1];
      entrychildrens.children = entrychildrens.children.filter((item: any) => item.dgUniqueID !== field.dgUniqueID);
      this.cbpService.tableDataEntrySelected = '';
      this.cbpService.selectedElement = this.field;
      this.cbpService.deleteListAlert(field);
      this.removeImage({ imageObj: imageField.item, index: imageField.index });
    } else {
      try {
        let element;
        try {
          element = JSON.parse(JSON.stringify(this.builderUtil.getElementByNumber(field.parentID, this.cbpService.cbpJson.section)))
        } catch (error) { }
        this.cbpService.deleteListAlert(field);
        this.cbpService.fileproperties = undefined
        // this.cbpService.setFilePropertiesValue(undefined)
        if (element)
          //   this.auditService.elementsRestoreSnapChats.push(element);
          // this.auditService.createEntry(this.auditService.selectedElementSnapchat, field, Actions.Delete);
          this.removeImage({ imageObj: imageField.item, index: imageField.index });
      } catch (error) {
        console.log(error)
      }
    }
  }

  removeImage(event: any) {
    let imageObj = event.imageObj;
    let index = event.index;
    const source = JSON.parse(JSON.stringify(this.field))
    this.field.images.splice(index, 1);
    this.cbpService.media.forEach((image: any, mindex: any) => {
      if (image.name.includes(imageObj.fileName)) {
        // this.auditService.elementsRestoreSnapChats.push({ file: image });
        // this.auditService.createEntry({}, JSON.parse(JSON.stringify(source)), Actions.Delete, AuditTypes.MEDIA_FILE);
        this.cbpService.media.splice(mindex, 1);
        if (this.cbpService?.fileproperties)
          this.mediaPropertiesRemove();
      }
    });
    this.cd.detectChanges();
  }
  removeAllImages() {
    this.field.images.forEach((simg: any) => {
      this.cbpService.media.forEach((image: any, mindex: any) => {
        if (image.name?.includes(simg?.fileName)) {
          this.cbpService.media.splice(mindex, 1);
        }
      });
    });
    this.field.images = [];
  }
  setLoader(event: any) {
    event.target.src = 'assets/cbp/images/loader.gif';
  }
  selectElement() {
    if (this.field?.images?.length > 0) {
      this.cbpService.fileproperties = this.field?.images[0];
      this.cbpService.fileproperties.name = this.cbpService.fileproperties.fileName ?? '';
      this.cbpService.fileproperties.source = this.cbpService.fileproperties.source ?? 'Local';
    } else {
      this.cbpService.fileproperties = undefined;
    }
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.controlService.setSelectItem(this.field);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Insert, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  setCaption(event: any) {
    if (this.field.images[event.index].caption != event.caption) {
      this.viewUpdate();
    }
    this.field.images[event.index].caption = event.caption;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.PROPERTY_MEDIA_CAPTION, { propName: 'caption', index: event.index });
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  ngOnDestroy() {
    this.setItemSubscription?.unsubscribe();
    this.imgpropertiessubscription?.unsubscribe();
    this.mediaSubscription?.unsubscribe();
    this.mediaUpdateSubscription?.unsubscribe();
    this.mediaCaptionSubscription?.unsubscribe();
  }
  mediaUpate(event: any) {
    if (event?.file) {
      const fileIndex = this.media.findIndex((x: any) => x.name.includes(event.file.name));
      this.cbpService.media.splice(fileIndex, 1, event.file);
      this.viewUpdate();
    }
    if (event?.eventType == 'resize') {
      if (event?.item) {
        const mediaFile = this.field?.images.find((x: any) => x.name.includes(event?.item.name));
        if (mediaFile) {
          mediaFile['height'] = event?.item?.height;
          mediaFile['width'] = event?.item?.width;
          mediaFile['resized'] = event?.item?.resized;
          mediaFile['resolution'] = event?.item?.resolution;
        }
        this.viewUpdate();
        this.cd.detectChanges();

      }
    }
  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }
  viewUpdate() {
    if (!this.field.isTableDataEntry) {
      // if (JSON.stringify(this.field) !== JSON.stringify(this.currentField)) {
      this.trackViewUpdate();
      // }
    } else {
      let table = this.builderUtil.getElementByDgUniqueID(this.field.parentDgUniqueID, this.cbpService.cbpJson);
      table = this.cbpService.setTableTrackChange(table);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }
  }
  trackViewUpdate() {
    this.field = this.cbpService.setUserUpdateInfo(this.field);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
