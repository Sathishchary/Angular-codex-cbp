import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnChanges, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventType, Event_resource, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { CbpSharedService, EditMediaComponent } from 'cbp-shared';
import { DatashareService } from '../../services/datashare.service';
import { SharedviewService } from '../../services/sharedview.service';
import { DataJsonService } from '../../services/datajson.service';
declare var $: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit,OnChanges {
  @Input() mediaFiles: any;
  @Input() media: any;
  @Input() obj: any;
  @Input() stepObject: any;
  @Input() canSelectItem = false;
  @Input() selected:any;
  @Output() addFiles: EventEmitter<any> = new EventEmitter();
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteMedia: EventEmitter<any> = new EventEmitter();
  @Output() setCaption: EventEmitter<any> = new EventEmitter();
  @Output() mediaUpdateFile: EventEmitter<any> = new EventEmitter();
  @Input() mediaType: any;
  @Input() doubleClickDisable = false;
  @Input() eventType: Event_resource | undefined;
  selectedItem: any;
  galleryId = 'lightgallery';
  selectIndex = 0;
  selectedItemIndex = 0;
  lg: any;
  accept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.wmv,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip";
  acceptImages = ".jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip";
  isMobile: boolean | undefined = false;
  uniqueID = new Date().getTime();

  constructor(public cbpService: CbpExeService, public sanitizer: DomSanitizer,public sharedviewService: SharedviewService,
    public cdref: ChangeDetectorRef, public executionService: ExecutionService, public dataJsonService: DataJsonService,
    private dataSharingService: DatashareService, private modalService: NgbModal,public cbpSharedService: CbpSharedService, private renderer: Renderer2) {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
  }

  ngOnInit() {
    this.galleryId = this.mediaType === 'executor' ? 'lightgallery' + (++this.selectIndex) : 'lightgalleryBuilder' + (++this.selectIndex);
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'mediaFiles' && !changes.mediaFiles.firstChange ) {
        this.mediaFiles = changes.mediaFiles.currentValue;
      }
      if (propName === 'media' && !changes.media.firstChange ) {
        this.media = changes.media.currentValue;
      }
      if(propName === 'selected' && changes.selected.currentValue){
        this.selectedItem = changes.selected.currentValue;
        let index = this.mediaFiles.findIndex((item:any)=>item.fileName ===this.selectedItem.fileName);
        if(index >= 0){
          this.mediaFiles[index].caption = this.selectedItem.caption;
          let editindex = this.mediaFiles.findIndex((item:any)=>item.fileName ===this.media.fileName);
          }
        // this.mediaFiles[index].caption = this.selectedItem?.caption;
        // let editindex = this.mediaFiles.findIndex((item:any)=>item.fileName ===this.media.fileName);
       // this.mediaFiles[editindex].file = this.selectedItem.caption;
        this.selectedItemIndex = index;
      }
    }
  }
  update(): void{
    $('#galleryView'+this.uniqueID).trigger('click');
  }
  selectedImage(item: any, i: number = 0) {
    this.selectedItem = item;
   // this.selectedItem.index = i;
    if(this.selectedItemIndex !== i){
      this.selectedItemIndex = i;
    }
    this.selectedChange.emit(item);
  }
  setImage(image: any, i:number) {
    if (this.isMobile) {
      if (image.fileName.endsWith('.wmf')) {
        return 'assets/cbp/images/loader.gif';
      } else {
        return this.dataSharingService.getMediaPath() + image.fileName;
      }
    } else {
      if (image.fileName.endsWith('.wmf')) {
        return 'assets/cbp/images/loader.gif';
      } else {
        const fileObject:any = this.media.find((x: any) => x.name.includes(image.fileName));
        if (fileObject) {
          const objectURL = fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
          const url = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          return url;
        }
      }
    }
  }

  removeImage(imageObj: any, index: number) {
    this.deleteMedia.emit({ imageObj: imageObj, index: index });
  }

  editImage(item: any, i: any) {
    if (this.isMobile) {
      if (this.eventType == Event_resource.uploadRef) {
        let evt: Request_Msg = { eventFrom: Event_resource.uploadRef, eventType: EventType.fireMediaEditEvent, msg: item };
        this.dataSharingService.sendMessageFromLibToOutside(evt);
      } else if (this.eventType == Event_resource.crRef) {
        let evt: Request_Msg = { eventFrom: Event_resource.crRef, eventType: EventType.fireMediaEditEvent, msg: item };
        this.dataSharingService.sendMessageFromLibToOutside(evt);
      } else if (this.eventType == Event_resource.commentsRef) {
        let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireMediaEditEvent, msg: item };
        this.dataSharingService.sendMessageFromLibToOutside(evt);
      }
    } else {
      this.cbpService.imageUrlShow = false;
      this.cbpService.mediaFile = item;
      this.cbpService.imageUrlShow = true;
      this.showEditImage(item, i);
    }
  }

  showEditImage(file: any, i:number) {
    const modalRef = this.modalService.open(EditMediaComponent, { backdrop:'static', backdropClass:'customBackdrop', size: 'xl'});
    file['baseUrl'] = undefined;
    modalRef.componentInstance.mediaFile = file;
    this.media = this.cbpService.removeDuplicates(this.media, 'name');
    modalRef.componentInstance.media = this.media;
    modalRef.componentInstance.type = this.mediaType;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      if (result != false) {
        try {
          this.mediaUpdateFile.emit({file:result.file, mediaFile:result.mediaFile, index:i});
          let getIndex  = this.media.findIndex((item:any)=>  item.name ===file.file.name)
          this.media[getIndex] = result.file;
          this.cdref.detectChanges();
        } catch(error:any){ console.error(error);}
      }
      modalRef.close();
    });
  }
  checkFileNameExist(name:string, main:string){
    let title = main.includes('media/') ? main.substring(6, main.length): main;
    return name === title ? true:false;
  }
  setLoader(event: any) {
    event.target.src = 'assets/cbp/images/loader.gif';
  }
  onChangeNewlyAddedFilesTest(event: any) {
    this.addFiles.emit(event);
    this.cdref.detectChanges();
    this.cdref.markForCheck();
  }

  showImagePreview(file: any, index: any) {
    try {
      if (file.fileType !== 'Video') {
        try {
          this.lg = $('#' + this.galleryId);
          if (this.lg && this.lg.data('lightGallery')) { this.lg.data('lightGallery').destroy(true); }
        } catch (ex) { console.error(ex); }
        const self = this;
        let dataElements = [];
        for (let i = 0; i < this.mediaFiles.length; i++) {
          if (!this.mediaFiles[i]['baseUrl']) {
            const obj = this.cbpService.media.filter((item: any) => item.name.includes(this.mediaFiles[i].fileName));
            if (obj.length > 0) {
              this.getBase64(obj[0], (base64Data: any) => {
                dataElements.push({ src: base64Data, thumb: base64Data, 'data-sub-html': this.mediaFiles[i]?.caption });
              });
            }
          } else {
            dataElements.push({ src: this.mediaFiles[i]['baseUrl'], thumb: this.mediaFiles[i]['baseUrl'], 'data-sub-html': this.mediaFiles[i]?.caption });
          }
        }
        if (self.mediaFiles.length === dataElements.length) {
          self.loadLightGallary(dataElements, index);
          $('#' + self.galleryId).trigger('click');
        }
      }
    } catch (error) { console.error(error); }
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  loadLightGallary(dataArray: any, i: any) {
    this.lg.lightGallery({
      // mode: modes[Math.floor(Math.random()*modes.length)],
      mode: 'lg-lollipop',
      preload: 2,
      videojs: true,
      showAfterLoad: false,
      thumbnail: true,
      fullscreen: true,
      dynamic: true,
      index: parseInt(i, 10),
      dynamicEl: dataArray
    });
  }

  // textEdit(item: any) {
  //   if (this.selectedItem === undefined) { this.selectedItem = item; }
  //   item['captionText'] = this.selectedItem === item ? true : false;
  //   this.cdref.detectChanges();
  // }
      @ViewChild('myInput') myInput!: ElementRef;
    textEdit(item: any) {
   
      this.mediaFiles.forEach((item: any) => item.captionText = false);
      if (this.selectedItem === undefined) { this.selectedItem = item; }
      item['captionText'] = this.selectedItem === item ? true : false;
      setTimeout(() => {
        this.renderer.selectRootElement(this.myInput.nativeElement).focus();
      })
    
  }
   changeCaption(caption: string, i: number) {
    this.cbpSharedService.setMediaCaption({ dgUniqueID: this.mediaFiles[i].dgUniqueID, caption: caption, index: i });
  }
  textBox(item: any) {
    item['captionText'] = false;
    this.setCaption.emit(item);
    this.cdref.detectChanges();
  }
  //  Mobile Event
  openImageChange() {
    // eventHandler.fireMediaEvent(this.cbpService.activeComponent);
    if (this.eventType == Event_resource.uploadRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.uploadRef, eventType: EventType.fireMediaEvent, msg: { 'event': 'media' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    } else if (this.eventType == Event_resource.crRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.crRef, eventType: EventType.fireMediaEvent, msg: { 'event': 'media' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    } else if (this.eventType == Event_resource.commentsRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireMediaEvent, msg: { 'event': 'media' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    }
  }
  captureMedia() {
    if (this.eventType == Event_resource.uploadRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.uploadRef, eventType: EventType.fireCameraEvent, msg: { 'event': 'camera' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    } else if (this.eventType == Event_resource.crRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.crRef, eventType: EventType.fireCameraEvent, msg: { 'event': 'camera' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    } else if (this.eventType == Event_resource.commentsRef) {
      let evt: Request_Msg = { eventFrom: Event_resource.commentsRef, eventType: EventType.fireCameraEvent, msg: { 'event': 'camera' } };
      this.dataSharingService.sendMessageFromLibToOutside(evt);
    }
  }
}

