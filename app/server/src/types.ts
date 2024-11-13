import { C2SMessageMap, S2CMessageMap } from "@ziltek/common/src/networking/Message.tsx";
import { Socket, Server } from "socket.io";

export interface InterServerEvents {};

export type SocketData = {

};

export type TServer = Server<
    C2SMessageMap,
    S2CMessageMap,
    InterServerEvents,
    SocketData
>;

export type TSocket = Socket<
    C2SMessageMap,
    S2CMessageMap,
    InterServerEvents,
    SocketData
>;

export type TMiddleware = Parameters<TServer["use"]>[0];
