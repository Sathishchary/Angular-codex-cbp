import { DgTypes } from "cbp-shared";

export class StepInfo {
  title = '';
  number: any;
  dgSequenceNumber: any;
  status: any;
  dgType: DgTypes = DgTypes.StepInfo;
  acknowledgementReqd = false;
  numberedSubSteps = true;
  ctrlKey = false;
  //isDataEntry = false;
  stepType = DgTypes.StepInfo;
  checkboxNode = true;
}
