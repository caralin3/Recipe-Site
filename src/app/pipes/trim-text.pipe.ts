import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText'
})
export class TrimTextPipe implements PipeTransform {

  transform(value: string, limit: number, stars?: number): string {
    if (value.length > limit) {
      if (stars < 3) {
        return value.slice(0, limit + 5) + ' ...';
      }
      if (stars < 4) {
        return value.slice(0, limit + 3) + ' ...';
      }
      return value.slice(0, limit) + ' ...';
    }
    return value;
  }
}
