export class ChangeRequest{
  status!: string;
  number!: string;
  crType: any;
  cdValue: any;
  requestType!: string;
  reasonCode!: any;
  reasonType!:string;
  title: any = "";
  description : any ="";
  location!: string;
  facility!: string;
  unit!: string;
  discipline!: string;
  componentInfo!: string;
  documentInfo: any;
  createdDate: any;
  equipmentId: any;
  equipmentName: any;
  createdBy!: string;
  locationInfo!: string;
  companyGroup!:string;
  action = 8200;
  dgType: any;
  selectedStepDgUniqueId!: string;
  dgUniqueID!: string;
  dynamicUniqueCRId!: string;
  media: any[] = [];
  crNewType!: string
}
