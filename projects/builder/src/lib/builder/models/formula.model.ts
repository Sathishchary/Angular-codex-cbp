import { DgTypes } from "cbp-shared";
export class Formula {
  dgUniqueID: any;
  prompt: any;
  varname: any;
  fieldName = '';
  type = 'data element';
  dataType = 'Text Area';
  multiline = 'true';
  dgType: DgTypes  = DgTypes.FormulaDataEntry;
  content = {
     equation: ''
    };
  required = true;
  alarm = [];
  rule = [];
  isDataEntry = true;
  Maxsize = null;

}
