import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StylesService } from '../services/styles.service';
@Pipe({
  name: 'fontSizePx'
})
export class FontSizePipe implements PipeTransform {

  constructor(public sanitizer: DomSanitizer, public stylesService: StylesService){

  }
  transform(date: string): any {
    date = this.stylesService.getFontStyles(date);
    return date;
  }

}
