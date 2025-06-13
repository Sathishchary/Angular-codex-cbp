import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class Checkbox {
  choice!: any[];
  alarm: any[] = [];
  data!: any[];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  prompt = '';
  varname = '';
  fieldName = '';
  fieldNameUpdated = false;
  required: any;
  type = 'data element';
  dataType = 'Checkbox';
  valueType = 'Normal';
  selected = false;
  options!: [{}];
  dgType: DgTypes = DgTypes.CheckboxDataEntry;
  isDataEntry = true;
  showLabel = true;
  dataEntrySize = 100;
  checkboxSide = 'right';
  TrueValue = 'Yes';
  FalseValue = 'No';
  Security = new Security();
}
