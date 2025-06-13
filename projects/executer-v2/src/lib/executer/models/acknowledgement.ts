import { DgTypes } from "cbp-shared";
export class Acknowledgement{
  acknowledgedBy!: string;
  acknowledgeDate: any = new Date();
  createdDate: any = new Date();
  statusDate: any = new Date();
  locationInfo!: string;
  dgUniqueID!: string;
  dgType = DgTypes.Acknowledgement;
}
