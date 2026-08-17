import { getLocale, baseLocale } from "#/paraglide/runtime";

export {
  getLocale,
  setLocale,
  locales,
  baseLocale,
  localizeHref,
  deLocalizeHref,
} from "#/paraglide/runtime";

/**
 * Returns the URL prefix for the current locale.
 * "" for the base locale, "/<locale>" otherwise.
 */
export function getLocaleBasepath(): string {
  const locale = getLocale();
  return locale === baseLocale ? "" : `/${locale}`;
}
