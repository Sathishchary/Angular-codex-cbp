import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePlaceholder'
})
export class DatePlaceholderPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.getPlaceHolder(value);
  }

  getPlaceHolder(res: any) {
    if (!res) {
      res = 'mm/dd/yyyy';
    }
    const mapObj = { m: "mm", M: "mon", Y: "yyyy", j: "dd" };
    return res.replace(/\b(?:m|M|Y|j)\b/gi, (matched: any) => mapObj[matched]);
  }
}
