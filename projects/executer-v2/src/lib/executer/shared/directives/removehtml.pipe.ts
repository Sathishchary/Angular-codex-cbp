import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'removehtml'
})
export class removehtmlPipe implements PipeTransform {
   
  constructor(){ }
  
  transform(htmlString: string): any {
    return this.removeHTMLTags(htmlString);
  }

  removeHTMLTags(str:any) {
    if ((str === null) || (str === undefined) || (str === '') )
      return '';
    else
      str = str.toString();
    let finalString = str.replace(/(<([^>]+)>)/ig, '');
    finalString = finalString.replace(/&nbsp;/g, ' ');
    return finalString;
  }

}
