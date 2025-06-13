import { DgTypes } from "cbp-shared";
export class VerificationForm {
  title!: string;
  type!: string;
  loginType!: string;
  comment!: string;
  saveInfo = false;
  userId: string = '';
  name!: string;
  initial!: string;
  password: string = '';
  signature: any;
  empId!: string;
  code!: string;
  uniqueId!: string;
  dgType: string = DgTypes.VerificationDataEntry;
  dgUniqueID!: string;
  createdBy!: string;
  createdDate = new Date();
  locationInfo!: string;
  value!: string;
  verifiedMethod!: string;
  verifiedBy!: string;
  verifiedUserId!: string;
  verificationproperty: verificationproperty = new verificationproperty();
  authenticator!: boolean;
  authenticatoruserId = false;
  authenticatorreviewerName = false;
}

export class verificationproperty {
  loginName!: string;
  loginNotes!: string;
  loginSaveInfo = false;
  signatureName!: string;
  signatureNotes!: string;
  signatureSaveInfo = false;
  codeName!: string;
  codeNotes!: string;
  codeSaveInfo = false;
}

