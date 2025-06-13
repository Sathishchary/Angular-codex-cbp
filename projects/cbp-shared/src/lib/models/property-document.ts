import { Header } from './header.model';
import { Footer } from './footer.model';
import { waterMarkOptions } from './watermarkoptions';

export class PropertyDocument {
  type?= '';
  subType?= '';
  title?= '';
  documentNo?= '';
  revision?= '';
  objective?= '';
  description?= '';
  usage?= '';
  facility?= '';
  units?= '';
  category: any;
  approver?= '';
  reviewer?= '';
  effectiveDate?= '';
  uniqueID?= '';
  responsibleDepartment?= '';
  safetyClass?= '';
  author?= '';
  header?= new Header();
  footer?= new Footer();
  color = '#000000';
  waterMarkOptions?= new waterMarkOptions();
  dateFormat = ''; // m/j/Y
  showNavigation = true;
  showProperty = true;
  newCoverPageeEnabled = true;
  isDataProtected = false;
  Security = {
    Role: [],
    Qualification: [],
    QualificationGroup: []
  };
  dynamicDocument = false;
  internalRevision = '';
}
