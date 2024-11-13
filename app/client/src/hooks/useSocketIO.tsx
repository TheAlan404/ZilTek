import { ClientAuth } from "@ziltek/common/src/networking/ClientAuth";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { VERSION } from "../meta";
import { EmitOf, ListenerOf } from "./useEvents";
import { useDebug } from "./useDebug";

export const useSocketIO = <I extends Record<string, any>, O extends Record<string, any>>({
    url,
    connect,
    auth,
    onMessage,
}: {
    url: string;
    connect: boolean;
    auth: ClientAuth;
    onMessage: (...m: NoInfer<EmitOf<I>>) => void;
}) => {
    const socket = useRef<Socket<I, O> | null>(null);
    const [isConnected, setConnected] = useState(false);
    const [error, setError] = useState<any>(null);
    const { debug } = useDebug();

    useEffect(() => {
        setConnected(false);
        setError(null);

        if(socket.current) {
            debug("socket", "disconnecting already connected socket");
            socket.current.disconnect();
            socket.current = null;
        };

        socket.current = io(url, {
            auth: {
                ...auth,
                version: VERSION,
            } as ClientAuth,
            autoConnect: false,
        });

        const dispose = () => {
            socket.current?.disconnect();
            socket.current = null;
            debug("socket", "socket disposed");
        };

        if(!connect) return dispose;

        socket.current.connect();
        debug("socket", "connecting...");

        socket.current.on("connect", () => {
            debug("socket", "socket connected");
            setConnected(true);
        });
        socket.current.on("connect_error", (err) => {
            debug("socket", "connect error", err);
            setError(err);
        });
        socket.current.on("disconnect", (reason) => {
            if(reason == "io client disconnect") return;
            debug("socket", "socket disconnected");
            setConnected(false);
        });

        socket.current.onAny((...e: EmitOf<I>) => {
            debug("network", "RECIEVE", ...e);
            onMessage(...e);
        });

        return dispose;
    }, [url, connect]);

    const sendMessage = (...e: EmitOf<O>) => {
        debug("network", "SEND", ...e);
        // @ts-ignore
        socket.current?.emit(...e);
    };

    return {
        isConnected,
        socket,
        sendMessage,
        error,
    };
};
