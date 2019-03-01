import * as i18n from 'i18next';
import * as LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en.json';
import es from './translations/es.json';

const instance = i18n.use(LanguageDetector).init({
  fallbackLng: 'en',
  defaultNS: 'translation',
  resources: {
    en,
    es
  },

  debug: false,

  interpolation: {
    escapeValue: false // not needed for react!!
  },

  react: {
    wait: true
  }
});

export default instance;
