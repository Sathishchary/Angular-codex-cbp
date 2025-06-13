/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { Action } from "./_action";
import { Atributes } from "./_atributes";
import { SearchAttributes } from "./_search-attributes";

export interface PageStructureList {
  id: string;
  name: string;
  version: number;
  display: string;
  type: number;
  identity: number;
  hideTitle: number;
  order: number;
  isCustom: number;
  pageId: string;
  attributes:Array<Atributes>;
  actions: Array<Action>;
  searchAttributes:any;
  autoRefresh:number;

}
