/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { CustomAttr } from './_custom-attr';
import { BasicAttributes } from './_basic-attributes';
export interface SearchAttributes {
  basic: Array<BasicAttributes>;
  custom: Array<CustomAttr> ;
}
