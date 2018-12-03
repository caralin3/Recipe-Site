import { CalendarEvent } from "angular-calendar";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

export const externalEvents: CalendarEvent[] = [
  {
    title: 'Event 1',
    color: colors.yellow,
    start: new Date(),
    draggable: true
  },
  {
    title: 'Event 2',
    color: colors.blue,
    start: new Date(),
    draggable: true
  }
];