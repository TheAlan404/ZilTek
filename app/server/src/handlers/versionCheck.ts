import { VERSION } from "../config.ts";
import { TMiddleware } from "../types.ts";

export const versionCheckMiddleware: TMiddleware = async (socket, next) => {
    let ver = socket.handshake.auth["version"] as string;
    if(ver !== VERSION)
        next(new Error(`Version Mismatch - This server is ${VERSION}`));
    else
        next();
};
