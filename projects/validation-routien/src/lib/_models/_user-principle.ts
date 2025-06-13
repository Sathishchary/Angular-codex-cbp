/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

export interface UserPrinciple {
  userId: string;
  userName: string;
  companyId: string;
  companyName:string;
  firstName: string;
  lastName: string;
  displayName: string;
  userType: number;
  userStatus: number;
  email: string;
  mobileNumber: string;
  externalUser: boolean;
  externalProperties: any;
}
