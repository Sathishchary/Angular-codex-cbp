/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { Action } from './_action';
import { Atributes } from './_atributes';
import { Page } from './_page';
import { SearchAttributes } from './_search-attributes';
export interface Details {
  id: string;
  name: string;
  version: number;
  display: string;
  type: number;
  subType: number;
  identity: number;
  hideTitle: number;
  pageSizePercent: number;
  order: number;
  isCustom: number;
  pageId: String;
  pages: Array<Page>;
  attributes: Array<Atributes>;
  actions: Array<Action>;
  searchAttributes: SearchAttributes;
  showNavigation?: number;
}
