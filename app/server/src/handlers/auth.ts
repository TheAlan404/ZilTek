import { ClientAuth, ClientType } from "@ziltek/common";
import { db } from "../db.ts";
import { TMiddleware } from "../types.ts";

export const validateClientType = (s: any): s is ClientType => typeof s == "string" && (s == "host" || s == "remote");

export const validateClientAuth = (t: any): t is ClientAuth => {
    return typeof t == "object" && typeof t["version"] == "string" && validateClientType(t["mode"]) && (
        t["mode"] == "host" ? (
            typeof t["hostId"] == "string"
            && typeof t["hostKey"] == "string"
        ) : (
            typeof t["connectTo"] == "string"
            && typeof t["remoteId"] == "string"
        )
    );
};

export const authenticationMiddleware: TMiddleware = async (socket, next) => {
    let auth = socket.handshake.auth;
    
    if(!validateClientAuth(auth)) {
        return next(new Error("Invalid ClientAuth"));
    }

    if(auth.mode == "host") {
        if(await db.hostExists(auth.hostId)) {
            if(await db.getHostKey(auth.hostId) !== auth.hostKey) {
                return next(new Error("Invalid hostKey"));
            }

            return next();
        }

        await db.setHostKey(auth.hostId, auth.hostKey);
        return next();
    } else {
        return next();
    }
};
