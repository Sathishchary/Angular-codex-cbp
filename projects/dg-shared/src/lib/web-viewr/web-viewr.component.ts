/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import WebViewer from "@pdftron/webviewer";
import { Subject } from "rxjs";


@Component({
  selector: "app-web-viewr",
  templateUrl: "./web-viewr.component.html",
  styleUrls: [
    "./web-viewr.component.css"]
})
export class WebViewromponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  fileInfo: any;


  @Input()
  activeTab = -1;

  fileObj: any;

  @ViewChild("viewer", { static: true }) viewer!: ElementRef;
  wvInstance: any;
  @Output() coreControlsEvent: EventEmitter<any> = new EventEmitter();

  private documentLoaded$: Subject<void>;
  loader = false;



  editAction = false;
  detectChanges = false;

  @Input()
  toggleSave = false;
  @Input()
  toggleEdit = false;

  interval: any
  // changeCountSnapChat =0 ;
  // changeCount = 0;
  @Output()
  notifyParent: EventEmitter<any> = new EventEmitter();

  @Input()
  changeEvent: any;

  @Input()
  actionEvent: any;

  constructor(

    private cdRef: ChangeDetectorRef

  ) {
    this.documentLoaded$ = new Subject<void>();
  }

  ngOnInit() {
    console.log(this.toggleEdit)
    this.loader = true;
    this.fileInfo.changeCount = 0;
    this.fileInfo.changeCountSnapChat = 0;
    if (this.fileInfo.file != undefined) {
      this.initWebViewer(this.fileInfo.file);
      this.cdRef.detectChanges();
    } else if (this.fileInfo["isEmbeded"]) {
      this.fileObj = this.fileInfo["file"];
      this.initWebViewer(this.fileObj);
      this.cdRef.detectChanges();
    }

  }
  ngAfterViewInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    for (const propName in changes) {
      if (propName === 'changeEvent' && !changes.changeEvent.firstChange) {
        this.notifyParent.emit({ type: propName, value: this.fileInfo.changeCountSnapChat < this.fileInfo.changeCount ? true : false });
      }
      if (propName === 'actionEvent' && !changes.actionEvent.firstChange) {
      }
      if (propName === 'toggleSave' && !changes.toggleSave.firstChange) {
        this.saveFile(this.wvInstance.Core)
      }
      if (propName === 'toggleEdit' && !changes.toggleEdit.firstChange) {
        this.editFile(this.wvInstance)
      }
    }
  }
  editFile(instance: any) {
    const {
      setHeaderItems,
      enableElements,
      disableElements,
      enableFeatures,
      disableFeatures,
      setTheme,
      Feature,
    } = instance.UI;
    console.log(this.toggleEdit);
    if (this.toggleEdit) {
      enableFeatures([Feature.Annotations]);
    } else {
      disableFeatures([Feature.Annotations]);
    }
  }

  getDocumentLoadedObservable() {
    return this.documentLoaded$.asObservable();
  }
  initWebViewer(blob: any) {
    const self = this;
    WebViewer(
      {
        path: "assets/lib",
        licenseKey:
          "DataGlance, Inc.:OEM:DGPro::B+:AMS(20241013):FA549C7CE6AFBB5A2048B353187F661F600DE276672EAD05536C3C10F65482B6F5C7",
        // initialDoc:"https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
      },
      this.viewer.nativeElement
    ).then((instance: any) => {
      self.wvInstance = instance;

      // `myBlob` is your blob data which can come
      // from sources such as a server or the filesystem
      instance.UI.loadDocument(blob, { filename: this.fileInfo.name, extension: this.fileInfo.name.split('.')[1] });
      // console.log(instance.Core);
      const { documentViewer, annotationManager } = instance.Core;
      documentViewer.addEventListener('documentLoaded', () => {
        self.loader = false;
        self.cdRef.detectChanges();
      });
      const {
        setHeaderItems,
        enableElements,
        disableElements,
        enableFeatures,
        disableFeatures,
        setTheme,
        Feature,
      } = instance.UI;
      if (self.fileInfo?.source == 'standalone-cbp' && self.fileInfo?.stepInfo?.action == 'Execute') {
        if (this.toggleEdit) {
          enableFeatures([Feature.Annotations]);
        } else {
          disableFeatures([Feature.Annotations]);
        }

      } else {
        disableFeatures([Feature.Annotations]);
      }

      annotationManager.addEventListener(
        "annotationChanged",
        (annotations: any, action: any) => {
          console.log(action)
          if (action === 'add' || action === 'modify' || action === 'delete') {
            self.detectChanges = true;
            self.fileInfo.changeCount++;
            self.notify({ type: 'refreshSideNav' });

          }
        }
      );

    });
  }
  notify(data: { type: string; }) {
    this.notifyParent.emit(data);
  }
  async saveFile(core: any) {
    const { documentViewer, annotationManager } = core;
    const doc = documentViewer.getDocument();
    const xfdfString = await annotationManager.exportAnnotations();
    const data = await doc.getFileData({
      // saves the document with annotations in it
      xfdfString,
    });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: "application/" + '.pdf' });
    if (!this.fileInfo.isEmbeded) {

    } else {
      this.notifyParent.emit({ type: 'embededSave', value: this.fileInfo, file: blob });
    }
    if (this.fileInfo.stepInfo?.action == 'Execute') {
      this.notifyParent.emit({ type: 'executeSave', value: this.fileInfo, file: blob });
    }


  }

  ngOnDestroy() {

  }
}
