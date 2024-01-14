import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_RELAY } from "./meta";
import en from "./translations/en";
import tr from "./translations/tr";

const resources = {
    en: {
        translation: en,
    },

    tr: {
        translation: tr,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
