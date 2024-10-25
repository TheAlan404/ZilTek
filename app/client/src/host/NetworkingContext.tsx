import React from "react";
import { ListAction } from "@ziltek/common/src/ListAction";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";
import { C2SMessageMap, HostMessageMap, S2CMessageMap } from "@ziltek/common/src/networking/Message";
import { EventEmitter } from "../hooks/useEvents";
import { Command } from "@ziltek/common/src/cmd/Command";
import { Socket } from "socket.io-client";

export type INetworkingContext = {
    label: string;
    setLabel: (label: string) => void;
    isConnected: boolean;
    emitter: EventEmitter<HostMessageMap>;
    socket: React.MutableRefObject<Socket<S2CMessageMap, C2SMessageMap> | null>;
    error?: any;
    
    // clientType == "remote"
    remoteId?: string;
    remoteRelayURL?: string;
    connectTo?: string;
    processCommand: (cmd: Command) => void;
    
    // clientType == "host"
    hostRelayURL: string;
    setHostRelayURL: (url: string) => void;
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

export const NetworkingContext = React.createContext<INetworkingContext>({} as INetworkingContext);
