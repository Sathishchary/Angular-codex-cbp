import { Injectable } from '@angular/core';
import { DgTypes, SequenceTypes } from 'cbp-shared';

@Injectable()
export class LayoutService {
  layoutMargin: any;
  layoutIcons: any;
  indendation: any;
  isShowingIon = true;
  showIndendation = false;
  disableCircle: any;
  isDisableNumber = false;
  layOutTypes = ['default', '10', '15', '20', '30', '40', '50'];
  isHiddenIcon: any = {};
  isDisableCircleSelected: any;
  constructor() { }

  setLayoutStyle(type: any, layoutMargin: any, layoutIcons: any) {
    if (type === 'margin' && layoutMargin) {
      return this.getlayoutStyle(layoutMargin[0]);
    } else if (type === 'showhideicons' && layoutIcons) {
      return this.getlayoutIconStyle(layoutIcons[0]);
    }
    return { 'display': 'none' };
  }
  getlayoutStyle(obj: any | {}) {
    if (obj) {
      return { 'margin-right': obj.margin ? obj.margin + 'px' : '0px', 'margin-left': obj.margin ? obj.margin + 'px' : '0px' };
    }
    return { 'display': 'none' };
  }
  getlayoutIconStyle(obj: any | {}) {
    if (obj) {
      return { 'display': !obj.showIcons ? 'none' : 'block' };
    }
    return { 'display': 'none' };
  }
  isDisableCirle(disableCircle: any | {}) {
    return disableCircle && disableCircle[0] ? disableCircle[0].disableCircle : false;
  }
  setLayoutIndendation(item: any | {}, indendation: any, layoutIcons: any) {
    let showicon = layoutIcons[0].showIcons;
    let count = item.level;
    let type = item.aType;
    let sequence = item?.originalSequenceType ? item?.originalSequenceType : item?.stepSequenceType;
    if (item?.firstDualStep || item?.dualStep) {
      count = count - 1;
    } else {
      if (item?.aType === DgTypes.Attachment && item.parentID !== null) {
        count = count - 1;
      }
    }
    // if(item?.dualStep){
    //   item.itemFontSize = item.itemFontSize ?? 2;
    //   if(count === 0) { count = 1;}
    //   if (indendation[0].showIndendation) {
    //     return { 'padding-left': (this.indentSize(count, item?.originalSequenceType, showicon,item.itemFontSize)) + 'px' };
    //   }
    //   if (indendation[0].showIndendation) {
    //     return { 'padding-left': (this.indentSize(8, item?.originalSequenceType, showicon,item.itemFontSize)) + 'px' };
    //   }
    //   return { 'padding-left': '0px' }
    // } else{
    if (indendation[0].showIndendation && (count > 0 && count < 5)) {
      return { 'margin-left': (this.indentSize(count, sequence, showicon, item.itemFontSize,type)) + 'px' };
    }
    if (indendation[0].showIndendation && (count > 4)) {
      return { 'margin-left': (this.indentSize(5, sequence, showicon, item.itemFontSize,type)) + 'px' };
    }
    return { 'margin-left': '0px' }
    // }

  }
  getLevelByNumber(number: any) {
    let split = number.toString().split('.');
    let length = split?.length;
    return length;
  }

  getlayoutIndendationStyle(obj: any | {}, length: any, layoutIcons: any, itemobj: any) {
    if (obj) {
      let value = !layoutIcons.showIcons ? 40 : 50;
      let newItem = itemobj?.dualStep && itemobj?.dgType === DgTypes.Section ? '20px' : '0px'
      return { 'margin-left': obj.showIndendation ? (value * length) + 'px' : newItem };
    }
    return { 'margin-left': '0px' };
  }

  isLayoutSet(indendation: any | {}) {
    return indendation ? indendation[0].showIndendation : false;
  }

  indentSize(level: any, sequence: any, isIcon: boolean, itemFontSize: number,type:any) {
    let arrayItem: any;
    itemFontSize = itemFontSize ?? 2;
    switch (Number(itemFontSize)) {
      case 1:
        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [52, 103, 159, 222, 291, 367, 449, 537, 537] : [40, 75, 117, 165, 219, 280, 347, 421, 421];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 30 , 63 , 93 , 128 ] : [0 , 18 , 37 , 54 , 75 ];
        }else{
          arrayItem = isIcon ? [35 , 63 , 93 , 128 , 170 ] : [25 , 46 , 65 , 90 , 120 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 30 , 60 , 98 , 145 ] : [0 , 18 , 35 , 50 , 70 ];
        }else{
          arrayItem = isIcon ? [32 , 63 , 100 , 147 , 204 ] : [23 , 43 , 69 , 103 , 147 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 30 , 60 , 100 , 146 ] : [0 , 20 , 35 , 60 , 95 ];
        }else{
          arrayItem = isIcon ? [32 , 64 , 104 , 152 , 205 ] : [24 , 44 , 70 , 104 , 146 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 28 , 54 , 84 , 118 ] : [0 , 18 , 30 , 47 , 67 ];
        }else{
          arrayItem = isIcon ? [32 , 54 , 84 , 118 , 158 ] : [24 , 39 , 57 , 80 , 107 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 30 , 55 , 85 , 117 ] : [0 , 20 , 34 , 50 , 70 ];
        }else{
          arrayItem = isIcon ? [32 , 57 , 87 , 119 , 158 ] : [25 , 41 , 59 , 81 , 109 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 60  , 88  , 116  ] : [0  , 20  , 32  , 49  , 64  ];
        }else{
          arrayItem = isIcon ? [34  , 62  , 91  , 119  , 148  ] : [24  , 39  , 54  , 70  , 85  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 58  , 87  , 117  ] : [0  , 20  , 40  , 60  , 80  ];
        }else{
          arrayItem = isIcon ? [34  , 64  , 94  , 125  , 155  ] : [22  , 38  , 55  , 72  , 89  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 56  , 81  , 106  ] : [0  , 20  , 35  , 51  , 67  ];
        }else{
          arrayItem = isIcon ? [32  , 60  , 87  , 115  , 143  ] : [23  , 37  , 52  , 67  , 82  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 59  , 90  , 122  ] : [0  , 20  , 36  , 54  , 70  ];
        }else{
          arrayItem = isIcon ? [32  , 68  , 103  , 139  , 175  ] : [20  , 39  , 59  , 78  , 97  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 57  , 85  , 114  ] : [0  , 20  , 40  , 60  , 81  ];
        }else{
          arrayItem = isIcon ? [32  , 65  , 97  , 130  , 164  ] : [23  , 42  , 60  , 81  , 100  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 30  , 55  , 80  , 103  ] : [0  , 20  , 36  , 52  , 65  ];
        }else{
          arrayItem = isIcon ? [32  , 60  , 90  , 119  , 149  ] : [20  , 36  , 52  , 68  , 85  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [52, 103, 159, 222, 291, 367, 449, 537, 537] : [40, 75, 117, 165, 219, 280, 347, 421, 421];
      }
        break;
      case 2:
        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [52, 103, 159, 222, 291, 367, 449, 537, 537] : [40, 75, 117, 165, 219, 280, 347, 421, 421];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 35 , 71 , 103 , 140 ] : [0 , 20 , 44 , 63 , 90 ];
        }else{
          arrayItem = isIcon ? [35 , 71 , 103 , 140 , 184  ] : [25 , 50 , 72 , 99 , 133 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 35 , 66 , 105 , 155 ] : [0 , 20 , 40 , 57 , 81 ];
        }else{
          arrayItem = isIcon ? [37 , 71 , 112 , 163 , 225 ] : [24 , 45 , 74 , 114 , 165 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 35 , 65 , 105 , 158 ] : [0 , 20 , 38 , 65 , 103 ];
        }else{
          arrayItem = isIcon ? [36 , 67 , 105 , 154 , 214 ] : [24 , 46 , 76 , 116 , 166 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 35 , 60 , 92 , 128 ] : [0 , 20 , 35 , 52 , 74 ];
        }else{
          arrayItem = isIcon ? [35 , 62 , 92 , 126 , 166 ] : [24 , 40 , 59 , 84 , 114 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 35 , 60 , 90 , 126 ] : [0 , 22 , 35 , 53 , 76 ];
        }else{
          arrayItem = isIcon ? [36 , 64 , 93 , 130 , 173 ] : [24 , 40 , 58 , 82 , 113 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 35  , 63  , 95  , 128  ] : [0  , 23  , 40  , 60  , 85  ];
        }else{
          arrayItem = isIcon ? [34  , 63  , 92  , 122  , 152  ] : [23  , 40  , 60  , 85  , 104  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 35  , 65  , 98  , 130  ] : [0  , 24  , 44  , 64  , 84  ];
        }else{
          arrayItem = isIcon ? [35  , 65  , 98  , 130  , 163  ] : [21  , 38  , 56  , 73  , 90  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 35  , 63  , 88  , 111  ] : [0  , 23  , 40  , 57  , 76  ];
        }else{
          arrayItem = isIcon ? [33  , 63  , 92  , 122  , 151  ] : [23  , 40  , 57  , 76  , 97  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 34  , 66  , 98  , 127  ] : [0  , 23  , 41  , 63  , 84  ];
        }else{
          arrayItem = isIcon ? [34  , 72  , 109  , 147  , 185  ] : [20  , 41  , 63  , 84  , 105  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 35  , 66  , 95  , 126  ] : [0  , 23  , 43  , 63  , 86  ];
        }else{
          arrayItem = isIcon ? [34  , 68  , 101  , 134  , 168  ] : [23  , 43  , 63  , 86  , 109  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 34  , 58  , 83  , 108  ] : [0  , 24  , 42  , 57  , 73  ];
        }else{
          arrayItem = isIcon ? [36  , 66  , 96  , 126  , 157  ] : [22  , 42  , 57  , 73  , 97  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [52, 103, 159, 222, 291, 367, 449, 537, 537] : [40, 75, 117, 165, 219, 280, 347, 421, 421];
      }
        break;
      case 3:

        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [58, 114, 180, 254, 337, 428, 528, 636, 636] : [44, 83, 131, 187, 252, 325, 407, 497, 497];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 43 , 88 , 127 , 176 ] : [0 , 25 , 51 , 73 , 105 ];
        }else{
          arrayItem = isIcon ? [47 , 88 , 127 , 176 , 233 ] : [33 , 62 , 87 , 120 , 149 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 40 , 83 , 123 , 169 ] : [0 , 25 , 50 , 70 , 100 ];
        }else{
          arrayItem = isIcon ? [50 , 95 , 151 , 221 , 305 ] : [33 , 57 , 93 , 142 , 206 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 43 , 82 , 132 , 196 ] : [0 , 25 , 47 , 82 , 130 ];
        }else{
          arrayItem = isIcon ? [47 , 87 , 138 , 202 , 281 ] : [33 , 58 , 92 , 142 , 206 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 40 , 72 , 110 , 153 ] : [0 , 26 , 40 , 61 , 90 ];
        }else{
          arrayItem = isIcon ? [46 , 78 , 115 , 158 , 211 ] : [34 , 52 , 74 , 104 , 141 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 45 , 80 , 115 , 160 ] : [0 , 25 , 39 , 59 , 87 ];
        }else{
          arrayItem = isIcon ? [46 , 77 , 113 , 156 , 208 ] : [33 , 51 , 74 , 104 , 141 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 42  , 75  , 109  , 148  ] : [0  , 25  , 45  , 70  , 95  ];
        }else{
          arrayItem = isIcon ? [45  , 80  , 114  , 148  , 186  ] : [31  , 49  , 67  , 84  , 102  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 40  , 77  , 113  , 151  ] : [0  , 26  , 48  , 77  , 105  ];
        }else{
          arrayItem = isIcon ? [46  , 84  , 123  , 160  , 199  ] : [28  , 48  , 67  , 87  , 108  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 40  , 72  , 104  , 135  ] : [0  , 25  , 45  , 70  , 92  ];
        }else{
          arrayItem = isIcon ? [45  , 78  , 112  , 146  , 182  ] : [30  , 48  , 66  , 83  , 102  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 40  , 81  , 120  , 163  ] : [0  , 26  , 50  , 73  , 97  ];
        }else{
          arrayItem = isIcon ? [45  , 91  , 136  , 181  , 229  ] : [26  , 50  , 73  , 97  , 125  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 40  , 78  , 116  , 154  ] : [0  , 25  , 47  , 70  , 92  ];
        }else{
          arrayItem = isIcon ? [45  , 84  , 124  , 163  , 204  ] : [33  , 60  , 87  , 113  , 140  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 40  , 69  , 100  , 131  ] : [0  , 26  , 45  , 64  , 83  ];
        }else{
          arrayItem = isIcon ? [44  , 81  , 117  , 154  , 191  ] : [33  , 55  , 77  , 99  , 121  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [58, 114, 180, 254, 337, 428, 528, 636, 636] : [44, 83, 131, 187, 252, 325, 407, 497, 497];
      }

        break;

      case 4:

        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [62, 123, 193, 273, 363, 462, 570, 689, 689] : [47, 100, 150, 210, 279, 358, 446, 544, 544];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 46 , 94 , 140 , 193 ] : [0 , 28 , 56 , 80 , 112 ];
        }else{
          arrayItem = isIcon ? [52 , 120 , 195 , 268 , 362 ] : [35 , 86 , 153 , 210 , 283 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 45 , 92 , 133 , 185 ] : [0 , 28 , 55 , 80 , 112 ];
        }else{
          arrayItem = isIcon ? [58 , 120 , 195 , 268 , 362 ] : [35 , 86 , 153 , 210 , 283 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 45 , 90 , 145 , 215 ] : [0 , 27 , 50 , 85 , 136 ];
        }else{
          arrayItem = isIcon ? [52 , 120 , 195 , 268 , 362 ] : [36 , 86 , 153 , 210 , 283 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 45 , 79 , 120 , 167 ] : [0 , 28 , 44 , 67 , 96 ];
        }else{
          arrayItem = isIcon ? [49 , 120 , 195 , 268 , 362 ] : [36 , 86 , 153 , 210 , 283 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 45 , 80 , 120 , 171 ] : [0 , 27 , 45 , 67 , 95 ];
        }else{
          arrayItem = isIcon ? [50 , 120 , 195 , 268 , 362 ] : [36 , 86 , 153 , 210 , 283 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 44  , 86  , 137  , 200  ] : [0  , 27  , 48  , 73  , 98  ];
        }else{
          arrayItem = isIcon ? [49  , 120  , 195  , 268  , 362  ] : [35  , 86  , 153  , 210  , 283  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 45  , 85  , 122  , 165  ] : [0  , 29  , 52  , 81  , 110  ];
        }else{
          arrayItem = isIcon ? [49  , 120  , 195  , 268  , 362  ] : [29  , 86  , 153  , 210  , 283  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 45  , 81  , 116  , 154  ] : [0  , 28  , 48  , 69  , 94  ];
        }else{
          arrayItem = isIcon ? [50  , 120  , 195  , 268  , 362  ] : [33  , 86  , 153  , 210  , 283  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 45  , 88  , 132  , 174  ] : [0  , 28  , 54  , 81  , 111  ];
        }else{
          arrayItem = isIcon ? [49  , 120  , 195  , 268  , 362  ] : [28  , 86  , 153  , 210  , 283  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 45  , 87  , 127  , 170  ] : [0  , 28  , 50  , 73  , 96  ];
        }else{
          arrayItem = isIcon ? [50  , 120  , 195  , 268  , 362  ] : [35  , 86  , 153  , 210  , 283  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 45  , 79  , 111  , 147  ] : [0  , 29  , 48  , 65  , 86  ];
        }else{
          arrayItem = isIcon ? [50  , 120  , 195  , 268  , 362  ] : [36  , 86  , 153  , 210  , 283  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [62, 123, 193, 273, 363, 462, 570, 689, 689] : [47, 100, 150, 210, 279, 358, 446, 544, 544];
      }

        break;

      case 5:

        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [72, 141, 221, 314, 420, 533, 657, 793, 793] : [54, 100, 158, 228, 312, 409, 518, 640, 640];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 56 , 112 , 163 , 227 ] : [0 , 38 , 76 , 109 , 154 ];
        }else{
          arrayItem = isIcon ? [61 , 117 , 167 , 228 , 306 ] : [44 , 82 , 113 , 156 , 214 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 50 , 104 , 154 , 215 ] : [0 , 35 , 70 , 100 , 140 ];
        }else{
          arrayItem = isIcon ? [69 , 125 , 196 , 289 , 405 ] : [44 , 75 , 122 , 191 , 283 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 53 , 100 , 165 , 252 ] : [0 , 35 , 65 , 109 , 176 ];
        }else{
          arrayItem = isIcon ? [62 , 111 , 178 , 265 , 376 ] : [43 , 73 , 121 , 191 , 283 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 55 , 95 , 141 , 195 ] : [0 , 35 , 50 , 73 , 107 ];
        }else{
          arrayItem = isIcon ? [61 , 100 , 144 , 200 , 271 ] : [44 , 66 , 94 , 133 , 185 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 55 , 95 , 140 , 199 ] : [0 , 33 , 55 , 76 , 110 ];
        }else{
          arrayItem = isIcon ? [60 , 100 , 144 , 200 , 270 ] : [45 , 67 , 95 , 133 , 183 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 54  , 102  , 160  , 237  ] : [0  , 31  , 56  , 86  , 119  ];
        }else{
          arrayItem = isIcon ? [60  , 101  , 143  , 185  , 231  ] : [41  , 62  , 83  , 104  , 129  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 50  , 97  , 146  , 191  ] : [0  , 33  , 60  , 89  , 116  ];
        }else{
          arrayItem = isIcon ? [61  , 108  , 157  , 205  , 256  ] : [37  , 60  , 83  , 107  , 136  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 55  , 95  , 139  , 179  ] : [0  , 35  , 60  , 90  , 110  ];
        }else{
          arrayItem = isIcon ? [61  , 101  , 142  , 184  , 231  ] : [40  , 60  , 80  , 101  , 125  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 53  , 101  , 149  , 196  ] : [0  , 30  , 58  , 89  , 120  ];
        }else{
          arrayItem = isIcon ? [60  , 120  , 180  , 240  , 304  ] : [36  , 70  , 105  , 139  , 178  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 55  , 101  , 148  , 195  ] : [0  , 33  , 59  , 89  , 120  ];
        }else{
          arrayItem = isIcon ? [60  , 111  , 162  , 212  , 267  ] : [43  , 76  , 109  , 142  , 177  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 54  , 92  , 131  , 167  ] : [0  , 35  , 58  , 77  , 95  ];
        }else{
          arrayItem = isIcon ? [60  , 105  , 149  , 194  , 244  ] : [45  , 73  , 103  , 132  , 162  ];
        }
      } if (sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [72, 141, 221, 314, 420, 533, 657, 793, 793] : [54, 100, 158, 228, 312, 409, 518, 640, 640];
      }

        break;

      case 6:

        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [82, 158, 249, 356, 479, 618, 772, 942, 942] : [60, 112, 180, 262, 361, 476, 606, 752, 752];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 61 , 123 , 175 , 245 ] : [0 , 42 , 89 , 126 , 173 ];
        }else{
          arrayItem = isIcon ? [74 , 138 , 193 , 264 , 354 ] : [54 , 99 , 135 , 189 , 260 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 65 , 128 , 185 , 260 ] : [0 , 40 , 80 , 110 , 160 ];
        }else{
          arrayItem = isIcon ? [80 , 142 , 225 , 335 , 474 ] : [53 , 92 , 150 , 235 , 348 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 62 , 117 , 195 , 297 ] : [0 , 39 , 70 , 127 , 210 ];
        }else{
          arrayItem = isIcon ? [75 , 132 , 211 , 316 , 450 ] : [53 , 90 , 147 , 231 , 344 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 65 , 105 , 160 , 230 ] : [0 , 43 , 65 , 95 , 136 ];
        }else{
          arrayItem = isIcon ? [75 , 119 , 169 , 234 , 317 ] : [54 , 79 , 112 , 158 , 220 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 65 , 110 , 165 , 230 ] : [0 , 43 , 65 , 93 , 136 ];
        }else{
          arrayItem = isIcon ? [73 , 116 , 167 , 233 , 316 ] : [53 , 78 , 111 , 157 , 219 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 62  , 115  , 185  , 271  ] : [0  , 36  , 62  , 92  , 125  ];
        }else{
          arrayItem = isIcon ? [72  , 118  , 165  , 212  , 265  ] : [49  , 72  , 95  , 119  , 149  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 65  , 116  , 167  , 223  ] : [0  , 35  , 64  , 96  , 132  ];
        }else{
          arrayItem = isIcon ? [73  , 128  , 183  , 237  , 296  ] : [43  , 70  , 96  , 123  , 158  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 60  , 103  , 145  , 185  ] : [0  , 37  , 65  , 93  , 125  ];
        }else{
          arrayItem = isIcon ? [71  , 118  , 165  , 211  , 265  ] : [48  , 71  , 94  , 117  , 144  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 60  , 116  , 172  , 228  ] : [0  , 35  , 64  , 96  , 132  ];
        }else{
          arrayItem = isIcon ? [74  , 143  , 214  , 284  , 358  ] : [41  , 80  , 119  , 159  , 208  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 63  , 112  , 167  , 224  ] : [0  , 39  , 72  , 107  , 144  ];
        }else{
          arrayItem = isIcon ? [72  , 131  , 190  , 249  , 313  ] : [52  , 91  , 130  , 170  , 212  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 62  , 101  , 147  , 196  ] : [0  , 40  , 62  , 85  , 112  ];
        }else{
          arrayItem = isIcon ? [72  , 123  , 174  , 227  , 283  ] : [55  , 89  , 121  , 154  , 191  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [82, 158, 249, 356, 479, 618, 772, 942, 942] : [60, 112, 180, 262, 361, 476, 606, 752, 752];
      }
        break;

      case 7:

        if (sequence === SequenceTypes.DGSEQUENCES ) { //|| sequence === SequenceTypes.Attachment
          arrayItem = isIcon ? [97, 189, 294, 420, 565, 728, 913, 1117, 1117] : [71, 130, 210, 308, 427, 564, 722, 900, 900];
        }
        if (sequence === SequenceTypes.NUMERIC) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 78 , 152 , 215 , 298 ] : [0 , 50 , 97 , 138 , 196 ];
        }else{
          arrayItem = isIcon ? [90 , 165 , 229 , 314 , 423 ] : [63 , 117 , 161 , 223 , 309 ];
        }
      }
        if (sequence === SequenceTypes.ALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 75 , 145 , 207 , 295 ] : [0 , 50 , 100 , 140 , 200 ];
        }else{
          arrayItem = isIcon ? [98 , 170 , 267 , 397 , 564 ] : [61 , 106 , 177 , 281 , 421 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALALPHABETICAL) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 75 , 140 , 230 , 352 ] : [0 , 50 , 90 , 156 , 260 ];
        }else{
          arrayItem = isIcon ? [90 , 155 , 245 , 370 , 534 ] : [67 , 112 , 180 , 282 , 422 ];
        }
      }
        if (sequence === SequenceTypes.CAPITALROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 80 , 130 , 191 , 265 ] : [0 , 49 , 75 , 110 , 160 ];
        }else{
          arrayItem = isIcon ? [91 , 141, 199 , 273 , 370 ] : [65 , 92 , 129 , 183 , 259 ];
        }
      }
        if (sequence === SequenceTypes.ROMAN) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18 , 80 , 130 , 188 , 260 ] : [0 , 50 , 75 , 112 , 163 ];
        }else{
          arrayItem = isIcon ? [92 , 140 , 198 , 273 , 371 ] : [63 , 91 , 129 , 184 , 258 ];
        }
      }
        if (sequence === SequenceTypes.BULLETS) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 76  , 129  , 188  , 238  ] : [0  , 45  , 81  , 119  , 161  ];
        }else{
          arrayItem = isIcon ? [89  , 142  , 196  , 250  , 311  ] : [57  , 85  , 113  , 139  , 173  ];
        }
      }
        if (sequence === SequenceTypes.STAR) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 79  , 135  , 191  , 255  ] : [0  , 38  , 68  , 107  , 146  ];
        }else{
          arrayItem = isIcon ? [90  , 152  , 215  , 278  , 349  ] : [51  , 82  , 113  , 144  , 187  ];
        }
      }
        if (sequence === SequenceTypes.CIRCLE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 79  , 130  , 182  , 240  ] : [0  , 45  , 73  , 107  , 140  ];
        }else{
          arrayItem = isIcon ? [90  , 144  , 199  , 253  , 312  ] : [59  , 85  , 113  , 140  , 174  ];
        }
      }
        if (sequence === SequenceTypes.SQUARE) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 76  , 141  , 209  , 277  ] : [0  , 38  , 68  , 110  , 152  ];
        }else{
          arrayItem = isIcon ? [88  , 171  , 253  , 336  , 423  ] : [50  , 99  , 150  , 200  , 261  ];
        }
      }
        if (sequence === SequenceTypes.ARROW) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 72  , 131  , 190  , 249  ] : [0  , 46  , 83  , 126  , 169  ];
        }else{
          arrayItem = isIcon ? [90  , 158  , 227  , 296  , 370  ] : [63  , 111  , 158  , 204  , 257  ];
        }
      }
        if (sequence === SequenceTypes.CHECKMARK) {
          if(type === SequenceTypes.Attachment){
          arrayItem = isIcon ? [18  , 78  , 123  , 176  , 227  ] : [0  , 46  , 76  , 102  , 135  ];
        }else{
          arrayItem = isIcon ? [89  , 149  , 208  , 267  , 333  ] : [64  , 103  , 143  , 183  , 225  ];
        }
      } if ( sequence === SequenceTypes.Attachment){
        arrayItem = isIcon ? [97, 189, 294, 420, 565, 728, 913, 1117, 1117] : [71, 130, 210, 308, 427, 564, 722, 900, 900];
      }
        break;

    }
    return arrayItem ? arrayItem[level - 1] : {};
  }
}
