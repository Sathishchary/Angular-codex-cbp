
import { DgTypes } from 'cbp-shared';
import { TreeInfo } from './tree-info.model';

export class Repeat extends TreeInfo {
  stepType = 'Repeat';
  condition: any;
  action = '';
  itemType: any;
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
  number: any;
  dgSequenceNumber: any;
  status!: string;
  compID: any;
  compDescription: any;
  building: any;
  elevation: any;
  room: any;
  location: any;
  repeatTimes = 1;
  dgType: DgTypes  = DgTypes.Repeat;
  applicabilityRule = [];
  rule = [];
  alarm = [];
  stepActionObjects = [];
  children = [];
  numberedChildren = true;
  numberedSubSteps = true;
  componentInformation = [];
}
