import { DgTypes } from "cbp-shared";

export class DelayStep {
  text = '';
  number: any;
  dgSequenceNumber: any;
  status: any;
  dealyTime = 1;
  numberedChildren = true;
  numberedSubSteps = true;
  dgType: DgTypes  = DgTypes.DelayStep;
  allowedtoStop = false;
  ctrlKey = false;
  stepType = DgTypes.DelayStep;
}
