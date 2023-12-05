import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let resources = {
    en: {
        translation: {
            by_dennis: "by dennis",
            error: "Error",
            language: "Language",

            mode: {
                local: {
                    button: "Enter Local Mode",
                    checkbox: "Enable local mode for this computer",
                    desc: "When ZilTek starts, it will enter local mode automatically if enabled",
                    running: "Running in Local Mode",
                },
                remote: {
                    name: "Remote Mode",
                    desc: "Connect to another ZilTek running in Local Mode to remote control it",
                    list: "Remotes List",
                    add: "Add a Remote",
                    running: "Connected to a remote ZilTek",
                },
                proxyurl: "Proxy URL",
            },

            audio: {
                playfailed: "Audio play failed! Try clicking on the window or check app permissions.",
            },
        }
    },
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
