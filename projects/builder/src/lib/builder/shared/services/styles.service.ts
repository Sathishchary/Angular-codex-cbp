import { Injectable } from '@angular/core';
import { DgTypes, styleModel, StyleTypes } from 'cbp-shared';
const stylesJson = require('src/assets/cbp/json/default-styles.json');

@Injectable({
  providedIn: 'root'
})
export class StylesService {
  styleModel: styleModel = new styleModel();
  selectedTypes = ['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5',
    'Normal', 'Warning', 'Caution', 'Note', 'Alara', 'WaterMark', 'Attachment', 'Link'];
  selectedSubTypes = ['Local', 'Attach', 'URL', 'EDOCUMENT', 'EMEDIA'];
  attachmentTitleText = 'Attachment';
  constructor() { }

  applyStyles(stylemodel: any, styleJson: any) {
    if (styleJson !== undefined) {
      styleJson = this.checkForOldCbpStyles(styleJson['style'], styleJson);
      let styles = styleJson.style;
      if (styles && styles.length > 0) {
        styles.forEach((item: any) => {
          switch (item.name) {
            case StyleTypes.Heading1:
              stylemodel.level1 = this.getStyleCss(item, 1);
              break;
            case StyleTypes.Heading2:
              stylemodel.level2['Section'] = this.getStyleCss(item.types[0], 2);
              stylemodel.level2['Step'] = this.getStyleCss(item.types[1], 2);
              break;
            case StyleTypes.Heading3:
              stylemodel.level3['Section'] = this.getStyleCss(item.types[0], 3);
              stylemodel.level3['Step'] = this.getStyleCss(item.types[1], 3);
              break;
            case StyleTypes.Heading4:
              stylemodel.level4['Section'] = this.getStyleCss(item.types[0], 4);
              stylemodel.level4['Step'] = this.getStyleCss(item.types[1], 4);
              break;
            case StyleTypes.Heading5:
              stylemodel.level5['Section'] = this.getStyleCss(item.types[0], 5);
              stylemodel.level5['Step'] = this.getStyleCss(item.types[1], 5);
              break;
            case StyleTypes.Normal:
              stylemodel.levelNormal = this.getStyleCss(item, 'normal');
              break;
            case StyleTypes.Alara:
              stylemodel.levelAlara = this.getStyleCss(item, 'alara');
              break;
            case StyleTypes.AlaraTitle:
              stylemodel.levelAlaraTitle = this.getStyleCss(item, 'alaraTitle');
              break;
            case StyleTypes.Warning:
              stylemodel.levelWarning = this.getStyleCss(item, 'warning');
              break;
            case StyleTypes.WarningTitle:
              stylemodel.levelWarningTitle = this.getStyleCss(item, 'warningTitle');
              break;
            case StyleTypes.Caution:
              stylemodel.levelCaution = this.getStyleCss(item, 'caution');
              break;
            case StyleTypes.CautionTitle:
              stylemodel.levelCautionTitle = this.getStyleCss(item, 'cautionTitle');
              break;
            case StyleTypes.Note:
              stylemodel.levelNote = this.getStyleCss(item, 'note');
              break;
            case StyleTypes.NoteTitle:
              stylemodel.levelNoteTitle = this.getStyleCss(item, 'noteTitle');
              break;
            case StyleTypes.WaterMark:
              stylemodel.levelWaterMark = this.getStyleCss(item, 'watermark');
              // this.storeWaterMarkValues(stylemodel);
              break;
            case StyleTypes.Attachment:
              stylemodel.levelAttachment = this.getStyleCss(item, 'attachment');
              break;
            case StyleTypes.AttachmentTitle:
              stylemodel.levelAttachmentTitle = this.getStyleCss(item, 'attachmentTitle');
              break;
            case StyleTypes.Link:
              stylemodel.levelLocal = this.getStyleCss(item.types.find((i: any) => i.subLevel === 'Local'), 'Link');
              stylemodel.levelAttach = this.getStyleCss(item.types.find((i: any) => i.subLevel === 'Attach'), 'Link');
              stylemodel.levelUrl = this.getStyleCss(item.types.find((i: any) => i.subLevel === 'URL'), 'Link');
              stylemodel.levelEmedia = this.getStyleCss(item.types.find((i: any) => i.subLevel === 'EMEDIA'), 'Link');
              stylemodel.levelEdocument = this.getStyleCss(item.types.find((i: any) => i.subLevel === 'EDOCUMENT'), 'Link');
              break;
            default: break;
          }
        });
      }
      return stylemodel;
    }
    return stylemodel;
  }
  checkForOldCbpStyles(styles: any, styleJson: any) {
    if (!styleJson['newStyle'] && styles) {
      let defaultStylJson = stylesJson;
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].name === StyleTypes.Heading1) {
          defaultStylJson.style[this.getIndex(defaultStylJson, i, styles)] = styles[i];
        }
        if (this.checkHeading(styles[i])) {
          defaultStylJson.style[this.getIndex(defaultStylJson, i, styles)].types[0] = styles[i];
        }
        if (this.checkTitleTypes(styles[i]) || styles[i].name === StyleTypes.WaterMark) {
          defaultStylJson.style[this.getIndex(defaultStylJson, i, styles)] = styles[i];
        }
      }
      return defaultStylJson;
    }
    return styleJson;
  }
  getIndex(styles: any, i: any, arrs: any) {
    return styles.style.findIndex((item: any) => item.name === arrs[i].name);
  }

  checkTitleTypes(obj: any) {
    if (obj.name === DgTypes.Warning || obj.name === DgTypes.Caution || obj.name === DgTypes.Attachment ||
      obj.name === DgTypes.Note || obj.name === DgTypes.Header || obj.name === DgTypes.Footer || obj.name === StyleTypes.CautionTitle
      || obj.name === StyleTypes.HeaderTitle || obj.name === StyleTypes.FooterTitle || obj.name === StyleTypes.Normal ||
      obj.name === StyleTypes.WarningTitle || obj.name === StyleTypes.CautionTitle || obj.name === StyleTypes.NoteTitle) {
      return true;
    }
    return false;
  }

  checkHeading(obj: any) {
    if (obj.name === this.selectedTypes[1] ||
      obj.name === this.selectedTypes[2]
      || obj.name === this.selectedTypes[3] || obj.name === this.selectedTypes[4]) {
      return true;
    }
    return false;
  }

  getStyleCss(obj: any, level: any) {
    const item: any = {};
    if (obj != undefined) {
      if (level === 1 || level === 2 || level === 3 || level === 4 || level === 5 || level === 'normal' || level === 'Link') {
        item['color'] = obj.color;
        item['backgroundColor'] = obj.backgroundColor;
        item['fontName'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign === true ? 'left' : (obj.rightalign === true ? 'right' : (obj.justify === true ? 'center' : 'left'));
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['lineHeight'] = '1.5';
        item['fontHeadSize'] = obj.fontSize;
        item['fontStyle'] = obj.italic ? 'italic' : 'unset';
        // item['textDecoration'] = obj.underline ? 'underline' : (obj.strikthrough ? 'line-through' : 'unset');
        item['textDecoration'] = obj.underline && obj.strikthrough ? 'underline line-through' : obj.underline ? 'underline' : obj.strikthrough ? 'line-through' : 'unset';
      }
      if (level === 'header' || level === 'footer' || level === 'headerTitle' || level === 'footerTitle' ||
        level === 'attachment' || level === 'attachmentTitle') {
        item['color'] = obj.color;
        item['fontName'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign === true ? 'left' : (obj.rightalign === true ? 'right' : (obj.justify === true ? 'center' : 'left'));
        item['backgroundColor'] = obj.backgroundColor;
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['padding'] = this.getPaddingStyles(obj.fontSize);
        item['lineHeight'] = '1.5';
        if (obj.fontSize === '6') { item['margin'] = '-4px' }
        if (obj.fontSize === '7') { item['margin'] = '-8px' }
        item['fontStyle'] = obj.italic ? 'italic' : 'unset';
        // item['textDecoration'] = obj.underline ? 'underline' : (obj.strikthrough ? 'line-through' : 'unset');
        item['textDecoration'] = obj.underline && obj.strikthrough ? 'underline line-through' : obj.underline ? 'underline' : obj.strikthrough ? 'line-through' : 'unset';
      }
      if (level === 'warning' || level === 'caution' || level === 'note' || level === 'alara' ||
        level === 'warningTitle' || level === 'cautionTitle' || level === 'noteTitle' || level === 'alaraTitle') {
        item['color'] = obj.color;
        item['backgroundColor'] = obj.backgroundColor;
        item['fontName'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign === true ? 'left' : (obj.rightalign === true ? 'right' : (obj.justify === true ? 'center' : 'left'));
        item['fontSize'] = (obj.fontSize === "7" || obj.fontSize === "6") ? '33px' : this.getFontStyles(obj.fontSize);
        item['fontStyle'] = obj.italic ? 'italic' : 'unset';
        item['lineHeight'] = '1.5';
        // item['textDecoration'] = obj.underline ? 'underline' : (obj.strikthrough ? 'line-through' : 'unset');
        item['textDecoration'] = obj.underline && obj.strikthrough ? 'underline line-through' : obj.underline ? 'underline' : obj.strikthrough ? 'line-through' : 'unset';
        if ((obj.fontSize === '7' || obj.fontSize === '6') && (level === 'warningTitle' || level === 'cautionTitle' || level === 'noteTitle' || level === 'alaraTitle')) {
          item['marginTop'] = '-8px'
        }
      }
      if (level === 'watermark') {
        item['color'] = obj.color;
        item['fontFamily'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign === true ? 'left' : (obj.rightalign === true ? 'right' : (obj.justify === true ? 'center' : 'left'));
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['backgroundRepeat'] = obj.backgroundRepeat ? obj.backgroundRepeat : 'no-repeat';
        item['degree'] = obj.degree ? obj.degree : '-35';
        item['alpha'] = obj.alpha ? obj.alpha : '1';
      }
    }
    return item;
  }
  getDynamicStyles(item: any, stylemodel: styleModel) {
    if (stylemodel === undefined || stylemodel === null) {
      this.styleModel = this.applyStyles(new styleModel(), stylesJson);
    }
    if (stylemodel !== undefined && stylemodel !== null) {
      if ((item.originalSequenceType === "BULLETS" || item.originalSequenceType === "ALPHABETICAL" ||
        item.originalSequenceType === "NUMERIC") && stylemodel['levelNormal']) {
        return this.setStyles(stylemodel['levelNormal']);
      } else {
        if (item.level === 0 && stylemodel['level1'] && item.dataType !== 'Attachment') {
          return this.setStyles(stylemodel['level1']);
        }
        if (item.level === 1 && stylemodel['level2']) {
          return item.dgType === DgTypes.Section ? this.setStyles(stylemodel['level2'].Section) : this.setStyles(stylemodel['level2'].Step);
        }
        if (item.level === 2 && stylemodel['level3']) {
          return item.dgType === DgTypes.Section ? this.setStyles(stylemodel['level3'].Section) : this.setStyles(stylemodel['level3'].Step);
        }
        if (item.level === 3 && stylemodel['level4']) {
          return item.dgType === DgTypes.Section ? this.setStyles(stylemodel['level4'].Section) : this.setStyles(stylemodel['level4'].Step);
        }
        if (item.level === 4 && stylemodel['level5']) {
          return item.dgType === DgTypes.Section ? this.setStyles(stylemodel['level5'].Section) : this.setStyles(stylemodel['level5'].Step);
        }
        if (item.level === 'normal' && stylemodel['levelNormal']) {
          return this.setStyles(stylemodel['levelNormal']);
        }
        if (item.level === 'warning' && stylemodel['levelWarning']) {
          return this.setStyles(stylemodel['levelWarning']);
        }
        if (item.level === 'caution' && stylemodel['levelCaution']) {
          return this.setStyles(stylemodel['levelCaution']);
        }
        if (item.level === 'note' && stylemodel['levelNote']) {
          return this.setStyles(stylemodel['levelNote']);
        }
        if (item.level === 'warningTitle' && stylemodel['levelWarningTitle']) {
          return this.setStyles(stylemodel['levelWarningTitle']);
        }
        if (item.level === 'alaraTitle' && stylemodel['levelAlaraTitle']) {
          return this.setStyles(stylemodel['levelAlaraTitle']);
        }
        if (item.level === 'alara' && stylemodel['levelAlara']) {
          return this.setStyles(stylemodel['levelAlara']);
        }

        if (item.level === 'cautionTitle' && stylemodel['levelCautionTitle']) {
          return this.setStyles(stylemodel['levelCautionTitle']);
        }
        if (item.level === 'noteTitle' && stylemodel['levelNoteTitle']) {
          return this.setStyles(stylemodel['levelNoteTitle']);
        }
        if (item.level === 'watermark' && stylemodel['levelWaterMark']) {
          return this.setWaterMarkStyles(stylemodel['levelWaterMark']);
        }
        if (item.level === 'attachmentTitle' && stylemodel['levelAttachmentTitle']) {
          return this.setStyles(stylemodel['levelAttachmentTitle']);
        }
        if (item.level === 'attachment' && stylemodel['levelAttachment']) {
          return this.setStyles(stylemodel['levelAttachment']);
        }
        if (item.level === 0 && item.dataType === 'Attachment' && stylemodel['levelAttachment']) {
          return this.setStyles(stylemodel['levelAttachment']);
        }
        if (item.level === 'Local' && stylemodel['levelLocal']) {
          return this.setStyles(stylemodel['levelLocal']);
        }
        if (item.level === 'Attach' && stylemodel['levelAttach']) {
          return this.setStyles(stylemodel['levelAttach']);
        }
        if (item.level === 'URL' && stylemodel['levelUrl']) {
          return this.setStyles(stylemodel['levelUrl']);
        }
        if (item.level === 'eMedia' && stylemodel['levelEmedia']) {
          return this.setStyles(stylemodel['levelEmedia']);
        }
        if (item.level === 'eDocument' && stylemodel['levelEdocument']) {
          return this.setStyles(stylemodel['levelEdocument']);
        }
      }
    }
    return;
  }

  setMessageStyles(type: any, stylemodel: styleModel) {
    let dgType = ''
    return this.getDynamicStyles({ 'level': type, 'dgType': dgType }, stylemodel);
  }

  getFontStyles(font: any) {
    let fontObj: any;
    switch (Number(font)) {
      case 1:
        fontObj = '10px';
        break;
      case 2:
        fontObj = '12px';
        break;
      case 3:
        fontObj = '16px';
        break;
      case 4:
        fontObj = '18px';
        break;
      case 5:
        fontObj = '24px';
        break;
      case 6:
        fontObj = '30px';
        break;
      case 7:
        fontObj = '38px';
        break;
      case 8:
        fontObj = '60px';
        break;
      case 9:
        fontObj = '80px';
        break;
      default: break;
    }
    return fontObj;
  }
  getSizeStyles(font: any) {
    let fontObj: any;
    switch (font) {
      case '10px':
        fontObj = 1;
        break;
      case '12px':
        fontObj = 2;
        break;
      case '16px':
        fontObj = 3;
        break;
      case '18px':
        fontObj = 4;
        break;
      case '24px':
        fontObj = 5;
        break;
      case '30px':
        fontObj = 6;
        break;
      case '38px':
        fontObj = 7;
        break;
      case '60px':
        fontObj = 8;
        break;
      case '80px':
        fontObj = 9;
        break;
      default: break;
    }
    return fontObj;
  }
  getPaddingStyles(font: any) {
    let fontObj: any;
    switch (Number(font)) {
      case 1:
        fontObj = '10px';
        break;
      case 2:
        fontObj = '10px';
        break;
      case 3:
        fontObj = '5px';
        break;
      case 4:
        fontObj = '5px';
        break;
      case 5:
        fontObj = '2px';
        break;
      case 6:
        fontObj = '0px';
        break;
      case 7:
        fontObj = '0px';
        break;
      case 8:
        fontObj = '60px';
        break;
      case 9:
        fontObj = '80px';
        break;
      default: break;
    }
    return fontObj;
  }

  setLinkStyles(field: any, stylemodel: styleModel) {
    return this.getDynamicStyles({ 'level': field.source, 'dgType': '' }, stylemodel);
  }

  setStyles(styleValue: any) {
    return {
      'font-family': styleValue.fontName ? styleValue.fontName : '',
      'font-weight': styleValue.fontWeight ? styleValue.fontWeight : '500',
      'font-size': styleValue.fontSize ? styleValue.fontSize : '12px',
      'font-style': styleValue.fontStyle ? styleValue.fontStyle : 'unset',
      'line-height': '1.5',
      'color': styleValue.color ? styleValue.color : '#555',
      'background-color': styleValue.backgroundColor ? styleValue.backgroundColor : 'transparent',
      'text-align': styleValue.textAlign ? styleValue.textAlign : 'unset',
      'text-decoration': styleValue.textDecoration ? styleValue.textDecoration : 'unset'
    };
  }

  setWaterMarkStyles(stylemodel: any) {
    const styleValue = stylemodel;
    return {
      'fontFamily': styleValue.fontName ? styleValue.fontName : '',
      'fontWeight': styleValue.fontWeight ? styleValue.fontWeight : 'bolder',
      'fontSize': styleValue.fontSize ? styleValue.fontSize : '80px',
      'color': styleValue.color ? styleValue.color : '#c8ccce',
      'textAlign': styleValue.textAlign ? styleValue.textAlign : 'center',
      'backgroundRepeat': styleValue.backgroundRepeat ? styleValue.backgroundRepeat : 'no-repeat'
    };
  }
  getIconStyles(item: any, stylemodel: any) {
    if (stylemodel) {
      let level = item.level < 4 ? item.level + 1 : 5;
      return this.setdynamicStyles(item, stylemodel['level' + level]);
    }
    return 2;
  }

  getNumberIconStyles(item: any, stylemodel: any) {
    if (stylemodel) {
      let level = item.level < 4 ? item.level + 1 : 5;
      return this.setNumberdynamicStyles(item, stylemodel['level' + level]);
    }
    return '#000000';
  }

  getFontSize(item: any, stylemodel: any) {
    if (stylemodel) {
      let level = item.level < 4 ? item.level + 1 : 5;
      return this.setFontStyles(item, stylemodel['level' + level]);
    }
    return 2;
  }
  setFontStyles(item: any, obj: any) {
    if (item.dgType === DgTypes.Section && item.level == 0) {
      return this.getSizeStyles(obj.fontSize);
    } else {
      return item.dgType === DgTypes.Section ? this.getSizeStyles(obj['Section'].fontSize) : this.getSizeStyles(obj['Step'].fontSize);
    }
  }

  setNumberdynamicStyles(item: any, stylemodel: any) {
    if (item.dgType === DgTypes.Section && item.level == 0) {
      return this.setNumberColor(stylemodel);
    } else {
      return item.dgType === DgTypes.Section ? this.setNumberColor(stylemodel['Section']) : this.setNumberColor(stylemodel['Step']);
    }
  }
  setNumberColor(stylemodel: any) {
    return stylemodel.color ? stylemodel.color : '#000000';
  }

  setdynamicStyles(item: any, stylemodel: any) {
    if (item.dgType === DgTypes.Section && item.level == 0) {
      return this.setFontHeadSize(stylemodel);
    } else {
      return item.dgType === DgTypes.Section ? this.setFontHeadSize(stylemodel['Section']) : this.setFontHeadSize(stylemodel['Step']);
    }
  }
  setFontHeadSize(stylemodel: any) {
    return stylemodel.fontHeadSize ? stylemodel.fontHeadSize : 2;
  }

  keySize(obj: any) {
    let size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }
}
