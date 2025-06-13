import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'innerhtml'
})
export class InnerhtmlPipe implements PipeTransform {
   
  constructor(public sanitizer: DomSanitizer){

  }
  transform(htmlString: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

}
