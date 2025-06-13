/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { Product } from './_product';
import { Qualifier } from './_qualifier';
import { CompanyGroup } from './_company-group';
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    companyId: string;
    companyCode: string;
    companyGroup: Array<CompanyGroup>;
    languageCode: number;
    productCode: number;
    qualifications: Array<Qualifier>;
    qualificationGroup: Array<Qualifier>;
    products: Array<Product>;
    ecollaborateKey: string;
}
