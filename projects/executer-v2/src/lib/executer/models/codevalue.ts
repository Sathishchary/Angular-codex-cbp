export class CodeValue {
  codeName!: string;
  companyID!: string;
  languageCode!: string;
  productID!: string;
  userID!: string;

  constructor(codeName?:string,companyID?:string,languageCode?:string,productID?:string, userID?:string){
    this.codeName = codeName ? codeName: '';
    this.companyID = companyID? companyID: ''
    this.languageCode = languageCode? languageCode: ''
    this.productID = productID? productID: ''
    this.userID = userID? userID: ''
  }
}
