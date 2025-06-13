import { DgTypes } from "cbp-shared";

export class Procedure {
  dgUniqueID: any;
  type = 'procedure';
  dataType = 'procedure';
  dgType: DgTypes  = DgTypes.Procedure;
  action = '';
  caption = '';
  description = '';
  link = '';
  value = 'Equipment info';
  prompt = '';
}
