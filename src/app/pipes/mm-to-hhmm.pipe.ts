import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mmToHhmm'
})
export class MmToHhmmPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 60) {
      const hour = Math.floor(value / 60);
      const min = value % 60;
      return `${hour} h ${min} min`;
    }
    return `${value} min`;
  }

}
