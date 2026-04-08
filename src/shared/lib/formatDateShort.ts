import { getLocale } from "#/shared/i18n";

export const formatDateShort = (date: Date): string =>
  date.toLocaleDateString(getLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
