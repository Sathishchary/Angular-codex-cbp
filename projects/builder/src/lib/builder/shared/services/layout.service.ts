import { Injectable } from '@angular/core';
import { DgTypes, SequenceTypes } from 'cbp-shared';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  layoutMargin: any;
  layoutIcons: any;
  indendation: any;
  isShowingIon = true;
  showIndendation = false;
  disableCircle: any;
  disableNumber: any;
  isDisableNumber = false;
  layOutTypes = ['default', '10', '15', '20', '30', '40', '50'];
  coverPage: any;
  isCoverPage = true
  layoutMarginValue: any;
  constructor() { }

  applyLayOutChanges(layoutstyles: any) {
    if (layoutstyles && layoutstyles.length > 0) {
      this.layoutMargin = layoutstyles.filter((item: any) => item.name === 'margin');
      this.layoutIcons = layoutstyles.filter((item: any) => item.name === 'showhideicons');
      this.indendation = layoutstyles.filter((item: any) => item.name === 'showIndendation');
      this.disableCircle = layoutstyles.filter((item: any) => item.name === 'disableCircle');
      this.disableNumber = layoutstyles.filter((item: any) => item.name === 'disableNumber');
      this.coverPage = layoutstyles.filter((item: any) => item.name === 'coverPage');
      if (this.disableCircle.length === 0) {
        this.disableCircle = [{ name: 'disableCircle', disableCircle: false }];
        layoutstyles.push({ name: 'disableCircle', disableCircle: false });
      };
      if (this.disableNumber.length === 0) {
        this.disableNumber = [{ name: 'disableNumber', disableNumber: false }];
        layoutstyles.push({ name: 'disableNumber', disableNumber: false });
      };
      this.layoutMarginValue = this.getlayoutStyle(this.layoutMargin[0]);
      if (this.disableNumber) { this.isDisableNumber = this.disableNumber[0].disableNumber; }
      if (this.coverPage.length === 0) {
        this.coverPage = [{ name: 'coverPage', coverPage: true }];
        layoutstyles.push({ name: 'coverPage', coverPage: true });
      }
    } else { this.setLayoutDefault(); }
  }
  setLayoutDefault() {
    this.layoutMargin = [{ name: 'margin', margin: '0' }];
    this.layoutIcons = [{ name: 'showhideicons', showIcons: true }];
    this.indendation = [{ name: 'showIndendation', showIndendation: false }];
    this.disableCircle = [{ name: 'disableCircle', disableCircle: false }];
    this.disableNumber = [{ name: 'disableNumber', disableNumber: false }];
    this.coverPage = [{ name: 'coverPage', coverPage: true }];
  }
  setLayoutStyle(type: any, layoutMargin: any, layoutIcons: any) {
    if (type === 'margin' && layoutMargin) {
      return this.getlayoutStyle(layoutMargin[0]);
    } else if (type === 'showhideicons' && layoutIcons) {
      return this.getlayoutIconStyle(layoutIcons[0]);
    }
  }
  getlayoutStyle(obj: any) {
    if (obj) {
      return { 'margin-right': obj.margin ? obj.margin + 'px' : '0px', 'margin-left': obj.margin ? obj.margin + 'px' : '0px' };
    }
    return '';
  }
  getlayoutIconStyle(obj: any) {
    if (obj) {
      return { 'display': !obj.showIcons ? 'block' : 'none' };
    }
    return '';
  }
  setLayoutIndendation(item: any) {
    let showicon = this.layoutIcons[0].showIcons;
    let count = item.level;
    let sequence = item?.originalSequenceType ? item?.originalSequenceType : item?.stepSequenceType;
    let type = item?.aType;
    if (item.aType === DgTypes.Attachment && item.parentID !== null) {
      count = count - 1;
    }
    if (this.indendation[0].showIndendation && (count > 0 && count < 5)) {
      return { 'margin-left': (this.indentSize(count, sequence, showicon, item.itemFontSize,type)) + 'px' };
    }
    if (this.indendation[0].showIndendation && (count > 4)) {
      return { 'margin-left': (this.indentSize(5, sequence, showicon, item.itemFontSize,type)) + 'px' };
    }
    return { 'margin-left': '0px' }
  }
  indentSize(level: any, sequence: any, isIcon: boolean, itemFontSize: number,type:any) {
    let arrayItem: any = [];
    switch (itemFontSize) {
      case 1:
        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [43, 85, 132, 186, 246, 313, 386, 465, 465] : [30, 57, 90, 130, 175, 227, 285, 350, 350];
        }
        // if (sequence === SequenceTypes.DGSEQUENCES) {
        //   arrayItem = isIcon ? [43, 85, 132, 186, 246, 313, 386, 465, 465] : [30, 57, 90, 130, 175, 227, 285, 350, 350];
        // }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 65, 100, 142] : [0, 23, 39, 61, 89];
          } else {
            arrayItem = isIcon ? [33, 65, 100, 142, 188] : [23, 39, 61, 89, 119];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 63, 107, 159] : [0, 23, 42, 70, 110];
          } else {
            arrayItem = isIcon ? [33, 63, 107, 159, 225] : [23, 42, 70, 110, 155];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 32, 69, 115, 169] : [0, 23, 43, 72, 110];
          } else {
            arrayItem = isIcon ? [33, 69, 115, 169, 234] : [23, 43, 72, 110, 155];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 63, 100, 140] : [0, 23, 38, 58, 83];
          } else {
            arrayItem = isIcon ? [33, 63, 100, 140, 190] : [23, 38, 58, 83, 110];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 63, 100, 140] : [0, 23, 39, 58, 83];
          } else {
            arrayItem = isIcon ? [33, 63, 100, 140, 182] : [23, 39, 58, 83, 110];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 66, 99, 131] : [0, 20, 33, 46, 59];
          } else {
            arrayItem = isIcon ? [33, 66, 99, 131, 164] : [20, 33, 46, 59, 72];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 68, 104, 142] : [0, 18, 35, 52, 70];
          } else {
            arrayItem = isIcon ? [33, 68, 104, 142, 175] : [18, 35, 52, 70, 85];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 68, 101, 134] : [0, 18, 32, 47, 60];
          } else {
            arrayItem = isIcon ? [33, 68, 101, 134, 166] : [18, 32, 47, 60, 75];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 74, 115, 157] : [0, 20, 40, 60, 80];
          } else {
            arrayItem = isIcon ? [33, 74, 115, 157, 195] : [20, 40, 60, 80, 101];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 74, 115, 157] : [0, 20, 40, 60, 80];
          } else {
            arrayItem = isIcon ? [33, 74, 115, 157, 193] : [20, 40, 60, 80, 98];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 69, 103, 138] : [0, 23, 43, 62, 81];
          } else {
            arrayItem = isIcon ? [33, 69, 103, 138, 170] : [23, 43, 62, 81, 100];
          }
        } if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;
      case 2:
        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [43, 85, 132, 186, 246, 313, 386, 465, 465] : [30, 57, 90, 130, 175, 227, 285, 350, 350];
        }
        // if (sequence === SequenceTypes.DGSEQUENCES) {
        //   arrayItem = isIcon ? [43, 85, 132, 186, 246, 313, 386, 465, 465] : [30, 57, 90, 130, 175, 227, 285, 350, 350];
        // }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 70, 113, 166] : [0, 26, 48, 78, 110];
          } else {
            arrayItem = isIcon ? [33, 70, 113, 166, 218] : [29, 48, 78, 110, 144];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 77, 133, 201] : [0, 25, 57, 95, 146];
          } else {
            arrayItem = isIcon ? [33, 77, 133, 201, 275] : [25, 57, 95, 146, 198];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 35, 79, 135, 202] : [0, 24, 55, 92, 144];
          } else {
            arrayItem = isIcon ? [33, 79, 135, 202, 277] : [24, 55, 92, 134, 186];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 31, 67, 107, 153] : [0, 20, 45, 74, 108];
          } else {
            arrayItem = isIcon ? [33, 67, 107, 153, 205] : [20, 45, 74, 108, 139];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 32, 65, 105, 151] : [0, 20, 43, 72, 105];
          } else {
            arrayItem = isIcon ? [33, 65, 105, 151, 195] : [20, 43, 72, 105, 136];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 64, 98, 132] : [0, 20, 38, 60, 86];
          } else {
            arrayItem = isIcon ? [33, 64, 98, 132, 164] : [20, 38, 60, 86, 102];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 34, 69, 102, 136] : [0, 21, 42, 64, 90];
          } else {
            arrayItem = isIcon ? [33, 69, 102, 136, 169] : [21, 42, 64, 90, 111];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 31, 62, 94, 128] : [0, 21, 43, 65, 89];
          } else {
            arrayItem = isIcon ? [33, 62, 94, 128, 160] : [21, 43, 65, 89, 106];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 65, 92, 133] : [0, 22, 44, 66, 87];
          } else {
            arrayItem = isIcon ? [33, 65, 92, 133, 172] : [22, 44, 66, 87, 109];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 36, 67, 102, 139] : [0, 25, 48, 74, 101];
          } else {
            arrayItem = isIcon ? [33, 67, 102, 139, 174] : [25, 48, 74, 101, 120];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 33, 66, 101, 137] : [0, 21, 45, 68, 92];
          } else {
            arrayItem = isIcon ? [33, 66, 101, 137, 168] : [21, 45, 68, 92, 110];
          }
        } if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;


      case 3:

        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [50, 98, 155, 220, 294, 375, 466, 564, 564] : [35, 65, 104, 151, 207, 271, 344, 425, 425];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 44, 80, 126, 180] : [0, 30, 50, 80, 119];
          } else {
            arrayItem = isIcon ? [44, 80, 126, 180, 246] : [30, 50, 80, 119, 164];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 41, 81, 136, 205] : [0, 28, 52, 92, 146];
          } else {
            arrayItem = isIcon ? [41, 81, 136, 205, 299] : [28, 52, 92, 146, 211];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 43, 85, 141, 212] : [0, 30, 55, 92, 144];
          } else {
            arrayItem = isIcon ? [43, 85, 141, 212, 300] : [30, 55, 92, 144, 209];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 43, 78, 120, 170] : [0, 30, 48, 75, 109];
          } else {
            arrayItem = isIcon ? [43, 78, 120, 170, 255] : [30, 48, 75, 109, 147];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 43, 78, 120, 170] : [0, 30, 48, 75, 108];
          } else {
            arrayItem = isIcon ? [43, 78, 120, 170, 226] : [30, 48, 75, 108, 144];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 43, 80, 118, 155] : [0, 27, 44, 60, 78];
          } else {
            arrayItem = isIcon ? [43, 80, 118, 155, 192] : [27, 44, 60, 78, 95];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 44, 86, 128, 170] : [0, 27, 50, 72, 95];
          } else {
            arrayItem = isIcon ? [44, 86, 128, 170, 212] : [27, 50, 72, 95, 114];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 45, 85, 125, 167] : [0, 27, 45, 66, 87];
          } else {
            arrayItem = isIcon ? [45, 85, 125, 167, 201] : [27, 45, 66, 87, 106];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 45, 97, 149, 200] : [0, 23, 50, 76, 103];
          } else {
            arrayItem = isIcon ? [45, 97, 149, 200, 250] : [23, 50, 76, 103, 130];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 44, 90, 137, 184] : [0, 30, 59, 88, 118];
          } else {
            arrayItem = isIcon ? [44, 90, 137, 184, 225] : [30, 59, 88, 118, 145];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 45, 85, 126, 167] : [0, 30, 53, 78, 102];
          } else {
            arrayItem = isIcon ? [45, 85, 126, 167, 206] : [30, 53, 78, 102, 124];
          }
        }
        if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;

      case 4:

        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [54, 105, 166, 237, 317, 407, 507, 616, 616] : [37, 69, 111, 162, 223, 294, 374, 463, 463];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 49, 89, 138, 196] : [0, 32, 54, 85, 127];
          } else {
            arrayItem = isIcon ? [49, 105, 164, 235, 322] : [32, 73, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 45, 90, 150, 225] : [0, 30, 58, 101, 160];
          } else {
            arrayItem = isIcon ? [45, 105, 164, 235, 322] : [30, 73, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 47, 92, 153, 230] : [0, 32, 58, 100, 156];
          } else {
            arrayItem = isIcon ? [47, 105, 164, 235, 322] : [32, 73, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 48, 85, 130, 184] : [0, 33, 50, 80, 116];
          } else {
            arrayItem = isIcon ? [48, 105, 164, 235, 322] : [33, 70, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 48, 85, 130, 184] : [0, 34, 55, 84, 120];
          } else {
            arrayItem = isIcon ? [48, 105, 164, 235, 322] : [34, 70, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 48, 88, 129, 170] : [0, 30, 48, 68, 86];
          } else {
            arrayItem = isIcon ? [48, 105, 164, 235, 322] : [34, 71, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 48, 93, 139, 185] : [0, 30, 55, 79, 105];
          } else {
            arrayItem = isIcon ? [48, 105, 164, 235, 322] : [30, 71, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 49, 91, 133, 175] : [0, 32, 52, 72, 92];
          } else {
            arrayItem = isIcon ? [49, 105, 164, 235, 322] : [32, 71, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 50, 107, 164, 217] : [0, 26, 58, 89, 120];
          } else {
            arrayItem = isIcon ? [50, 105, 164, 235, 322] : [26, 69, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 50, 96, 143, 192] : [0, 34, 65, 95, 127];
          } else {
            arrayItem = isIcon ? [50, 105, 164, 235, 322] : [34, 73, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 50, 95, 138, 182] : [0, 35, 60, 86, 114];
          } else {
            arrayItem = isIcon ? [50, 105, 164, 235, 322] : [35, 73, 121, 170, 245];
          }
        }
        if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;

      case 5:

        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [63, 122, 194, 279, 375, 485, 608, 743, 743] : [44, 81, 131, 193, 268, 355, 456, 568, 568];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 58, 103, 162, 233] : [0, 39, 62, 98, 150];
          } else {
            arrayItem = isIcon ? [58, 103, 162, 233, 315] : [39, 62, 98, 150, 211];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 56, 107, 182, 277] : [0, 40, 71, 126, 200];
          } else {
            arrayItem = isIcon ? [56, 107, 182, 277, 408] : [40, 71, 126, 200, 297];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 55, 108, 183, 278] : [0, 38, 71, 124, 198];
          } else {
            arrayItem = isIcon ? [55, 108, 183, 278, 400] : [38, 71, 124, 198, 292];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 57, 100, 155, 219] : [0, 38, 63, 98, 143];
          } else {
            arrayItem = isIcon ? [57, 100, 155, 219, 295] : [38, 63, 98, 143, 195];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 57, 100, 155, 219] : [0, 40, 64, 98, 143];
          } else {
            arrayItem = isIcon ? [57, 100, 155, 219, 295] : [40, 64, 98, 143, 195];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 56, 103, 151, 196] : [0, 35, 57, 81, 106];
          } else {
            arrayItem = isIcon ? [56, 103, 151, 196, 242] : [35, 57, 81, 106, 130];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 57, 111, 164, 215] : [0, 35, 63, 92, 120];
          } else {
            arrayItem = isIcon ? [57, 111, 164, 215, 265] : [35, 63, 92, 120, 150];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 58, 107, 155, 203] : [0, 39, 64, 88, 113];
          } else {
            arrayItem = isIcon ? [58, 107, 155, 203, 250] : [39, 64, 88, 113, 136];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 58, 124, 188, 253] : [0, 30, 65, 100, 137];
          } else {
            arrayItem = isIcon ? [58, 124, 188, 253, 319] : [30, 65, 100, 137, 178];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 60, 117, 174, 231] : [0, 40, 78, 116, 155];
          } else {
            arrayItem = isIcon ? [60, 117, 174, 231, 288] : [40, 78, 116, 155, 187];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 57, 107, 157, 207] : [0, 40, 73, 105, 135];
          } else {
            arrayItem = isIcon ? [57, 107, 157, 207, 258] : [40, 73, 105, 135, 165];
          }
        }
        if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;

      case 6:

        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [74, 142, 223, 321, 434, 563, 709, 869, 869] : [52, 94, 153, 228, 318, 424, 547, 685, 685];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 67, 118, 184, 268] : [0, 46, 73, 116, 175];
          } else {
            arrayItem = isIcon ? [67, 118, 184, 268, 370] : [46, 73, 116, 175, 250];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 65, 121, 207, 319] : [0, 47, 84, 148, 237];
          } else {
            arrayItem = isIcon ? [65, 121, 207, 319, 463] : [47, 84, 148, 237, 353];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 67, 127, 214, 328] : [0, 45, 85, 150, 240];
          } else {
            arrayItem = isIcon ? [67, 127, 214, 328, 470] : [45, 85, 150, 240, 354];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 68, 117, 179, 254] : [0, 47, 73, 111, 163];
          } else {
            arrayItem = isIcon ? [68, 117, 179, 254, 347] : [47, 73, 111, 163, 228];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 68, 117, 179, 254] : [0, 46, 70, 108, 160];
          } else {
            arrayItem = isIcon ? [68, 117, 179, 254, 342] : [46, 70, 108, 160, 224];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 69, 121, 172, 225] : [0, 45, 70, 96, 122];
          } else {
            arrayItem = isIcon ? [69, 121, 172, 225, 275] : [45, 70, 96, 122, 150];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 68, 129, 190, 251] : [0, 40, 75, 108, 143];
          } else {
            arrayItem = isIcon ? [68, 129, 190, 251, 310] : [40, 75, 108, 143, 175];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 70, 122, 176, 228] : [0, 45, 71, 96, 122];
          } else {
            arrayItem = isIcon ? [70, 122, 176, 228, 277] : [45, 71, 96, 122, 147];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 70, 145, 221, 297] : [0, 35, 78, 122, 166];
          } else {
            arrayItem = isIcon ? [70, 145, 221, 297, 370] : [35, 78, 122, 166, 214];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 70, 136, 202, 265] : [0, 46, 89, 133, 177];
          } else {
            arrayItem = isIcon ? [70, 136, 202, 265, 328] : [46, 89, 133, 177, 217];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 70, 130, 189, 250] : [0, 50, 84, 118, 154];
          } else {
            arrayItem = isIcon ? [70, 130, 189, 250, 306] : [50, 84, 118, 154, 187];
          }
        }
        if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;

      case 7:

        if (sequence === SequenceTypes.DGSEQUENCES) {//|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [88, 170, 266, 383, 518, 674, 849, 1043, 1043] : [62, 112, 182, 272, 382, 512, 662, 832];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 83, 140, 218, 315] : [0, 55, 85, 136, 206];
          } else {
            arrayItem = isIcon ? [83, 140, 218, 315, 435] : [55, 85, 136, 206, 300];
          }
        }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 82, 150, 250, 384] : [0, 55, 100, 180, 291];
          } else {
            arrayItem = isIcon ? [82, 150, 250, 384, 559] : [55, 100, 180, 291, 437];
          }
        }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 84, 155, 260, 396] : [0, 58, 105, 185, 295];
          } else {
            arrayItem = isIcon ? [84, 155, 260, 396, 570] : [58, 105, 185, 295, 442];
          }
        }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 83, 134, 202, 289] : [0, 52, 80, 123, 187];
          } else {
            arrayItem = isIcon ? [83, 134, 202, 289, 399] : [52, 80, 123, 187, 266];
          }
        }
        if (sequence === SequenceTypes.ROMAN) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 83, 134, 202, 289] : [0, 55, 84, 129, 191];
          } else {
            arrayItem = isIcon ? [83, 134, 202, 289, 392] : [55, 84, 129, 191, 271];
          }
        }
        if (sequence === SequenceTypes.BULLETS) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 85, 145, 201, 259] : [0, 52, 85, 116, 144];
          } else {
            arrayItem = isIcon ? [85, 145, 201, 259, 319] : [52, 85, 116, 144, 179];
          }
        }
        if (sequence === SequenceTypes.STAR) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 83, 152, 220, 287] : [0, 47, 86, 129, 166];
          } else {
            arrayItem = isIcon ? [83, 152, 220, 287, 356] : [47, 86, 129, 166, 206];
          }
        }
        if (sequence === SequenceTypes.CIRCLE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 84, 145, 205, 263] : [0, 50, 80, 109, 143];
          } else {
            arrayItem = isIcon ? [84, 145, 205, 263, 318] : [50, 80, 109, 143, 174];
          }
        }
        if (sequence === SequenceTypes.SQUARE) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 85, 175, 264, 354] : [0, 43, 94, 145, 195];
          } else {
            arrayItem = isIcon ? [85, 175, 264, 354, 440] : [43, 94, 145, 195, 257];
          }
        }
        if (sequence === SequenceTypes.ARROW) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 82, 158, 233, 304] : [0, 55, 106, 157, 208];
          } else {
            arrayItem = isIcon ? [82, 158, 233, 304, 376] : [55, 106, 157, 208, 258];
          }
        }
        if (sequence === SequenceTypes.CHECKMARK) {
          if (type === SequenceTypes.Attachment) {
            arrayItem = isIcon ? [0, 85, 153, 220, 282] : [0, 56, 100, 142, 182];
          } else {
            arrayItem = isIcon ? [85, 153, 220, 282, 342] : [56, 100, 142, 182, 220];
          }
        }
        if (sequence === SequenceTypes.Attachment) {
          arrayItem = isIcon ? [43, 85, 137, 200, 274, 358, 453, 559, 559] : [30, 57, 94, 142, 201, 270, 350, 441, 441];
        }
        break;
    }
    return arrayItem[level - 1];
  }
  isDisableCirle(disableCircle: any) {
    return disableCircle && disableCircle[0] ? disableCircle[0].disableCircle : false;
  }
  getLevelByNumber(number: any) {
    let split = number.toString().split('.');
    let length = split?.length;
    return length;
  }
  isLayoutSet(indendation: any) {
    return indendation ? indendation[0].showIndendation : false;
  }
  isNumberDisable(disableNumber: any) {
    return disableNumber ? disableNumber[4].disableNumber : false;
  }
}
