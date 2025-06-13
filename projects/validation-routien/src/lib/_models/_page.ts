/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { Action } from './_action';
import { Atributes } from './_atributes';
import { SearchAttributes } from './_search-attributes';
export interface Page {
  id: string;
  name: string;
  version: string;
  display: string;
  type: number;
  subType: number;
  identity: string;
  hideTitle: number;
  pageSizePercent: number;
  order: number;
  isCustom: number;
  pageId: string;
  pages: Array<Page>;
  attributes: Array<Atributes>;
  actions: Array<Action>;
  searchAttributes: SearchAttributes;
  depth?: number;
  autoRefresh?: number;
  parentPageId?: string;
  isListPage?: boolean;
  rowAction?: string;
  tableData?: any;
  media?: any;
  parentPageFields?: any;
  clickedActionFromParentPage?: any;
}
