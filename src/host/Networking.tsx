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

type Sock = Socket<ServerToClientEvents, ClientToServerEvents>;

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
    authenticatedRemotes: string[],
}): {
    socket: React.RefObject<Sock>,
    isConnected: boolean,
    connectedRemotes: string[],
    remoteQueue: { remoteId: string, cb: (accept: boolean) => void }[],
} => {
    let [isConnected, setIsConnected] = useState(false);
    let [connectedRemotes, setConnectedRemotes] = useState([]);
    let [remoteQueue, setRemoteQueue] = useState<{ remoteId: string, cb: (accept: boolean) => void }[]>([]);
    let socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);

    useEffect(() => {
        socket.current = io(url, {
            autoConnect: connect,
            auth,
        });
    }, [connect, url, auth]);

    useEffect(() => {
        if (connect)
            socket.current?.connect();

        return () => socket.current?.disconnect();
    }, [connect]);

    useEffect(() => {
        socket.current?.on("remoteConnected", (remoteId) => {
            setConnectedRemotes(l => [...l, remoteId]);
        });
        socket.current?.on("remoteDisconnected", (remoteId) => {
            setConnectedRemotes(l => l.filter(x => x !== remoteId));
        });

        return () => {
            socket.current?.off("remoteConnected");
            socket.current?.off("remoteDisconnected");
        }
    }, [connectedRemotes]);

    useEffect(() => {
        socket.current?.on("remoteConnectionRequest", (remoteId, cb) => {
            setRemoteQueue(r => [...r, {
                remoteId,
                cb: (accept: boolean) => {
                    cb(accept);
                    setRemoteQueue(q => q.filter(x => x.remoteId !== remoteId));
                },
            }]);
        });

        return () => {
            socket.current?.off("remoteConnectionRequest");
        }
    }, [authenticatedRemotes]);

    useEffect(() => {
        socket.current?.on("connect", () => {
            setIsConnected(true);
            console.log("socket.io connected");
        });

        socket.current?.on("disconnect", () => {
            setIsConnected(false);
            console.log("socket.io closed");
        });

        socket.current?.onAny((...a) => console.log("Networking::onAny", ...a));

        socket.current?.on("connect_error", (e) => console.log(e));

        return () => {
            socket.current?.off("connect");
            socket.current?.off("connect_error");
            socket.current?.offAny();
        };
    }, []);

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
        isConnected,
        connectedRemotes,
        remoteQueue,
    };
}
