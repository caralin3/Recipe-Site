import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToLabel'
})
export class NumberToLabelPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if (value === 1) {
      return "one";
    } else if (value == 2) {
      return "two";
    } else if (value == 3) {
      return "three";
    } else if (value == 4) {
      return "four";
    } else if (value == 5) {
      return "five";
    } else if (value == 6) {
      return "six";
    } else if (value == 7) {
      return "seven";
    } else if (value == 8) {
      return "eight";
    } else if (value == 9) {
      return "nine";
    } else if (value == 10) {
      return "ten";
    } else if (value == 11) {
      return "eleven";
    } else if (value == 12) {
      return "twelve";
    } else if (value == 13) {
      return "thirteen";
    } else if (value == 14) {
      return "fourteen";
    } else if (value == 15) {
      return "fifteen";
    } else if (value == 16) {
      return "sixteen";
    } else if (value == 17) {
      return "seventeen";
    } else if (value == 18) {
      return "eightteen";
    } else if (value == 19) {
      return "nineteen";
    } else if (value == 20) {
      return "twenty";
    } 
  }

}
