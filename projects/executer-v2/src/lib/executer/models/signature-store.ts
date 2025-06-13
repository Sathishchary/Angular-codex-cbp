import { DgTypes } from "cbp-shared";

export class SignatureStore {
    dgType = DgTypes.SignatureDataEntry;
    signatureValue: any;
    signatureName: any;
    name!: string;
    signature!: string;
    signatureDate: any;
    initial: any;
    dgUniqueID: any;
    createdDate = new Date();
    createdBy: any;
    signatureUserId: any;
    signatureNotes!: string;
    signatureUserName: any;
    notes: any;
    constructor(signatureValue: string, signatureName: string, name: string, signature: string,
        signatureDate: any, initial: string, dgUniqueID: any, createdBy: string, createdDate: any,
        signatureUserId: any, signatureNotes: string) {
        this.dgType = DgTypes.SignatureDataEntry;
        this.signatureValue = signatureValue;
        this.signatureName = signatureName;
        this.name = name;
        this.signature = signature;
        this.signatureDate = signatureDate;
        this.initial = initial;
        this.dgUniqueID = dgUniqueID;
        this.createdBy = createdBy
        this.createdDate = createdDate;
        this.signatureUserId = signatureUserId;
        this.signatureNotes = signatureNotes;
        this.signatureUserName = signatureName;
        this.notes = signatureNotes;
    }
}
