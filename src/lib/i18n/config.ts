import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';

export type Locale = 'en' | 'ar';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'ar'];

const dictionaries = {
  en,
  ar,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') {
    return cleanPath;
  }
  return `/ar${cleanPath === '/' ? '' : cleanPath}`;
}
