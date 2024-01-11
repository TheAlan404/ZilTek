import pkg from "../package.json";

export const MODE = import.meta.env.VITE_MODE;

export const VERSION = pkg.version;
export const BUILD = "240110";
export const DEFAULT_RELAY = "wss://ziltek.kuylar.dev";
export const UPDATE_URL = "https://raw.githack.com/TheAlan404/ZilTekProject/main/metadata.json";
export const WEBSITE = "https://thealan404.github.io/ziltekproject";
export const DOWNLOAD_LINK = "https://github.com/TheAlan404/ZilTekProject/releases/latest";
export const QRCODE_PREFIX = "https://ziltek.kuylar.dev/";
export const HOST_MODE_ALLOWED = true;
export const REMOTE_MODE_ALLOWED = true;
