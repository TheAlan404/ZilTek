import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage, useSet } from "@mantine/hooks";
import { useSocketIO } from "../hooks/useSocketIO";
import { ClientAuth } from "@ziltek/common/src/networking/ClientAuth";
import { noop } from "@mantine/core";
import { EmitOf, useEventEmitter } from "../hooks/useEvents";
import { HostContext } from "./ctx/HostContext";
import { v4 } from "uuid";
import { DEFAULT_RELAY } from "../meta";
import { C2SMessageMap, HostMessageMap, S2CMessageMap } from "@ziltek/common/src/networking/Message";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";
import { Command } from "@ziltek/common/src/cmd/Command";
import { NetworkingContext } from "./ctx/NetworkingContext";
import { applyListAction } from "@ziltek/common/src/ListAction";
import { HostStatus } from "@ziltek/common/src/networking/HostStatus";

const useSingleReadLocalStorage = (key: string, def: string) => {
    if(!localStorage.getItem(key))
        localStorage.setItem(key, def);
    return useMemo(() => localStorage.getItem(key)!, []);
};

export const NetworkingProvider = ({
    children
}: React.PropsWithChildren) => {
    const { clientType, connectTo, remoteRelayURL } = useContext(HostContext);
    
    // -- Stored --

    let [hostRelayURL, setHostRelayURL] = useLocalStorage({
        key: "ziltek-proxy-url",
        defaultValue: DEFAULT_RELAY,
    });
    let [label, setLabel] = useLocalStorage({
        key: "ziltek-host-label",
        defaultValue: "",
    });
    const [rcEnabled, setRCEnabled] = useLocalStorage<boolean>({
        key: "ziltek-remote-control-enabled",
        defaultValue: false,
    })
    const hostId = useSingleReadLocalStorage("ziltek-host-id", v4());
    const hostKey = useSingleReadLocalStorage("ziltek-host-key", v4());
    const remoteId = useSingleReadLocalStorage("ziltek-remote-id", v4());
    const [knownRemotes, setKnownRemotes] = useLocalStorage<KnownRemote[]>({
        key: "ziltek-authenticated-remotes",
        defaultValue: [],
    })

    // -- State --

    const emitter = useEventEmitter<HostMessageMap>();
    const connectedRemotes = useSet<string>([]);
    const connectionQueue = useSet<string>([]);
    const [hostStatus, setHostStatus] = useState<HostStatus>("connecting");

    const modifyKnownRemotes = (act) => setKnownRemotes(prev => (
        applyListAction(prev, act)
    ));

    // -- Socket IO --

    const version = "";
    const auth: ClientAuth = clientType == "host" ? {
        mode: "host",
        hostId,
        hostKey,
        version,
    } : {
        mode: "remote",
        remoteId,
        connectTo: connectTo!,
        version,
    };

    const onMessage = (...[t, ...d]: EmitOf<S2CMessageMap>) => {
        const handlers: Partial<S2CMessageMap> = {
            IncomingRemoteConnection: (remoteId) => {
                connectedRemotes.delete(remoteId);
                if(knownRemotes.some(x => x.remoteId == remoteId)) {
                    acceptConnection(remoteId);
                } else {
                    connectionQueue.add(remoteId);
                };
            },
            RemoteConnected: (remoteId) => {
                connectionQueue.delete(remoteId);
                connectedRemotes.add(remoteId);
            },
            RemoteDisonnected: (remoteId) => {
                connectionQueue.delete(remoteId);
                connectedRemotes.delete(remoteId);
            },
            ProcessCommand: (cmd) => emitter.emit("ProcessCommand", cmd),
            UpdateState: (st) => emitter.emit("UpdateState", st),
            SetFilesList: (f) => emitter.emit("SetFilesList", f),
            HostStatusChanged: (status) => setHostStatus(status),
            RequestFile: (filename, cb) => emitter.emit("RequestFile", filename, cb),
        };

        ((handlers[t] || noop) as any)(...d);
    };

    const { isConnected, sendMessage, socket, error } = useSocketIO<S2CMessageMap, C2SMessageMap>({
        url: remoteRelayURL || hostRelayURL,
        connect: rcEnabled || clientType == "remote",
        auth,
        onMessage,
    });

    useEffect(() => {
        if(!isConnected) {
            connectedRemotes.clear();
            connectionQueue.clear();
            setHostStatus("remoteDisconnected");
        }
    }, [isConnected]);

    // -- Provided Methods --

    const acceptConnection = (remoteId: string) => {
        sendMessage("AcceptConnection", remoteId);
    };
    
    const denyConnection = (remoteId: string) => {
        sendMessage("DenyConnection", remoteId);
    };
    
    const kickConnectedRemote = (remoteId: string) => {
        sendMessage("DisconnectConnection", remoteId);
    };

    const processCommand = (cmd: Command) => {
        sendMessage("ProcessCommand", cmd);
    };

    return (
        <NetworkingContext.Provider
            value={{
                socket,
                selfHostId: hostId,
                label,
                setLabel,
                remoteId,
                connectTo,
                hostRelayURL,
                setHostRelayURL,
                rcEnabled,
                setRCEnabled,
                knownRemotes,
                modifyKnownRemotes,
                connectedRemotes: Array.from(connectedRemotes),
                connectionQueue: Array.from(connectionQueue),
                acceptConnection,
                denyConnection,
                kickConnectedRemote,
                isConnected,
                emitter,
                processCommand,
                error,
                hostStatus,
                sendMessage,
            }}
        >
            {children}
        </NetworkingContext.Provider>
    )
};
