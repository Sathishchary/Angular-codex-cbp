import { Pipe, PipeTransform } from '@angular/core';
import { LayoutService } from '../services/layout.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Pipe({
  name: 'layout'
})
export class layoutStyle implements PipeTransform {
  constructor(public layoutService: LayoutService){
  }
  transform(pipe:any, item:any): any {
    let isIndent = this.layoutService?.indendation[0].showIndendation;
    let layoutItem = this.layoutService.setLayoutIndendation(item);
    if(!item?.layoutStyle) { item['layoutStyle'] = layoutItem; }
    // if((item?.rightdual || (item?.rightdualchild && item.level ==2)) && isIndent){
    //   layoutItem =  { 'margin-left' : '0px' };
    // }
    // if(item?.rightdualchild && item.level ==3 && isIndent){
    //   layoutItem =  { 'margin-left' : '50px' };
    // }
    // if(item?.rightdualchild && item.level ==4 && isIndent){
    //   layoutItem =  { 'margin-left' : '70px' };
    // }
    return layoutItem;
  }

  
}