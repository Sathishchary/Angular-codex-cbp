import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges,
  ChangeDetectorRef, HostListener, ViewChild, Renderer2, ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularResizableDirective } from 'dg-shared';
import 'lg-zoom.js';
import 'lg-fullscreen.js';
import 'lg-autoplay.js';
import 'lg-thumbnail.js';
import { EditMediaComponent } from '../edit-media/edit-media.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CbpSharedService } from '../../cbp-shared.service';
import { NotifierService } from 'angular-notifier';
declare var $: any, lightGallery: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

export interface ISize {
  width: number;
  height: number;
}

export class Size implements ISize {
  constructor(public width: number, public height: number) { }
  static getCurrent(el: Element) {
    let size = new Size(0, 0);
    if (window) {
      const computed = window.getComputedStyle(el);
      if (computed) {
        size.width = parseInt(computed.getPropertyValue('width'), 10);
        size.height = parseInt(computed.getPropertyValue('height'), 10);
      }
      return size;
    } else {
      console.error('Not Supported!');
      return null;
    }
  }
  static copy(s: Size) {
    return new Size(0, 0).set(s);
  }
  set(s: ISize) {
    this.width = s.width;
    this.height = s.height;
    return this;
  }
}

@Component({
  selector: 'app-show-media',
  templateUrl: './show-media.component.html',
  styleUrls: ['./show-media.component.css']
})
export class ShowMediaComponent implements OnInit {
  @Input() propertyUpdated:any;
  @Input() selectedTbl: any;
  @Input() mediaFiles: any;
  @Input() media: any = [];
  @Input() field: any;
  @Input() builder = false;
  @Input() obj: any;
  @Input() stepObject: any;
  @Input() canSelectItem = false;
  @Output() addFiles: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteMedia: EventEmitter<any> = new EventEmitter();
  @Output() showPreview: EventEmitter<any> = new EventEmitter();
  @Output() setCaption: EventEmitter<any> = new EventEmitter();
  @Output() copycutEvent: EventEmitter<any> = new EventEmitter();
  @Output() mobileEvent: EventEmitter<any> = new EventEmitter();
  @Output() gallerView: EventEmitter<any> = new EventEmitter();
  @Output() mediaUpdateFile: EventEmitter<any> = new EventEmitter();

  @Input() mediaType: any = 'editor';
  @Input() headerSelected = false;
  @Input() doubleClickDisable = false;
  @Input() isMobile = false;
  @Input() refreshView = false;
  @Input() mediaPath = '';
  @Input() coverPageViewVal: any;
  @Input() editCoverPage: any;
  @Input() hideButtonsImg: any;
  @Input() coverPageViewEnable: any;

  selectedItem: any;
  imageResized  = false ;
  galleryId = 'lightgallery';
  selectIndex = new Date().getTime();
  lg: any;
  orgHeight :any[] = [];
  orgWidth:any[] = [];
  @Input() executer = false;
  @Input() isBackground = false;
  @Input() galleryView = false;
  public size: Size = new Size(0, 0);
  accept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.wmv,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip";
  acceptImages = ".jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip";

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal,
    public cdref: ChangeDetectorRef, public cbpSharedService: CbpSharedService, private renderer: Renderer2,
    public notifier: NotifierService) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.keyCode == 67 || event.keyCode == 86 || event.keyCode == 88) {
        let type = (event.keyCode == 67 ? 'copy' : (event.keyCode == 86 ? 'paste' : 'cut'))
        this.copyElement(type, event);
        event.preventDefault();
      }
    }
  }
  @ViewChild(AngularResizableDirective) resizeable!: AngularResizableDirective;
  @ViewChild('myInput') myInput!: ElementRef;
  ngOnInit() {
    if (!this.isMobile) {
     // this.getdgImage()
    }
    if (!this.field?.mediaType) {
      this.field['mediaType'] = 'multipleImages';
    }
    this.galleryId = this.mediaType === 'executor' ? 'lightgallery' + (++this.selectIndex) : 'lightgalleryBuilder' + (++this.selectIndex);
  }
  getdgImage() {
    const src = 'assets/cbp/images/DataGlancePng.png'
    fetch(src).then(response => response.blob())
      .then(blob => {
        const file = new File([blob], "DataGlancePng.png", { lastModified: new Date().getTime(), type: blob.type })
        this.media.push(file)
        if (this.mediaFiles?.length > 0 && this.media?.length > 0) { this.setBase64Urls(); }
      })

    this.cdref.detectChanges();
  }

  setOrignalImageResolution() {
    this.mediaFiles.forEach((item: any) => {
      if (item.fileType === 'Image' || item.fileName.indexOf('.png') > -1 ||
        item.fileName.indexOf('.jpg') > -1 || item.fileName.indexOf('.PNG') > -1 ||
        item.fileName.indexOf('.JPG') > -1) {
        let img = this.field?.images.find((i: any) => i.fileName == item.fileName);
        if (img) {
          img['originalWidth'] = !img['originalWidth'] ? item.width : img['originalWidth'];
          img['originalHieght'] = !img['originalHieght'] ? item.height : img['originalHieght'];
          if(this.orgHeight.length<1){
            this.orgHeight.push(img['originalHieght']);
          }
          if(this.orgWidth.length<1){
            this.orgWidth.push(img['originalWidth']);
          }
        }
      }
    });
  }

  resetImage(item: any, index: number) {
 //   this.imageResized = true
    item.resized=false;
    item.resolution=true;
    if(this.orgWidth[0]!=undefined || this.orgHeight[0]!=undefined){
      item['originalWidth']=this.orgWidth[0];
      item['originalHieght']=this.orgHeight[0];
    }
    item.width = item['originalWidth'];
    item.height = item['originalHieght'];
    this.size = new Size(item.width, item.height);
    this.mediaUpdateFile.emit({ eventType: 'resize', item: item });
    this.resizeable.resetSize(this.size);
    this.cdref.detectChanges();
  }
  copyElement(type: any, event: any) {
    this.copycutEvent.emit({ type, event });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'editCoverPage' && changes.editCoverPage.currentValue) {
        this.editCoverPage = changes.editCoverPage.currentValue;
        this.cdref.detectChanges();
      }
      if (propName === 'field' && changes.field) {
        if (changes?.mediaFiles)
          this.mediaFiles = changes.mediaFiles.currentValue;
        this.field = changes.field.currentValue;
        this.cdref.detectChanges();
      }
      if (propName === 'mediaFiles' && changes.mediaFiles) {
        this.mediaFiles = changes.mediaFiles.currentValue;
        if ((this.media?.length > 0 && Array.isArray(this.media)) || this.isMobile) { this.setImageItems(); }
      }
      if (propName === 'refreshView' && changes.refreshView) {
        this.cdref.detectChanges();
      }
      if (propName === 'media' && changes.media) {
        if (changes.media.currentValue?.length > 0) {
          this.mediaFiles = this.field?.images;
          this.media = changes.media.currentValue;
          this.setImageItems();
        }
      }
      if (propName === 'propertyUpdated' && changes.propertyUpdated) {
        if (changes.propertyUpdated.currentValue?.img != undefined) {
          this.propertyUpdated = changes.propertyUpdated.currentValue?.img;
          let index = this.mediaFiles.findIndex((img: any) => img.dgUniqueID === this.propertyUpdated.dgUniqueID && img.fileName === this.propertyUpdated.fileName);
          if (index != -1) {
            this.mediaFiles[index].caption = this.propertyUpdated.caption;
            this.mediaFiles[index].align = this.propertyUpdated.align;
            this.mediaFiles[index].description = this.propertyUpdated.description;
          }
        }
      }
    }
  }
  setImageItems() {
    this.setBase64Urls();
    this.setImages();
    this.cdref.detectChanges();
  }
  setBase64Urls() {
    for (let i = 0; i < this.mediaFiles.length; i++) {
      if (Array.isArray(this.media) && this.media?.length > 0) {
        const obj = this.media.filter((item: any) => item?.name?.includes(this.mediaFiles[i].fileName) &&
          this.checkFileNameExist(this.mediaFiles[i].fileName, item.name));
        if (obj?.length > 0) {
          this.getBase64(obj[0], (base64Data: any) => {
            this.mediaFiles[i]['baseUrl'] = base64Data;
            this.cdref.detectChanges();
          });
          const imageLoad = { url: URL.createObjectURL(obj[0]), context: obj[0].name }
          if (!this.mediaFiles[i]?.resolution || !this.mediaFiles[i]['height'] || !this.mediaFiles[i]['width']) {
            this.cbpSharedService.getImageDimension(imageLoad).subscribe((response: any) => {
              if (!this.mediaFiles[i]['height'] && !this.mediaFiles[i]['width']) {
                this.mediaFiles[i]['height'] = response.height;
                this.mediaFiles[i]['width'] = response.width;
                this.mediaFiles[i]['originalHieght'] = response.height;
                this.mediaFiles[i]['originalWidth'] = response.width;
                this.mediaFiles[i].resolution = true;
                this.setOrignalImageResolution();
                this.cdref.detectChanges();
              }
            });
          }
        }
      }
      if (this.isMobile) {
        this.mediaFiles[i]['baseUrl'] = this.mediaPath + this.mediaFiles[i].name;
      }
    }
  }

  isImage(item: any) {
    if (item.fileType === 'Image' || item.fileName.indexOf('.png') > -1 ||
      item.fileName.indexOf('.jpg') > -1 || item.fileName.indexOf('.PNG') > -1 ||
      item.fileName.indexOf('.JPG') > -1) {
      return true;
    }
    return false;
  }

  selectedImage(item: any, i: number) {
    this.selectedItem = item;
    this.selectedItem.index = i;
    this.selected.emit(item);
  }
  setImage(image: any) {
    if (image.fileName.endsWith('.wmf')) {
      return 'assets/cbp/images/loader.gif';
    } else {
      if (this.isMobile) {
        return this.mediaPath + image.name;
      } else {
        if (Array.isArray(this.media) && this.media?.length > 0) {
          const fileObject = this.media.find((x: any) => (x) && x?.name?.includes(image.fileName) &&
            this.checkFileNameExist(image.fileName, x?.name));
          if (fileObject) {
            const objectURL = fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
            return this.sanitizer.bypassSecurityTrustUrl(objectURL);
          } else {
            return 'assets/cbp/images/loader.gif';
          }
        }
      }
    }
  }
  removeImage(imageObj: any, index: number) {
    if (this.isMobile) {
      this.mobileEvent.emit({ type: 'remove', file: imageObj });
      this.mediaFiles.splice(index, 1);
      const indexValue = this.media.findIndex((itemObj: any) => itemObj?.name?.includes(imageObj.fileName) &&
        this.checkFileNameExist(imageObj.fileName, itemObj.name));
      if (indexValue != -1) {
        this.media.splice(indexValue, 1);
      }
    } else {
      if (this.mediaType === 'mediaeditor') {
        this.mediaFiles.splice(index, 1);
        this.deleteMedia.emit({ imageObj: imageObj, index: index });
      } else {
        this.mediaFiles.splice(index, 1);
        const indexValue = this.media.findIndex((itemObj: any) => itemObj?.name?.includes(imageObj.fileName) &&
          this.checkFileNameExist(imageObj.fileName, itemObj.name));
        if (indexValue != -1) { this.media.splice(indexValue, 1); }
      }
    }
  }
  deleteListAlert(item: any, i: number, field: any) {
    if (field) this.deleteEvent.emit({ field: field, index: i, item: item });
  }
  setImages() {
    for (let i = 0; i < this.mediaFiles.length; i++) {
      this.mediaFiles[i]['mediaUrl'] = this.setImage(this.mediaFiles[i]);
    }
    this.mediaFiles = JSON.parse(JSON.stringify(this.mediaFiles));
    this.cdref.detectChanges();
  }
  setLoader(event: any) {
    event.target.src = 'assets/cbp/images/loader.gif';
  }
  onChangeNewlyAddedFilesTest(event: any) {
    var ext = $('#files').val().split('.').pop().toLowerCase();
    if (!this.acceptImages.includes(ext)) {
      this.notifier.notify('error', 'Please upload Image format files only.');
      return false;
    } else {
      this.addFiles.emit(event);
      this.setBase64Urls();
    }
  }
  // deleteImage(item: any, step: any, i: any) {
  //   if (this.isMobile) {
  //     this.mediaFiles.splice(i, 1);
  //     const index = this.media.findIndex((itemObj: any) => itemObj.name === item.name);
  //     if (index != -1) { this.media.splice(index, 1); }
  //     this.mobileEvent.emit({type:'remove', file:item});
  //   }
  //  this.deleteEvent.emit({ 'item': item, 'stepObj': step, 'index': i });
  // }
  deleteImage(item: any, step: any, i: any) {
    if (this.isMobile) {
      this.mediaFiles.splice(i, 1);
      // const index = this.media.findIndex((itemObj: any) => itemObj.name === item.name);
      // if (index != -1) { this.media.splice(index, 1); }
      this.mobileEvent.emit({ type: 'remove', file: item });
    }
    else {
      this.deleteEvent.emit({ 'item': item, 'stepObj': step, 'index': i });
    }
  }
  showImagePreview(file: any, index: any) {
    try {
      if (file.fileType !== 'Video') {
        try {
          this.lg = $('#' + this.galleryId);
          if (this.lg && this.lg.data('lightGallery')) { this.lg.data('lightGallery').destroy(true); }
        } catch (ex) { console.error(ex); };
        const self = this;
        let dataElements = [];
        for (let i = 0; i < this.mediaFiles.length; i++) {
          if (this.mediaFiles[i].fileType !== 'Video') {
            if (!this.mediaFiles[i]['baseUrl']) {
              const obj = this.media.filter((item: any) => item?.name?.includes(this.mediaFiles[i].fileName) &&
                this.checkFileNameExist(this.mediaFiles[i].fileName, item.name));
              if (obj.length > 0) {
                let self = this;
                this.getBase64(obj[0], function (base64Data: any) {
                  dataElements.push(self.setCaptionDesc(i, base64Data));
                });
              }
            } else {
              dataElements.push(this.setCaptionDesc(i, this.mediaFiles[i]['baseUrl']));
            }
          }
        }
        if (self.mediaFiles.length === dataElements.length) {
          this.loadLightGallary(dataElements, index);
          $('#' + self.galleryId).trigger('click');
        }
      }
    } catch (error) { console.error(error); }
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
  loadLightGallary(dataArray: any, i: any) {
    lightGallery(document.getElementById(this.galleryId), {
      mode: 'lg-lollipop',
      preload: 2,
      videojs: true,
      download: true,
      showAfterLoad: true,
      showThumbByDefault: true,
      addClass: 'lg-showthumb',
      thumbnail: true,
      fullscreen: true,
      dynamic: true,
      getCaptionFromTitleOrAlt: true,
      appendSubHtmlTo: '.lg-sub-html',
      subHtmlSelectorRelative: true,
      index: parseInt(i, 10),
      dynamicEl: dataArray
    });
  }
  editImage(item: any, i: any) {
    if (this.isMobile) {
      this.mobileEvent.emit({ type: 'editImage', file: item })
    } else {
      this.showEditImage(item, i);
    }
  }
  textEdit(item: any) {
    if (!this.editCoverPage && this.coverPageViewEnable) { }
    else {
      this.mediaFiles.forEach((item: any) => item.captionText = false);
      if (this.selectedItem === undefined) { this.selectedItem = item; }
      item['captionText'] = this.selectedItem === item ? true : false;
      setTimeout(() => {
        this.renderer.selectRootElement(this.myInput.nativeElement).focus();
      })
    }
  }

  textBox(item: any, index: any) {
    item['captionText'] = false;
    if (item.type === 'executor') {
      this.mediaUpdateFile.emit({ eventType: 'resize', item: item });
      this.setCaption.emit(item);
      this.cdref.detectChanges();
    } else {
      this.setCaption.emit({ dgUniqueID: this.field.dgUniqueID, caption: item.caption, index: index });
    }
    this.cdref.detectChanges();
  }
  changeCaption(caption: string, i: number) {
    this.cbpSharedService.setMediaCaption({ dgUniqueID: this.field.dgUniqueID, caption: caption, index: i });
  }

  showEditImage(file: any, i: number) {
    const modalRef = this.modalService.open(EditMediaComponent, { backdrop: 'static', backdropClass: 'customBackdrop', size: 'xl' });
    modalRef.componentInstance.mediaFile = file;
    modalRef.componentInstance.media = this.media;
 //   modalRef.componentInstance.isMobile = this.isMobile;
    modalRef.componentInstance.type = this.mediaType;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      if (result != false) {
        try {
          const fileIndex = this.media.findIndex((x: any) => x?.name?.includes(file.name) &&
            this.checkFileNameExist(file.name, x.name));
          if (fileIndex !== -1) { this.media[fileIndex] = result.file; }
          this.mediaUpdateFile.emit({ file: result.file, mediaFile: result.mediaFile });
          this.setBase64Urls();
          this.setImages();
        } catch (error: any) { console.error(error); }
      }
      modalRef.close();
    });
  }
  columnOriginalWidth: any;
  onResizeStart(event: any, item1: any) {
    if (item1.isTableDataEntry) {
      const parentTd = document.querySelector(`img[id='${item1.fileName}']`)?.closest('td') as HTMLElement;
      if (parentTd) {
        this.columnOriginalWidth = parentTd.offsetWidth; // Store original column width
        this.columnOriginalWidth = this.columnOriginalWidth - 20;//to allow padding and margin of image removed 20px
        this.resizeable.rzMaxWidth = this.columnOriginalWidth;
      }
    }
  }
  onResizeStop(event: any, item1: any) {
    item1.height = event.size.height;
    item1.width = event.size.width;
    this.mediaFiles.forEach((item: any) => {
      if (item.fileType === 'Image' || item.fileName.indexOf('.png') > -1 ||
        item.fileName.indexOf('.jpg') > -1 || item.fileName.indexOf('.PNG') > -1 ||
        item.fileName.indexOf('.JPG') > -1) {
        let img = this.field.images.find((i: any) => i.fileName == item1.fileName);
        if (img) {
          img['height'] = event.size.height;
          img['width'] = event.size.width;
          img['resized'] = true ;
          img['originalWidth'] = !img['originalWidth'] ? item.width : img['originalWidth'];
          img['originalHieght'] = !img['originalHieght'] ? item.height : img['originalHieght'];
          item1['originalWidth'] = !item1['originalWidth'] ? item.width : item1['originalWidth'];
          item1['originalHieght'] = !item1['originalHieght'] ? item.height : img['originalHieght'];
          item1['resized'] = true ;
        }
      }
    });

    this.mediaUpdateFile.emit({ eventType: 'resize', item: item1 });
  }
  onResizing(event: any) { }
  checkFileNameExist(name: string, main: string) {
    let title = main.includes('media/') ? main.substring(6, main.length) : main;
    return name === title ? true : false;
  }
  ngAfterViewInit(): void {
    this.setBase64Urls();
  }
}
