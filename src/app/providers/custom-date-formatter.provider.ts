import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    if (window.innerWidth < 760) {
      return new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date).substr(0, 1);
    }
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'dd', locale);
  }

  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE, MMM, dd y', locale);
  }
}