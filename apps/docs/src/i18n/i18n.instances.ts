import i18next from 'i18next';
import type { i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DOCS_SITE } from '../docs.config';
import en from './locales/en/translation.json';
import uk from './locales/uk/translation.json';

const RESOURCES = {
  en: { docs: en },
  uk: { docs: uk },
};

// NOTE: one instance per locale, its language fixed. The locale comes from the route (each
// locale has its own routes, see routes.tsx), so nothing ever switches a shared instance: the
// server can render pages of both languages at once, the static export one after another.
const createI18nInstance = (locale: string): I18nInstance => {
  const instance = i18next.createInstance();

  instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DOCS_SITE.defaultLocale,
    resources: RESOURCES,
    defaultNS: 'docs',
    // NOTE: the resources are bundled, so the instance is ready synchronously, on the server too
    initAsync: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

  return instance;
};

const I18N_INSTANCE__BY_LOCALE: Record<string, I18nInstance> =
  Object.fromEntries(
    Object.keys(DOCS_SITE.locales).map((locale) => [
      locale,
      createI18nInstance(locale),
    ]),
  );

export { I18N_INSTANCE__BY_LOCALE };
