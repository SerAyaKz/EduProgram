import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en/common.json";
import ru from "../locales/ru/common.json";
import kk from "../locales/kk/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      ru: {
        translation: ru
      },
      kk: {
        translation: kk
      }
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;