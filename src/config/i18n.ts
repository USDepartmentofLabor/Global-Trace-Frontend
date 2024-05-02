import Vue from 'vue';
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import { getLocalStorage } from 'utils/store';
import { langEn, langUr, DEFAULT_LANGUAGE } from './constants';

Vue.use(VueI18Next);

const currentLanguage = getLocalStorage('language');

i18next.init({
  lng: currentLanguage || DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  resources: {
    en: {
      translation: langEn,
    },
    ur: {
      translation: langUr,
    },
  },
});
const i18n = new VueI18Next(i18next);

export default i18n;
