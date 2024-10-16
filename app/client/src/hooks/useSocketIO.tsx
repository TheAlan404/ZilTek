import { ClientAuth } from "@ziltek/common/src/networking/ClientAuth";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { VERSION } from "../meta";
import { EmitOf, ListenerOf } from "./useEvents";

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

    useEffect(() => {
        setConnected(false);

        if(socket.current) {
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

        const dispose = () => { socket.current?.disconnect() };

        if(!connect) return dispose;

        socket.current.connect();

        socket.current.on("connect", () => setConnected(true));
        socket.current.on("disconnect", (reason) => {
            if(reason == "io client disconnect") return;
            setConnected(false);
        });

        socket.current.onAny((...e: EmitOf<I>) => {
            onMessage(...e);
        });

        return dispose;
    }, [url, connect]);

    const sendMessage = (...e: EmitOf<O>) => {
        socket.current?.send(...e);
    };

    return {
        isConnected,
        socket,
        sendMessage,
    };
};
