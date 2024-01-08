import React, { useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../proxy/index";
import { notifications } from "@mantine/notifications";

export interface NetworkingAuth {
    mode: "host" | "remote",
    hostId: string,
    hostKey: string | null,
    remoteId: string | null,
}

export interface Remote {
    remoteId: string,
    label: string,
    cb: ((accept: boolean) => void) | null,
}

type Sock = Socket<ServerToClientEvents, ClientToServerEvents>;
type SockRef = React.RefObject<Sock>;

interface UseSocketIOResult {
    socket: SockRef,
    isConnected: boolean,
    connectedRemotes: string[],
    remoteQueue: Remote[],
    isHostAlive: boolean,
}

const log = (s) => console.debug(`[networking] ${s}`);

export const useSocketIO = ({
    url,
    connect,
    events,
    deps = [],
    auth,
    authenticatedRemotes = [],
}: {
    url: string,
    connect: boolean,
    events: ServerToClientEvents,
    deps: React.DependencyList,
    auth: NetworkingAuth,
    authenticatedRemotes: Remote[],
}): UseSocketIOResult => {
    let [isConnected, setIsConnected] = useState(false);
    let [isHostAlive, setIsHostAlive] = useState(false);
    let [connectedRemotes, setConnectedRemotes] = useState([]);
    let [socketStatus, setSocketStatus] = useState("");
    let [remoteQueue, setRemoteQueue] = useState<{ remoteId: string, cb: (accept: boolean) => void }[]>([]);
    let socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);

    useEffect(() => {
        if(socket.current) socket.current.disconnect();
        socket.current = io(url, {
            autoConnect: connect,
            auth,
        });
    }, [connect, url]);

    useEffect(() => {
        if (connect) {
            log("connecting...")
            socket.current?.connect();
        }

        return () => socket.current?.disconnect();
    }, [connect]);

    useEffect(() => {
        socket.current?.on("remoteConnected", (remoteId) => {
            setConnectedRemotes(l => [...l, remoteId]);
            log(`remoteConnected: ${remoteId}`);
        });
        socket.current?.on("remoteDisconnected", (remoteId) => {
            setConnectedRemotes(l => l.filter(x => x !== remoteId));
            log(`remoteDisconnected: ${remoteId}`);
        });

        return () => {
            socket.current?.off("remoteConnected");
            socket.current?.off("remoteDisconnected");
        }
    }, [setConnectedRemotes]);

    useEffect(() => {
        socket.current?.on("remoteConnectionRequest", (remoteId, cb) => {
            if (authenticatedRemotes.some((r) => r.remoteId === remoteId)) {
                cb(true);
                log(`authenticated remote accepted: ${remoteId}`);
            } else {
                log(`unknown remote wants to connect: ${remoteId}`);
                setRemoteQueue(r => [...r, {
                    remoteId,
                    cb: (accept: boolean) => {
                        cb(accept);
                        log(`remote ${accept ? "accepted" : "denied"}: ${remoteId}`);
                        setRemoteQueue(q => q.filter(x => x.remoteId !== remoteId));
                    },
                }]);
            }
        });

        return () => {
            socket.current?.off("remoteConnectionRequest");
        }
    }, [authenticatedRemotes]);

    useEffect(() => {
        socket.current?.on("connect", () => {
            setIsConnected(true);
            setSocketStatus("rc.connected");
            log("socket.io connected");
        });

        socket.current?.on("disconnect", () => {
            setIsConnected(false);
            log("socket.io disconnected");
        });

        socket.current?.on("updateHostState", (con) => {
            if(!con) setSocketStatus("errors.hostDisconnected");
            setIsHostAlive(con);
        });

        socket.current?.onAny((...a) => console.log("Networking::onAny", ...a));

        socket.current?.on("connect_error", (e) => {
            setSocketStatus("errors.socketError");
            console.log(e);
        });

        return () => {
            socket.current?.off("connect");
            socket.current?.off("connect_error");
            socket.current?.off("updateHostState");
            socket.current?.offAny();
        };
    }, [socket.current]);

    useEffect(() => {
        socket.current?.on("processCommand", events.processCommand);
        socket.current?.on("updateState", events.updateState);

        return () => {
            socket.current?.off("processCommand", events.processCommand);
            socket.current?.off("updateState", events.updateState);
        };
    }, [events.processCommand, events.updateState]);

    return {
        socket,
        socketStatus,
        isConnected,
        connectedRemotes,
        remoteQueue,
        isHostAlive,
    };
}
