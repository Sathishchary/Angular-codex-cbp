import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class BooleanDataEntry {
  type = 'data element';
  dataType = 'Boolean';
  prompt = '';
  varname = 'Radio';
  fieldName = '';
  fieldNameUpdated = false;
  dgUniqueID = '';
  TrueValue = 'Yes';
  FalseValue = 'No';
  dgType: DgTypes = DgTypes.BooleanDataEntry;
  changed = 'True';
  unchanged = 'False';
  required = false;
  alarm = [];
  rule = [];
  isDataEntry = true;
  Security = new Security();
}
