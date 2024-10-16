import { useLocalStorage, useSet } from "@mantine/hooks";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_RELAY } from "../meta";
import { ListAction, modifyList } from "@ziltek/common/src/ListAction";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";
import { ClientType } from "@ziltek/common/src/networking/ClientType";
import { useSocketIO } from "../hooks/useSocketIO";
import { ClientAuth } from "@ziltek/common/src/networking/ClientAuth";
import { C2SMessageMap, HostMessageMap, S2CMessageMap } from "@ziltek/common/src/networking/Message";
import { noop } from "@mantine/core";
import { EmitOf, EventEmitter, ListenerOf, useEventEmitter } from "../hooks/useEvents";
import { HostContext } from "./Host";
import { Command } from "@ziltek/common/src/cmd/Command";

export type INetworkingContext = {
    clientType: ClientType;
    relayURL: string;
    setRelayURL: (url: string) => void;
    isConnected: boolean;
    emitter: EventEmitter<HostMessageMap>;
    
    // clientType == "remote"
    remoteHostId?: string;
    processCommand: (cmd: Command) => void;
    
    // clientType == "host"
    selfHostId: string;
    rcEnabled: boolean;
    setRCEnabled: (b: boolean) => void;
    knownRemotes: KnownRemote[];
    modifyKnownRemotes: (act: ListAction<KnownRemote>) => void;
    connectedRemotes: string[];
    connectionQueue: string[];
    acceptConnection: (id: string) => void;
    denyConnection: (id: string) => void;
    kickConnectedRemote: (id: string) => void;
};

const useSingleReadLocalStorage = (key: string, def: string) => {
    if(!localStorage.getItem(key))
        localStorage.setItem(key, def);
    return useMemo(() => localStorage.getItem(key)!, []);
};

export const NetworkingContext = React.createContext<INetworkingContext>({} as INetworkingContext);

export const NetworkingProvider = ({
    children
}: React.PropsWithChildren) => {
    const { clientType, connectTo } = useContext(HostContext);
    
    // -- Stored --

    let [relayURL, setRelayURL] = useLocalStorage({
        key: "ziltek-proxy-url",
        defaultValue: DEFAULT_RELAY,
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

    const onMessage = (...[t, d]: EmitOf<S2CMessageMap>) => {
        const handlers: Partial<S2CMessageMap> = {
            IncomingRemoteConnection: (remoteId) => {
                connectedRemotes.delete(remoteId);
                connectionQueue.add(remoteId);
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
        };

        ((handlers[t] || noop) as any)(d);
    };

    const { isConnected, sendMessage, socket } = useSocketIO<S2CMessageMap, C2SMessageMap>({
        url: relayURL,
        connect: rcEnabled || clientType == "remote",
        auth,
        onMessage,
    });

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
                clientType,
                selfHostId: hostId,
                remoteHostId: connectTo,
                relayURL,
                setRelayURL,
                rcEnabled,
                setRCEnabled,
                knownRemotes,
                modifyKnownRemotes: (act) => setKnownRemotes(prev => modifyList(prev, act)),
                connectedRemotes: Array.from(connectedRemotes),
                connectionQueue: Array.from(connectionQueue),
                acceptConnection,
                denyConnection,
                kickConnectedRemote,
                isConnected,
                emitter,
                processCommand,
            }}
        >
            {children}
        </NetworkingContext.Provider>
    )
};
