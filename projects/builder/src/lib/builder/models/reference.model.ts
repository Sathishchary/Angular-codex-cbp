import { DgTypes } from "cbp-shared";
export class Reference {
  dgUniqueID: any;
  type = 'reference';
  dataType = 'reference';
  dgType: DgTypes  = DgTypes.Reference;
  action = '';
  caption = '';
  description = '';
  link = '';
  value = 'Equipment info';
  prompt = '';
  isDataEntry = true;
}
