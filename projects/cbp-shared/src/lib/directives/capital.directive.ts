import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'capital'
})
export class CaptalLetter implements PipeTransform {
  constructor(public sanitizer: DomSanitizer){
  }
  transform(string: string): any {
    return string === '' ? '' :string.charAt(0).toUpperCase() + string.slice(1)
  }
}
