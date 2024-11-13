import pkg from "../../../package.json";

export const MODE = (import.meta.env.VITE_MODE || "") as "web" | "tauri" | "";

console.log("Mode", MODE);

export const VERSION = pkg.version;
export const BUILD = "241113"; // YYMMDD
export const DEFAULT_RELAY = "wss://ziltek.deniz.blue";
export const WEBSITE = "https://ziltek.deniz.blue/";
export const DOWNLOAD_LINK = "https://github.com/TheAlan404/ZilTek/releases/latest";
export const HOST_MODE_ALLOWED = true;
export const REMOTE_MODE_ALLOWED = true;
