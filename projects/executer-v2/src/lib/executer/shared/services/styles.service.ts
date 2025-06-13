import { Injectable } from '@angular/core';
import { DgTypes, SequenceTypes, StyleTypes, styleModel } from 'cbp-shared';
import { LayoutService } from './layout.service';
const stylesJson = require('src/assets/cbp/json/default-styles.json');

@Injectable()
export class StylesService {
  sequenceTypes: typeof SequenceTypes = SequenceTypes;

  selectedTypes = ['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5',
    'Normal', 'Warning', 'Caution', 'Note', 'Header', 'Footer', 'WaterMark', 'Attachment', 'Link'];
  selectedSubTypes = ['Local', 'Attach', 'URL', 'eDocument', 'eMedia'];
  attachmentTitleText = 'Attachment';
  constructor(public layoutService: LayoutService) {

  }

  applyStyles(stylemodel: any, styleJson: any, defaultStyleObj: any) {
    styleJson = styleJson ?? stylesJson;
    if (styleJson !== undefined) {
      styleJson = this.checkForOldCbpStyles(styleJson['style'], styleJson, defaultStyleObj);
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
            case StyleTypes.Header:
              stylemodel.levelHeader = this.getStyleCss(item, 'header');
              break;
            case StyleTypes.HeaderTitle:
              stylemodel.levelHeaderTitle = this.getStyleCss(item, 'headerTitle');
              break;
            case StyleTypes.Footer:
              stylemodel.levelFooter = this.getStyleCss(item, 'footer');
              break;
            case StyleTypes.FooterTitle:
              stylemodel.levelFooterTitle = this.getStyleCss(item, 'footerTitle');
              break;
            case StyleTypes.WaterMark:
              stylemodel.levelWaterMark = this.getStyleCss(item, 'watermark');
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
  }
  checkForOldCbpStyles(styles: any, styleJson: any, defaultStyleObj: any) {
    let defaultStylJson: any;
    if (!styleJson['newStyle'] || !this.checkValidStyle(styles)) {
      defaultStylJson = defaultStyleObj;
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
    if (styleJson['newStyle'] && styles) {
      defaultStylJson = styleJson
    }
    return defaultStylJson;
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
    if (obj.name === this.selectedTypes[1] || obj.name === this.selectedTypes[2]
      || obj.name === this.selectedTypes[3] || obj.name === this.selectedTypes[4]) {
      return true;
    }
    return false;
  }

  checkValidStyle(array: any) {
    return array.every((name: any) => name?.name);
  }

  getStyleCss(obj: any | {}, level: any) {
    const item: any = {};
    if (obj != undefined) {
      if (level === 1 || level === 2 || level === 3 || level === 4 || level === 5 || level === 'normal' || level === 'Link') {
        item['color'] = obj.color;
        item['backgroundColor'] = obj.backgroundColor;
        item['fontName'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign ? 'left' : (obj.rightalign ? 'right' : (obj.justify ? 'center' : 'left'));
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
        item['textAlign'] = obj.leftalign ? 'left' : (obj.rightalign ? 'right' : (obj.justify ? 'center' : 'left'));
        item['backgroundColor'] = obj.backgroundColor;
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['padding'] = this.getPaddingStyles(obj.fontSize);
        item['lineHeight'] = '1.5';
        if (obj.fontSize === '6') {
          item['margin'] = '-4px'
        }
        if (obj.fontSize === '7') {
          item['margin'] = '-8px'
        }
        item['fontStyle'] = obj.italic ? 'italic' : 'unset';
        // item['textDecoration'] = obj.underline ? 'underline' : (obj.strikthrough ? 'line-through' : 'unset');
        item['textDecoration'] = obj.underline && obj.strikthrough ? 'underline line-through' : obj.underline ? 'underline' : obj.strikthrough ? 'line-through' : 'unset';
      }
      if (level === 'alara' || level === 'warning' || level === 'caution' || level === 'note' || level === 'alaraTitle' ||
        level === 'warningTitle' || level === 'cautionTitle' || level === 'noteTitle') {
        item['color'] = obj.color;
        item['backgroundColor'] = obj.backgroundColor;
        item['fontName'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign ? 'left' : (obj.rightalign ? 'right' : (obj.justify ? 'center' : 'left'));
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['lineHeight'] = '1.5';
        item['fontStyle'] = obj.italic ? 'italic' : 'unset';
        // item['textDecoration'] = obj.underline ? 'underline' : (obj.strikthrough ? 'line-through' : 'unset');
        item['textDecoration'] = obj.underline && obj.strikthrough ? 'underline line-through' : obj.underline ? 'underline' : obj.strikthrough ? 'line-through' : 'unset';
      }
      if (level === 'watermark') {
        item['color'] = obj.color;
        item['fontFamily'] = obj.fontName ? obj.fontName : 'Poppins';
        item['fontWeight'] = obj.fontWeight ? 'bold' : '500';
        item['textAlign'] = obj.leftalign ? 'left' : (obj.rightalign ? 'right' : (obj.justify ? 'center' : 'left'));
        item['fontSize'] = this.getFontStyles(obj.fontSize);
        item['lineHeight'] = '1.5';
        item['backgroundRepeat'] = obj.backgroundRepeat ? obj.backgroundRepeat : 'no-repeat';
        item['degree'] = obj.degree ? obj.degree : '-45';
      }
    }
    return item;
  }
  getDynamicStyles(item: any | {}, stylemodel: any | {}) {
    if (stylemodel === undefined || stylemodel === null) {
      return {};
    }
    if (stylemodel !== undefined && stylemodel !== null) {
      if ((item.originalSequenceType == "") && stylemodel['levelNormal']) {
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
        if ((item.level >= 4) && stylemodel['level5']) {
          return item.dgType === DgTypes.Section ? this.setStyles(stylemodel['level5'].Section) : this.setStyles(stylemodel['level5'].Step);
        }
        if ((item.level === 'normal') && stylemodel['levelNormal']) {
          return this.setStyles(stylemodel['levelNormal']);
        }
        if (item.level === 'header' && stylemodel['levelHeader']) {
          return this.setStyles(stylemodel['levelHeader']);
        }
        if (item.level === 'footer' && stylemodel['levelFooter']) {
          return this.setStyles(stylemodel['levelFooter']);
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
        if (item.level === 'cautionTitle' && stylemodel['levelCautionTitle']) {
          return this.setStyles(stylemodel['levelCautionTitle']);
        }
        if (item.level === 'noteTitle' && stylemodel['levelNoteTitle']) {
          return this.setStyles(stylemodel['levelNoteTitle']);
        }
        if (item.level === 'headerTitle' && stylemodel['levelHeaderTitle']) {
          return this.setHeadFooterStyles(stylemodel['levelHeaderTitle']);
        }
        if (item.level === 'footerTitle' && stylemodel['levelFooterTitle']) {
          return this.setHeadFooterStyles(stylemodel['levelFooterTitle']);
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
  }

  setIndentaion(obj: any | {}, indendation: any) {
    if (indendation) {
      if (indendation[0].indendation) {
        if (this.setLayoutCss(obj) && obj.indentLevel == 1) {
          return { 'width': '67px' };
        } else if (this.setLayoutCss(obj) && obj.indentLevel == 2) {
          return { 'width': '92px' };
        } else if (this.setLayoutCss(obj) && obj.indentLevel == 3) {
          return { 'width': '177px' };
        } else if (this.setLayoutCss(obj) && obj.indentLevel == 4) {
          return { 'width': '240px' };
        } else if (this.setLayoutCss(obj) && obj.indentLevel == 5) {
          return { 'width': '310px' };
        }
      }
    }
    return { 'width': '0px' };
  }
  setAlignIndentaion(obj: any | {}, indendation: any, layoutIcons: any) {
    if (indendation) {
      if (indendation[0].showIndendation) {
        return this.layoutService.setLayoutIndendation(obj, indendation, layoutIcons);
      } else if (this.setLayoutCss(obj) && obj.indentLevel == 1) {
        return { 'margin-left': '67px' };
      } else if (this.setLayoutCss(obj) && obj.indentLevel == 2) {
        return { 'margin-left': '92px' };
      } else if (this.setLayoutCss(obj) && obj.indentLevel == 3) {
        return { 'margin-left': '177px' };
      } else if (this.setLayoutCss(obj) && obj.indentLevel == 4) {
        return { 'margin-left': '240px' };
      } else if (this.setLayoutCss(obj) && obj.indentLevel == 5) {
        return { 'margin-left': '310px' };
      }
    } else {
      return { 'margin-left': '67px' };
    }

  }
  setSpaceIndentaion(obj: any | {}) {
    if (!obj['aType']) {
      if (obj.originalSequenceType === SequenceTypes.ALPHABETICAL) {
        if (obj.number.length === 2) {
          return { 'width': 'auto', 'margin-right': '15px' };
        } else if (obj.number.length === 3) {
          return { 'width': 'auto', 'margin-right': '15px' };
        } else if (obj.number.length === 4) {
          return { 'width': '60px', 'margin-right': 'none' };
        } else {
          return { 'width': '70px', 'margin-right': '15px' };
        }
      } else if (obj.originalSequenceType === SequenceTypes.NUMERIC) {
        return { 'width': '60px', 'margin-right': 'none' };
      }
    }
  }

  setLayoutCss(stepObj: any) {
    return stepObj.originalSequenceType !== SequenceTypes.DGSEQUENCES ? true : false;
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
  getTopStyles(font: any) {
    let fontObj: any;
    switch (Number(font)) {
      case 1:
        fontObj = '0';
        break;
      case 2:
        fontObj = '1';
        break;
      case 3:
        fontObj = '5';
        break;
      case 4:
        fontObj = '6';
        break;
      case 5:
        fontObj = '10';
        break;
      case 6:
        fontObj = '15';
        break;
      case 7:
        fontObj = '21';
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

  setStyles(styleValue: any) {
    return {
      'font-family': styleValue.fontName ? styleValue.fontName : '',
      'font-weight': styleValue.fontWeight ? styleValue.fontWeight : '500',
      'font-size': styleValue.fontSize ? styleValue.fontSize : '12px',
      'font-style': styleValue.fontStyle ? styleValue.fontStyle : 'unset',
      'color': styleValue.color ? styleValue.color : '#555',
      'line-height': '1.5',
      'background-color': styleValue.backgroundColor ? styleValue.backgroundColor : 'transparent',
      'text-align': styleValue.textAlign ? styleValue.textAlign : 'unset',
      'text-decoration': styleValue.textDecoration ? styleValue.textDecoration : 'unset'
    };
  }

  setHeadFooterStyles(styleModalObj: any) {
    const styleValue = styleModalObj;
    return {
      'font-family': styleValue.fontName ? styleValue.fontName : '',
      'font-weight': styleValue.fontWeight ? styleValue.fontWeight : '500',
      'font-size': styleValue.fontSize ? styleValue.fontSize : '12px',
      'font-style': styleValue.fontStyle ? styleValue.fontStyle : 'unset',
      'color': styleValue.color ? styleValue.color : '#555',
      'background-color': styleValue.backgroundColor ? styleValue.backgroundColor : '#ffffff',
      'text-align': styleValue.textAlign ? styleValue.textAlign : 'unset',
      'text-decoration': styleValue.textDecoration ? styleValue.textDecoration : 'unset',
      'padding': styleValue.padding ? styleValue.padding : '10px',
      'margin': styleValue.margin ? styleValue.margin : 'none'
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

  getIconStyles(item: any, stylemodel: styleModel) {
    if (stylemodel) {
      if (item.level === 0 && stylemodel['level1']) {
        return this.setdynamicStyles(stylemodel['level1'], item);
      }
      if (item.level === 1 && stylemodel['level2']) {
        return this.setdynamicStyles(stylemodel['level2'], item);
      }
      if (item.level === 2 && stylemodel['level3']) {
        return this.setdynamicStyles(stylemodel['level3'], item);
      }
      if (item.level === 3 && stylemodel['level4']) {
        return this.setdynamicStyles(stylemodel['level4'], item);
      }
      if (item.level >= 4 && stylemodel['level5']) {
        return this.setdynamicStyles(stylemodel['level5'], item);
      }
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
  setNumberdynamicStyles(item: any, stylemodel: any) {
    if (item.dgType === DgTypes.Section && item.level == 0) {
      return this.setNumberColor(stylemodel);
    } else {
      return item.dgType === DgTypes.Section ? this.setNumberColor(stylemodel['Section']) : this.setNumberColor(stylemodel['Step']);
    }
  }
  setNumberColor(stylemodel: any) {
    return stylemodel?.color ? stylemodel.color : '#000000';
  }

  setdynamicStyles(stylemodel: any, item: any) {
    if (item.dgType === DgTypes.Section && item.level == 0) {
      return this.setFontHeadSize(stylemodel);
    } else {
      return item.dgType === DgTypes.Section ? this.setFontHeadSize(stylemodel['Section']) : this.setFontHeadSize(stylemodel['Step']);
    }
  }
  setFontHeadSize(stylemodel: any) {
    return stylemodel?.fontHeadSize ? stylemodel.fontHeadSize : 2;
  }


  keySize(obj: any) {
    let size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  setExecutorStyles(styleObj: any | {}) {
    return this.setStyles(styleObj);
  }

}
