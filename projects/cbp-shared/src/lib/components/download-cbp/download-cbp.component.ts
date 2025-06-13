import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit,
  Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import JSZip from 'jszip';
import { CbpSharedService } from '../../cbp-shared.service';

@Component({
  selector: 'download-cbp',
  templateUrl: './download-cbp.component.html',
  styleUrls: ['./download-cbp.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadCbpComponent implements OnInit, AfterViewInit {
  fileName = '';
  @Input() cbpJson:any;
  @Input() signatureJson:any;
  @Input() styleJson:any;
  @Input() styleImageJson:any;
  @Input() layoutJson:any;
  @Input() attachment:any;
  @Input() orderJson:any;
  @Input() dynamicSectionJson:any;
  @Input() dataJson:any;
  @Input() protectJson:any;
  saveCbp:boolean=false
  // @Input() dynamicSectionInfo:any;
  @Input() annotateJson:any;
  @Input() media:any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() fileNameEvent: EventEmitter<any> = new EventEmitter();
  constructor(public cbpSharedService:CbpSharedService, public cdref: ChangeDetectorRef) { }

  ngOnInit(){
    this.fileName = this.cbpJson.documentInfo[0]['fileName'] ?? '';
  }

  ngAfterViewInit(){
    this.cbpSharedService.openModalPopup('saveCbpModal');
  }

  updateView(){
    this.cdref.detectChanges();
  }

  setCbpZipDownload() {
    const zip = new JSZip();
    this.cbpJson.documentInfo[0]['fileName'] = this.fileName;
    zip.file('cbp.json', JSON.stringify(this.cbpJson));
    zip.file('style/style.json', JSON.stringify(this.styleJson));
    zip.file('style/style-image.json', JSON.stringify(this.styleImageJson));
    zip.file('style/layout.json', JSON.stringify(this.layoutJson));
    if (this.media && this.media.length > 0) {
      for (let i = 0; i < this.media.length; i++) {
        const blob = this.media[i];
        if (this.media[i].name.includes('media/')) {
          zip.file(this.media[i].name, blob);
        } else { zip.file('media/' + this.media[i].name, blob); }
      }
    } else { zip.folder('media'); }
    if (this.attachment && this.attachment.length > 0) {
      for (let i = 0; i < this.attachment.length; i++) {
        const blob = this.attachment[i];
        if (this.attachment[i].name && this.attachment[i].name.includes('attachment/')) {
          zip.file(this.attachment[i].name, blob);
        } else { zip.file('attachment/' + this.attachment[i].name, blob); }
      }
    } else { zip.folder('attachment'); }
    zip.file('data/data.json', JSON.stringify(this.dataJson));
    zip.file('data/protect.json', JSON.stringify(this.protectJson));

    // if(this.signatureJson && this.signatureJson.length > 0){
    //   zip.file('data/signature.json', JSON.stringify(this.signatureJson));
    // }
    if(this.signatureJson === undefined){
      this.signatureJson = [];
    }
    const signatureJson = this.signatureJson;
    if(signatureJson !== undefined){zip.file('data/signature.json', JSON.stringify(signatureJson));}
    if(this.annotateJson === undefined){
      this.annotateJson = {
        annotateObjects: []
      };;
    }
    const annotationJson = this.annotateJson;
    if(annotationJson !== undefined){zip.file('data/annotation.json', JSON.stringify(annotationJson));}
    zip.file('data/execution-order.json', JSON.stringify(this.orderJson));
    zip.file('data/dynamic-section.json', JSON.stringify(this.dynamicSectionJson));
    // zip.file('data/dynamic-section-info.json', JSON.stringify(this.dynamicSectionInfo));
    // if(this.annotateJson?.annotateObjects?.length>0)
    //   zip.file('data/annotation.json', JSON.stringify(this.annotateJson));
    zip.generateAsync({ type: 'blob' }).then((blob) => {
        const a = document.createElement('a');
        a.setAttribute('href', (window.URL.createObjectURL(blob)));
        if (!this.fileName) { this.fileName = 'downlaodable'; }
        a.setAttribute('download', this.fileName + '.cbp');
        a.click();
        this.saveCbp=true;
        this.closeModal();
    }, (err) => {
      console.log('err: ' + err);
    });
  }

  closeModal(){
    this.cbpSharedService.closeModalPopup('saveCbpModal');
    this.fileNameEvent.emit(this.fileName);
    this.closeEvent.emit(false);
  }
  ngOnDestroy(): void {
    this.closeModal();
  }

}
