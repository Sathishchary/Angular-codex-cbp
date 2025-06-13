/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

import { Action } from './_action';
import { Menu } from "./_menu";
import { Module } from "./_module";
import { Role } from './_role';
import { Setting } from './_setting';

export interface ProductProfile {
  code: number;
  name: string;
  menu: Array<Menu>;
  modules: Array<Module>;
  settings: Array<Setting>;
  userRoles: Array<Role>;
  actions: Array<Action>
  securityQualifiers: any;
  customSettings: any;
}
