export { BOUNCE_FEE } from "#/shared/config/appConfig";

export const MIN_TERM_DAYS = 365;
export const MAX_TERM_DAYS = 10 * 365;
export const MAX_AMOUNT = 999999;

export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMinDate(): Date {
  const d = getToday();
  d.setDate(d.getDate() + MIN_TERM_DAYS);
  return d;
}

export function getMaxDate(): Date {
  const d = getToday();
  d.setDate(d.getDate() + MAX_TERM_DAYS);
  return d;
}

/** @deprecated Use getToday() */
export const today = getToday();
/** @deprecated Use getMinDate() */
export const minDate = getMinDate();
/** @deprecated Use getMaxDate() */
export const maxDate = getMaxDate();
