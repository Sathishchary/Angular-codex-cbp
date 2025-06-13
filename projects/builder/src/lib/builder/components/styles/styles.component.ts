import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Style } from '../../models/style.model';

const stylesJson = require('src/assets/cbp/json/default-styles.json');
const styleImageJson = require('src/assets/cbp/json/style-image.json');

import { CbpSharedService, DgTypes, ImagePath, StyleTypes, styleModel, waterMarkOptions } from 'cbp-shared';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { StylesService } from '../../shared/services/styles.service';
import { BuilderUtil } from '../../util/builder-util';

/* @author: Sathish Kotha ; contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylesComponent implements OnInit, OnDestroy {
  styleObject: Style = new Style();
  styleTitleObject: any = new Style();
  dgType: any = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  toggle = false;
  toggleback = false;
  togglebackCheck = false;
  toggleCheck = false;
  styleSnapchat: any;
  currentWaterMark!: waterMarkOptions;
  stepObjectText = 'Section';
  stepObjectTitle = 'Step';
  waterMarkItems = ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'space', 'round', 'initial'];
  footerList = [{ type: 'Reset' }, { type: 'Apply' }, { type: 'Cancel' }]

  @Output() notifyBuilder: EventEmitter<any> = new EventEmitter();
  constructor(public cbpService: CbpService, public notifier: NotifierService,
    public stylesservice: StylesService, private _buildUtil: BuilderUtil,
    public cd: ChangeDetectorRef, private controlService: ControlService,
    public sharedService: CbpSharedService) {
    //  this.currentWaterMark = new waterMarkOptions();
  }
  onChange(styleName: string) {
    const isStyleThere = this.cbpService.styleJson.style.filter((item: any) => item.name === styleName);
    if (isStyleThere.length > 0) {
      this.styleObject = JSON.parse(JSON.stringify(isStyleThere[0]));
      if (this.styleObject.name === DgTypes.Link) {
        this.styleObject = isStyleThere[0].types.find((i: any) => i.subName === 'Local');
      }
      if (this.styleObject.name && this.checkTitleTypes()) {
        this.stepObjectTitle = 'Title';
        this.stepObjectText = 'Text';
        const isStyleTileThere = this.cbpService.styleJson.style.filter((item: any) => item.name === styleName + 'Title');
        if (isStyleTileThere.length > 0) {
          if (this.styleObject.name === StyleTypes.Attachment || this.styleTitleObject.name === StyleTypes.AttachmentTitle) {
            this.styleTitleObject = JSON.parse(JSON.stringify(this.styleObject));
            this.styleObject = JSON.parse(JSON.stringify(isStyleTileThere[0]));
            this.styleObject.name = 'Attachment';
            if (this.styleTitleObject.name === StyleTypes.Attachment) {
              if (this.styleTitleObject['titleText']) {
                this.stylesservice.attachmentTitleText = this.styleTitleObject['titleText'];
              } else {
                this.styleTitleObject['titleText'] = this.stylesservice.attachmentTitleText;
              }
            }
          } else {
            this.styleTitleObject = JSON.parse(JSON.stringify(isStyleTileThere[0]));
          }
        }
      }
      if (this.stylesservice.checkHeading(this.styleObject)) {
        this.stepObjectText = 'Step';
        this.stepObjectTitle = 'Section';
        this.styleObject = JSON.parse(JSON.stringify(isStyleThere[0].types[0]));
        this.styleTitleObject = JSON.parse(JSON.stringify(isStyleThere[0].types[1]));
      }
      if (this.styleObject.name === DgTypes.WaterMark) {
        this.currentWaterMark = new waterMarkOptions();
        this.currentWaterMark['alpha'] = this.styleObject?.alpha ? this.styleObject?.alpha : 0.7;
        this.currentWaterMark['fontFamily'] = this.styleObject?.fontName ? this.styleObject?.fontName : 'Poppins';
        this.currentWaterMark['degree'] = this.styleObject?.degree ? this.styleObject.degree : -45;
        this.currentWaterMark['fontSize'] = this.stylesservice.getFontStyles(this.styleObject.fontSize);
      }
      if (this.styleObject.name === DgTypes.WaterMark || this.styleObject.name === 'Normal') {
        this.stepObjectTitle = '';
      }
    } else {
      this.styleObject = new Style();
      this.styleTitleObject = new Style();
      this.Initialize(styleName, '#161515', this.getLevelByName(styleName));

      if (styleName === StyleTypes.Heading2 || styleName === StyleTypes.Heading3 || styleName === StyleTypes.Heading4 || styleName === StyleTypes.Heading5) {
        const stylDefaulObj = stylesJson['style'].find((i: any) => i.name === styleName);
        this.setStyleValues(stylDefaulObj);
      }

      if (styleName === DgTypes.Attachment) {
        this.cbpService.styleJson.style.push(stylesJson['style'].find((i: any) => i.name === StyleTypes.Attachment));
        this.cbpService.styleJson.style.push(stylesJson['style'].find((i: any) => i.name === StyleTypes.AttachmentTitle));
        this.styleObject = JSON.parse(JSON.stringify(stylesJson['style'].find((i: any) => i.name === StyleTypes.Attachment)));
        this.styleTitleObject = JSON.parse(JSON.stringify(stylesJson['style'].find((i: any) => i.name === StyleTypes.AttachmentTitle)));
      }
      if (this.controlService.isMessageField(styleName)) {
        const stylDefaulObj = stylesJson['style'].find((i: any) => i.name === styleName);
        const stylDefaulObjTitle = stylesJson['style'].find((i: any) => i.name === styleName + 'Title');
        this.setStyelAlerts(stylDefaulObj, stylDefaulObjTitle)
      }
    }
  }

  setStyelAlerts(alertObj: any, alertObjTitle: any) {
    this.cbpService.styleJson.style.push(alertObj);
    this.cbpService.styleJson.style.push(alertObjTitle);
    this.styleObject = alertObj;
    this.styleTitleObject = alertObjTitle;
  }
  setStyleValues(stylDefaulObj: any) {
    this.cbpService.styleJson.style.push(stylDefaulObj);
    this.styleObject = stylDefaulObj.types[0];
    this.styleTitleObject = stylDefaulObj.types[1];
  }
  onLinkChange(event: string) {
    let linkStyleObj = this.cbpService.styleJson.style.find((item: any) => item.name === StyleTypes.Link);
    let linkSubTypeObj = linkStyleObj.types.find((item: any) => item.subLevel === event);
    if (linkSubTypeObj) {
      this.styleObject = linkSubTypeObj;
    }
  }

  Initialize(event: string, color: string, level: number) {
    this.styleObject.name = event;
    this.styleObject.color = color;
    this.styleObject.level = level;
    this.styleObject.backgroundColor = '#ffffff';
    this.styleObject.fontName = 'Poppins';
    this.styleObject.fontSize = this.styleObject.name === 'WaterMark' ? '9' : '2';
  }
  setAlign(left: boolean, justify: boolean, right: boolean) {
    this.styleObject.leftalign = left;
    this.styleObject.justify = justify;
    this.styleObject.rightalign = right;
  }
  clearTitleStyles() {
  }
  setTextFormat(type: string) {
    this.setTitleObj(this.styleObject, type);
  }
  setTitleTextFormat(type: string) {
    this.setTitleObj(this.styleTitleObject, type);
  }
  setTitleObj(obj: any, type: string) {
    if (obj.underline && type === 'underline') { obj.strikthrough = false; }
    if (obj.strikthrough && type === 'strike') { obj.underline = false; }
    return obj;
  }
  clearStyles() {
    let obj = JSON.parse(JSON.stringify(this.styleObject));
    this.styleObject = new Style();
    this.styleTitleObject = new Style();
    this.onChange(obj.name)
  }
  getLevelByName(name: any) {
    let value: any = this.stylesservice.selectedTypes.findIndex((item: any) => item === name);
    if (value > 4) { value = null; }
    return value;
  }
  checkStyleJsonValidation() {
    if (typeof this.cbpService.styleJson === 'string') { this.cbpService.styleJson = JSON.parse(this.cbpService.styleJson); }
    if (this.cbpService.styleJson === undefined) {
      this.cbpService.defaultStylesJson = JSON.parse(JSON.stringify(stylesJson));
      this.cbpService.styleJson = JSON.parse(JSON.stringify(stylesJson));
      this.cbpService.styleImageJson = styleImageJson;
    } else {
      if (this.cbpService.styleJson['Style']) {
        if (Array.isArray(this.cbpService.styleJson['Style']) && this.cbpService.styleJson['Style'][0].name == 'default') {
          this.cbpService.styleJson = JSON.parse(JSON.stringify(stylesJson));
        }
      }
      this.onChange(StyleTypes.Heading1);
    }
  }
  ngOnInit() {
    this.cbpService.styleChangeBarSession = [];
    this.cbpService.styleHeadings = [];
    this.currentWaterMark = JSON.parse(JSON.stringify(this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']));
    this.checkStyleJsonValidation();
    this.styleSnapchat = JSON.parse(JSON.stringify(this.cbpService.styleJson));
    this.sharedService.openModalPopup('styleModal');
    this.cbpService.styleJson = this.setDefaultStyleObjects(this.cbpService.styleJson);
  }

  setDefaultStyleObjects(styleJson: any) {
    let styles = styleJson.style;
    if (styles && styles.length > 0) {
      for (let i = 0; i < styles.length; i++) {
        if (!styles[i]['level'] && !styles[i]['name']) {
          styles.splice(i, 1);
        }
      }
    }
    styleJson.style = styles;
    return styleJson;
  }


  save(styleObj: Style) {
    const isStyleThere = this.cbpService.styleJson.style.filter((item: any) => item.name == styleObj.name);
    let index = 0;
    if (this.styleObject.name === StyleTypes.Attachment) {
      let stylObj = JSON.parse(JSON.stringify(this.styleObject));
      let stylTitleObj = JSON.parse(JSON.stringify(this.styleTitleObject));
      stylObj.level = 'attachmentTitle';
      stylObj.name = 'AttachmentTitle';
      stylTitleObj.level = 'attachment';
      stylTitleObj.name = 'Attachment';
      stylTitleObj.titleText = this.stylesservice.attachmentTitleText;
      stylObj.titleText = this.stylesservice.attachmentTitleText;
      this.cbpService.styleJson.style[this.cbpService.styleJson.style.findIndex((i: any) => i.name === StyleTypes.Attachment)] = stylTitleObj;
      this.cbpService.styleJson.style[this.cbpService.styleJson.style.findIndex((i: any) => i.name === StyleTypes.AttachmentTitle)] = stylObj;
      this.cbpService.styleChangeBarSession.push('Attachment');
      this.setMessage('Style updated successfully');
    } else {
      if (isStyleThere.length > 0) {
        try { index = this.cbpService.styleJson.style.findIndex((item: any) => item.name == styleObj.name); } catch (err) { }
        // if(!this.stylesservice.checkHeading(styleObj) && this.styleObject.name !== StyleTypes.Link){  this.cbpService.styleJson.style.splice(index, 1); }
        if (this.styleObject.name === StyleTypes.Link) {
          const indexLink = this.cbpService.styleJson.style.findIndex((item: any) => item.name === StyleTypes.Link);
          const linkSubTypeIndex = this.cbpService.styleJson.style[indexLink].types.findIndex((item: any) => item.subLevel === this.styleObject.subLevel);
          this.cbpService.styleJson.style[indexLink].types.splice(linkSubTypeIndex, 1);
          this.styleObject['subName'] = this.styleObject.subLevel;
          this.cbpService.styleJson.style[indexLink].types.push(this.styleObject);
          this.cbpService.styleChangeBarSession.push(this.styleObject.subLevel);
          this.setMessage('Style updated successfully');
        } else {
          this.saveStyles(styleObj, 'Style updated successfully', index);
        }
        if (this.checkTitleTypes() || this.styleObject.name === DgTypes.Attachment) {
          const indexTitle = this.cbpService.styleJson.style.findIndex((item: any) => item.name === styleObj.name + 'Title');
          this.cbpService.styleJson.style.splice(indexTitle, 1);
          this.saveTitleStyle();
        }
      } else {
        this.saveStyles(styleObj, 'Style saved successfully', index);
        this.saveTitleStyle();
      }

    }
    let stylModelObj = (this.cbpService.styleModel === undefined || this.cbpService.styleModel === null) ? new styleModel() : this.cbpService.styleModel;
    this.cbpService.styleModel = this.stylesservice.applyStyles(stylModelObj, this.cbpService.styleJson);
    if (this.styleObject.name === DgTypes.Attachment) {
      const attachmentsObjets = this.cbpService.cbpJson.section.filter((i: any) => i.dataType === DgTypes.Attachment);
      attachmentsObjets.forEach((item: any) => {
        const num = item.number.split(' ');
        const itemNumber = this.stylesservice.attachmentTitleText + ' ' + num[1];
        item.number = itemNumber;
        item = this.cbpService.setUserUpdateInfo(item);
        let titleObj = this._buildUtil.setIconAndText(item)
        let obj = { text: titleObj.text, number: item.number, dgUniqueId: item.dgUniqueID, dgType: item.dgType };
        this.cbpService.headerItem = obj;
      });
      this.cbpService.refreshTreeNav = true;
    }
    this.cbpService.styleUpdated = true;
    // console.log( this.cbpService.styleModel.levelWarningTitle);
  }

  saveStyles(styleObj: any, mesg: string, i: number) {
    if (this.stylesservice.checkHeading(styleObj)) {
      if (JSON.stringify(this.cbpService.styleJson.style[i].types[0]) !== JSON.stringify(this.styleObject)) {
        this.cbpService.styleHeadings.push({ subLevel: this.styleObject.subLevel, subName: this.styleObject.subName })
      }
      if (JSON.stringify(this.cbpService.styleJson.style[i].types[1]) !== JSON.stringify(this.styleTitleObject)) {
        this.cbpService.styleHeadings.push({ subLevel: this.styleObject.subLevel, subName: this.styleTitleObject.subName })
      }
      this.cbpService.styleJson.style[i].types = [];
      this.cbpService.styleJson.style[i].types.push(this.styleObject);
      this.cbpService.styleJson.style[i].types.push(this.styleTitleObject);
    } else {
      if (styleObj.name === DgTypes.WaterMark) {
        this.styleObject['alpha'] = this.currentWaterMark['alpha'];
        this.styleObject['degree'] = this.currentWaterMark['degree'];
        this.currentWaterMark['fontSize'] = this.stylesservice.getFontStyles(this.styleObject.fontSize);
        styleObj.fontName = this.styleObject.fontName;
        styleObj.alpha = this.styleObject.alpha;
        styleObj.fontSize = this.styleObject.fontSize;
        styleObj.degree = this.styleObject.degree;
        styleObj.backgroundRepeat = this.styleObject.backgroundRepeat;
        this.updateWaterMark();
      }
      // console.log(styleObj);
      this.cbpService.styleChangeBarSession.push(styleObj.name);
      this.cbpService.styleJson.style[i] = styleObj;
    }
    // console.log(this.cbpService.styleJson);
    this.setMessage(mesg);
  }
  setMessage(mesg: string) {
    this.notifier.hideAll();
    this.notifier.notify('success', mesg);
  }
  saveTitleStyle() {
    if (this.styleObject.fontSize === '1' || this.styleObject.fontSize === '2') {
      this.styleTitleObject['padding'] = '10px';
    }
    else if (this.styleObject.fontSize === '3' || this.styleObject.fontSize === '4') {
      this.styleTitleObject['padding'] = '5px';
    } else if (this.styleObject.fontSize === '5') {
      this.styleTitleObject['padding'] = '2px';
    } else if (this.styleObject.fontSize === '6') {
      this.styleTitleObject['padding'] = '0px';
      this.styleTitleObject['margin'] = '-4px';
    } else if (this.styleObject.fontSize === '7') {
      this.styleTitleObject['padding'] = '0px';
      this.styleTitleObject['margin'] = '-8px';
    }
    this.cbpService.styleChangeBarSession.push(this.styleTitleObject.name);
    this.cbpService.styleJson.style.push(this.styleTitleObject);
  }
  checkHeading() {
    return this.stylesservice.checkHeading(this.styleObject);
  }
  checkTitleTypes() {
    if (this.styleObject.name === DgTypes.Warning || this.styleObject.name === DgTypes.Caution ||
      this.styleObject.name === DgTypes.Note || this.styleObject.name === DgTypes.Alara ||
      this.styleObject.name === DgTypes.Attachment) {
      return true;
    }
    return false;
  }

  setTitleAlign(left: boolean, justify: boolean, right: boolean) {
    this.styleTitleObject.leftalign = left;
    this.styleTitleObject.justify = justify;
    this.styleTitleObject.rightalign = right;
  }
  updateWaterColor() {
    this.updateOptions({ color: this.styleObject.color });
  }
  optionsDegreeChange() {
    this.updateOptions({ degree: this.currentWaterMark['degree'] });
  }
  optionsAlphaChange() {
    this.updateOptions({ alpha: this.currentWaterMark['alpha'] });
  }
  backgroundRepeat() {
    this.updateOptions({ backgroundRepeat: this.styleObject.backgroundRepeat });
  }
  optionsFontSizeChange() {
    const fontSizeValue = this.stylesservice.getFontStyles(this.styleObject.fontSize);
    if (this.styleObject.name === DgTypes.WaterMark) {
      this.updateOptions({ fontSize: fontSizeValue });
    }
  }
  optionsFontChange() {
    if (this.styleObject.name === DgTypes.WaterMark) {
      this.updateOptions({ fontFamily: this.styleObject.fontName });
    }
  }
  updateOptions(_obj: any) {
    this.currentWaterMark = Object.assign({}, this.currentWaterMark, _obj);
    this.currentWaterMark['backgroundRepeat'] = this.styleObject.backgroundRepeat;
    this.currentWaterMark['fontFamily'] = this.styleObject.fontName;
    this.currentWaterMark['fontSize'] = this.stylesservice.getFontStyles(this.styleObject.fontSize);
  }
  setStyleObj(event: any) {
    this.styleObject = event;
  }
  updateWaterMark() {
    this.currentWaterMark.text = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'].text;
    let isWaterMarkEnabled = this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions']['isWaterMarkEnabled'];
    if (!this.currentWaterMark['backgroundRepeat']) {
      this.currentWaterMark['backgroundRepeat'] = this.styleObject.backgroundRepeat;
    }
    if (isWaterMarkEnabled) {
      this.currentWaterMark.isWaterMarkEnabled = isWaterMarkEnabled;
    }
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = Object.assign({},
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'], this.currentWaterMark);
    this.notifyBuilder.emit(this.styleObject);
  }
  checkTitleVal(title: string) {
    if (!/^[a-zA-Z]*$/g.test(title.trim())) {
      this.stylesservice.attachmentTitleText = 'Attachment';
      this.notifier.hideAll();
      this.notifier.notify('error', 'Enter alphabets only');
      return false;
    }
  }
  validText(event: { keyCode: any; }) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8);
  }
  ngOnDestroy(): void {
    this.hide();
  }
  hide() {
    this.cbpService.isStylesOpen = false;
    this.sharedService.closeModalPopup('styleModal');
    this.notifyBuilder.emit(false);
  }
  undoStyle() {
    // console.log(this.cbpService.styleJson);
    this.cbpService.styleJson = JSON.parse(JSON.stringify(this.styleSnapchat));
    // console.log(this.cbpService.styleJson);
    let stylModelObj = (this.cbpService.styleModel === undefined || this.cbpService.styleModel === null) ? new styleModel() : this.cbpService.styleModel;
    this.cbpService.styleModel = this.stylesservice.applyStyles(stylModelObj, this.cbpService.styleJson);
    this.clearStyles();
  }
}
