
import { DgTypes } from 'cbp-shared';
import { TreeInfo } from './tree-info.model';
import { Security } from './security';

export class StepAction extends TreeInfo {
  stepType = 'Simple Action';
  condition: any;
  action = '';
  itemType: any;
  actionText = '';
  additionalInfo: any;
  dgUniqueID: any;
  criticalLocation = '';
  actionVerb: any;
  object: any;
  criticalSupplementalInformation: any;
  requiresIV = false;
  requiresCV = false;
  requiresQA = false;
  requiresPC = false;
  holdPointStart = false;
  holdPointEnd = false;
  isCritical = false;
  number: any;
  dgSequenceNumber: any;
  status!: string;
  compID: any;
  compDescription: any;
  building: any;
  elevation: any;
  room: any;
  location: any;
  dgType: DgTypes  = DgTypes.StepAction;
  applicabilityRule = [];
  rule = [];
  numberedChildren = true;
  ctrlKey = false;
  numberedSubSteps = true;
  componentInformation = [];
  dependencyChecked = false;
  checkboxNode = true;
  Security = new Security();
  // stickyNote = new StickyNote();
}
