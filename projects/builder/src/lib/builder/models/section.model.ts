
import { DgTypes } from 'cbp-shared';
import { TreeInfo } from './tree-info.model';
import { Security } from './security';

export class Section extends TreeInfo {
  number = '';
  dgSequenceNumber = '';
  title = '';
  numberedChildren= true;
  dgUniqueID: any;
  dgType: DgTypes  = DgTypes.Section;
  type = 'Section';
  numberedSteps = true;
  acknowledgementReqd = null;
  applicabilityRule = [];
  rule = [];
  ctrlKey = false;
  usage = 'Continuous';
  dependency = 'Default';
  configureDependency = [];
  dependencyChecked = false;
  checkboxNode = true;
  Security = new Security();
  dynamic_number = 0;
  dynamic_section = false;
  hide_section = false;
  selectedDgType = DgTypes.Section;
  // stickyNote = new StickyNote();
}
