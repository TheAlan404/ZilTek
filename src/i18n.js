import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        error: "Error",

        mode: {
            local: {
                button: "Enter Local Mode",
                checkbox: "Enable local mode for this computer",
                desc: "When ZilTek starts, it will enter local mode automatically if enabled",
            },
            remote: {
                name: "Remote Mode",
                desc: "Connect to another ZilTek running in Local Mode to remote control it",
                list: "Remotes List",
                add: "Add a Remote",
            },
            proxyurl: "Proxy URL",
        },

        audio: {
            playfailed: "Audio play failed! Try clicking on the window or check app permissions.",
        },
    }
};

i18n
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
