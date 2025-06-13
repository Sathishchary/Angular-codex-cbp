import { DgTypes } from "cbp-shared";
export class Type {
  data!: any[];
  allowOther: any;
  dgUniqueID: any;
  number: any;
  varname: any;
  fieldName = '';
  fieldNameUpdated = false;
  required = false;
  dgType: DgTypes  = DgTypes.Type;
  prompt: any;
}
