import { DgTypes } from "cbp-shared";

export class ProtectObject {
 
  TxnId!: number ;
  by!: string ;
  Action!:number;
  device!: string;
  dgType!: string;
  createdDate!: string;
  dgUniqueIDProtectList!: Array<string>;
  dgUniqueIDUnProtectList!: Array<string>;

  init() {
    this.TxnId = new Date().getTime();
    this.createdDate = new Date().toISOString();
    this.dgType = DgTypes.Protect;
    this.dgUniqueIDProtectList = [];
    this.dgUniqueIDUnProtectList = [];
    return this;
  }
}
