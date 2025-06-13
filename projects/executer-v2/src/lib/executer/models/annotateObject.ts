import { DgTypes } from "cbp-shared";
import { ActionId } from "./action-id";

export class AnnotateObject {
  TxnId!: number ;
  by!: string ;
  Action!:ActionId;
  device!: string;
  dgType!: string;
  createdDate!: string;

  text!: string ;
  type!: string ;
  selectedStepDgUniqueID!: string ;
  count!: string ;
  prompt!: string ;
  id!: string;
  show!: boolean;
  objectInfo!: string;

  init() {
    this.TxnId = new Date().getTime();
    this.createdDate = new Date().toISOString();
    this.dgType = DgTypes.Annotate;
    this.Action = ActionId.Update;
    return this;
  }
  build(text: string, type: any, dgUniqueID: any, count: any, prompt: string, id: string, device: string,
    userId:string): AnnotateObject {
    this.init();
    this.device = device;
    this.by = userId;
    this.text = text;
    this.type = type;
    this.selectedStepDgUniqueID = dgUniqueID;
    this.count = count;
    this.prompt = prompt;
    this.id = id;
    this.show = true;
    return this;
  }
}
