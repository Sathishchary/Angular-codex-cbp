import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'capital'
})
export class CaptalLetter implements PipeTransform {
  constructor(){
  }
  transform(string: string): any {
    return string === '' ? '' :string.charAt(0).toUpperCase() + string.slice(1);
  }
}
