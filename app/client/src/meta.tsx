import pkg from "../package.json";

export const MODE = (import.meta.env.VITE_MODE || "") as "web" | "tauri" | "";

export const VERSION = pkg.version;
export const BUILD = "241025"; // YYMMDD
export const DEFAULT_RELAY = "wss://ziltek.deniz.blue";
export const UPDATE_URL = "https://raw.githack.com/TheAlan404/ZilTekProject/main/metadata.json";
export const WEBSITE = "https://ziltek.deniz.blue/";
export const DOWNLOAD_LINK = "https://github.com/TheAlan404/ZilTekProject/releases/latest";
export const LIGHTTUBE_INSTANCES = "https://raw.githubusercontent.com/kuylar/LightTube/master/public_instances.json";
export const HOST_MODE_ALLOWED = true;
export const REMOTE_MODE_ALLOWED = true;
