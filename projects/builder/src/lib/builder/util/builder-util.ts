import { Injectable } from '@angular/core';
import AlphanumericEncoder from 'alphanumeric-encoder';
import { DgTypes, Image, SequenceTypes } from 'cbp-shared';
import { HighlightTag } from 'dg-shared';
import { Subject } from 'rxjs';
import {
  Alara,
  BooleanDataEntry,
  Caution,
  Checkbox, DateDataEntry,
  DelayStep,
  DropDown,
  Formula,
  Initial,
  Note,
  Paragraph, Procedure, Reference, Section,
  Signature,
  StepAction, StepInfo,
  TableList, TextArea, Textbox,
  TextLabel,
  TextNumber,
  Url,
  Verification,
  Warning
} from '../models';
import { Utills } from './utillMethods';
const findAnd = require('find-and');

@Injectable({
  providedIn: 'root'
})
export class BuilderUtil {

  lowerAlph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  romanletters = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
    "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  capRoman = '^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$';
  smallRoman = '^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$';
  maxDgUniqueId = 1;
  paginateIndex: number = 1;
  uniqueIdIndex = 0;
  // reuseIndex = 0;
  alphaParam = '';
  attachmentId = false;
  dataFieldNumber = 0;
  dualSteps: any[] = [];
  paraList: any[] = [];
  windowWidth: any;
  dupUniqueIDs: any[] = [];
  dragElements: any = [DgTypes.LabelDataEntry, DgTypes.Warning, DgTypes.Caution, DgTypes.Note, DgTypes.Alara,
  DgTypes.Para, DgTypes.TextDataEntry, DgTypes.TextAreaDataEntry, DgTypes.FormulaDataEntry,
  DgTypes.NumericDataEntry, DgTypes.DateDataEntry, , DgTypes.Figures, DgTypes.SingleFigure,
  DgTypes.BooleanDataEntry, DgTypes.CheckboxDataEntry, DgTypes.DropDataEntry, DgTypes.Table,
  DgTypes.Link, DgTypes.Independent, DgTypes.Concurrent, DgTypes.QA, DgTypes.Peer, DgTypes.SignatureDataEntry,
  DgTypes.InitialDataEntry
  ];

  loggedInUserName!: string;
  cbpStandalone = true;
  documentInfo: any;
  public dataSave = new Subject<any>();
  data_reso = this.dataSave.asObservable();
  isNumberDisabled: boolean = false;
  loadedMaxInteger!: boolean;
  disableDuplicateCall: boolean = false;
  setItem(obj: any) {
    this.dataSave.next(obj);
  }
  public idUpdateUndo = new Subject<{ targetID: number, newID: number }>();
  idUpdateUndo_reso = this.idUpdateUndo.asObservable();

  updateDgUniqueID(targetID: number, newID: number) {
    this.idUpdateUndo.next({ targetID, newID }); // Notify all subscribers
  }
  constructor() { }

  build(obj: any, number: string, dgUniqueId: any, dgSequenceNumber: string, parentID = null, level = 0) {
    obj.number = number;
    obj.dgSequenceNumber = dgSequenceNumber;
    obj['dgUniqueID'] = dgUniqueId;
    obj['parentID'] = parentID;
    obj['isEmbededObject'] = false;
    obj['paginateIndex'] = this.paginateIndex++;
    obj['level'] = level;
    if (obj?.dgType === DgTypes.StepInfo || obj?.dgType === DgTypes.DelayStep) {
      obj['title'] = '';
    }
    if (obj?.dataType == SequenceTypes.Attachment) {
      obj['aType'] = SequenceTypes.Attachment;
    }
    this.buildTree(obj);
    if (obj?.aType == SequenceTypes.Attachment) {//'Attachment'
      obj['childSequenceType'] = SequenceTypes.Attachment;
      obj['originalSequenceType'] = SequenceTypes.Attachment;
    } else {
      this.buildSequenceType(obj);
    }
    return obj;
  }
  private buildTree(obj: any) {
    obj = this.setIndexDisplayState(obj);
    obj.id = obj.dgUniqueID;
    obj.children = [];
    return obj;
  }

  createElement(dgType: DgTypes): any {
    switch (dgType) {
      case DgTypes.Section:
        return new Section();
      case DgTypes.StepAction:
        return new StepAction();
      case DgTypes.StepInfo:
        return new StepInfo();
      case DgTypes.DelayStep:
        return new DelayStep();
      case DgTypes.TextDataEntry:
        return new Textbox();
      case DgTypes.DropDataEntry:
        return new DropDown();
      case DgTypes.CheckboxDataEntry:
        return new Checkbox();
      case DgTypes.LabelDataEntry:
        return new TextLabel();
      case DgTypes.Link:
        return new Url();
      case DgTypes.DateDataEntry:
        return new DateDataEntry();
      case DgTypes.SignatureDataEntry:
        return new Signature();
      case DgTypes.InitialDataEntry:
        return new Initial();
      case DgTypes.TextAreaDataEntry:
        return new TextArea();
      case DgTypes.FormulaDataEntry:
        return new Formula();
      case DgTypes.Alara:
        return new Alara();
      case DgTypes.Caution:
        return new Caution();
      case DgTypes.Note:
        return new Note();
      case DgTypes.Warning:
        return new Warning();
      case DgTypes.BooleanDataEntry:
        return new BooleanDataEntry();
      case DgTypes.Para:
        return new Paragraph();
      case DgTypes.NumericDataEntry:
        return new TextNumber();
      case DgTypes.Figures:
        return new Image();
      case DgTypes.Procedure:
        return new Procedure();
      case DgTypes.Reference:
        return new Reference();
      case DgTypes.Table:
        return new TableList();
      case DgTypes.QA:
        return this.buildVerfication(DgTypes.QA);
      case DgTypes.Independent:
        return this.buildVerfication(DgTypes.Independent);
      case DgTypes.Concurrent:
        return this.buildVerfication(DgTypes.Concurrent);
      case DgTypes.Peer:
        return this.buildVerfication(DgTypes.Peer);
      default:
        break;
    }
  }

  insertObjSpecificPos(arr: any, index: any, newItem: any) {
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
  }

  getElement(parentID = '1.0', step: any) {
    switch (step.dgType) {
      case 'Section':
        return new Section();
        break;
      default:
        break;
    }
  }

  // build and return number for newly added child
  getNumberForChild(element: any, position?: any) {
    let parentNumberString;
    let number;
    if (element['childSequenceType'] == SequenceTypes.DGSEQUENCES) {
      parentNumberString = element.number.indexOf('.0') > -1 ? element.number.slice(0, element.number.length - 2) : element.number;
      number = parentNumberString + '.' + (position ? (position + 1) : (element.children.filter((i: any) => i.number).length + 1));
      //  let arr = element.number.split(' ');
      //  number = arr[1] + '.' + (position ? (position + 1) : ((element.children.filter(i => i.number).length) + 1));
    } else if (element['childSequenceType'] == SequenceTypes.BULLETS) {
      //parentNumberString = '.';
      number = '&#9679';
    } else if (element['childSequenceType'] == SequenceTypes.ALPHABETICAL) {
      const encoder = new AlphanumericEncoder();
      if (element.number.match(/[a-z]/i) && !element?.isAlpha) {
        // number = element.number + (position ? this.lowerAlph[position + 1] : this.lowerAlph[element.children.filter((i:any) => i.number).length]) + '.';
        number = element.number + (position ? encoder.encode(position + 1)?.toLowerCase() : encoder.encode(element.children.filter((i: any) => i.number).length + 1))?.toLowerCase() + '.';
      } else {
        if (position) { position = position - 1; }
        number = (position !== undefined ? encoder.encode(position + 1)?.toLowerCase() : encoder.encode(element.children.filter((i: any) => i.number).length + 1))?.toLowerCase() + '.';
      }
    } else if (element['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
      const encoder = new AlphanumericEncoder();
      if (element.number.match(/[a-z]/i) && !element?.isCapAlpha) {
        if (position) { position = position - 1; }
        number = element.number + (position ? encoder.encode(position + 1) : encoder.encode(element.children.filter((i: any) => i.number).length + 1)) + '.';
      } else {
        if (position) { position = position - 1; }
        number = (position ? encoder.encode(position + 1) : encoder.encode(element.children.filter((i: any) => i.number).length + 1)) + '.';
      }
      number = number.toUpperCase();
    } else if (element['childSequenceType'] == SequenceTypes.NUMERIC) {
      if (element.number.endsWith('.') && Utills.isNumber(element.number.replace(/\./g, '')) && !element?.isNumeric) {
        number = element.number + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1)) + '.';
      } else {
        number = (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1)) + '.';
      }
    } else if (element['childSequenceType'] == SequenceTypes.Attachment) {
      if (!element.numberedChildren) {
        number = '&#9679';
      } else {
        if (element.number.match(/[1-9]/g)) {
          number = element.number + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
        } else {
          let arr = element.number.split(' ');
          number = arr[1] + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
        }
      }
    } else if (element['childSequenceType'] == SequenceTypes.STAR) {
      number = '&#10038';
    } else if (element['childSequenceType'] == SequenceTypes.CIRCLE) {
      number = '&#9675';
    } else if (element['childSequenceType'] == SequenceTypes.ARROW) {
      number = '&#10148';
    } else if (element['childSequenceType'] == SequenceTypes.CHECKMARK) {
      number = '&#10003';
    } else if (element['childSequenceType'] == SequenceTypes.SQUARE) {
      number = '&#9726';
    } else if (element['childSequenceType'] == SequenceTypes.ROMAN || element['childSequenceType'] == SequenceTypes.CAPITALROMAN) {

      let matchString = element.number.substring(0, element.number.length - 1);
      let splitno = matchString.split('.').join('');
      if (element.number.endsWith('.') && (splitno.length > 1 || splitno.match(this.capRoman) || splitno.match(this.smallRoman)) && ((!element?.isRoman && element['childSequenceType'] == SequenceTypes.ROMAN) || (!element?.isCapRoman && element['childSequenceType'] == SequenceTypes.CAPITALROMAN))) {
        let incrNo = position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1);
        let other = this.convertNumberToRoman(incrNo);
        number = element.number + other + '.';
      } else {
        let incrNo = position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1);
        let other = this.convertNumberToRoman(incrNo);
        number = other + '.';
      }
      if (!element['romanNumber']) {
        if (element.number.endsWith('.') && Utills.isNumber(element.number.replace(/\./g, '')) && ((!element?.isRoman && element['childSequenceType'] == SequenceTypes.ROMAN) || (!element?.isCapRoman && element['childSequenceType'] == SequenceTypes.CAPITALROMAN))) {
          element['romanNumber'] = element.number + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1)) + '.';
        } else {
          element['romanNumber'] = (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1)) + '.';
        }
      } else {
        element['romanNumber'] = element['romanNumber'].toString();
        if (element['romanNumber'].endsWith('.') && Utills.isNumber(element['romanNumber'].replace(/\./g, '')) && ((!element?.isRoman && element['childSequenceType'] == SequenceTypes.ROMAN) || (!element?.isCapRoman && element['childSequenceType'] == SequenceTypes.CAPITALROMAN))) {
          element['romanNumber'] = element['romanNumber'] + (position ? (position + 1) : ((element.children.filter((i: any) => i['romanNumber']).length) + 1)) + '.';
        } else {
          element['romanNumber'] = (position ? (position + 1) : ((element.children.filter((i: any) => i['romanNumber']).length) + 1)) + '.';
        }
      }
      if (element['childSequenceType'] == SequenceTypes.ROMAN) {
        number = number.toLowerCase();
      }
    }
    return number;
  }

  convertNumberToRoman(number: any) {
    let newNumber: any = '';
    let splitNumber = number.toString().split('.');
    if (splitNumber.length > 1) {
      splitNumber.forEach((item: any) => {
        if (item !== '.') {
          newNumber = newNumber + this.numberToRoman(Number(item));
        }
      })
    } else {
      newNumber = this.numberToRoman(number)
    }
    return newNumber;
  }

  numberToRoman(num: any) {
    if (isNaN(num))
      return NaN;
    var digits: any = String(+num).split(""),
      key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
      roman = "",
      i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }
  getAttachmentDuplicateValue(element: any, position?: any) {
    let number;
    if (element.numberedChildren) {
      if (element.number.match(/[1-9]/g)) {
        number = element.number + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
      } else {
        let arr = element.number.split(' ');
        number = arr[1] + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
      }
    } else {
      if (element.dgType == "Section") {
        if (element.number.match(/[1-9]/g)) {
          number = element.number + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
        } else {
          let arr = element.number.split(' ');
          number = arr[1] + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.number).length) + 1));
        }
      } else {
        if (element.duplicateValue.match(/[1-9]/g)) {
          number = element.duplicateValue + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.duplicateValue).length) + 1));
        } else {
          let arr = element.duplicateValue.split(' ');
          number = arr[1] + '.' + (position ? (position + 1) : ((element.children.filter((i: any) => i.duplicateValue).length) + 1));
        }
      }
    }
    return number;
  }

  getDgSequenceNumberForChild(element: any) {
    let dgSequenceNumberString;
    let dgSequenceNumber;
    if (element.dgSequenceNumber) {
      dgSequenceNumberString = element.dgSequenceNumber.indexOf('.0') > -1 ? element.dgSequenceNumber.slice(0, element.dgSequenceNumber.length - 2) : element.dgSequenceNumber;
      dgSequenceNumber = dgSequenceNumberString + '.' + (element.children.filter((i: any) => i.dgSequenceNumber).length + 1);
    }
    return dgSequenceNumber;
  }

  setNodes(data: any, parentID = null, level = 0, isEmbededObject = false, parentDgUniqueID = null, isBack: boolean = false) {
    data['level'] = level;
    if (data.number) {
      if (data.dgType === DgTypes.Section) {
        data['selectedDgType'] = data['selectedDgType'] ? data['selectedDgType'] : data.dgType?.toString();
        data['usage'] = data['usage'] ? data['usage'] : 'Continuous';
        data['dependency'] = data['dependency'] ? data['dependency'] : 'Default';
        data['configureDependency'] = data['configureDependency'] ? data['configureDependency'] : [];
        data['dependencyChecked'] = data['dependencyChecked'] ? data['dependencyChecked'] : false;
        data['type'] = data['type'] ? data['type'] : data.dgType;
        data['dynamic_number'] = data['dynamic_number'] ? data['dynamic_number'] : 0;
        data['dynamic_section'] = data['dynamic_section'] ? data['dynamic_section'] : false;
        data['hide_section'] = data['hide_section'] ? data['hide_section'] : false;
      }
      if (data.dgType === DgTypes.StepInfo) {
        // if (!data['text']) { data['text'] = '' };
        // if (data?.title === undefined)
        //   data['title'] = JSON.parse(JSON.stringify(data['text']));
      } else {
        if (data.dgType === DgTypes.StepAction) {
          if (!data.properties) {
            data['properties'] = {
              type: 'step',
              stepType: 'Simple Action'
            };
          }
        }
      }
      if (data.dgType === DgTypes.DualAction) {
        this.dualSteps.push({ id: data.dgUniqueID, added: false, obj: data });
        data['isEmbededObject'] = false;
        data['id'] = data.dgUniqueID;
        data['parentID'] = parentID;
        data['parentDgUniqueID'] = parentDgUniqueID;
        if (data.originalSequenceType !== SequenceTypes.DGSEQUENCES) {
          data['state'] = { hidden: true };
        }
        data.children.forEach((item: any) => this.setNodes(item, data.dgSequenceNumber, level + 1, data['isEmbededObject'], data.dgUniqueID, isBack));
      }
      if (this.checkAllSteps(data)) {
        if (data?.stickyNote) {
          if (!data?.stickyNote['selectedStepDgUniqueID']) {
            data.stickyNote['selectedStepDgUniqueID'] = data?.stickyNote['dgUniqueID'] ? data?.stickyNote['dgUniqueID'] : data.dgUniqueID;
            delete data?.stickyNote['dgUniqueID'];
          }
        }
      }
      if (data['childSequenceType'] == undefined || data['originalSequenceType'] === undefined) {
        this.buildSequenceType(data);
      }
      data = this.setIndexDisplayState(data);
      data['id'] = data.dgUniqueID;
      data['parentID'] = parentID;
      data['parentDgUniqueID'] = parentDgUniqueID;
      data['ctrlKey'] = false;
      data['paginateIndex'] = this.paginateIndex++;
      if (data.embeddedSection) {
        data.dyTpe = DgTypes.Section;
        // data.children = JSON.parse(JSON.stringify(data.embeddedSection.section));
        // data.embeddedSection.section = [];
        data['isEmbededObject'] = true;
        this.setEmbededData(data.children, data, 0, data?.property?.type, false);
      } else if (data.children && Array.isArray(data.children)) {
        data['isEmbededObject'] = false;
        data.children.forEach((item: any) => this.setNodes(item, data.dgSequenceNumber, level + 1, data['isEmbededObject'], data.dgUniqueID, isBack));
      }
    } else {
      data['parentID'] = parentID;
      data['parentDgUniqueID'] = parentDgUniqueID;
      if (data.dgType === DgTypes.TextDataEntry && data.fieldName === null) {
        if (data.choice) {
          if (data.choice.length > 0) {
            data['dataType'] = 'Dropdown';
          } else {
            data['dataType'] = 'Text';
            data['fieldName'] = DgTypes.TextDataEntry + (++this.dataFieldNumber);
          }
        }
      }
      if (data.dgType === DgTypes.TextDataEntry && data.fieldName === null) {
        data['fieldName'] = DgTypes.NumericDataEntry + (data.dgUniqueID);
      }
      if (data.dgType === DgTypes.NumericDataEntry && data.fieldName === null) {
        data['fieldName'] = DgTypes.NumericDataEntry + (data.dgUniqueID);
      }
      data['state'] = { hidden: true }
      // data['isEmbededObject'] = isEmbededObject;
    }
  }

  setLevel(data: any, level: any = 0, indentLevel: any = null, parentDgUniqueID: any = null) {
    if (Array.isArray(data)) {
      let [dataObj, index] = data;
      let position = dataObj?.dgSequenceNumber?.endsWith('.0') ? dataObj.dgSequenceNumber.slice(0, dataObj.dgSequenceNumber.lastIndexOf('.0')) : undefined;
      if (position != undefined) {
        if (Number(position) !== index + 1 && dataObj?.childSequenceType === dataObj?.originalSequenceType
          && dataObj?.originalSequenceType === SequenceTypes.DGSEQUENCES && dataObj?.aType !== 'Attachment') {
          data = this.setFirstSectionDgSequenceNumbers(dataObj, index + 1);
        }
      }
      data = dataObj;
    }
    data['level'] = level;
    if (indentLevel) {
      data['indentLevel'] = indentLevel;
    }
    if (data?.number?.includes('-')) {
      data.number = data.number.replace('-', '');
      data.dgSequenceNumber = data.dgSequenceNumber.replace('-', '');
    }
    if (data?.dgUniqueID > Number.MAX_SAFE_INTEGER) {
      data.dgUniqueID = this.getUniqueIdIndex();
      data.dgUniqueID = data.dgUniqueID?.toString();
    }
    if (data?.number && data?.dgSequenceNumber) {
      if (data?.childSequenceType == data?.originalSequenceType && data?.originalSequenceType == SequenceTypes.DGSEQUENCES && data?.aType !== 'Attachment') {
        data = this.checkDgSequenceNumbersFormate(data);
      }
    }
    this.setDgUniqueID(data);
    // this.setPropertyNames(data);
    let duplicates = this.duplicateFind(this.dupUniqueIDs);
    let isThere = duplicates.filter((ite: any) => ite == data.dgUniqueID)
    if (isThere?.length > 0) {
      data.dgUniqueID = this.getUniqueIdIndex();
    }
    if (data.dgType == DgTypes.Section || data.dgType == DgTypes.StepAction ||
      data.dgType == DgTypes.Timed || data.dgType == DgTypes.DelayStep ||
      data.dgType == DgTypes.Repeat
    ) {
      parentDgUniqueID = data.dgUniqueID;
    }
    if (data.dgType === DgTypes.Form) {
      data.parentDgUniqueID = parentDgUniqueID;
      this.setDefaultTableChanges(data, parentDgUniqueID, data.dgUniqueID);
    }
    if (data.dgType === DgTypes.DualAction) {
      data.children.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevel(item, level + 1));
      });
      data.rightDualChildren.forEach((element: any) => {
        element['level'] = data.level;
        if (indentLevel) {
          element['indentLevel'] = indentLevel;
        }
        if (element.children?.length > 0)
          element.children.forEach((item: any) => this.setLevel(item, level + 1));
      });
    }
    if (data.children && Array.isArray(data.children) && data.dgType !== DgTypes.DualAction) {
      if (data['childSequenceType'] !== SequenceTypes.DGSEQUENCES) {
        data['isIndent'] = true;
      }
      const nextIndentLevel = data['childSequenceType'] !== SequenceTypes.DGSEQUENCES ? (indentLevel ? indentLevel + 1 : 1) : undefined;
      data.children.forEach((item: any) => {
        this.setLevel(item, level + 1, nextIndentLevel);
        item = this.setParentStepInfo(item, data);
      });
    }
  }
  setFirstSectionDgSequenceNumbers(parentElement: any, index: any) {
    let position = 0;
    parentElement.number = index + '.0';
    parentElement.dgSequenceNumber = index + '.0';
    const childs = parentElement.children.filter((child: any) => child.number);
    childs.forEach((child: any) => {
      child['parentID'] = parentElement?.dgSequenceNumber;
      child['parentDgUniqueID'] = parentElement.dgUniqueID;
    });
    for (const child of parentElement.children) {
      if (child?.number && child?.dgSequenceNumber) {
        child.number = child.number.replace('-', '');
        child.dgSequenceNumber = child.dgSequenceNumber.replace('-', '');
        const id = this.extractParentId(child.parentID);
        position++;
        const updatedId = `${id}.${position}`;
        if (child?.originalSequenceType == SequenceTypes.DGSEQUENCES) {
          child.number = updatedId;
        }
        child.dgSequenceNumber = updatedId;
      }
    }
    return parentElement;
  }
  checkDgSequenceNumbersFormate(parentElement: any) {
    if (!parentElement?.children?.length) return parentElement;
    let isValidDgSequenceNumber = true;
    const childs = parentElement.children.filter((child: any) => child.number);
    for (let i = 0; i < childs.length; i++) {
      const child = childs[i];
      childs.forEach((child: any) => {
        if (child['parentID'] !== parentElement?.dgSequenceNumber) {
          child['parentID'] = parentElement?.dgSequenceNumber;
          child['parentDgUniqueID'] = parentElement.dgUniqueID;
        }
      });
      if (child?.number && child?.dgSequenceNumber) {
        let parentId = this.extractParentId(child.parentID);
        const expectedId = `${parentId}.${i + 1}`;
        if (child.number !== expectedId || child.dgSequenceNumber !== expectedId) {
          isValidDgSequenceNumber = false;
          break;
        }
      }
    }
    if (!isValidDgSequenceNumber) {
      let position = 0;
      for (const child of parentElement.children) {
        if (child?.number && child?.dgSequenceNumber) {
          child.number = child.number.replace('-', '');
          child.dgSequenceNumber = child.dgSequenceNumber.replace('-', '');
          const id = this.extractParentId(child.parentID);
          position++;
          const updatedId = `${id}.${position}`;
          child.number = updatedId;
          child.dgSequenceNumber = updatedId;
        }
      }
    }
    return parentElement;
  }
  extractParentId(version: any) {
    if (typeof version !== 'string') return version;
    if (version.endsWith('.0')) {
      return version.slice(0, version.lastIndexOf('.0'));
    }
    return version;
  }

  buildSequenceType(element: any) {
    if (element?.number && !(Array.isArray(element?.number))) {
      if (element?.number == '&#9679') {
        this.setSequenceType(element, SequenceTypes.BULLETS);
      } else if (element?.number?.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        this.setSequenceType(element, SequenceTypes.NUMERIC);
      } else if (!element?.number?.endsWith('.') && Utills.isNumber(element?.number.replace(/\./g, ''))) {
        this.setSequenceType(element, SequenceTypes.DGSEQUENCES);
      } else if (element?.number.match(/[a-z]/i) && this.isLowerCase(element?.number) && !element['stepSequenceType']) {
        this.setSequenceType(element, SequenceTypes.ALPHABETICAL);
      } else if (element.number === '&#10038') {
        this.setSequenceType(element, SequenceTypes.STAR);
      } else if (element.number === '&#9675') {
        this.setSequenceType(element, SequenceTypes.CIRCLE);
      } else if (element.number === '&#9726') {
        this.setSequenceType(element, SequenceTypes.SQUARE);
      } else if (element.number === '&#10003') {
        this.setSequenceType(element, SequenceTypes.CHECKMARK);
      } else if (element.number === '&#10148') {
        this.setSequenceType(element, SequenceTypes.ARROW);
      } else if (element?.number.match(/[a-z]/i) && !this.isLowerCase(element?.number) && !element['stepSequenceType']) {
        let type = element?.aType ? SequenceTypes.Attachment : SequenceTypes.CAPITALALPHABETICAL;
        this.setSequenceType(element, type);
      } else if (element.number.match(this.capRoman) && element['stepSequenceType']) {
        this.setSequenceType(element, SequenceTypes.CAPITALROMAN);
      } else if (element.number.match(this.smallRoman) && element['stepSequenceType']) {
        this.setSequenceType(element, SequenceTypes.ROMAN);
      }
    }
    // else {
    //   throw new Error('can\'t  buildSequenceType');
    // }

  }

  setSequenceType(element: any, sequenceType: SequenceTypes) {
    element['childSequenceType'] = sequenceType;
    element['originalSequenceType'] = this.getSequenceType(element);
    if (element['originalSequenceType'] == undefined) {
      element['originalSequenceType'] = sequenceType;
    }
    if (sequenceType === SequenceTypes.DGSEQUENCES || sequenceType === SequenceTypes.ALPHABETICAL ||
      sequenceType === SequenceTypes.ROMAN || sequenceType === SequenceTypes.CAPITALROMAN ||
      sequenceType === SequenceTypes.NUMERIC || sequenceType === SequenceTypes.CAPITALALPHABETICAL ||
      sequenceType === SequenceTypes.Attachment) {
      element.numberedChildren = true;
    } else {
      element.numberedChildren = false;
    }
  }

  getSequenceType(element: any): any {
    if (element.number) {
      if (element.number == '&#9679') {
        return SequenceTypes.BULLETS;
      } else if (element.number.endsWith('.') && Utills.isNumber(element.number.replace(/\./g, ''))) {
        return SequenceTypes.NUMERIC;
      } else if (!element.number.endsWith('.') && Utills.isNumber(element.number.replace(/\./g, ''))) {
        return SequenceTypes.DGSEQUENCES;
      } else if (element.number.match(/[a-z]/i) && this.isLowerCase(element.number) && !element['stepSequenceType']) {
        return SequenceTypes.ALPHABETICAL
      } else if (element.number.match(/[a-z]/i) && !this.isLowerCase(element.number) && !element['stepSequenceType']) {
        return element?.dataType === "Attachment" ? SequenceTypes.Attachment : SequenceTypes.CAPITALALPHABETICAL;
      } else if (element.number === '&#10038') {
        return SequenceTypes.STAR;
      } else if (element.number === '&#9675') {
        return SequenceTypes.CIRCLE;
      } else if (element.number === '&#9726') {
        return SequenceTypes.SQUARE;
      } else if (element.number === '&#10003') {
        return SequenceTypes.CHECKMARK;
      } else if (element.number === '&#10148') {
        return SequenceTypes.ARROW;
      } else if (element.number.match(this.capRoman) && element['stepSequenceType']) {
        return SequenceTypes.CAPITALROMAN;
      } else if (element.number.match(this.smallRoman) && element['stepSequenceType']) {
        return SequenceTypes.ROMAN;
      }
    } else {
      // console.log(element);
      throw new Error('can\'t  buildSequenceType');
    }
  }
  isLowerCase(str: string) {
    return str == str.toLowerCase() && str != str.toUpperCase();
  }

  getNode(obj: any) {
    if (obj.number) {
      const text = obj.dgType === DgTypes.StepAction ? obj.action : obj.title;
      return {
        text: obj.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : ''),
        children: [],
        id: obj.dgUniqueID,
        data: obj
      };
    } else {
      // console.error('Object number can\'t be null');
    }
  }
  replaceElement(source: any, target: any, section: any): any {
    return findAnd.replaceObject(section, source, target);
  }
  getElementByNumber(number: any, section: any): any {
    return findAnd.returnFound(section, { dgSequenceNumber: number });
  }

  getElementByDgType(dgType: any, section: any): any {
    return findAnd.returnFound(section, { dgType: dgType });
  }
  getElementByDgUniqueID(dgUniqueID: any, section: any): any {
    let obj = findAnd.returnFound(section, { dgUniqueID: dgUniqueID });
    if (!obj) {
      obj = findAnd.returnFound(section, { dgUniqueID: dgUniqueID?.toString() });
    }
    if (!obj) {
      obj = findAnd.returnFound(section, { dgUniqueID: Number(dgUniqueID) });
    }
    return obj;
  }
  getElementBypaginationIndex(index: any, section: any): any {
    return findAnd.returnFound(section, { paginateIndex: index });
  }

  getElementByProperty(colsObj: any, item: any) {
    let element = findAnd.returnFound(colsObj, { property: item?.property });
    if (element) { return element }
    else { return null }
  }

  getNodeByNumber(number: any, nodes: any): any {
    return findAnd.returnFound(nodes, { number: number });
  }
  pushNode(obj: any, parent: any, nodes: any) {
    findAnd.returnFound(nodes, { number: parent.number }).children.push(this.getNode(obj));
  }
  deleteNode(obj: any, nodes: any) {

  }
  deletObject(obj: any, ctrlSelectedItems: any[]) {
    return findAnd.removeObject(ctrlSelectedItems, { dgSequenceNumber: obj.dgSequenceNumber });
  }
  deleteHeaderDataEelement(item: any, HeaderFooter: any, audit: any) {
    // let element = this.getElementByDgUniqueID(Number(item.parentDgUniqueID), HeaderFooter);
    // let parentElement = this.getElementByDgUniqueID(Number(element.parentDgUniqueID), HeaderFooter);
    if (HeaderFooter) {
      HeaderFooter.children.forEach((data: any) => {
        if (data.dgType === DgTypes.Table || item.dgType === DgTypes.Table) {
          this.tabledeleteDataEelement(item, HeaderFooter);
        } else {
          HeaderFooter.children = HeaderFooter.children.filter((i: any) => i?.dgUniqueID != item.dgUniqueID);
        }
      })
      return HeaderFooter;
    }
  }
  deleteDataEelement(item: any, section: any) {
    let dualStep = false;
    let element = this.getElementByNumber(item.parentID, section);
    if (element?.length == 2) {
      dualStep = true;
      let parent: any = this.getElementByDgUniqueID(item.parentDgUniqueID, section);
      if (parent === undefined) {
        if (element[0].children.length > 0)
          parent.children = element[0].children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
        if (parent.chidren.length === element[0].children.length)
          parent.children = element[1].children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
      }
      parent.children = parent.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
    }
    if (element?.length == 3) {
      dualStep = true;
      let parent: any = this.getElementByDgUniqueID(item.parentDgUniqueID, section);
      if (parent === undefined) {
        parent = element.find((el: any) => el.dgUniqueID === item.parentDgUniqueID);
      }
      if (item['rightdualchild']) {
        if (!parent?.rightDualChildren && parent?.children) {
          parent.children = parent.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
        } else {
          parent.rightDualChildren = parent.rightDualChildren.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
        }
      } else {
        parent.children = parent.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
      }
    }
    if (element && !dualStep) {
      element.children.forEach((data: any) => {
        if (data.dgType === DgTypes.Table || item.dgType === DgTypes.Table) {
          this.tabledeleteDataEelement(item, section);
        } else {
          element.children = element.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
        }
      })
      if (element.dgType === DgTypes.StepAction) {
        if (item.dgType === DgTypes.Independent) {
          if (!element.children.find((i: any) => i.dgType === DgTypes.Independent)) {
            element.requiresIV = false;
          }
          if (!element.children.find((i: any) => i.dgType === DgTypes.Concurrent)) {
            element.requiresCV = false;
          }
          if (!element.children.find((i: any) => i.dgType === DgTypes.QA)) {
            element.requiresQA = false;
          }
          if (!element.children.find((i: any) => i.dgType === DgTypes.Peer)) {
            element.requiresPC = false;
          }
        }
      }
    }
    return element;
  }
  tabledeleteDataEelement(item: any, section: any) {
    let element: any;
    if (section.dgType == "Header" || section.dgType == "Footer") {
      element = section
    }
    else {
      element = this.getElementByNumber(item.parentID, section);
    }

    if (element) {
      let entryObj, object;
      for (let j = 0; j < element.children.length; j++) {

        if ((element.dgType === 'Section' || element.dgType === 'Header' || element.dgType === 'Footer' || element.dgType === 'StepAction' || element.dgType === 'Repeat') && item.dgType != DgTypes.TextDataEntry && item.dgType != DgTypes.NumericDataEntry
          && item.dgType != DgTypes.TextAreaDataEntry && item.dgType != DgTypes.DateDataEntry && item.dgType != DgTypes.BooleanDataEntry && item.dgType != DgTypes.CheckboxDataEntry && item.dgType != DgTypes.LabelDataEntry && item.dgType != DgTypes.Para && item.dgType != DgTypes.Figures) {
          for (let i = 0; i < element.children.length; i++) {
            element.children = element.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
          }
          return true;
        }
        if (element.dgType === DgTypes.Section || element.dgType === 'Header' || element.dgType === 'Footer' || element.dgType === DgTypes.StepAction) {
          // for (let i = 0; i < element.children.length; i++) {
          //   element.children = element.children.filter(i => i.dgUniqueID != item.dgUniqueID);
          // }
          element.children.forEach((data: any) => {
            if (data.dgType === DgTypes.Table) {
              let childata = data;
              let rowdata = childata.calstable[0].table.tgroup.tbody[0].row;
              for (let l = 0; l < rowdata.length; l++) {
                entryObj = rowdata[l].entry;
                for (let m = 0; m < entryObj.length; m++) {
                  if (entryObj[m]) {
                    object = childata.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
                    object.children = object.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
                    if (childata.dgType === DgTypes.Table && childata.dgUniqueID === item.dgUniqueID) {
                      element.children = element.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
                    }
                  }
                }
              }
            } else {
              element.children = element.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
            }
          });
          return true;
          // for (let k = 0; k < element.children.length; k++) {
          //   element.children = element.children.filter(k => k.dgUniqueID != item.dgUniqueID);
          // }
        }
        let childata = element?.children[j];
        if ((childata?.dgType != DgTypes.Form && childata?.dgType != DgTypes.Table)) {
          continue;
        }
        let rowdata = childata?.calstable[0]?.table?.tgroup?.tbody[0]?.row;
        for (let l = 0; l < rowdata.length; l++) {
          entryObj = rowdata[l].entry;
          for (let m = 0; m < entryObj.length; m++) {
            if (entryObj[m]) {
              object = childata.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
              object.children = object.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
              if (childata.dgType === DgTypes.Table && childata.dgUniqueID === item.dgUniqueID) {
                element.children = element.children.filter((i: any) => i.dgUniqueID != item.dgUniqueID);
              }
            }
          }
        }

      };
      return object;
    }

  }
  buildVerfication(verificationType: string): any {
    const qa = new Verification();
    qa.VerificationType = verificationType;
    qa.dataType = verificationType;
    qa.prompt = 'Requires ' + verificationType.toUpperCase() + ' Verification';
    return qa;
  }

  deleteStep(items: any, cbpJson: any) {
    let index;
    if (items.parentID) {
      const parent = items?.dualStep ? this.getElementByDgUniqueID(items.parentDgUniqueID, cbpJson) : this.getElementByNumber(items.parentID, cbpJson);
      if (parent.dgType == DgTypes.Section || parent.dgType == DgTypes.StepAction || parent.dgType == DgTypes.Timed || parent.dgType == DgTypes.Repeat || parent.dgType == DgTypes.DelayStep) {
        index = parent.children.findIndex((i: any) => i.dgUniqueID == items.dgUniqueID);
        parent.children = parent.children.filter((i: any) => i.dgUniqueID != items.dgUniqueID);
        this.renameCurrentLevelSteps(parent.children, index);
      }
    } else {
      index = cbpJson.findIndex((i: any) => i.dgSequenceNumber == items.dgSequenceNumber)
      cbpJson = cbpJson.filter((i: any) => i.dgSequenceNumber != items.dgSequenceNumber)
      this.renameMasterSteps(cbpJson, index, items);
    }
    return cbpJson;
  }
  nextCharacter(c: any) {
    return String.fromCharCode(c.charCodeAt(0) - 1);
  }

  deleteMultipleSteps(items: any, cbpJson: any) {
    let index: any;
    let parent: any;
    items.forEach((item: any) => {
      if (item.parentID) {
        parent = this.getElementByNumber(item.parentID, cbpJson);
        if (parent.dgType == DgTypes.Section || parent.dgType == DgTypes.StepAction) {
          index = parent.children.findIndex((i: any) => i.dgSequenceNumber == item.dgSequenceNumber);
          parent.children = parent.children.filter((i: any) => i.dgSequenceNumber != item.dgSequenceNumber);
        }
      } else {
        index = cbpJson.findIndex((i: any) => i.dgSequenceNumber == item.dgSequenceNumber)
        cbpJson = cbpJson.filter((i: any) => i.dgSequenceNumber != item.dgSequenceNumber)
      }
    });
    if (parent) {
      this.renameCurrentLevelSteps(parent.children, index);
    } else {
      this.renameMasterSteps(cbpJson, index, '');
    }
  }
  renameMasterSteps(sections: any, index: any, selectedItem: any, value = -1, renameNumber = true, renameDgSequenceNumber = true) {
    try {
      if (Array.isArray(sections)) {
        sections.forEach((item, i) => {
          if (item?.dgType === DgTypes.DualAction) {
            item.children.forEach((element: any) => {
              element = this.reMasterStepsReUse(element, i, index, renameNumber, value, selectedItem, renameDgSequenceNumber)
            });
            item.rightDualChildren.forEach((element: any) => {
              element = this.reMasterStepsReUse(element, i, index, renameNumber, value, selectedItem, renameDgSequenceNumber)
            });
          }
          else {
            item = this.reMasterStepsReUse(item, i, index, renameNumber, value, selectedItem, renameDgSequenceNumber)
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  reMasterStepsReUse(item: any, i: number, index: number, renameNumber: any, value: any, selectedItem: any, renameDgSequenceNumber: any) {
    if (item?.dataType !== SequenceTypes.Attachment) {
      this.attachmentId = false;
    }
    if (i < index) {
      if (item?.dataType === SequenceTypes.Attachment) {
        const arr = item.number.split(' ');
        let alpha = arr[1];
        this.alphaParam = alpha;
        this.attachmentId = true;
      }
      return;
    } else {
      if (item?.dgSequenceNumber) {
        if (renameNumber && item.number != '.' && item.dataType !== SequenceTypes.Attachment) {
          const arr = item.number.split('.');
          arr[0] = parseInt(arr[0]) + value;
          item.number = arr.join('.');
        } else if (renameNumber && item.number != '.' && item.dataType === SequenceTypes.Attachment) {
          if (selectedItem?.dataType) {
            const arr = item.number.split(' ');
            let alpha = arr[1];
            alpha = this.nextCharacter(alpha);
            item.number = arr[0] + ' ' + alpha;
            this.alphaParam = alpha;
            this.attachmentId = true;
            this.renameDeleteAttachmentChildLevelSteps(item, renameNumber, alpha);
          } else {
            item.number;
          }
        } else {
          item.number = '.';
        }
        if (renameDgSequenceNumber) {
          const arr = item.dgSequenceNumber.split('.');
          arr[0] = parseInt(arr[0]) + value;
          item.dgSequenceNumber = arr.join('.');
        }
        item = this.setIndexDisplayState(item);
        this.renameChildLevelSteps(item, renameNumber, renameDgSequenceNumber);
      }
    }
    return item;
  }


  renameDeleteAttachmentChildLevelSteps(item: any, renameNumber = true, alpha: any) {
    try {
      if (Array.isArray(item.children)) {
        let numberdIndex = -1;
        item.children.forEach((so: any, i: any) => {
          if (so.number) {
            ++numberdIndex;
            if (renameNumber) {
              if (item['childSequenceType'] == SequenceTypes.Attachment) {
                const str = item.number + '.' + (numberdIndex + 1);
                so.number = str.replace("Attachment ", '');
              }
            }
            this.renameDeleteAttachmentChildLevelSteps(so, renameNumber = true, alpha);
          }
        });
      }

    } catch (error) {
      console.error(error);
    }
  }
  renameCurrentLevelSteps(objects: any, index: any, value = -1, renameNumber = true, renameDgSequenceNumber = true) {
    try {
      if (Array.isArray(objects)) {
        objects.forEach((item, i) => {
          if (i < index) {
            return;
          } else {
            if (item?.dgSequenceNumber) {
              if (item?.dgType === DgTypes.DualAction) {
                item.children.forEach((element: any) => {
                  if (value < 0) {
                    this.decreaseNumber(element)
                  } else {
                    this.increaseNumber(element);
                  }
                  if (renameDgSequenceNumber) {
                    const arr = element.dgSequenceNumber.split('.');
                    arr[arr.length - 1] = parseInt(arr[arr.length - 1]) + value;
                    item.dgSequenceNumber = arr.join('.');
                  }
                  element = this.setIndexDisplayState(element);
                  this.renameChildLevelSteps(element, renameNumber, renameDgSequenceNumber);
                });

                item.rightDualChildren.forEach((element: any) => {
                  if (value < 0) {
                    this.decreaseNumber(element)
                  } else {
                    this.increaseNumber(element);
                  }
                  if (renameDgSequenceNumber) {
                    const arr = element.dgSequenceNumber.split('.');
                    arr[arr.length - 1] = parseInt(arr[arr.length - 1]) + value;
                    element.dgSequenceNumber = arr.join('.');
                  }
                  element = this.setIndexDisplayState(element);
                  this.renameChildLevelSteps(element, renameNumber, renameDgSequenceNumber);
                });
              }
              if (value < 0) {
                this.decreaseNumber(item)
              } else {
                this.increaseNumber(item);
              }
              if (renameDgSequenceNumber) {
                const arr = item.dgSequenceNumber.split('.');
                arr[arr.length - 1] = parseInt(arr[arr.length - 1]) + value;
                item.dgSequenceNumber = arr.join('.');
              }
              item = this.setIndexDisplayState(item);
              this.renameChildLevelSteps(item, renameNumber, renameDgSequenceNumber);
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  renameChildLevelSteps(item: any, renameNumber = true, renameDgSequenceNumber = true, dgUniqueID = 0, isNewlyAdded = false, isIndent = false, updateUndo = true, isCopyPaste = false) {
    try {
      let numberdIndex = -1;
      if (item.dgType === DgTypes.DualAction) {
        this.dualStepNumberChange(item, numberdIndex, item, renameNumber, renameDgSequenceNumber, dgUniqueID, isNewlyAdded, isIndent, 'dual');
      }
      item.children.forEach((so: any, i: any) => {
        if (so.dgType !== DgTypes.Warning && so.dgType !== DgTypes.Caution && so.dgType !== DgTypes.Note && so.dgType !== DgTypes.Alara && so.dgType !== DgTypes.InitialDataEntry
          && so.dgType !== DgTypes.Para && so.dgType !== DgTypes.NumericDataEntry && so.dgType !== DgTypes.LabelDataEntry && so.dgType !== DgTypes.FormulaDataEntry && so.dgType !== DgTypes.DateDataEntry
          && so.dgType !== DgTypes.CheckboxDataEntry && so.dgType !== DgTypes.BooleanDataEntry && so.dgType !== DgTypes.TextAreaDataEntry && (so.dgType !== DgTypes.TextDataEntry && so.dataType != "Dropdown")
          && (so.dgType !== DgTypes.Form && so.dataType != "table") && so.dgType !== DgTypes.Link && (so.dgType !== DgTypes.Figures && so.dataType != "image") && so.dgType !== DgTypes.VerificationDataEntry
          && so.dgType !== DgTypes.SignatureDataEntry) {
          if (item.dgType === DgTypes.DualAction) {
            this.dualStepNumberChange(so, numberdIndex, item, renameNumber, renameDgSequenceNumber, dgUniqueID, isNewlyAdded, isIndent, 'dual');
          } else {
            ++numberdIndex;
            so = this.renameChildLevelReuse(so, numberdIndex, item, renameNumber, renameDgSequenceNumber, dgUniqueID, isNewlyAdded, isIndent, '', updateUndo, isCopyPaste);
          }
        }
        else {
          if (isCopyPaste && this.isCopyPasteDataEntry(so)) {
            so['fieldName'] = so.dgType + (so.dgUniqueID);
          }
          so.parentID = item.dgSequenceNumber;
          so.parentDgUniqueID = item.dgUniqueID;
          if (so?.dgSequenceNumber) {
            so.dgSequenceNumber = item.dgSequenceNumber.substring(0, 1) + so.dgSequenceNumber.substring(1);
            so.text = so.dgSequenceNumber;
            so.number = so.dgSequenceNumber;
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  isCopyPasteDataEntry(element: any) {
    return (element?.dgType == DgTypes.TextAreaDataEntry || element?.dgType == DgTypes.TextDataEntry ||
      element?.dgType == DgTypes.NumericDataEntry || element?.dgType == DgTypes.BooleanDataEntry ||
      element?.dgType == DgTypes.CheckboxDataEntry || element?.dgType == DgTypes.DateDataEntry ||
      element?.dgType == DgTypes.FormulaDataEntry) ? true : false;
  }

  dualStepNumberChange(so: any, numberdIndex: any, item: any, renameNumber: any, renameDgSequenceNumber: any, dgUniqueID: any, isNewlyAdded: any, isIndent: any, dual: string) {
    if (so.rightDualChildren?.length > 0) {
      so.rightDualChildren.forEach((element: any) => {
        ++numberdIndex;
        element = this.renameChildLevelReuse(element, numberdIndex, item, renameNumber, renameDgSequenceNumber, dgUniqueID, isNewlyAdded, isIndent, 'dual');
      });
    }
    if (so.children?.length > 0) {
      so.children.forEach((element: any) => {
        ++numberdIndex
        element = this.renameChildLevelReuse(element, numberdIndex, item, renameNumber, renameDgSequenceNumber, dgUniqueID, isNewlyAdded, isIndent, 'dual');
      });
    }
  }

  renameChildLevelReuse(so: any, numberdIndex: any, item: any, renameNumber = true, renameDgSequenceNumber = true, dgUniqueID = 0, isNewlyAdded = false, isIndent = false, dual: string = '', updateUndo = true, isCopyPaste = false) {
    if (so?.number) {
      const index = so.number.lastIndexOf('.');
      if (item?.number.indexOf('.0') > -1) {
        if (renameNumber) {
          if (item['childSequenceType'] == SequenceTypes.DGSEQUENCES) {
            so.number = item.number.slice(0, item.number.lastIndexOf('.')) + '.' + (numberdIndex + 1);
          } else if (item['childSequenceType'] == SequenceTypes.ALPHABETICAL) {
            if (this.getSequenceType(item) == SequenceTypes.ALPHABETICAL) {
              so.number = item.number.slice(0, item.number.lastIndexOf('.')) + this.lowerAlph[numberdIndex] + '.';
            } else {
              so.number = this.lowerAlph[numberdIndex] + '.';
            }
          } else if (item['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
            if (this.getSequenceType(item) == SequenceTypes.CAPITALALPHABETICAL) {
              so.number = item.number.slice(0, item.number.lastIndexOf('.')) + this.lowerAlph[numberdIndex] + '.';
            } else {
              so.number = this.lowerAlph[numberdIndex] + '.';
            }
            so.number = so.number.toUpperCase();
          } else if (item['childSequenceType'] == SequenceTypes.NUMERIC) {
            if (this.getSequenceType(item) == SequenceTypes.NUMERIC) {
              so.number = item.number.slice(0, item.number.lastIndexOf('.')) + '.' + (numberdIndex + 1) + '.';
            } else {
              so.number = (numberdIndex + 1) + '.';
            }
          } else if (item['childSequenceType'] == SequenceTypes.BULLETS) {
            so.number = '&#9679';
          } else if (item['childSequenceType'] == SequenceTypes.STAR) {
            so.number = '&#10038';
          } else if (item['childSequenceType'] == SequenceTypes.CIRCLE) {
            so.number = '&#9675';
          } else if (item['childSequenceType'] == SequenceTypes.ARROW) {
            so.number = '&#10148';
          } else if (item['childSequenceType'] == SequenceTypes.CHECKMARK) {
            so.number = '&#10003';
          } else if (item['childSequenceType'] == SequenceTypes.SQUARE) {
            so.number = '&#9726';
          } else if (item['childSequenceType'] == SequenceTypes.ROMAN || item['childSequenceType'] == SequenceTypes.CAPITALROMAN) {
            let newNumber: any;
            if (this.getSequenceType(item) == SequenceTypes.ROMAN || this.getSequenceType(item) == SequenceTypes.CAPITALROMAN) {
              newNumber = item['romanNumber'].slice(0, item['romanNumber'].lastIndexOf('.')) + '.' + (numberdIndex + 1) + '.';
            } else {
              newNumber = (numberdIndex + 1) + '.';
            }
            so.number = this.convertNumberToRoman(newNumber);
            if (item['childSequenceType'] == SequenceTypes.ROMAN) {
              so.number = so.number.toLowerCase();
            }
          }
        }
        if (renameDgSequenceNumber) {
          so.dgSequenceNumber = item.dgSequenceNumber.slice(0, item.dgSequenceNumber.lastIndexOf('.')) + '.' + (numberdIndex + 1);
        }
      } else {
        // console.log(numberdIndex);
        if (renameNumber) {
          if (item['childSequenceType'] == SequenceTypes.DGSEQUENCES) {
            if (dual === 'dual') {
              so.number = item.number;
            }
            else if (so['childSequenceType'] == SequenceTypes.CAPITALROMAN) {
              let num = this.convertNumberToRoman(numberdIndex + 1);
              so.number = item.number + '.' + num;
            } else {
              so.number = item.number + '.' + (numberdIndex + 1);
            }
          } else if (item['childSequenceType'] == SequenceTypes.ALPHABETICAL) {
            if (this.getSequenceType(item) == item['childSequenceType']) {
              so.number = item.number.slice(0, item.number.lastIndexOf('.')) + '.' + this.lowerAlph[numberdIndex] + '.';
            } else {
              so.number = this.lowerAlph[numberdIndex] + '.';
            }
          } else if (item['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
            if (this.getSequenceType(item) == item['childSequenceType']) {
              so.number = item.number.slice(0, item.number.lastIndexOf('.')) + '.' + this.lowerAlph[numberdIndex] + '.';
            } else {
              so.number = this.lowerAlph[numberdIndex] + '.';
            }
            so.number = so.number.toUpperCase();
          } else if (item['childSequenceType'] == SequenceTypes.NUMERIC) {
            if (this.getSequenceType(item) == SequenceTypes.NUMERIC) {
              if (dual) {
                so.number = item.number;
              } else {
                so.number = item.number.slice(0, item.number.lastIndexOf('.')) + '.' + (numberdIndex + 1) + '.';
              }
            } else {
              so.number = (numberdIndex + 1) + '.';
            }
          } else if (item['childSequenceType'] == SequenceTypes.CAPITALROMAN) {
            let num = this.convertNumberToRoman(numberdIndex + 1);
            so.number = num + '.';
          }
          else if (item['childSequenceType'] == SequenceTypes.BULLETS) {
            so.number = '&#9679';
          } else if (item['childSequenceType'] == SequenceTypes.STAR) {
            so.number = '&#10038';
          } else if (item['childSequenceType'] == SequenceTypes.CIRCLE) {
            so.number = '&#9898';
          } else if (item['childSequenceType'] == SequenceTypes.ARROW) {
            so.number = '&#10148';
          } else if (item['childSequenceType'] == SequenceTypes.CHECKMARK) {
            so.number = '&#10003';
          } else if (item['childSequenceType'] == SequenceTypes.SQUARE) {
            so.number = '&#9726';
          } else if (item['childSequenceType'] == SequenceTypes.ROMAN || item['childSequenceType'] == SequenceTypes.CAPITALROMAN) {
            let nnnumber = item['romanNumber'].slice(0, item['romanNumber'].lastIndexOf('.')) + '.' + (numberdIndex + 1) + '.';
            // so.number = this.convertNumberToRoman(nnnumber);
            if (item['childSequenceType'] == SequenceTypes.ROMAN) {
              so.number = so.number.toLowerCase();
            }
          } else if (item['childSequenceType'] == SequenceTypes.Attachment) {
            if (item?.level == 0) {
              const input = item.number;
              const result = input.substring(input.indexOf(" ") + 1);
              so.number = result + '.' + (numberdIndex + 1);
            } else {
              so.number = item.number + '.' + (numberdIndex + 1);
            }
          }
        }
        if (renameDgSequenceNumber) {
          if (dual === 'dual') {
            so.dgSequenceNumber = item.dgSequenceNumber;
          } else {
            so.dgSequenceNumber = item.dgSequenceNumber + '.' + (numberdIndex + 1);
          }
        }
      }
      so.number = so.number.replace(/\.\./g, '.');
      so.dgSequenceNumber = so.dgSequenceNumber.replace(/\.\./g, '.');

      if (so.number.includes('-')) {
        so.number = so.number.replace('-', '');
        so.dgSequenceNumber = so.dgSequenceNumber.replace('-', '');
      }
      so = this.setIndexDisplayState(so);
      so.parentID = item.dgSequenceNumber;
      so.parentDgUniqueID = item.dgUniqueID;
      so.level = (parseInt(item.level) + 1);
      if (so) {
        so = this.setUserUpdateInfo(so);
      }
      if (isNewlyAdded) {
        let oldId = JSON.parse(JSON.stringify(so?.dgUniqueID));
        so['dgUniqueID'] = this.getUniqueIdIndex();
        so['id'] = so['dgUniqueID'];
        so['originalSequenceType'] = item['childSequenceType'];
        so['childSequenceType'] = item['childSequenceType'];
        let newId = JSON.parse(JSON.stringify(so?.dgUniqueID));
        if (oldId != newId && updateUndo) {
          this.updateDgUniqueID(oldId, newId);
        }
        this.renameChildLevelSteps(so, true, true, this.getUniqueIdIndex(), true, false, updateUndo);
      } else if (isIndent) {
        so['originalSequenceType'] = item['childSequenceType'];
        this.renameChildLevelSteps(so, true, true, 0, false, true);
      } else {
        so['childSequenceType'] = item['childSequenceType'];
        so['originalSequenceType'] = item['childSequenceType'];
        this.renameChildLevelSteps(so, true, true, 0, false, false, updateUndo, isCopyPaste);
      }
    }
  }

  decreaseNumber(item: any) {
    if (item['childSequenceType'] == SequenceTypes.DGSEQUENCES) {
      const arr = item.number.split('.');
      arr[arr.length - 1] = parseInt(arr[arr.length - 1]) - 1;
      item.number = arr.join('.');
    } else if (item['childSequenceType'] == SequenceTypes.ALPHABETICAL) {
      const arr = item.number.split('.');
      arr[arr.length - 2] = this.lowerAlph[this.lowerAlph.indexOf(arr[arr.length - 2]) - 1];
      item.number = arr.join('.');
    } else if (item['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
      const arr = item.number.split('.');
      arr[arr.length - 2] = this.lowerAlph[this.lowerAlph.indexOf(arr[arr.length - 2]) - 1];
      item.number = arr.join('.');
      item.number = item.number.toUpperCase();
    } else if (item['childSequenceType'] == SequenceTypes.NUMERIC) {
      const arr = item.number.split('.');
      arr[arr.length - 2] = parseInt(arr[arr.length - 2]) - 1;
      item.number = arr.join('.');
    } else if (item['childSequenceType'] == SequenceTypes.Attachment) {
      const arr = item.number.split('.');
      arr[arr.length - 1] = parseInt(arr[arr.length - 1]) - 1;
      item.number = arr.join('.');
      let alpha = arr[1];
      if (item.children) {
        this.renameDeleteAttachmentChildLevelSteps(item, true, alpha);
      }
    } else if (item['childSequenceType'] == SequenceTypes.ROMAN || item['childSequenceType'] == SequenceTypes.CAPITALROMAN) {
      if (item.romanNumber?.endsWidth('.')) {
        const arr = item.romanNumber.split('.');
        arr[arr.length - 2] = parseInt(arr[arr.length - 2]) + 1;
        let newNumber = arr.join('.');
        item['romanNumber'] = newNumber;
        item.number = this.convertNumberToRoman(newNumber)
      } else {
        let newNumber = Number(item.romanNumber) - 1;
        item['romanNumber'] = newNumber;
        item.number = this.convertNumberToRoman(newNumber);
      }
      if (item['childSequenceType'] == SequenceTypes.ROMAN) {
        item.number = item.number.toLowerCase();
      }

    } else {
      item = this.setChildSequenceInfo(item);
    }
  }
  increaseNumber(item: any) {
    if (item['childSequenceType'] == SequenceTypes.DGSEQUENCES) {
      const arr = item.number.split('.');
      arr[arr.length - 1] = parseInt(arr[arr.length - 1]) + 1;
      item.number = arr.join('.');
    } else if (item['childSequenceType'] == SequenceTypes.ALPHABETICAL || item['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
      const arr = item.number.split('.');
      arr[arr.length - 2] = this.lowerAlph[this.lowerAlph.indexOf(arr[arr.length - 2]) + 1];
      item.number = arr.join('.');
      if (item['childSequenceType'] == SequenceTypes.CAPITALALPHABETICAL) {
        item.number = item.number.toUpperCase();
      }
    } else if (item['childSequenceType'] == SequenceTypes.NUMERIC || item['childSequenceType'] == SequenceTypes.Attachment) {
      let strinNumber = JSON.parse(JSON.stringify(item.number));
      const arr = item.number.split('.');
      arr[arr.length - 2] = parseInt(arr[arr.length - 2]) + 1;
      item.number = arr.join('.');
      if (item.number.includes('NaN')) {
        item.number = strinNumber.toString();
        let arr = item.number.split('.');
        let count = arr.length - 1;
        arr[arr.length - count] = parseInt(arr[arr.length - count]) + 1;
        item.number = arr.join('.');
      }
    } else if (item['childSequenceType'] == SequenceTypes.ROMAN || item['childSequenceType'] == SequenceTypes.CAPITALROMAN) {

      if (item.romanNumber.endsWidth('.')) {
        const arr = item.romanNumber.split('.');
        arr[arr.length - 2] = parseInt(arr[arr.length - 2]) + 1;
        let newNumber = arr.join('.');
        item['romanNumber'] = newNumber;
        item.number = this.convertNumberToRoman(newNumber);
      } else {
        let newNumber = Number(item.romanNumber) + 1;
        item.number = this.convertNumberToRoman(newNumber);
      }
      if (item['childSequenceType'] == SequenceTypes.ROMAN) {
        item.number = item.number.toLowerCase();
      }
    } else {
      item = this.setChildSequenceInfo(item);
    }
  }
  getRomanNumber(item: any, position?: any) {
    let roman = item['romanNumber'] ? 'romanNumber' : 'number'
    const arr = item[roman].split('.');
    arr[arr.length - 2] = parseInt(arr[arr.length - 2]) + 1;
    item['romanNumber'] = arr.join('.');
    return item['romanNumber']
  }

  setChildSequenceInfo(item: any) {
    if (item['childSequenceType'] == SequenceTypes.BULLETS) {
      item.number = '&#9679';
    } else if (item['childSequenceType'] == SequenceTypes.STAR) {
      item.number = '&#10038';
    } else if (item['childSequenceType'] == SequenceTypes.CIRCLE) {
      item.number = '&#9675';
    } else if (item['childSequenceType'] == SequenceTypes.ARROW) {
      item.number = '&#10148';
    } else if (item['childSequenceType'] == SequenceTypes.CHECKMARK) {
      item.number = '&#10003';
    } else if (item['childSequenceType'] == SequenceTypes.SQUARE) {
      item.number = '&#9726';
    }
    return item;
  }

  setEmbededData(data: any, parent: any, maxUniqueId: any, type: any, changeDgUniqueID = true, procedureIndex = 0) {
    if (changeDgUniqueID) {
      this.maxDgUniqueId = maxUniqueId;
    }
    if (!data?.property) {
      data['property'] = {};
    }
    data.forEach((item: any) => this.setEmbededNodes(item, parent.number, changeDgUniqueID, type, parent?.dgUniqueID?.toString(), procedureIndex, parent));
  }

  setEmbededNodes(data: any, parentID: any = null, changeDgUniqueID = true, procedureType: any, parentDgUniqueID: any, procedureIndex = 1, selectedElement: any) {
    if (data.number) {
      if (data.dgType === DgTypes.TextDataEntry) {
        if (data.choice) {
          data['dataType'] = data.choice.length > 0 ? 'Dropdown' : 'Text';
        }
      }
      if (parentID) {
        let parentNumber = parentID.indexOf('.0') > -1 ? parentID.split('.')[0] : parentID;
        const text = data.dgType === DgTypes.StepAction ? data.action : data.title;
        if (data.originalSequenceType == SequenceTypes.DGSEQUENCES) {
          data.number = parentNumber + '.' + (data.number.indexOf('.0') > -1 ? data.number.split('.')[0] : data.number.slice(data.number.lastIndexOf('.') + 1, data.number.length));
        }
        data.dgSequenceNumber = parentNumber + '.' + (data.number.indexOf('.0') > -1 ? data.number.split('.')[0] : data.number.slice(data.number.lastIndexOf('.') + 1, data.number.length));
        if (text) {
          data['text'] = data.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
        } else {
          data['text'] = data.number;
        }
        data['state'] = { hidden: false };
        data['parentID'] = parentID;
      }
      if (!data?.property) {
        data['property'] = {};
      }
      if (selectedElement?.protectDynamic || selectedElement.dynamic_section) {
        data['protectDynamic'] = true;
        data['dynamic_section'] = false;
      }
      data['property']['type'] = procedureType;
      if (changeDgUniqueID) {
        data['dgUniqueID'] = 'p_' + procedureIndex + '_' + data['dgUniqueID'];
        data['id'] = data['dgUniqueID'];
        data['parentDgUniqueID'] = parentDgUniqueID;
      } else {
        data['id'] = data['dgUniqueID'];
      }
      if (changeDgUniqueID) {
        let prefixOfdgUniqueId = this.extractPrefixBeforeLastNumber(data?.dgUniqueID)
        if (data?.rule?.length > 0) {
          data.rule.forEach((item: any) => {
            let rule = this.replaceAmpersandValues(item.ParsedValue, `&${prefixOfdgUniqueId}`);
            item.ParsedValue = rule.replace(/goto\s*{([^}]+)}/g, `goto {${prefixOfdgUniqueId}$1}`);
          });
          data = this.setIconAndText(data);
        }
        if (data?.applicabilityRule?.length > 0) {
          data.applicabilityRule.forEach((item: any) => {
            item.ParsedValue = this.replaceAmpersandValues(item.ParsedValue, `&${prefixOfdgUniqueId}`);
          });
          data = this.setIconAndText(data);
        }
        if (data?.repeatRules?.length > 0) {
          data.repeatRules.forEach((item: any) => {
            item.ParsedValue = this.replaceAmpersandValues(item.ParsedValue, `&${prefixOfdgUniqueId}`);
          });
          data = this.setIconAndText(data);
        }
        if (data?.tableRules?.length > 0) {
          data.tableRules = [];
        }
      }

      if (data.children && Array.isArray(data.children)) {
        data.children.forEach((item: any) => this.setEmbededNodes(item, data.dgSequenceNumber, changeDgUniqueID, procedureType, data['dgUniqueID'], procedureIndex, selectedElement));
      }
    } else {
      if (changeDgUniqueID) {
        data['parentID'] = parentID;
        data['dgUniqueID'] = 'p_' + procedureIndex + '_' + data['dgUniqueID'];
        data['id'] = data['dgUniqueID'];
        data['parentDgUniqueID'] = parentDgUniqueID;
        if ('parentTableDgUniqueID' in data) {
          data['parentTableDgUniqueID'] = parentDgUniqueID;
        }
      } else {
        data['id'] = data['dgUniqueID'];
      }
      if (this.isDataEntry(data) && changeDgUniqueID) {
        let prefixOfdgUniqueId = this.extractPrefixBeforeLastNumber(data?.dgUniqueID)
        if (data?.alarm?.length > 0) {
          data.alarm.forEach((item: any) => {
            item.ParsedValue = this.replaceAmpersandValues(item.ParsedValue, `&${prefixOfdgUniqueId}`);
          })
        }
        if ((data?.dgType == DgTypes.NumericDataEntry || data?.dgType == DgTypes.TextDataEntry) && data.valueType == 'Derived') {
          data.ParsedValue = this.replaceAmpersandValues(data.ParsedValue, `&${prefixOfdgUniqueId}`);
        }
      }
      if (data?.dgType === DgTypes.Form) {
        if (data?.tableRules?.length > 0) {
          data.tableRules = [];
        }
        let castable: any = data.calstable[0].table.tgroup.tbody[0].row;// for table body
        this.updateIds(castable, data.dgUniqueID, parentID, changeDgUniqueID, procedureIndex);
        let castableHead: any = data.calstable[0].table.tgroup.thead;
        this.updateIds(castableHead, data.dgUniqueID, parentID, changeDgUniqueID, procedureIndex);// for table head 
      }
      data['state'] = { hidden: true };
    }
    data['isEmbededObject'] = true;
  }
  updateIds(obj: any, parentDgId: string | null = null, parentId: string | null = null, changeDgUniqueID: any, procedureIndex: any = null) {
    if (obj?.dgUniqueID && changeDgUniqueID) {
      // obj.dgUniqueID = ++this.maxDgUniqueId;
      obj['dgUniqueID'] = 'p_' + procedureIndex + '_' + obj['dgUniqueID'];
    }
    if (procedureIndex != null && changeDgUniqueID) {
      if (obj?.alarm?.length > 0) {
        let prefixOfdgUniqueId = this.extractPrefixBeforeLastNumber(obj?.dgUniqueID)
        obj.alarm.forEach((item: any) => {
          item.ParsedValue = this.replaceAmpersandValues(item.ParsedValue, `&${prefixOfdgUniqueId}`);
        })
      }
      if ((obj?.dgType == DgTypes.NumericDataEntry || obj?.dgType == DgTypes.TextDataEntry) && obj.valueType == 'Derived') {
        let prefixOfdgUniqueId = this.extractPrefixBeforeLastNumber(obj?.dgUniqueID)
        obj.ParsedValue = this.replaceAmpersandValues(obj.ParsedValue, `&${prefixOfdgUniqueId}`);
      }
    }
    if (obj?.dgType === DgTypes.Form) {
      if (obj?.tableRules?.length > 0) {
        obj.tableRules = [];
      }
    }
    if (obj?.dgType) {
      obj['parentDgUniqueID'] = parentDgId;
    }

    if (obj?.entry) {
      obj.entry.forEach((child: any) => this.updateIds(child, parentDgId, parentId, changeDgUniqueID, procedureIndex));
    }
    if (obj?.children) {
      obj.children.forEach((child: any) => this.updateIds(child, parentDgId, parentId, changeDgUniqueID, procedureIndex));
    }
    if (obj && Array.isArray(obj)) {
      obj.forEach((column: any) => {
        this.updateIds(column, parentDgId, parentId, changeDgUniqueID, procedureIndex);
      });
    }
  }


  formatForSave(sections: any, type: string, maxDgUniqueId: number, isDownload = false) {
    this.maxDgUniqueId = maxDgUniqueId;
    try {
      this.dupUniqueIDs = [];
      let json = JSON.parse(JSON.stringify(sections));
      if (type === 'build')
        json.forEach((item: any) => this.removeUnwantedVariables(item, isDownload));
      json.forEach((item: any, index: any) => this.setLevel([item, index]));
      return json;
    } catch (error) {
      console.error(error)
    }
  }
  formatforRead(sections: any) {
    let arr = findAnd.returnFound(sections, { dgType: DgTypes.StepInfo });
    arr.forEach((item: any) => item.text = item.title);
    return sections;
  }

  removeUnwantedVariables(data: any, isDownload: boolean = false) {
    // delete data['parentID'];
    delete data['id'];
    // delete data['state'];
    // delete data['isEmbededObject'];
    delete data['ctrlKey'];
    delete data['editorOpened'];
    if ('internalRevision' in data && isDownload) {
      data['internalRevision'] = '';
    }
    //  delete data['level'];
    data.dgUniqueID = String(data.dgUniqueID);
    if (data.number) {

      delete data['text'];

      if (data.children && Array.isArray(data.children)) {
        data.children.forEach((item: any) => this.removeUnwantedVariables(item, isDownload));
      }
      if (data.embeddedSection) {
        data.dyTpe = DgTypes.Section;
        // data.embeddedSection.section = JSON.parse(JSON.stringify(data.children));
        // data.children = [];
      }
    } else {
      if (data.dgType === DgTypes.TextAreaDataEntry) {
        //data.dgType = DgTypes.TextDataEntry;
      }
      if (data.dgType === DgTypes.Figures) {
        data.images.forEach((item: any) => { if (item['baseUrl']) { delete item['baseUrl']; } });
      }
      if (data.dgType === DgTypes.Form) {
        this.setDgUniqueIdsForTable(data, isDownload);
      }
    }
  }
  setDgUniqueIdsForTable(data: any, isDownload: boolean = false) {
    try {
      if ('internalRevision' in data && isDownload) {
        data['internalRevision'] = '';
      }
      data?.calstable[0]?.table?.tgroup?.thead?.forEach((th: any) => {
        if (!th['dgUniqueID']) {
          th['dgUniqueID'] = this.getUniqueIdIndex();
        }
      });
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        if (!tr['dgUniqueID']) {
          tr['previousRowDgUniqueID'] = i > 0 ? data?.calstable[0]?.table?.tgroup?.tbody[0]?.row[i - 1]?.['dgUniqueID'] : undefined;
          tr['dgUniqueID'] = this.getUniqueIdIndex();
          // this.uniqueIdIndex = this.getUniqueIdIndex();
          tr.entry?.forEach((entry: any) => {
            if (!entry['dgUniqueID']) {
              entry['dgUniqueID'] = this.getUniqueIdIndex();
              // this.uniqueIdIndex = this.getUniqueIdIndex();
            }
            if (entry.children && entry.children.length > 0) {
              entry.children.forEach((child: any) => {
                if ('internalRevision' in child && isDownload) {
                  child['internalRevision'] = '';
                }
                if (child.dgType === DgTypes.Form) {
                  this.setDgUniqueIdsForTable(child, isDownload);
                }
              });
            }
          });
          if (tr['internalRevision'] == 0 || tr['internalRevision'] && isDownload) {
            tr['internalRevision'] = '';
          }
        } else {
          tr.entry?.forEach((entry: any) => {
            if (entry?.children && entry?.children?.length > 0) {
              entry.children.forEach((child: any) => {
                if ('internalRevision' in child && isDownload) {
                  child['internalRevision'] = '';
                }
                if (child.dgType == DgTypes.Figures) {
                  child.images.forEach((image: any) => {
                    if (image['internalRevision']) {
                      image['internalRevision'] = ''
                    }
                  });
                }
                if (child.dgType === DgTypes.Form) {
                  this.setDgUniqueIdsForTable(child, isDownload);
                }
              });
            }
          });
          if ((tr['internalRevision'] == 0 || tr['internalRevision']) && isDownload) {
            tr['internalRevision'] = '';
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
  clearInternalVersionForTable(data: any, isDownload: boolean) {
    try {
      if ('internalRevision' in data && isDownload) {
        data['internalRevision'] = '';
      }
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        tr.entry?.forEach((entry: any) => {
          if (entry.children && entry.children.length > 0) {
            entry.children.forEach((child: any) => {
              if ('internalRevision' in child && isDownload) {
                child['internalRevision'] = '';
              }
              if (child.dgType == DgTypes.Figures) {
                child.images.forEach((image: any) => {
                  if (image['internalRevision']) {
                    image['internalRevision'] = ''
                  }
                });
              }
              if (child.dgType === DgTypes.Form) {
                this.clearInternalVersionForTable(child, isDownload);
              }
            });
          }
        });
        if ((tr['internalRevision'] == 0 || tr['internalRevision']) && isDownload) {
          tr['internalRevision'] = '';
        }
      });
      return data;
    } catch (error) {
      console.log(error)
    }
  }
  //CUSTOM ITERATORS
  returnFoundConditional(source: any, predicate: any) {
    if (source === undefined) {
      return undefined;
    } else {
      return source;
    }
  }

  isEmpty(object: any): boolean {
    return this.isObject(object) && Object.keys(object).length === 0;
  }
  isObject(object: any): boolean {
    return !!object && Object.prototype.toString.call(object) === '[object Object]';
  }
  unNumberedSteps(selectedElement: any, section: any) {
    if (Array.isArray(selectedElement.children)) {
      this.setSequenceType(selectedElement, SequenceTypes.BULLETS);
      selectedElement.children.forEach((element: any) => {
        this.renameNumberAsOthers(element, SequenceTypes.BULLETS);
      });
    }
    //this.reArrangeSubSequentnumbers(selectedElement, section);

  }
  reArrangeSubSequentnumbers(selectedElement: any, section: any) {
    if (selectedElement.dgSequenceNumber) {
      if (selectedElement.parentID) {
        const parent = findAnd.returnFound(section, { dgSequenceNumber: selectedElement.parentID });
        if (parent) {
          const index = parent.children.findIndex((i: any) => i.dgSequenceNumber = selectedElement.dgSequenceNumber);
          this.renameCurrentLevelSteps(parent.children, index + 1, -1, true, false);
        } else {
          console.error('Element not found');
        }
      } else {
        const index = section.findIndex((i: any) => i.dgSequenceNumber = selectedElement.dgSequenceNumber);
        this.renameMasterSteps(section, index + 1, selectedElement, -1, true, false);
      }
    }
  }

  // convert number to other special chars
  renameNumberAsOthers(selectedElement: any, type: SequenceTypes) {
    if (selectedElement.number) {
      selectedElement = this.setUserUpdateInfo(selectedElement);
      selectedElement['state'] = { hidden: true }
      if (type === SequenceTypes.BULLETS) {
        selectedElement.number = "&#9679";
      }
      if (type === SequenceTypes.STAR) {
        selectedElement.number = "&#10038";
      }
      if (type === SequenceTypes.CIRCLE) {
        selectedElement.number = "&#9675";
      }
      if (type === SequenceTypes.SQUARE) {
        selectedElement.number = "&#9726";
      }
      if (type === SequenceTypes.CHECKMARK) {
        selectedElement.number = "&#10003";
      }
      if (type === SequenceTypes.ARROW) {
        selectedElement.number = "&#10148";
      }

      this.setSequenceType(selectedElement, type);
      selectedElement = this.setIconAndText(selectedElement);
      if (selectedElement.dgType === DgTypes.DualAction) {
        selectedElement.rightDualChildren.forEach((element: any) => {
          this.renameNumberAsOthers(element, type);
        });
        selectedElement.children.forEach((element: any) => {
          this.renameNumberAsOthers(element, type);
        });
      }
      if (Array.isArray(selectedElement.children)) {
        selectedElement.children.forEach((element: any) => {
          this.renameNumberAsOthers(element, type);
        });
      }
    }
  }

  // re use method for convert others to number
  renameOthersASNumbers(selectedElement: any) {
    if (selectedElement.number) {
      selectedElement = this.setUserUpdateInfo(selectedElement);
      if (selectedElement.aType === 'Attachment') {
        selectedElement.number = selectedElement.duplicateValue;
      }
      else {
        selectedElement.number = selectedElement.dgSequenceNumber;
      }
      if (selectedElement.dgType === DgTypes.DualAction) {
        selectedElement.rightDualChildren.forEach((element: any) => {
          this.renameOthersASNumbers(element);
        });
        selectedElement.children.forEach((element: any) => {
          this.renameOthersASNumbers(element);
        });
      }
      this.setSequenceType(selectedElement, SequenceTypes.DGSEQUENCES);
      selectedElement = this.setIndexDisplayState(selectedElement);
      if (Array.isArray(selectedElement.children)) {
        selectedElement.children.forEach((element: any) => {
          this.renameOthersASNumbers(element);
        });
      }
    }
  }
  // number steps
  numberedSteps(selectedElement: any, section: any) {
    if (Array.isArray(selectedElement.children)) {
      this.setSequenceType(selectedElement, SequenceTypes.DGSEQUENCES);
      selectedElement.children.forEach((element: any) => {
        this.renameOthersASNumbers(element);
      });
    }
    //this.reArrangeSubSequentnumbers(selectedElement, section);
  }

  // other Special steps
  otherSteps(selectedElement: any, section: any, sepcilaType: any) {
    if (selectedElement) {
      if (Array.isArray(selectedElement.children)) {
        this.setSequenceType(selectedElement, sepcilaType);
        selectedElement.children.forEach((element: any) => {
          this.renameNumberAsOthers(element, sepcilaType);
        });
      }
    }
  }

  alphabeticList(selectedElement: any, sequenceType: SequenceTypes) {
    if (selectedElement) {
      if (Array.isArray(selectedElement.children)) {
        this.setSequenceType(selectedElement, sequenceType);
        selectedElement = this.validateListType(selectedElement, sequenceType);
        if (sequenceType == SequenceTypes.ROMAN || sequenceType === SequenceTypes.CAPITALROMAN) {
          selectedElement = this.setRomanSequence(selectedElement, sequenceType);
        }
        let count = (sequenceType == SequenceTypes.ROMAN || sequenceType === SequenceTypes.CAPITALROMAN) ? 1 : 0;
        selectedElement.children.forEach((element: any) => {
          if (element.number) {
            element = this.setUserUpdateInfo(element);
            if (element.dgType === DgTypes.DualAction) {
              // this.setIndexDisplayState(element);
              element['state'] = { hidden: true };
              if (Array.isArray(element.rightDualChildren)) {
                element.rightDualChildren.forEach((item: any) => {
                  item['state'] = { hidden: true };
                  this.renameNumberAsAlphabets(item, count, '', sequenceType);
                });
              }
              if (Array.isArray(element.children)) {
                element.children.forEach((item: any) => {
                  item['state'] = { hidden: true };
                  this.renameNumberAsAlphabets(item, count, '', sequenceType);
                });
              }
            } else {
              this.renameNumberAsAlphabets(element, count, '', sequenceType);
            }
            count = count + 1;
          }
        });
      }
    }
  }

  renameNumberAsAlphabets(element: any, position = 0, parent = '', sequenceType: SequenceTypes) {
    element = this.setUserUpdateInfo(element);
    if (sequenceType !== SequenceTypes.ROMAN && sequenceType !== SequenceTypes.CAPITALROMAN) {
      if (position < 26) {
        element.number = parent ? parent + '.' + this.lowerAlph[position] : this.lowerAlph[position];
      } else {
        let reminder = Math.trunc(position % 25) - 1;
        let fraction = Math.trunc(position / 25) - 1;
        element.number = parent ? parent + '.' + this.lowerAlph[fraction] + this.lowerAlph[reminder]
          : this.lowerAlph[fraction] + this.lowerAlph[reminder];
      }
      if (sequenceType === SequenceTypes.CAPITALALPHABETICAL) {
        element.number = element.number.toUpperCase();
      }
      this.setSequenceType(element, sequenceType);
    } else {
      let number = this.convertNumberToRoman(position);
      element.number = parent ? parent + '.' + number : number;
      // element['romanNumber'] = parent ? parent + '.' + position : position;
      element['romanNumber'] = parent ? parent + '.' + number : number;
      element = this.setRomanSequence(element, sequenceType);
      element.number = sequenceType == SequenceTypes.ROMAN ? element.number.toLowerCase() : element.number.toUpperCase();
      element['romanNumber'] = element['romanNumber'] + '.';
    }

    element = this.setIndexDisplayState(element);
    if (element.dgType === DgTypes.DualAction) {
      this.isItDualStep(element, position, sequenceType);
    }
    if (Array.isArray(element.children)) {
      let count = (sequenceType == SequenceTypes.ROMAN || sequenceType === SequenceTypes.CAPITALROMAN) ? 1 : 0;
      element.children.forEach((item: any) => {
        if (item.number) {
          if (item.numberedChildren) {
            item.numberedChildren = false;
          }
          this.renameNumberAsAlphabets(item, count++, element.number, sequenceType);
        }
      });
    }
    element.number = element.number + '.';
    if (sequenceType === SequenceTypes.CAPITALALPHABETICAL) {
      element.number = element.number.toUpperCase();
    }
  }

  setRomanSequence(element: any, sequenceType: SequenceTypes) {
    element['stepSequenceType'] = sequenceType;
    element['childSequenceType'] = sequenceType;
    element['originalSequenceType'] = sequenceType;
    return element;
  }

  isItDualStep(element: any, count: any, sequenceType: SequenceTypes) {
    if (Array.isArray(element.rightDualChildren)) {
      element.rightDualChildren.forEach((dual: any) => {
        this.renameNumberAsAlphabets(dual, count++, element.number, sequenceType);
      });
    }
    if (Array.isArray(element.children)) {
      element.children.forEach((dual: any) => {
        this.renameNumberAsAlphabets(dual, count++, element.number, sequenceType);
      });
    }
  }
  validateListType(selectedElement: any, type: any) {
    let valueInclude = ['isNumeric', 'isAlpha', 'isCapAlpha', 'isRoman', 'isCapRoman'];
    valueInclude.forEach((item: any) => {
      if (item in selectedElement) {
        delete selectedElement[item];
      }
    })
    if (type == 'NUMERIC') {
      selectedElement['isNumeric'] = true;
    } else if (type == 'ALPHABETICAL') {
      selectedElement['isAlpha'] = true;
    } else if (type == 'CAPITALALPHABETICAL') {
      selectedElement['isCapAlpha'] = true;
    } else if (type == 'CAPITALROMAN') {
      selectedElement['isCapRoman'] = true;
    } else if (type == 'ROMAN') {
      selectedElement['isRoman'] = true;
    }
    return selectedElement;
  }
  numberedList(selectedElement: any, section: any) {
    if (selectedElement) {
      if (Array.isArray(selectedElement.children)) {
        this.setSequenceType(selectedElement, SequenceTypes.NUMERIC);
        selectedElement = this.validateListType(selectedElement, SequenceTypes.NUMERIC);
        let count = 1;
        selectedElement.children.forEach((element: any) => {
          if (element.number) {
            if (element.dgType === DgTypes.DualAction) {
              // this.setIndexDisplayState(element);
              element['state'] = { hidden: true };
              if (Array.isArray(element.rightDualChildren)) {
                element.rightDualChildren.forEach((item: any) => {
                  if (item.number) {
                    item['state'] = { hidden: true };
                    this.renameNumberdSequence(item, true, count);
                  }
                });
              }
              if (Array.isArray(element.children)) {
                element.children.forEach((item: any) => {
                  if (item.number) {
                    item['state'] = { hidden: true };
                    this.renameNumberdSequence(item, true, count);
                  }
                });
              }
            } else {
              this.renameNumberdSequence(element, true, count);
            }
            count = count + 1;
          }
        });
      }
    }
  }

  renameNumberdSequence(element: any, firstLevel = false, position = 0, parent = '') {
    if (!element?.dualStep) {
      element.number = parent ? parent + '.' + position : position;
      // const text = element.dgType === DgTypes.StepAction ? element.action : element.title;
      let text = element.action !== undefined ? element.action : element.title;
      if (text === undefined) { text = ''; }
      element.text = element.number + '. ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
    } else {
      element.number = parent ? parent + '.' + position : position;
      let text = element.action !== undefined ? element.action : element.title;
      if (text === undefined) { text = ''; }
      element.text = element.number + '. ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
    }
    if (element.dgType === DgTypes.DualAction) {
      if (Array.isArray(element.rightDualChildren)) {
        element.rightDualChildren.forEach((item: any) => {
          this.renameNumberdSequence(item, true, position);
        });
      }
      if (Array.isArray(element.children)) {
        element.children.forEach((item: any) => {
          this.renameNumberdSequence(item, true, position);
        });
      }
    }
    if (Array.isArray(element.children)) {
      let count = 1;
      element.children.forEach((item: any) => {
        if (item.number) {
          this.renameNumberdSequence(item, false, count++, element.number);
        }
      });
    }
    element.number = element.number + '.';
    this.setSequenceType(element, SequenceTypes.NUMERIC);
    element = this.setIndexDisplayState(element);
  }
  indentLeft(ctrlSelectedItems: any, section: any) {
    for (let index = 0; index < ctrlSelectedItems.length; index++) {

      if (!ctrlSelectedItems[index].parentID) {
        throw new Error(' Left indent can\'t  perform on Master Sections ');
      } else {
        // let parent = this.getElementByNumber(ctrlSelectedItems[index].parentID, section);
        // let parent = this.getElementByDgUniqueID(ctrlSelectedItems[index].parentDgUniqueID, section);
        if (ctrlSelectedItems[index].parentID.indexOf('.0') > -1 && ctrlSelectedItems[index]?.dgType != DgTypes.Section) {
          throw new Error(`Left indent can\'t  perform on ${ctrlSelectedItems[index]?.dgType} in leve 1`);
        }
        let parent: any;
        if (ctrlSelectedItems[index]?.aType && ctrlSelectedItems[index]?.aType == "Attachment") {
          parent = this.getElementByDgUniqueID(ctrlSelectedItems[index].parentDgUniqueID, section);
        } else {
          parent = this.getElementByNumber(ctrlSelectedItems[index].parentID, section);
        }
        if (ctrlSelectedItems[index].dgType == DgTypes.StepInfo && parent && parent?.children?.length > 0) {
          let currentIndex = parent?.children?.findIndex((child: any) => child?.dgUniqueID == ctrlSelectedItems[index]?.dgUniqueID);
          if (currentIndex != -1) {
            if (currentIndex != parent?.children?.length - 1) {
              throw new Error(' Left indentation cannot be performed on this StepInfo. Indentation is only allowed when the step is the last child of its parent.');
            }
          }
        }
        if (parent) {
          if (parent.dataType && parent.dataType == "Attachment") {
            throw new Error(' Left indent can\'t  perform ');
          }
        } else {
          throw new Error(' Left indent can\'t  perform on Master Sections ');
        }
      }
    }
    let parentIndex;
    for (let index = 0; index < ctrlSelectedItems.length; index++) {
      if (ctrlSelectedItems[index].parentID.indexOf('.0') > -1) {
        if (ctrlSelectedItems[index].dgType != DgTypes.StepAction && ctrlSelectedItems[index].dgType != DgTypes.Section && ctrlSelectedItems[index].dgType != DgTypes.StepInfo) {
          throw new Error(' Left indent can\'t  perform on ' + ctrlSelectedItems[index].dgType);
        }
        if (ctrlSelectedItems[index].dgType == DgTypes.StepAction) {
          if (ctrlSelectedItems[index]['children'] && ctrlSelectedItems[index]['children'].length > 0) {
            if (ctrlSelectedItems[index]['children'].filter((i: any) => !i.number && i.isDataEntry).length > 0) {
              throw new Error('Invalid Action: Step with Data Entry cannot be converted to Section');
            }
          }
          ctrlSelectedItems[index]['title'] = ctrlSelectedItems[index].action;
        }
        if (ctrlSelectedItems[index].dgType == DgTypes.StepInfo) {
          if (ctrlSelectedItems.length > 1) {
            if (!ctrlSelectedItems[index]['children']) { ctrlSelectedItems[index]['children'] = [] }
            ctrlSelectedItems[index]['children'] = [...ctrlSelectedItems[index]['para'], ...ctrlSelectedItems[index]['children']];
            // ctrlSelectedItems[index]['para'].forEach(para => ctrlSelectedItems[index]['children'].push(para))
          }
        }
        ctrlSelectedItems[index].dgType = DgTypes.Section;
      }
      this.assignAsChilds(ctrlSelectedItems[index], section);
      // for (let index = ctrlSelectedItems.length - 1; index >= 0; index--) {
      //   section = this.deleteStep(ctrlSelectedItems[index], section);
      // }

      section = this.indentLeftSubSteps(JSON.parse(JSON.stringify(ctrlSelectedItems[index])), section, parentIndex);
    }
    return section;
  }
  assignAsChilds(item: any, section: any) {
    // let parent = this.getElementByNumber(item.parentID, section);
    // let parent = this.getElementByDgUniqueID(item.parentDgUniqueID, section);
    let parent: any;
    if (item?.aType && item?.aType == "Attachment") {
      parent = this.getElementByDgUniqueID(item.parentDgUniqueID, section);
    } else {
      parent = this.getElementByNumber(item.parentID, section);
    }
    if (parent?.length === 2) { parent = item?.leftdualchild ? parent[0] : parent[1]; }
    if (parent) {
      //if (parent['childSequenceType'] !== SequenceTypes.DGSEQUENCES) {
      let position = parent.children.findIndex((i: any) => i.dgSequenceNumber == item.dgSequenceNumber)
      if (!item.children) {
        item.children = [];
      }
      for (let index = position + 1; index < parent.children.length; index++) {
        if (parent.children[index].dgSequenceNumber) {
          item.children.push(JSON.parse(JSON.stringify(parent.children[index])));
        }
      }

      this.renameChildLevelSteps(item, true, true, 0, false, true);
      parent.children = parent.children.filter((d: any, i: any) => (d.dgSequenceNumber && (i < position)) || !d.dgSequenceNumber);
      // for (let index = position + 1; index < parent.children.length; index++) {
      //   this.deleteStep(parent.children[index],section)
      // }
      // }
    }
  }
  indentRight(ctrlSelectedItems: any, section: any) {
    let parentIndex;
    for (let index = 0; index < ctrlSelectedItems.length; index++) {
      if (!ctrlSelectedItems[index].parentID) {
        parentIndex = this.indentRightMasterSteps(JSON.parse(JSON.stringify(ctrlSelectedItems[index])), section, parentIndex);
      } else {
        parentIndex = this.indentRightSubSteps(JSON.parse(JSON.stringify(ctrlSelectedItems[index])), section, parentIndex);
      }
      if (parentIndex == null) {
        return false;
      }
    }
    for (let index = ctrlSelectedItems.length - 1; index >= 0; index--) {
      section = this.deleteStep(ctrlSelectedItems[index], section);
    }
    return section;
  }

  indentRightMasterSteps(element: any, section: any, parentIndex: any) {
    const index = section.findIndex((i: any) => i.dgSequenceNumber == element.dgSequenceNumber)
    if (index > 0) {
      if (parentIndex == undefined || parentIndex == null) {
        parentIndex = index - 1;
      }
      const children = section[parentIndex]?.children?.filter((i: any) => i.dgSequenceNumber);
      let dgSequenceNumber;
      let number;
      if (children?.length > 0) {
        dgSequenceNumber = children[children.length - 1].dgSequenceNumber.slice(0,
          children[children.length - 1].dgSequenceNumber.lastIndexOf('.')) + '.' + (children.length + 1)
      } else {
        dgSequenceNumber = (section[index - 1].dgSequenceNumber.indexOf('.0') > -1) ? (section[index - 1].dgSequenceNumber.slice(
          0, section[index - 1].dgSequenceNumber.lastIndexOf('.')) + '.' + 1) : (section[index - 1].dgSequenceNumber + '.' + 1)
      }
      const numberedChildren = section[parentIndex]?.children?.filter((i: any) => i.number && i.number != '.');
      if (numberedChildren?.length > 0) {
        number = numberedChildren[numberedChildren.length - 1].number.slice(0,
          numberedChildren[numberedChildren.length - 1].number.lastIndexOf('.')) + '.' + (numberedChildren.length + 1)
      } else {
        number = (section[index - 1].number.indexOf('.0') > -1) ? (section[index - 1].number.slice(
          0, section[index - 1].number.lastIndexOf('.')) + '.' + 1) : (section[index - 1].number + '.' + 1);
      }

      element.dgSequenceNumber = dgSequenceNumber;
      element.number = this.getNumberForChild(section[parentIndex]);
      element.level = 1;
      element = this.setUserUpdateInfo(element);
      element = this.setIndexDisplayState(element);
      element.parentID = section[parentIndex].dgSequenceNumber;
      element.parentDgUniqueID = section[parentIndex].dgUniqueID;
      element['originalSequenceType'] = section[parentIndex]['childSequenceType'];
      element['childSequenceType'] = section[parentIndex]['childSequenceType'];
      this.renameChildLevelSteps(element, true, true);
      section[parentIndex].children.push(element);
      return parentIndex;
    } else {
      return null;
    }
  }
  indentRightSubSteps(element: any, section: any, parentIndex: any) {
    // const parent = findAnd.returnFound(section, { dgSequenceNumber: element.parentID });
    // const parent = findAnd.returnFound(section, { dgUniqueID: element.parentDgUniqueID });
    let parent: any;
    if (element?.aType && element?.aType == "Attachment") {
      parent = findAnd.returnFound(section, { dgUniqueID: element.parentDgUniqueID });
    } else {
      parent = findAnd.returnFound(section, { dgSequenceNumber: element.parentID });
    }
    if (parent) {
      const index = parent?.children?.findIndex((i: any) => i.dgSequenceNumber == element.dgSequenceNumber)

      if (index > 0) {
        if (parentIndex == undefined || parentIndex == null) {
          parentIndex = index - 1;
        }
        if (element['childSequenceType'] !== SequenceTypes.DGSEQUENCES && element['childSequenceType'] !== SequenceTypes.Attachment) {
          if (!element.children || element.children.length == 0) {
            throw new Error('Can\'t perform action')
          }
        }
        this.validateHeirarchyForRightIndent(parent.children[parentIndex], element);
        const children = parent?.children[parentIndex]?.children.filter((i: any) => i.dgSequenceNumber);
        let dgSequenceNumber;
        let number;
        if (children?.length > 0) {
          dgSequenceNumber = children[children.length - 1].dgSequenceNumber.slice(0,
            children[children.length - 1].dgSequenceNumber.lastIndexOf('.')) + '.' + (children.length + 1)
        } else {
          dgSequenceNumber = (parent.children[index - 1].dgSequenceNumber.indexOf('.0') > -1) ?
            (parent.children[index - 1].dgSequenceNumber.slice(0, parent.children[index - 1].dgSequenceNumber.lastIndexOf('.')) + '.' + 1)
            : (parent.children[index - 1].dgSequenceNumber + '.' + 1);
        }
        const numberedChildren = parent?.children[parentIndex]?.children.filter((i: any) => i.number && i.number != '.');
        if (numberedChildren?.length > 0) {
          number = numberedChildren[numberedChildren.length - 1].number.slice(0,
            numberedChildren[numberedChildren.length - 1].number.lastIndexOf('.')) + '.' + (numberedChildren.length + 1)
        } else {
          number = (parent.children[index - 1].number.indexOf('.0') > -1) ? (parent.children[index - 1].number.slice(
            0, parent.children[index - 1].number.lastIndexOf('.')) + '.' + 1) : (parent.children[index - 1].number + '.' + 1);
        }

        element.dgSequenceNumber = dgSequenceNumber;
        element.number = this.getNumberForChild(parent.children[parentIndex]);
        element.parentID = parent.children[parentIndex].dgSequenceNumber;
        element.parentDgUniqueID = parent.children[parentIndex].dgUniqueID;
        element.level = parseInt(parent.children[parentIndex].level) + 1;
        element = this.setUserUpdateInfo(element);
        parent.children[parentIndex].children.push(element)
        if (element['childSequenceType'] !== SequenceTypes.DGSEQUENCES) {
          element.children.filter((i: any) => i.dgSequenceNumber).forEach((item: any) => parent.children[parentIndex].children.push(JSON.parse(JSON.stringify(item))));
          element.children = element.children.filter((i: any) => !i.number)
          this.renameChildLevelSteps(parent.children[parentIndex], true, true);
        }
        // element['childSequenceType'] = parent.children[parentIndex]['childSequenceType'];
        element = this.setIndexDisplayState(element);
        this.renameChildLevelSteps(element, true, true);
        return parentIndex;
      } else {
        return null;
      }
    }
  }
  validateHeirarchy(parent: any, element: any, showError = true) {
    if (parent) {
      if (!element.number) {
        if (element.dgType == DgTypes.Warning || element.dgType == DgTypes.Caution) {
          if (!(parent.dgType === DgTypes.Section || parent.dgType === DgTypes.StepAction)) {
            if (showError) {
              //throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (element.dgType == DgTypes.Para || element.dgType == DgTypes.Note) {
          if (!parent.number) {
            if (showError) {
              // throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (parent.dgType === DgTypes.Section && element.dgType === DgTypes.Table) {
          return true;
        }
        if (parent.dgType === DgTypes.StepAction || parent.dgType === DgTypes.Repeat) {
          return true;
        }
        if (parent.dgType === DgTypes.Form || parent.dgType === DgTypes.Section) {
          return true;
        } else {
          if (showError) {
            //throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
          } else {
            return false;
          }
        }
      }
      if (parent.dgType === DgTypes.Section || parent.dgType === DgTypes.StepAction) {
        return true;
      }
      if (parent.dgType === DgTypes.StepInfo) {
        if (showError) {
          //throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
        } else {
          return false;
        }
      }
      if (parent.dgType === DgTypes.StepAction || parent.dgType === DgTypes.Repeat || parent.dgType === DgTypes.Timed) {
        if (element.dgType === DgTypes.StepAction || element.dgType === DgTypes.StepInfo || element.dgType === DgTypes.Repeat || element.dgType === DgTypes.Timed) {
          return true;
        } else if (element.dgType == DgTypes.TextAreaDataEntry || element.dgType == DgTypes.TextDataEntry ||
          element.dgType == DgTypes.NumericDataEntry || element.dgType == DgTypes.BooleanDataEntry ||
          element.dgType == DgTypes.CheckboxDataEntry || element.dgType == DgTypes.Figures ||
          element.dgType == DgTypes.Table || element.dgType == DgTypes.VerificationDataEntry ||
          element.dgType == DgTypes.Link ||
          element.dgType == DgTypes.FormulaDataEntry || element.dgType == DgTypes.InitialDataEntry ||
          element.dgType == DgTypes.SignatureDataEntry || element.dgType == DgTypes.DateDataEntry ||
          element.dgType == DgTypes.Para || element.dgType == DgTypes.LabelDataEntry) {
          return true;
        }
        else {
          if (showError) {
            //throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
          } else {
            return false;
          }
        }

      }
    }
    return false;
  }
  isDataEntry(element: any) {
    return (element?.dgType == DgTypes.TextAreaDataEntry || element?.dgType == DgTypes.TextDataEntry ||
      element?.dgType == DgTypes.NumericDataEntry || element?.dgType == DgTypes.BooleanDataEntry ||
      element?.dgType == DgTypes.CheckboxDataEntry || element?.dgType == DgTypes.InitialDataEntry ||
      element?.dgType == DgTypes.SignatureDataEntry || element?.dgType == DgTypes.DateDataEntry ||
      element?.dgType == DgTypes.Para || element?.dgType == DgTypes.LabelDataEntry) ? true : false;
  }
  validateHeirarchyForRightIndent(parent: any, element: any, showError = true) {
    if (parent) {
      if (!element.number) {
        if (element.dgType == DgTypes.Warning || element.dgType == DgTypes.Caution || element.dgType == DgTypes.Table
          || element.dgType == DgTypes.Figures || element.dgType == DgTypes.Link) {
          if (!(parent.dgType === DgTypes.Section || parent.dgType === DgTypes.StepAction)) {
            if (showError) {
              throw new Error(parent.dgType + ' can\'t accept ' + element.dgType)
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (element.dgType == DgTypes.Para || element.dgType == DgTypes.Note) {
          if (!parent.number) {
            if (showError) {
              throw new Error(parent.dgType + ' can\'t accept ' + element.dgType)
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (parent.dgType === DgTypes.StepAction) {
          return true;
        } else {
          return false;
        }
      } else if (element['childSequenceType'] == SequenceTypes.Attachment || (element['dataType'] == SequenceTypes.Attachment && element['dgType'] == DgTypes.Section)) {
        if (parent.aType == SequenceTypes.Attachment && element['dgType'] == DgTypes.Section && !element['parentID']) {
          return false;
        }
        else if (parent.aType == SequenceTypes.Attachment) {
          return true;
        } else {
          return false;
        }
      }
      else {
        if (element['childSequenceType'] !== SequenceTypes.DGSEQUENCES) {
          if (!element.children || element.children.length == 0) {
            if (showError) {
              throw new Error(parent.dgType + ' can\'t accept ' + element.dgType);
            } else {
              return false;
            }
          }
        }
      }
      // if (parent.dgType === DgTypes.Section && element.children && element.children.length > 0) {
      //   return true;
      // }
      if (parent.dgType === DgTypes.Section) {
        return true;
      }
      if (parent.dgType === DgTypes.StepInfo) {
        if (showError) {
          throw new Error(parent.dgType + ' can\'t accept ' + element.dgType)
        } else {
          return false;
        }
      }
      if (parent.dgType === DgTypes.StepAction) {
        if (element.dgType === DgTypes.Section || element.dgType === DgTypes.StepInfo ||
          element.dgType === DgTypes.DelayStep || element.dgType === DgTypes.Repeat
          || element.dgType === DgTypes.Timed) {
          if (showError) {
            throw new Error(parent.dgType + ' can\'t accept ' + element.dgType)
          } else {
            return false;
          }
        } else if (element.dgType === DgTypes.StepAction || (element.children && element.children.length > 0)) {
          return true;
        }
      }
    }
    return false;
  }
  validateHeirarchyForLeftIndent(parent: any, element: any, showError = true) {
    if (element.dgType === DgTypes.DelayStep || element.dgType === DgTypes.Timed || element.dgType === DgTypes.Repeat) {
      if (parent && parent.dgSequenceNumber.indexOf('.0') > -1) {
        return true;
      }
    } else if (element.dgType === DgTypes.StepAction) {
      if (parent && parent.dgSequenceNumber.indexOf('.0') > -1 && element.children && element.children.length > 0) {
        for (let index = 0; index < element.children.length; index++) {
          if (element.children[index].dgType === DgTypes.TextAreaDataEntry
            || element.children[index].dgType === DgTypes.NumericDataEntry
            || element.children[index].dgType === DgTypes.TextDataEntry
            || element.children[index].dgType === DgTypes.VerificationDataEntry
            || element.children[index].dgType === DgTypes.DateDataEntry
            || element.children[index].dgType === DgTypes.BooleanDataEntry
            || element.children[index].dgType === DgTypes.CheckboxDataEntry
            || element.children[index].dgType === DgTypes.Link
            || element.children[index].dgType === DgTypes.Reference
            || element.children[index].dgType === DgTypes.Table
            || element.children[index].dgType === DgTypes.SignatureDataEntry
            || element.children[index].dgType === DgTypes.InitialDataEntry
            || element.children[index].dgType === DgTypes.DropDataEntry
            || element.children[index].dgType === DgTypes.LabelDataEntry
            || element.children[index].dgType === DgTypes.URL
            || element.children[index].dgType === DgTypes.QA
            || element.children[index].dgType === DgTypes.Peer
            || element.children[index].dgType === DgTypes.Independent
            || element.children[index].dgType === DgTypes.Concurrent
            || element.children[index].dgType === DgTypes.Address
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  indentLeftSubSteps(element: any, section: any, parentIndex: any) {
    // let parent = findAnd.returnFound(section, { dgUniqueID: element.parentDgUniqueID });
    let parent: any;
    if (element?.aType && element?.aType == "Attachment") {
      parent = findAnd.returnFound(section, { dgUniqueID: element.parentDgUniqueID });
    } else {
      parent = findAnd.returnFound(section, { dgSequenceNumber: element.parentID });
    }
    if (parent?.length === 2) { parent = element?.leftdualchild ? parent[0] : parent[1]; }
    let superParent;
    if (parent.parentID) {
      // superParent = findAnd.returnFound(section, { dgUniqueID: parent.parentDgUniqueID });
      if (parent?.aType && parent?.aType == "Attachment") {
        superParent = findAnd.returnFound(section, { dgUniqueID: parent.parentDgUniqueID });
      } else {
        superParent = findAnd.returnFound(section, { dgSequenceNumber: parent.parentID });
      }
    } else {
      superParent = { children: section, isRoot: true, sequenceType: SequenceTypes.DGSEQUENCES };
    }
    if (superParent.length === 3) {
      superParent = element?.leftdualchild ? superParent[1] : superParent[2]
    }
    if (superParent) {
      const index = superParent.children.filter((i: any) => i.dgSequenceNumber).findIndex((i: any) => i.dgSequenceNumber == parent.dgSequenceNumber);
      if (index != undefined && index != null) {
        if (parentIndex == undefined || parentIndex == null) {
          const index1 = superParent.children.findIndex((i: any) => i.dgSequenceNumber == parent.dgSequenceNumber);

          parentIndex = index1 + 1;
        }
        let dgSequenceNumber;
        let number;
        if (parent.dgSequenceNumber.indexOf('.0') > -1) {
          dgSequenceNumber = (parseInt(parent.dgSequenceNumber.slice(0, parent.dgSequenceNumber.lastIndexOf('.'))) + 1) + '.0';
        } else {
          dgSequenceNumber = parent.dgSequenceNumber.slice(0, parent.dgSequenceNumber.lastIndexOf('.')) + '.' +
            (parseInt(parent.dgSequenceNumber.slice(parent.dgSequenceNumber.lastIndexOf('.') + 1, parent.dgSequenceNumber.length)) + 1);
        }

        if (parent.number.indexOf('.0') > -1) {
          number = (parseInt(parent.number.slice(0, parent.number.lastIndexOf('.'))) + 1) + '.0';
        } else {
          number = this.getNumberForChild(superParent, index + 1);
        }
        element.dgSequenceNumber = dgSequenceNumber;
        element.number = number;
        element.parentID = superParent.dgSequenceNumber;
        element.parentDgUniqueID = superParent.dgUniqueID;
        element.level = superParent.isRoot ? 0 : (parseInt(superParent.level) + 1);
        element = this.setUserUpdateInfo(element);
        element = this.setIndexDisplayState(element);
        this.buildSequenceType(element);
        this.renameChildLevelSteps(element, true, true, 0, false, true);
        superParent.children = findAnd.insertObjectAfter(superParent.children, { dgSequenceNumber: parent.dgSequenceNumber }, element)
        if (superParent.isRoot) {
          this.renameMasterSteps(superParent.children, parentIndex + 1, element, +1, true, true);
          return superParent.children;
        } else {
          this.renameCurrentLevelSteps(superParent.children, parentIndex + 1, +1, true, true);
          if (element?.dualStep) {
            const parents = this.getElementByDgUniqueID(superParent.dgUniqueID, section);
            parents.children = JSON.parse(JSON.stringify(superParent.children));
            const parent = this.getElementByDgUniqueID(element.parentDgUniqueID, section);
            parent.children = [];
          }
          return section;
        }
      } else {
        return null;
      }
    }
  }

  //Construct Tree structure
  constructTreeJson(sections: any, json: any[] = []) {
    if (Array.isArray(sections)) {
      sections.forEach(section => {
        if (section.dgSequenceNumber) {
          const obj: any = this.buildTreeObj(section);
          if (section.children && section.children.length > 0) {
            obj['children'] = [];
            this.constructTreeJson(section.children, obj['children'])
          }
          json.push(obj);
        }
      });
    }
    return json;
  }
  buildTreeObj(section: any) {
    let text = section.dgType === DgTypes.StepAction ? section.action : section.title;
    if (text) {
      text = section.number + ' ' + text.slice(0, 25) + (text.length > 25 ? '...' : '');
    } else {
      text = section.number + ' '
    }
    return {
      id: section.dgUniqueID,
      children: [],
      state: { hidden: false },
      text: text,
      isEmbededObject: false
    };
  }
  setPaginationIndex(sections: any, pageSize: any = 20, parent: any = null, ref: any = null) {
    if (Array.isArray(sections)) {
      let count = 0;
      let count1 = 0;
      if (sections?.length > 0)
        sections.forEach(item => {
          if (item.dgSequenceNumber) {

            if (item.dgSequenceNumber == '1.0') {
              this.paginateIndex = 1;

            }
            item['position'] = ++count;
            item['paginateIndex'] = this.paginateIndex++;
            item['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;

            item['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);
            if (item.dgType === DgTypes.DualAction) {
              item.rightDualChildren['position'] = ++count;
              item.rightDualChildren['paginateIndex'] = this.paginateIndex++;
              item.rightDualChildren['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;
              item.rightDualChildren['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);
            }
            if (item?.children && Array.isArray(item?.children)) {
              let tables = item.children.filter((i: any) => i.dgType == DgTypes.Table);
              this.increasePaginateIndex(tables, item, ref);
            }
            if (this.paginateIndex >= ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
              this.paginateIndex = ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
            }
            if (Array.isArray(item?.children) && item?.children?.length > 0) {
              this.setPaginationIndex(item.children, pageSize, item, ref);
            }
            if (item.dgType === DgTypes.DualAction) {
              let tables = findAnd.returnFound(item.rightDualChildren, { dgType: DgTypes.Table });

              this.increasePaginateIndex(tables, item.rightDualChildren, ref);
              if (this.paginateIndex > ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
                this.paginateIndex = ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
              }
              if (Array.isArray(item.rightDualChildren) && item?.rightDualChildren?.length > 0) {
                this.setPaginationIndex(item.rightDualChildren);
              }

            }

          }
        });
    }
  }
  setPaginationIndex2(sections: any, pageSize = 20) {
    if (Array.isArray(sections)) {
      let count = 0;
      let count1 = 0;
      sections.forEach(item => {
        if (item.dgSequenceNumber) {
          item['position'] = ++count;
          item['paginateIndex'] = this.paginateIndex++;
          item['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;
          item['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);

          if (item.dgType === DgTypes.DualAction) {
            item.rightDualChildren['position'] = ++count;
            item.rightDualChildren['paginateIndex'] = this.paginateIndex++;
            item.rightDualChildren['page'] = Math.floor(item['paginateIndex'] / pageSize) + 1;
            item.rightDualChildren['isLastChild'] = (count == sections.filter(i => i.dgSequenceNumber).length);
          }
          let tables = item.children.filter((i: any) => i.dgType == DgTypes.Table);
          this.increasePaginateIndex(tables, item, null);
          if (this.paginateIndex > ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
            this.paginateIndex = ((Math.floor(item['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
          }
          if (Array.isArray(item.children)) {
            this.setPaginationIndex(item.children);
          }
          if (item.dgType === DgTypes.DualAction) {

            let tables = findAnd.returnFound(item.rightDualChildren, { dgType: DgTypes.Table });

            this.increasePaginateIndex(tables, item.rightDualChildren, null);
            if (this.paginateIndex > ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize)) {
              this.paginateIndex = ((Math.floor(item.rightDualChildren['paginateIndex'] / pageSize) * pageSize) + pageSize) + 1;
            }
            if (Array.isArray(item.rightDualChildren)) {
              this.setPaginationIndex(item.rightDualChildren);
            }

          }
        } else {
          item['position'] = ++count1;
          item['isLastChild'] = (count1 == sections.filter(i => !i.dgSequenceNumber).length) && (sections.filter(i => i.dgSequenceNumber).length == 0);
        }
      });
    }
  }
  increasePaginateIndex(tables: any, parent: any, parentTable: any) {
    if (Array.isArray(tables)) {
      tables.forEach((obj: any) => {
        if (Array.isArray(obj)) {
          this.increasePaginateIndex(obj, parent, null);
        } else {
          if (obj.rowSize) {
            this.paginateIndex = this.paginateIndex + obj.rowSize;
            let tables1 = findAnd.returnFound(obj.calstable, { dgType: DgTypes.Table });
            if (tables1) {
              this.increasePaginateIndex(tables1, parent, obj);
            }
          }
        }
      })
    } else if (tables) {
      this.increasePaginateIndex([tables], parent, null);
    }
  }
  // increasePaginateIndex(tables: any, parent:any) {
  //   if(  Array.isArray(tables)){
  //     tables.forEach( (obj:any) => {
  //       if(obj.parentID == parent.dgSequenceNumber && obj.rowSize){
  //         this.paginateIndex = this.paginateIndex + obj.rowSize;
  //         let tables1 = findAnd.returnFound(obj.calstable, { dgType: DgTypes.Table });
  //         if( tables1){
  //           this.increasePaginateIndex(tables1,parent);
  //         }
  //       }
  //     })
  //   } else if(tables) {
  //     this.increasePaginateIndex([tables], parent);
  //   }
  // }
  setPaginationIndex1(sections: any, pageSize = 12) {
    if (Array.isArray(sections)) {
      sections.forEach(item => {
        if (item.dgSequenceNumber) {
          item['paginateIndex'] = this.paginateIndex++;
          //    this.currentPaginateIndex = this.paginateIndex;
          //this.lastPage = item['paginateIndex'];

          if (Array.isArray(item.children)) {
            // item.children.forEach( (obj:any) => {
            //   if(obj.dgType == DgTypes.Table){
            //     this.paginateIndex = this.paginateIndex + obj.rowSize;
            //     if(this.paginateIndex > ((this.currentPaginateIndex/pageSize) + pageSize)){
            //       this.paginateIndex = (Math.round(this.currentPaginateIndex/pageSize)) + pageSize;
            //     }
            //   }
            // })
            this.setPaginationIndex(item.children);
          }
        }

      });
    }
  }
  changeChildProps(selectedlement: any, element: any, uniqueIdIndex: any, isNewElement = false, updateUndo = true, isCopyPaste = false) {
    this.uniqueIdIndex = ++uniqueIdIndex;
    if (selectedlement) {
      let parentNumberString: any, number: any, dgSequenceNumberString: any, dgSequenceNumber: any;
      if (selectedlement?.numberedChildren) {
        parentNumberString = selectedlement.number.indexOf('.0') > -1 ? selectedlement.number.slice(0, selectedlement.number.length - 2) : selectedlement.number;
        number = parentNumberString + '.' + (selectedlement.children.filter((i: any) => i.number).length + 1);
      } else if (selectedlement?.number == '.') {
        parentNumberString = '.';
        number = '.'
      } else if (selectedlement?.number.match("[a-z]*\.?")) {
        parentNumberString = selectedlement.number;
        number = selectedlement.number + this.lowerAlph[selectedlement.children.filter((i: any) => i.number).length];
      } else {
        parentNumberString = selectedlement.number;
        number = selectedlement.number + (selectedlement.children.filter((i: any) => i.number).length);
      }
      if (selectedlement?.dgSequenceNumber) {
        dgSequenceNumberString = selectedlement.dgSequenceNumber.indexOf('.0') > -1 ? selectedlement.dgSequenceNumber.slice(0, selectedlement.dgSequenceNumber.length - 2) : selectedlement.dgSequenceNumber;
        dgSequenceNumber = dgSequenceNumberString + '.' + (selectedlement.children.filter((i: any) => i.dgSequenceNumber).length + 1);
      }
      if (selectedlement?.originalSequenceType == SequenceTypes.Attachment) {
        const input = selectedlement.number;
        // const result = input.substring(input.indexOf(" ") + 1);
        const result = input.includes(" ") ? input.substring(0, input.indexOf(" ")) : input;
        number = number.replace(result + " ", '');
      }
      if (selectedlement?.dataType == SequenceTypes.Attachment || selectedlement?.aType == SequenceTypes.Attachment) {
        element['aType'] = SequenceTypes.Attachment;
      }
      let title = '';
      if (element?.dgType === DgTypes.StepInfo || element?.dgType === DgTypes.DelayStep) {
        title = element.title;
      }
      let obj = this.build(JSON.parse(JSON.stringify(element)), number, this.uniqueIdIndex, dgSequenceNumber, selectedlement.dgSequenceNumber);
      if (element?.dgType === DgTypes.StepInfo || element?.dgType === DgTypes.DelayStep) {
        obj.title = title;
      }
      obj.children = this.setNewDgUniqueID(JSON.parse(JSON.stringify(element.children)), updateUndo, isCopyPaste);
      obj['numberedChildren'] = selectedlement.numberedChildren;

      obj['level'] = selectedlement['level'] + 1;
      obj = this.setIndexDisplayState(obj);
      if (obj.dgType !== DgTypes.Table) {
        this.renameChildLevelSteps(obj, true, true, this.getUniqueIdIndex(), true, false, updateUndo, isCopyPaste);
      } else {
        this.renameTableChild(obj);
      }
      obj = this.setUserUpdateInfo(obj);
      return obj;
    } else {
      console.error("Please select element")
    }
  }
  setNewDgUniqueID(arraylist: any, updateUndo = true, isCopyPaste = false) {
    arraylist.forEach((element: any) => {
      let oldId = JSON.parse(JSON.stringify(element?.dgUniqueID));
      element['dgUniqueID'] = this.getUniqueIdIndex();
      let newId = JSON.parse(JSON.stringify(element?.dgUniqueID));
      if (oldId != newId && updateUndo) {
        this.updateDgUniqueID(oldId, newId);
      }
      if (element.dgType === DgTypes.Table) {
        element = this.updateTableEntriesDgUniqueIds(element, isCopyPaste);
        element['dgUniqueID'] = this.getUniqueIdIndex();
      }
      if (element.dgType === DgTypes.FormulaDataEntry && isCopyPaste) {
        element['fieldName'] = element.dgType + (element.dgUniqueID);
      }
    });
    return arraylist;
  }

  renameTableChild(obj: any) {
    // this.getUniqueIdIndex()  // do table work here
    obj = this.setUserUpdateInfo(obj);
    this.updateTableEntriesDgUniqueIds(obj);
    obj['uniqueIndex'] = this.getUniqueIdIndex();
  }
  updateTableEntriesDgUniqueIds(obj: any, isCopyPaste = false) {
    try {
      for (let i = 0; i < obj.calstable.length; i++) {
        if (obj.calstable[i]) {
          const colsObj = obj.calstable[i].table.tgroup.tbody;
          for (let j = 0; j < colsObj.length; j++) {
            if (colsObj[j]) {
              const tableObj = colsObj[j].row;
              for (let k = 0; k < tableObj.length; k++) {
                if (tableObj[k]) {
                  const entryObj = tableObj[k].entry;
                  for (let l = 0; l < entryObj.length; l++) {
                    if (entryObj[l]) {
                      const object = obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children;
                      for (let m = 0; m < object.length; m++) {
                        if (isCopyPaste) {
                          obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m]['fieldName'] = "Column" + object[m]['column'] + (this.getUniqueIdIndex());
                        }
                        let id = obj.dgUniqueID.toString() + k + l + m + (this.getUniqueIdIndex());
                        obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m].dgUniqueID = id;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }
  changePropertiesAsNewElement(obj: any, uniqueIdIndex: any, parentID: any) {
    obj.dgUniqueID = this.getUniqueIdIndex();
    obj = this.setUserUpdateInfo(obj);
    obj['parentID'] = parentID;
    obj['isEmbededObject'] = false;
    if (obj.dgType === DgTypes.Table) {
      this.renameTableChild(obj);
    }
    return obj;
  }
  setIndexDisplayState(obj: any) {
    if (obj?.number && !(Array.isArray(obj?.number)) && obj?.dgSequenceNumber) {
      if (!obj?.number.endsWith('.') && Utills.isNumber(obj?.number.replace(/\./g, ''))) {
        obj['state'] = { hidden: false };
      } else if (obj?.number.endsWith('.') && Utills.isNumber(obj?.number.replace(/\./g, ''))) {
        obj['state'] = { hidden: false };
      }
      else if (obj?.aType === DgTypes.Attachment || obj.dataType === SequenceTypes.Attachment || obj?.childSequenceType === SequenceTypes.Attachment) {
        if (obj?.originalSequenceType == SequenceTypes.BULLETS || obj?.originalSequenceType == SequenceTypes.STAR ||
          obj?.originalSequenceType == SequenceTypes.CIRCLE || obj?.originalSequenceType == SequenceTypes.SQUARE ||
          obj?.originalSequenceType == SequenceTypes.ARROW || obj?.originalSequenceType == SequenceTypes.CHECKMARK
        ) {
          obj['state'] = { hidden: true };
        } else {
          obj['state'] = { hidden: false };
        }
      } else if (obj?.originalSequenceType === SequenceTypes.NUMERIC ||
        obj?.originalSequenceType === SequenceTypes.ALPHABETICAL ||
        obj?.originalSequenceType === SequenceTypes.CAPITALALPHABETICAL
        || obj?.originalSequenceType === SequenceTypes.ROMAN ||
        obj?.originalSequenceType === SequenceTypes.ROMAN ||
        obj?.originalSequenceType === SequenceTypes.CAPITALROMAN
      ) {
        obj['state'] = { hidden: false };
      } else {
        obj['state'] = { hidden: true };
      }
    } else {
      obj['state'] = { hidden: true };
    }
    obj = this.setIconAndText(obj);
    return obj;
  }
  setIconAndText(obj: any) {
    let text = obj?.action !== undefined ? obj.action : obj.title;
    text = this.removeHTMLTags(text);
    const value: number = this.getWindowWidthChanges();
    obj['text'] = obj?.number + ' ' + ((text !== undefined && text !== null) ? text.slice(0, value) + (text.length > value ? '...' : '') : '');
    if (obj.isCritical) {
      obj["text"] = [obj["text"].slice(0, obj.number.length), ' <i class="fa fa-exclamation iscritical"></i>', obj["text"].slice(obj.number.length)].join('');
    }
    if ((obj.applicabilityRule && obj.applicabilityRule.length > 0) || (obj.rule && obj.rule.length > 0)) {
      obj["text"] = [obj["text"].slice(0, obj.number.length), ' <i class="fa fa-cog rule-css"></i>', obj["text"].slice(obj.number.length)].join('');
    }
    if (obj["text"] === undefined || obj["text"] === null) {
      text = obj?.action !== undefined ? obj.action : obj.title;
      text = this.removeHTMLTags(text);
      if (this.isHTMLText(text)) {
        text = text.replace(/<[^>]+>/g, '');
      }
      obj['text'] = obj.number + ' ' + ((text !== undefined && text !== null) ? text.slice(0, 25) + (text.length > 25 ? '...' : '') : '');
    }
    if (this.isNumberDisabled) {
      obj['text'] = obj['text'].slice(obj.number.length);
    }
    return obj;
  }
  getWindowWidthChanges() {
    this.windowWidth = this.windowWidth ?? window.innerWidth;
    if (this.windowWidth > 1130 && this.windowWidth < 1430) { return 25; } //110%
    if (this.windowWidth > 1430 && this.windowWidth < 1700) { return 30; } // 100%
    if (this.windowWidth > 1700 && this.windowWidth < 1800) { return 40; } //90
    if (this.windowWidth > 1800 && this.windowWidth < 2000) { return 45; } //80
    if (this.windowWidth > 2000 && this.windowWidth < 2220) { return 47; } // 75%
    if (this.windowWidth > 2220 && this.windowWidth < 2600) { return 50; } // 67%
    if (this.windowWidth > 2600 && this.windowWidth < 3072) { return 55; } //50% to 
    if (this.windowWidth > 3072 && this.windowWidth < 4700) { return 70; } // 33 to 50 %
    if (this.windowWidth > 4700) { return 70; }
    return 75;
  }

  getMaxDgUniqueID(obj: any, maxDgUniqueId = 0) {
    if (obj) {
      let dgUniqueID = obj.dgUniqueID;
      if (dgUniqueID?.toString().includes('b')) {
        dgUniqueID = obj.dgUniqueID.toString().split('b')[1];
      }
      if (maxDgUniqueId < Number(dgUniqueID)) {
        maxDgUniqueId = Number(dgUniqueID);
      }
      if (obj.children != null && obj.children != undefined && obj.children.length > 0) {
        obj.children.forEach((item: any) => maxDgUniqueId = this.getMaxDgUniqueID(item, maxDgUniqueId));
      }

      if (obj.dgType == DgTypes.Figures) {
        obj?.images?.forEach((item: any) => {
          if (maxDgUniqueId < Number(item.dgUniqueID)) {
            maxDgUniqueId = Number(item.dgUniqueID);
          }
        });
      }
      if (obj.dgType == DgTypes.Form && obj?.calstable[0]?.table?.tgroup?.tbody[0]?.row) {
        obj?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((item: any) => {
          if (item?.dgUniqueID?.toString().includes('b')) {
            item.dgUniqueID = item.dgUniqueID.toString().split('b')[1];
          }
          if (maxDgUniqueId < Number(item?.dgUniqueID)) {
            maxDgUniqueId = Number(item?.dgUniqueID);
          }
          const entryObj = item.entry;
          if (maxDgUniqueId < Number(entryObj?.dgUniqueID)) {
            maxDgUniqueId = Number(entryObj?.dgUniqueID);
          }
          entryObj?.children?.forEach((i: any) => maxDgUniqueId = this.getMaxDgUniqueID(i, maxDgUniqueId));
          if (Array.isArray(entryObj)) {
            entryObj?.forEach((i: any) => maxDgUniqueId = this.getMaxDgUniqueID(i, maxDgUniqueId));
          }
        })
      }
    }
    return maxDgUniqueId;
  }

  //SEARCH
  search(searchString: string, cbpJson: any, result = [], isFromChild = false) {
    if (searchString.length === 0) {
      return result;
    }
    let section;
    if (!isFromChild) {
      const header = cbpJson?.documentInfo[0]?.header?.children;
      section = cbpJson?.section
      header.forEach((item: any) => {
        if (item.dgType === DgTypes.DualAction) {
          if (Array.isArray(item.rightDualChildren) && item.rightDualChildren.length > 0) {
            this.search(searchString, item.rightDualChildren, result, true);
          }
        }
        this.findOcuurances(searchString, item, result);
        if (Array.isArray(item.children) && item.children.length > 0) {
          this.search(searchString, item.children, result, true);
        }
      });

    } else {
      section = cbpJson
    }
    if (!section) {
      return result;
    }

    section.forEach((item: any) => {
      if (item.dgType === DgTypes.DualAction) {
        if (Array.isArray(item.rightDualChildren) && item.rightDualChildren.length > 0) {
          this.search(searchString, item.rightDualChildren, result, true);
        }
      }
      this.findOcuurances(searchString, item, result);
      if (Array.isArray(item.children) && item.children.length > 0) {
        this.search(searchString, item.children, result, true);
      }
    });
    if (!isFromChild) {
      const footer = cbpJson?.documentInfo[0]?.footer?.children;
      footer.forEach((item: any) => {
        if (item.dgType === DgTypes.DualAction) {
          if (Array.isArray(item.rightDualChildren) && item.rightDualChildren.length > 0) {
            this.search(searchString, item.rightDualChildren, result, true);
          }
        }
        this.findOcuurances(searchString, item, result);
        if (Array.isArray(item.children) && item.children.length > 0) {
          this.search(searchString, item.children, result, true);
        }
      });
    }
    return result;
  }

  findOcuurances(searchString: string, item: any, result: any[]) {
    if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo || item.dgType === DgTypes.Para
      || item.dgType === DgTypes.DelayStep) {
      if (item.dgType === DgTypes.Section || item.dgType === DgTypes.DelayStep || item.dgType === DgTypes.StepInfo) {
        if (item['title'] && item['title'].length > 0 && this.removeHTMLTags(item['title'].toLowerCase()).indexOf(searchString) > -1) {
          result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'title', indexes: this.findAllOccurences(searchString, item['title'], false) });
        }
      }
      if (item.dgType === DgTypes.Para) {
        if (item['text'] && item['text'].length > 0 && this.removeHTMLTags(item['text'].toLowerCase()).indexOf(searchString) > -1) {
          result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'text', indexes: this.findAllOccurences(searchString, item['text'], false) });
        }
      }
    } else if (item.dgType === DgTypes.StepAction || item.dgType === DgTypes.Timed || item.dgType === DgTypes.Repeat) {
      if (item['action'] && item['action'].length > 0 && this.removeHTMLTags(item['action'].toLowerCase()).indexOf(searchString) > -1) {
        result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'action', indexes: this.findAllOccurences(searchString, item['action'], false) });
      }
    } else if (item.dgType === DgTypes.Warning || item.dgType === DgTypes.Caution) {
      if (item['cause'] && item['cause'].length > 0 && this.removeHTMLTags(item['cause'].toLowerCase()).indexOf(searchString) > -1) {
        result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'cause', indexes: this.findAllOccurences(searchString, item['cause'], false) });
      }
      if (item['effect'] && item['effect'].length > 0 && this.removeHTMLTags(item['effect'].toLowerCase()).indexOf(searchString) > -1) {
        result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'effect', indexes: this.findAllOccurences(searchString, item['effect'], false) });
      }
    }
    // else if (item.dgType === DgTypes.Figures) {
    //   item.images.forEach((child: { [x: string]: string; dgUniqueID: any; }) => {
    //     if (child['caption'] && child['caption'].length > 0 && this.removeHTMLTags(child['caption'].toLowerCase()).indexOf(searchString) > -1) {
    //       result.push({ dgUniqueID: child.dgUniqueID, dgType:item.dgType, propName:'caption',    indexes: this.findAllOccurences(searchString, child['caption'], false) });
    //     }
    //   })
    //   if (item['fileName'] && item['fileName'].length > 0 && this.removeHTMLTags(item['fileName'].toLowerCase()).indexOf(searchString) > -1) {
    //     result.push({ dgUniqueID: item.dgUniqueID, dgType:item.dgType, propName:'fileName',    indexes: this.findAllOccurences(searchString, item['fileName'], false) });
    //   }
    // }
    else if (item.dgType === DgTypes.Link) {
      if (item['caption'] && item['caption'].length > 0 && this.removeHTMLTags(item['caption'].toLowerCase()).indexOf(searchString) > -1) {
        result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'caption', indexes: this.findAllOccurences(searchString, item['caption'], false) });
      }
    } else if (item.dgType === DgTypes.LabelDataEntry || item.dgType === DgTypes.TextDataEntry
      || item.dgType === DgTypes.NumericDataEntry || item.dgType === DgTypes.DateDataEntry || item.dgType === DgTypes.TextAreaDataEntry
      || item.dgType === DgTypes.BooleanDataEntry || item.dgType === DgTypes.CheckboxDataEntry || item.dgType === DgTypes.DropDataEntry
      || item.dgType === DgTypes.VerificationDataEntry || item.dgType === DgTypes.InitialDataEntry || item.dgType === DgTypes.Link) {
      if (item['prompt'] && item['prompt'].length > 0 && this.removeHTMLTags(item['prompt'].toLowerCase()).indexOf(searchString) > -1) {
        result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'prompt', indexes: this.findAllOccurences(searchString, item['prompt'], false) });
      }
    }
    else if (item.dgType === DgTypes.Note) {
      if (item.notes && item.notes.length > 0) {
        item.notes.forEach((note: any) => {
          result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'notes', indexes: this.findAllOccurences(searchString, note, false) });

        });
      }
    }
    else if (item.dgType === DgTypes.Alara) {
      if (item.alaraNotes && item.alaraNotes.length > 0) {
        item.alaraNotes.forEach((alaraNote: any) => {
          result.push({ dgUniqueID: item.dgUniqueID, dgType: item.dgType, propName: 'alaraNotes', indexes: this.findAllOccurences(searchString, alaraNote, false) })

        });
      }
    }
    else if (item.dgType === DgTypes.Form) {
      this.findSubTableTextElement(item, searchString, result);
    }
  }
  findSubTableTextElement(item: any, searchString: string, result: any[]) {
    let entryObj, object
    let rowdata = item.calstable[0].table.tgroup.tbody[0].row;
    for (let l = 0; l < rowdata.length; l++) {
      entryObj = rowdata[l].entry;
      for (let m = 0; m < entryObj.length; m++) {
        if (entryObj[m]) {
          object = item.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
          object.children.forEach((child: { [x: string]: string; dgUniqueID: any; }) => {
            // console.log(child)
            if (child['dgType'] === DgTypes.Para) {
              if (child['text'] && child['text'].length > 0 && this.removeHTMLTags(child['text'].toLowerCase()).indexOf(searchString) > -1) {
                result.push({ dgUniqueID: child.dgUniqueID, dgType: child.dgType, propName: 'text', indexes: this.findAllOccurences(searchString, child['text'], false) });
              }
            }
            else if (child['dgType'] === DgTypes.LabelDataEntry || child['dgType'] === DgTypes.CheckboxDataEntry) {
              if (child['prompt'] && child['prompt'].length > 0 && child['prompt'].toLowerCase().indexOf(searchString) > -1) {
                result.push({ dgUniqueID: child.dgUniqueID, dgType: child.dgType, propName: 'prompt', indexes: this.findAllOccurences(searchString, child['prompt'], false) });
              }
            }
            else if (child['dgType'] === DgTypes.TextDataEntry || child['dgType'] === DgTypes.NumericDataEntry || child['dgType'] === DgTypes.DateDataEntry
              || child['dgType'] === DgTypes.BooleanDataEntry || child['dgType'] === DgTypes.TextAreaDataEntry) {
              if (child['showLablePrompt'] && child['showLablePrompt'].length > 0 && child['showLablePrompt'].toLowerCase().indexOf(searchString) > -1) {
                result.push({ dgUniqueID: child.dgUniqueID, dgType: child.dgType, propName: 'showLablePrompt', indexes: this.findAllOccurences(searchString, child['showLablePrompt'], false) });
              }
            }
          });
          for (let k = 0; k < object.children.length; k++) {
            if (object.children[k].dgType === DgTypes.Table) {
              this.findSubTableTextElement(object.children[k], searchString, result);
            }
          }
        }
      }
    }
  }
  findAllOccurences(searchStr: any, str: any, caseSensitive: any) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
      str = this.removeHTMLTags(str).toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  matchSearchWithIgnoreHTMLTags(htmlString = '', search = '', caseSensitive = false): HighlightTag[] {
    if (htmlString == '' || search == '') {
      return [];
    }
    let htmlIndexes = this.findHTMLIndexes(htmlString), position = 0, series = [];
    if (!caseSensitive) {
      htmlString = htmlString.toLowerCase();
      search = search.toLowerCase();
    }
    while (position < htmlString.length) {
      for (let i = 0; i < search.length; i++) {
        let breakParent = false;
        for (let j = position; j < htmlString.length; j++) {
          if (search[i] == htmlString[j]) {
            let state = false;
            for (let k = 0; k < htmlIndexes.length; k++) {
              if (j >= htmlIndexes[k].start && j <= htmlIndexes[k].end) {
                state = true;
                break;
              }
            }
            if (!state) {
              let subStr = this.removeHTMLTags(htmlString.substring(0, j));
              if (i > 0 && (subStr.substring(subStr.length - i) == search.substring(0, i))) {
                series.push(j)
                position = j + 1;
                break;
              } else if (i == 0) {
                series.push(j)
                position = j + 1;
                break;
              } else {
                for (let index = 0; index < i; index++) {
                  series.pop();
                }
                position = j + 1;
                breakParent = true;
                break;
              }
            }
          } else {
            let state = false;
            for (let k = 0; k < htmlIndexes.length; k++) {
              if (j >= htmlIndexes[k].start && j <= htmlIndexes[k].end) {
                state = true;
                break;
              }
            }
            if (!state) {
              if (i > 0 && i < search.length) {
                for (let index = 0; index < i; index++) {
                  series.pop();
                }
                if (j == htmlString.length - 1) {
                  position = htmlString.length;
                } else {
                  position = j + 1;
                }
                breakParent = true;
                break;
              }
              if (j == htmlString.length - 1) {
                position = htmlString.length;
                if (i != (search.length - 1)) {
                  for (let index = 0; index < i; index++) {
                    series.pop();
                  }
                }
              } else {
                position = j + 1;
              }
            } else {

              if (j == htmlString.length - 1) {
                position = htmlString.length;
                if (i - 1 != (search.length - 1)) {
                  for (let index = 0; index < i; index++) {
                    series.pop();
                  }
                }
              } else {
                position = j + 1;
              }
            }
          }
        }
        if (breakParent) {
          break;
        }
      }
    }
    return this.mergeIndexs(series);
  }
  mergeIndexs(series: any[]): HighlightTag[] {
    if (!series || !Array.isArray(series) || series.length == 0) {
      return [];
    }
    let indexs = [];
    let position = 0;
    while (position < (series.length - 1)) {
      let start = series[position];
      for (let i = position; i < series.length - 1; i++) {
        if (series[i] == (series[i + 1] - 1)) {
          position = i + 1;
          if (position == (series.length - 1)) {
            indexs.push({ indices: { start: start, end: series[position] }, cssClass: 'search-bg-blue' })
          }
          continue;
        } else {
          indexs.push({ indices: { start: start, end: series[i] }, cssClass: 'search-bg-blue' })
          position = i + 1;
          if (position == (series.length - 1)) {
            indexs.push({ indices: { start: series[position], end: series[position] }, cssClass: 'search-bg-blue' })
          }
          break;
        }
      }
    }
    return indexs;
  }
  findHTMLIndexes(htmlString: string) {
    let index = 0;
    let htmlIndexes = [];
    while (index < htmlString.length) {
      let start = htmlString.indexOf('<', index);
      if (start > -1) {
        let end = htmlString.indexOf('>', start + 1)
        htmlIndexes.push({
          start: start,
          end: end
        })
        index = end
      } else {
        index = htmlString.length
      }
    }
    return htmlIndexes;
  }

  removeHTMLTags(str: any) {
    if ((str === null) || (str === undefined) || (str === ''))
      return '';
    else
      str = str.toString();
    let finalString = str.replace(/(<([^>]+)>)/ig, '');
    finalString = finalString.replace(/&nbsp;/g, ' ');
    return finalString;
  }

  findById(data: any, id: any) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].number === id) {
        return data[i];
      } else if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.findById(data[i].children, id);
      }
    }
  }

  //FIND SEARCH RESULT
  updateReplace(item: any, text: any, propName: any = null, index = 0) {
    if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo || item.dgType === DgTypes.Para || item.dgType === DgTypes.DelayStep) {
      // if (item.dgType === DgTypes.Section || item.dgType === DgTypes.DelayStep || item.dgType === DgTypes.StepInfo) {
      item['title'] = text;
      item['text'] = item.number + ' ' + this.removeHTMLTags(text);
      // }
      if (item.dgType === DgTypes.Para) {
        item['text'] = text;
      }
    } else if (item.dgType === DgTypes.StepAction || item.dgType === DgTypes.Timed || item.dgType === DgTypes.Repeat) {
      item['action'] = text;
      item['text'] = item.number + ' ' + this.removeHTMLTags(text);
    } else if (item.dgType === DgTypes.Warning || item.dgType === DgTypes.Caution) {
      if (propName) {
        if (propName == 'cause') {
          item['cause'] = text;
        }
        if (propName == 'effect') {
          item['effect'] = text;
        }
      }
    } else if (item.dgType === DgTypes.Figures) {
      if (propName) {
        if (propName == 'caption') {
          item['caption'] = text;
        }
        if (propName == 'fileName') {
          item['fileName'] = text;
        }
      }
    } else if (item.dgType === DgTypes.Link) {
      item['caption'] = text;
    } else if (item.dgType === DgTypes.FormulaDataEntry) {
      if (item?.content?.equation) {
        item.content.equation = text;
      } else {
        item['content']['equation'] = text;
      }

    } else if (item.dgType === DgTypes.LabelDataEntry || item.dgType === DgTypes.TextDataEntry
      || item.dgType === DgTypes.TextAreaDataEntry
      || item.dgType === DgTypes.NumericDataEntry || item.dgType === DgTypes.DateDataEntry
      || item.dgType === DgTypes.BooleanDataEntry || item.dgType === DgTypes.CheckboxDataEntry
      || item.dgType === DgTypes.VerificationDataEntry || item.dgType === DgTypes.InitialDataEntry) {
      if (item.isTableDataEntry && item.dgType !== DgTypes.LabelDataEntry && item.dgType !== DgTypes.CheckboxDataEntry) {
        item['showLablePrompt'] = text;
      }
      else {
        item['prompt'] = text;
      }
    }
    else if (item.dgType === DgTypes.Note) {
      item.notes[index] = text;
    }
    else if (item.dgType === DgTypes.Alara) {
      item.alaraNotes[index] = text
    }
    item = this.setUserUpdateInfo(item);
  }
  getSearchTags(text: any, searchString: any, isHTMLText = false): HighlightTag[] {
    if (isHTMLText) {
      return this.matchSearchWithIgnoreHTMLTags(text, searchString);
    }
    const tags: any[] = []
    try {
      let indexes = this.findAllOccurences(searchString, text, false);
      indexes.forEach((index, n) => {
        tags.push({ indices: { start: index, end: index + searchString.length }, cssClass: 'search-bg-blue', position: n })
      });
    } catch (error) {
      console.error(error);
    }
    // console.log(tags)
    return tags;
  }

  isHTMLText(text: any): boolean {
    if (text === undefined) text = '';
    if (text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }

  getSearchText(item: any, propName: any) {
    let arr = [];
    if (!propName) {
      if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo
        || item.dgType === DgTypes.DelayStep) {
        if (item.dgType === DgTypes.Section || item.dgType === DgTypes.DelayStep) {
          arr.push(item['title']);
          return arr;
        }
        if (item.dgType === DgTypes.StepInfo) {
          arr.push(item['title']);
          return arr;
        }
      } else if (item.dgType === DgTypes.StepAction || item.dgType === DgTypes.Timed || item.dgType === DgTypes.Repeat) {
        arr.push(item['action']);
        return arr;
      } else if (item.dgType === DgTypes.Alara) {
        arr = item.alaraNotes;
        return arr;
      } else if (item.dgType === DgTypes.Note) {
        arr = item.notes;
        return arr;
      } else if (item.dgType === DgTypes.Warning || item.dgType === DgTypes.Caution) {
        arr.push(item['cause']);
        arr.push(item['effect']);
        return arr;
      } else if (item.dgType === DgTypes.Para) {
        arr.push(item['text']);
        return arr;
      } else if (item.dgType === DgTypes.LabelDataEntry
        || item.dgType === DgTypes.TextDataEntry || item.dgType === DgTypes.DateDataEntry
        || item.dgType === DgTypes.BooleanDataEntry || item.dgType === DgTypes.CheckboxDataEntry
        || item.dgType === DgTypes.InitialDataEntry || item.dgType === DgTypes.NumericDataEntry
        || item.dgType === DgTypes.VerificationDataEntry || item.dgType === DgTypes.DropDataEntry) {
        arr.push(item['prompt']);
        return arr;
      } else if (item.dgType === DgTypes.Link) {
        arr.push(item['displayText']);
        return arr;
      } else if (item.dgType === DgTypes.TextAreaDataEntry && item?.showLablePrompt) {
        arr.push(item['showLablePrompt']);
        return arr;
      } else if (item.dgType === DgTypes.FormulaDataEntry) {
        arr.push(item?.content?.equation ? item?.content?.equation : '');
        return arr;
      }
      arr.push(item[propName]);
      return arr;

    } else {
      if (item.dgType === DgTypes.Warning || item.dgType === DgTypes.Caution || item.dgType === DgTypes.Para || item.dgType === DgTypes.LabelDataEntry
        || item.dgType === DgTypes.TextDataEntry || item.dgType === DgTypes.TextAreaDataEntry || item.dgType === DgTypes.DateDataEntry || item.dgType === DgTypes.Link
        || item.dgType === DgTypes.BooleanDataEntry || item.dgType === DgTypes.CheckboxDataEntry
        || item.dgType === DgTypes.InitialDataEntry || item.dgType === DgTypes.NumericDataEntry
        || item.dgType === DgTypes.VerificationDataEntry || item.dgType === DgTypes.DropDataEntry) {
        arr.push(item[propName]);
        return arr;
      }
    }
  }

  //HTML EDITOR
  setHtmlText(item: any, event: any) {
    throw new Error('Method not implemented.');
  }
  /*
style="-webkit-user-select:text;" is needed for iPad

*/
  getCaretCharacterOffsetWithin(element: any) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  getCaretPosition(el: any) {
    if (window.getSelection && window?.getSelection()?.getRangeAt) {
      var range: any = window?.getSelection()?.getRangeAt(0);
      var selectedObj: any = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i]['outerHTML'])
          rangeCount += childNodes[i]['outerHTML'].length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }

  showCaretPos(dgUniqueID: any) {
    if (dgUniqueID) {
      //let el = document.getElementById("ctn-"+dgUniqueID);
      let pos = this.getCaretCharacterOffsetWithin(dgUniqueID);
      // console.log(pos);
    }

  }

  roman_to_Int(str1: string) {
    if (str1 == null) return -1;
    var num = this.char_to_int(str1.charAt(0));
    var pre, curr;
    for (var i = 1; i < str1.length; i++) {
      curr = this.char_to_int(str1.charAt(i));
      pre = this.char_to_int(str1.charAt(i - 1));
      if (curr <= pre) {
        num += curr;
      } else {
        num = num - pre * 2 + curr;
      }
    }
    return num;
  }

  char_to_int(c: any) {
    switch (c) {
      case 'I': return 1;
      case 'V': return 5;
      case 'X': return 10;
      case 'L': return 50;
      case 'C': return 100;
      case 'D': return 500;
      case 'M': return 1000;
      default: return -1;
    }
  }

  getPaginateIndex(selectedElement: any, cbpJson: any) {
    const element = this.getElementByDgUniqueID(selectedElement.dgUniqueID, cbpJson.documentInfo);
    if (element) {
      return 1;
    } else {
      if (selectedElement.paginateIndex) {
        return selectedElement.paginateIndex;
      }
      const parent = this.getElementByNumber(selectedElement.parentID, cbpJson.section);
      if (parent) {
        return parent.paginateIndex;
      } else {
        return 1;
      }
    }
  }

  setDgUniqueID(data: any) {
    if (data.dgUniqueID > Number.MAX_SAFE_INTEGER) {
      data.dgUniqueID = this.getUniqueIdIndex();
      data.dgUniqueID = data.dgUniqueID?.toString();
    }
    if (data.dgUniqueID === undefined) {
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          this.dupUniqueIDs.push(item.dgUniqueID);
        })
      }
    } else {
      this.dupUniqueIDs.push(data.dgUniqueID);
    }
  }

  setDefaultTableChanges(obj: any, stepParentID: any, tableDgUniqueID: any) {
    try {
      if (!obj?.parentStepId || obj.parentStepId > Number.MAX_SAFE_INTEGER) {
        obj.parentStepId = stepParentID?.toString();
      }
      if (obj?.parentStepId) {
        obj.parentStepId = obj.parentStepId?.toString();
      }
      if (obj?.parentDgUniqID && obj?.parentDgUniqID > Number.MAX_SAFE_INTEGER) {
        obj.parentDgUniqueID = tableDgUniqueID?.toString();
        obj.parentTableDgUniqueID = tableDgUniqueID?.toString();
        delete obj?.parentDgUniqID;
      }
      if (obj?.parentDgUniqID) {
        delete obj?.parentDgUniqID;
      }
      if (obj?.parentTableDgUniqueID || 'parentTableDgUniqueID' in obj) {
        obj.parentTableDgUniqueID = obj.parentTableDgUniqueID?.toString();
      }
      if (obj?.parentDgUniqueID || 'parentDgUniqueID' in obj) {
        obj.parentDgUniqueID = obj.parentDgUniqueID?.toString();
      }
      if (obj?.parentDgUniqID || 'parentDgUniqID' in obj) {
        obj.parentDgUniqueID = obj?.parentDgUniqID?.toString();
        delete obj?.parentDgUniqID;
      }
      const tableObjheads = obj.calstable[0].table.tgroup.thead;
      if (obj.calstable[0].dgUniqueID || obj.calstable[0].dgUniqueID == '') {
        delete obj.calstable[0].dgUniqueID;
      }
      for (let t = 0; t < tableObjheads.length; t++) {
        if (tableObjheads[t]?.dgUniqueID) {
          if (tableObjheads[t].dgUniqueID > Number.MAX_SAFE_INTEGER) {
            tableObjheads[t].dgUniqueID = this.getUniqueIdIndex();
            tableObjheads[t].dgUniqueID = tableObjheads[t].dgUniqueID?.toString();
            this.setDgUniqueID(tableObjheads[t]);
          }
          tableObjheads[t].dgUniqueID = tableObjheads[t].dgUniqueID?.toString();
          if (tableObjheads[t].dgTypeObj) {
            if (tableObjheads[t].dgTypeObj.dgUniqueID > Number.MAX_SAFE_INTEGER) {
              if (tableObjheads[t].dgTypeObj?.dgUniqueID) {
                tableObjheads[t].dgTypeObj.dgUniqueID = this.getUniqueIdIndex();
                tableObjheads[t].dgTypeObj.dgUniqueID = tableObjheads[t].dgTypeObj.dgUniqueID?.toString();
                this.setDgUniqueID(tableObjheads[t].dgTypeObj);
              }
            }
            tableObjheads[t].dgTypeObj.dgUniqueID = tableObjheads[t].dgTypeObj.dgUniqueID?.toString();
          }
        }
      }
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row;
      if (tableObj?.dgUniqueID) {
        if (tableObj?.dgUniqueID > Number.MAX_SAFE_INTEGER) {
          tableObj.dgUniqueID = this.getUniqueIdIndex();
          tableObj.dgUniqueID = tableObj?.dgUniqueID?.toString();
          this.setDgUniqueID(tableObj);
        }
        tableObj.dgUniqueID = tableObj.dgUniqueID?.toString();
      }
      for (let k = 0; k < tableObj?.length; k++) {
        if (tableObj[k]) {
          if (tableObj[k]?.dgUniqueID || 'dgUniqueID' in tableObj[k]) {
            if (tableObj[k]?.dgUniqueID > Number.MAX_SAFE_INTEGER) {
              tableObj[k].dgUniqueID = this.getUniqueIdIndex();
              tableObj[k].dgUniqueID = tableObj[k].dgUniqueID?.toString();
              this.setDgUniqueID(tableObj[k]);
            }
            tableObj[k].dgUniqueID = tableObj[k].dgUniqueID?.toString();
          }
          if (tableObj[k]?.previousRowDgUniqueID || 'previousRowDgUniqueID' in tableObj[k]) {
            tableObj[k].previousRowDgUniqueID = tableObj[k]?.previousRowDgUniqueID.toString();
          }
          const entryObj = tableObj[k].entry;
          if (entryObj) {
            for (let l = 0; l < entryObj.length; l++) {
              if (entryObj[l]) {
                if (entryObj[l]?.dgUniqueID || 'dgUniqueID' in entryObj[l]) {
                  if (entryObj[l]?.dgUniqueID > Number.MAX_SAFE_INTEGER) {
                    entryObj[l].dgUniqueID = this.getUniqueIdIndex();
                    entryObj[l].dgUniqueID = entryObj[l].dgUniqueID?.toString();
                    this.setDgUniqueID(entryObj[l]);
                  }
                  entryObj[l].dgUniqueID = entryObj[l].dgUniqueID?.toString();
                }
                const object = obj.calstable[0].table.tgroup.tbody[0].row[k].entry[l].children;
                if (object) {
                  for (let m = 0; m < object.length; m++) {
                    // Check if child is a proper object and contains dgType property
                    if (!object[m] || typeof object[m] !== 'object' || object[m] === null || !('dgType' in object[m]) && !object[m].coverType) {
                      // Delete the object from the array if it doesn't have dgType
                      object.splice(m, 1);
                      m--; // Adjust index as we removed an item
                      continue;
                    }
                    if (object[m].dgUniqueID > Number.MAX_SAFE_INTEGER) {
                      if (object[m]?.dgUniqueID) {
                        object[m].dgUniqueID = this.getUniqueIdIndex();
                        object[m].dgUniqueID = object[m].dgUniqueID?.toString();
                      }
                    }
                    object[m] = this.setParentStepInfo(object[m], obj);
                    this.setDgUniqueID(object[m]);
                    object[m].dgUniqueID = object[m].dgUniqueID?.toString();
                    if (object[m]?.parentDgUniqID) {
                      delete object[m].parentDgUniqID;
                    }
                    object[m].parentDgUniqueID = tableDgUniqueID?.toString();
                    object[m].parentStepId = stepParentID?.toString();
                    if ('parentTableDgUniqueID' in object[m]) {
                      object[m].parentTableDgUniqueID = object[m].parentTableDgUniqueID.toString();
                    }
                    if ('parentDgUniqID' in object[m]) {
                      delete object[m].parentDgUniqID;
                    }

                    if (object[m]?.parentStepID || 'parentStepID' in object[m]) {
                      if (object[m].parentStepID > Number.MAX_SAFE_INTEGER) {
                        object[m].parentStepID = stepParentID;
                      }
                      object[m].parentStepID = object[m].parentStepID?.toString();
                    }
                    if (object[m].dgType == DgTypes.Form) {
                      object[m]['subTabe'] = true;
                      object[m]['superParentTableID'] = tableDgUniqueID;
                      this.setDefaultTableChanges(object[m], stepParentID, object[m].dgUniqueID);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) { console.error('table' + err); }
  }

  duplicateFind(arr: any) {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }

  stepActionCondition(obj: any) {
    if (obj !== undefined) {
      if (obj?.dgType === DgTypes.StepAction || obj?.dgType === DgTypes.DelayStep || obj?.dgType === DgTypes.Timed || obj?.dgType === DgTypes.Repeat) {
        return true;
      }
    }
    return false;
  }
  sectionAndStep(obj: any) {
    return this.stepActionCondition(obj) || obj?.dgType === DgTypes.Section ? true : false;
  }
  checkAllSteps(obj: { dgType: DgTypes; }) {
    return (this.sectionAndStep(obj) || obj?.dgType === DgTypes.StepInfo) ? true : false;
  }
  getParaObjects(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.Para || object[i].dgType === DgTypes.LabelDataEntry ||
        object[i].dgType === DgTypes.Table || object[i].dgType === DgTypes.Figures ||
        object[i].dgType === DgTypes.SingleFigure
      ) {
        let find = object[i].dgUniqueID.toString().includes('b') ? true : false;
        if (find) {
          let dup = this.paraList.filter(it => it.dgUniqueID == object[i].dgUniqueID);
          if (dup.length == 0)
            this.paraList.push(object[i]);
        }
      }
      if (object[i]?.children && object[i]?.children?.length > 0) {
        this.getParaObjects(object[i]?.children)
      }
    }
  }
  getUniqueIdIndex() {
    if (this.uniqueIdIndex == null || this.uniqueIdIndex == undefined) {
      this.uniqueIdIndex = this.maxDgUniqueId;
      return this.uniqueIdIndex;
    }
    if (this.uniqueIdIndex < 1) {
      this.uniqueIdIndex = this.maxDgUniqueId;
      return this.uniqueIdIndex;
    }
    if (this.uniqueIdIndex) {
      if (this.uniqueIdIndex > Number.MAX_SAFE_INTEGER) {
        if (!this.maxDgUniqueId) { this.maxDgUniqueId = this.uniqueIdIndex; }
        if (this.maxDgUniqueId > Number.MAX_SAFE_INTEGER && !this.loadedMaxInteger) {
          this.maxDgUniqueId = Number.MAX_SAFE_INTEGER / 2;
          this.loadedMaxInteger = true;
        }
        this.uniqueIdIndex = ++this.maxDgUniqueId;
        this.maxDgUniqueId = this.uniqueIdIndex;
        this.findduplicateValue();
        this.maxDgUniqueId = this.uniqueIdIndex;
        return this.uniqueIdIndex;
      }
      ++this.uniqueIdIndex;
      this.maxDgUniqueId = this.uniqueIdIndex;
      this.findduplicateValue();
      this.maxDgUniqueId = this.uniqueIdIndex;
      return this.uniqueIdIndex;
    }
  }

  findduplicateValue() {
    if (this.dupUniqueIDs?.length > 0 && !this.disableDuplicateCall) {
      this.dupUniqueIDs.map(item => Number(item));
      let findObj = this.dupUniqueIDs.filter(item => item == this.uniqueIdIndex);
      if (findObj?.length > 0) {
        this.uniqueIdIndex = this.uniqueIdIndex + 19;
        this.findduplicateValue();
      }
    }
    return this.uniqueIdIndex
  }

  setUserUpdateInfo(item: any) {
    item['updatedBy'] = this.loggedInUserName;
    item['updatedDate'] = new Date();
    if (this.documentInfo)
      item = this.setRevision(item, this.documentInfo);
    return item;
  }
  setRevision(item: any, documentInfo: any) {
    if (!this.cbpStandalone) {
      let internalRevision: any = '';
      internalRevision = this.validateTrackChange(internalRevision, documentInfo);
      if (internalRevision && internalRevision != '' && internalRevision != undefined) {
        item['internalRevision'] = internalRevision;
      }
    }
    return item;
  }
  validateTrackChange(internalRevision: any, documentInfo: any) {
    if (documentInfo?.internalRevision && documentInfo?.internalRevision != "" && documentInfo?.internalRevision != undefined) {
      internalRevision = documentInfo?.internalRevision;
    }
    return internalRevision;
  }
  setParentObjChild(dgType: any, type: string, obj: any, selectedElement: any) {
    if (selectedElement?.dgType == dgType || selectedElement[type]) {
      obj[type] = true;
    }
    return obj;
  }
  setParentStepInfo(obj: any, selectedElement: any) {
    obj = this.setParentObjChild(DgTypes.Repeat, 'isParentRepeatStep', obj, selectedElement);
    obj = this.setParentObjChild(DgTypes.Timed, 'isParentTimedStep', obj, selectedElement);
    return obj;
  }
  reUpdateTrackChanges(obj: any) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i]?.dgType) {
        obj[i] = this.setUserUpdateInfo(obj[i]);
      }
      if (obj[i]?.children && obj[i]?.children?.length > 0) {
        this.reUpdateTrackChanges(obj[i].children);
      }
    }
    return obj;
  }
  replaceAmpersandValues(rule: string, dgUniqueIdPart: string): string {
    return rule.replace(/&([\w\d_]+)/g, (match, key) => {
      // Remove any leading p_*_ style prefixes (even multiple or malformed ones)
      const cleanedKey = key.replace(/^(p(_\w+)+?_)+/, '');
      return dgUniqueIdPart + cleanedKey;
    });
  }
  extractPrefixBeforeLastNumber(str: string): string {
    const parts = str?.toString().split('_');
    parts.pop(); // Remove last segment
    return parts.join('_') + '_';
  }
}
