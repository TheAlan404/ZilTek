import { log } from "../logger.ts";
import { TMiddleware } from "../types.ts";

export const inspectMiddleware: TMiddleware = (socket, next) => {
    let h = (socket.handshake.auth.remoteId || socket.handshake.auth.hostId || "")
        .split("-")[0];
    
    socket.onAny((...e) => {
        log("trace", `FROM ${h} :: ${JSON.stringify(e.map(x => typeof x == "string" ? x : 0))}`)
    });
    
    socket.onAnyOutgoing((...e) => {
        log("trace", `TO ${h} :: ${JSON.stringify(e.map(x => typeof x == "string" ? x : 0))}`)
    });

    next();
};
