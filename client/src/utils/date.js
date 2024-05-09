import {HOLIDAYS} from '../constants';

export const isSummer = (date) => {
  return date.slice(5, 7) === '07' || date.slice(5, 7) === '08'
}

export const isSummerBlon = (date) => {
  const month = parseInt(date.slice(5, 7));
  const day = parseInt(date.slice(8, 10));

  if (month === 7 && day >= 20) {
    return true;
  } else if (month === 8 && day <= 20) {
    return true;
  } else {
    return false;
  }
}

export const isWeekday = (date) => {
  const dayIdx = new Date(date).getDay();
  return dayIdx !== 5 && dayIdx !== 6;
}

export const isFriday = (date) => {
  const dayIdx = new Date(date).getDay();
  return dayIdx === 5;
}

export const isSaturday = (date) => {
  const dayIdx = new Date(date).getDay();
  return dayIdx === 6;
}

export const isHoliday = (date) => {
  return HOLIDAYS.includes(date);
}