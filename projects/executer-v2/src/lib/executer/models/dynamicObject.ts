import { DgTypes } from "cbp-shared";
import { ActionId } from "./action-id";

export class DynamicObject {
 
  TxnId!: number ;
  by!: string ;
  Action!:number;
  dgType!: string;
  device!: string;
  createdDate!: string;
  dgUniqueIDList!: Array<string>;
  valueList!: Array<string>;

  init() {
    this.TxnId = new Date().getTime();
    this.createdDate = new Date().toISOString();
    this.dgType = DgTypes.DynamicSection;
    this.Action =  ActionId.DynamicSection;
    this.dgUniqueIDList = [];
    this.valueList = [];
    return this;
  }
}
