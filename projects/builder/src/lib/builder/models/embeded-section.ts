import { DgTypes } from "cbp-shared";
export class EmbededSection {
  type = 'embedded';
  title = '';
  number = '';
  stepAction = [];
  selected: false = false;
  parentID: '' = '';
  dgType: DgTypes = DgTypes.Section;
  dgUniqueID!: number;
  sectionObjects = [];
  embeddedSection = { section: [] };
  property = {
    documentNumber: '',
    title: this.title,
    description: '',
    type: 'Static',
  };
  applicabilityRule = [];
  componentInformation = [];
  Security = {
    Role: [],
    Qualification: [],
    QualificationGroup: [],
  };
}
