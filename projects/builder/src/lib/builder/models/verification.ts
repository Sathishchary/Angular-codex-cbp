import { DgTypes } from "cbp-shared";
export class Verification {
  Number = "";
  prompt = "Sign here";
  Varname = "VerDataEntry_1";
  VerificationType = "";
  dgType: DgTypes  = DgTypes.VerificationDataEntry;
  dgUniqueID = "";
  dataType = '';
  alarm = [];
  rule = [];
  isDataEntry = true;
}
