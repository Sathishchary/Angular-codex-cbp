import { ProtectObject } from "./protectObject";

export class ProtectJson {
  protectObjects! : Array<ProtectObject>
  init(){
    this.protectObjects = [];
    return this;
  }
}
