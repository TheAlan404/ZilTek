import pkg from "../../../package.json" with { type: "json" };

export const PORT = Number(process.env.PORT) || 3000;
export const ADDR = process.env.ADDR || "0.0.0.0";
export const VERSION = pkg.version;
export const DIST_FOLDER = process.env.DIST || "./dist";
export const DATABASE_PATH = "./db.json";
