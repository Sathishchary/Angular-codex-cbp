import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CbpSharedService } from '../../cbp-shared.service';
declare var tui:any, whiteTheme:any, $: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMediaComponent implements OnInit, AfterViewInit  {
  @Input() mediaFile: any;
  @Input() type: any;
  @Output() closeEvent : EventEmitter<any> = new EventEmitter();
  @Output() updateEditMedia : EventEmitter<any> = new EventEmitter();
  @Output() mediaChange: EventEmitter<any> = new EventEmitter();
  @Output() saveEditImge: EventEmitter<any> = new EventEmitter();
  loading = false;
  imageEditor: any;
  @Input() isMobile :any ;
  @Input() media!:any;
  constructor(public cbpSharedService: CbpSharedService) { }

  ngOnInit() {
  }
  closeModal(){
    this.closeEvent.emit(false);
  }
  ngAfterViewInit() {
    console.log("editmedia ",this.isMobile)
    if(this.mediaFile.baseUrl !== undefined){
      if(this.mediaFile.baseUrl  instanceof Blob){
        this.getBase64(this.mediaFile.baseUrl, (base64Data: any) => {
          this.mediaFile.baseUrl = base64Data;
          this.openEditor();
        });
      }
      else{
        this.openEditor();
      }
    } else {
      if(this.mediaFile.baseUrl === undefined){
        const obj = this.media.filter((item: any) => item.name.includes(this.mediaFile.fileName));
        if(!this.mediaFile.name){
          this.media.forEach((ele:any) => {
            if(ele.name.includes(this.mediaFile.fileName)){
              this.mediaFile.name=ele.name;
            }
          });
        }
        if (obj.length > 0) {
        this.getBase64(obj[0], (base64Data: any) => {
          this.mediaFile.baseUrl = base64Data;
          this.openEditor();
        });
      }
     }
    }
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  openEditor(){
    let self = this;
    this.imageEditor = new tui.ImageEditor('#tui-image-editor-container', {
      includeUI: {
        loadImage: { path: self.mediaFile.baseUrl,  name: self.mediaFile.name },
        theme: whiteTheme,
        initMenu: 'draw',
        menuBarPosition: 'right'
      },
      cssMaxWidth: 700,
      cssMaxHeight: 450,
      usageStatistics: false,
    });
    window.onresize = function () { self.imageEditor.ui.resizeEditor(); };
    $('.help').css({"margin-bottom":"-7px"});
  }

  eventSubmit(event:any){
    if(event.type === 'Ok'){
      this.saveImgeBlob();
    } else {
      this.closeModal();
    }
  }

  saveImgeBlob(){
    const imageBlob = this.cbpSharedService.dataURItoBlob(this.imageEditor.toDataURL());
    const file = new File([imageBlob], this.mediaFile.name, { lastModified: new Date().getTime(), type: imageBlob.type })
    this.closeEvent.emit({file:file, mediaFile: this.mediaFile});
   // this.closeEvent.emit({file:file, mediaFile: this.mediaFile,mediaurl : this.imageEditor.toDataURL()});
  }
}
