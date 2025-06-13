import { Component, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { DgTypes, ImagePath, waterMarkOptions } from 'cbp-shared';
import { Style } from '../../../models';
import { CbpService } from '../../../services/cbp.service';
import { StylesService } from '../../../shared/services/styles.service';

/* @author: Sathish Kotha ; contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-style-toolbar',
  templateUrl: './style-toolbar.component.html',
  styleUrls: ['./style-toolbar.component.css', '../styles.component.css']
})
export class StyleToolbarComponent implements OnInit {

  @Input() styleObject: Style = new Style();
  dgType: any = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  toggle = false;
  toggleback = false;
  togglebackCheck = false;
  toggleCheck = false;
  colorPalet: boolean = false;
  colorBgPalet: boolean = false;
  currentWaterMark: waterMarkOptions;
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  fontsizes = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];
  btnclass = 'btn btn-outline-secondary btn-sm button-border buttoncolor';
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  bgColors: any[] = [];

  @Input() styleObjectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cbpService: CbpService, public notifier: NotifierService,
    public stylesservice: StylesService) {
    this.currentWaterMark = new waterMarkOptions();
    this.bgColors = [...this.colors, ...['#ffffff']]
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'styleObject' && !changes.styleObject.firstChange) {
        this.styleObject = changes.styleObject.currentValue;
      }
    }
  }
  setTextFormat(type: any) {
    // if (this.styleObject.underline && type === 'underline') { this.styleObject.strikthrough = false; }
    // if (this.styleObject.strikthrough && type === 'strike') { this.styleObject.underline = false; }
    this.setStyleObj();
  }
  setAlign(left: any, justify: any, right: any) {
    this.styleObject.leftalign = left;
    this.styleObject.justify = justify;
    this.styleObject.rightalign = right;
    this.setStyleObj();
  }
  setStyleObj() {
    this.styleObjectChange.emit(this.styleObject);
  }
  insertColor(color: string, type: string, isUpdate: string) {
    if (type !== 'textColor') {
      this.styleObject.backgroundColor = color;
    } else {
      this.styleObject.color = color;
    }
    this.colorBgPalet = false;
    this.colorPalet = false;
    this.setStyleObj();
  }
  changeRequestFiles(event: any) {
    const file = event.target.files[0];
    let self = this;
    const blobToBase64 = (blob: any, self: any) => {
      const reader = new FileReader(); reader.readAsDataURL(blob);
      return new Promise(resolve => { reader.onloadend = () => { resolve(reader.result); }; });
    };
    blobToBase64(file, self).then(res => {
      if (self.styleObject.name === 'WarningTitle') {
        self.cbpService.styleImageJson['warningImage'] = res;
      }
      if (self.styleObject.name === 'CautionTitle') {
        self.cbpService.styleImageJson['cautionImage'] = res;
      }
      if (self.styleObject.name === 'NoteTitle') {
        self.cbpService.styleImageJson['noteImage'] = res;
      }
      if (self.styleObject.name === 'AlaraTitle') {
        self.cbpService.styleImageJson['alaraImage'] = res;
      }
      if (res) {
        this.setStyleObj();
        this.notifier.notify('success', 'successfully updated the ' + this.styleObject.name.toString() + ' image');
      }
    });
  }
  updateWaterColor() {
    this.setStyleObj();
    this.updateOptions({ color: this.styleObject.color });
  }

  optionsFontSizeChange() {
    const fontSizeValue = this.stylesservice.getFontStyles(this.styleObject.fontSize);
    if (this.styleObject.name === DgTypes.WaterMark) {
      this.setStyleObj();
      this.updateOptions({ fontSize: fontSizeValue });
    }
  }
  optionsFontChange() {
    if (this.styleObject.name === DgTypes.WaterMark) {
      this.setStyleObj();
      this.updateOptions({ fontFamily: this.styleObject.fontName });
    }
  }
  updateOptions(_obj: any) {
    this.currentWaterMark = Object.assign({}, this.currentWaterMark, _obj);
    this.updateWaterMark();
  }
  updateWaterMark() {
    this.currentWaterMark.text = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'].text;
    let isWaterMarkEnabled = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'];
    if(!this.currentWaterMark['backgroundRepeat']){
      this.currentWaterMark['backgroundRepeat'] = this.styleObject.backgroundRepeat;
    }
    if(isWaterMarkEnabled){
      this.currentWaterMark.isWaterMarkEnabled = isWaterMarkEnabled;
    }
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = Object.assign({},
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'], this.currentWaterMark);

    //  this.notifyBuilder.emit(false);
  }
  changecolor() {
    this.colorBgPalet = false;
    this.colorPalet = !this.colorPalet;
  }
  changebgcolor() {
    this.colorPalet = false;
    this.colorBgPalet = !this.colorBgPalet;
  }
  clearColor() {
    this.colorPalet = false;
    this.colorBgPalet = false;
  }
}
