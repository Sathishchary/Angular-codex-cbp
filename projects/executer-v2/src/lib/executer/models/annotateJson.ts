import { AnnotateObject } from "./annotateObject";

export class AnnotateJson {
  annotateObjects! : Array<AnnotateObject>
  init() {
    this.annotateObjects = [];
    
    return this;
  }
}
