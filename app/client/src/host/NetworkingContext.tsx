import { useLocalStorage, useSet } from "@mantine/hooks";
import React, { useMemo, useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_RELAY } from "../meta";
import { ListAction, modifyList } from "@ziltek/common/src/ListAction";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";
import { ClientType } from "@ziltek/common/src/networking/ClientType";

export type INetworkingContext = {
    clientType: ClientType;
    selfHostId: string;
    remoteHostId?: string;

    relayURL: string;
    setRelayURL: (url: string) => void;

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
    children,
    clientType,
}: {
    clientType: ClientType;
} & React.PropsWithChildren) => {
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
    const [knownRemotes, setKnownRemotes] = useLocalStorage<KnownRemote[]>({
        key: "ziltek-authenticated-remotes",
        defaultValue: [],
    })

    // -- State --

    const connectedRemotes = useSet<string>([]);
    const connectionQueue = useSet<string>([]);

    // -- Logic --

    

    return (
        <NetworkingContext.Provider
            value={{
                clientType,
                selfHostId: hostId,
                remoteHostId: "",
                relayURL,
                setRelayURL,
                rcEnabled,
                setRCEnabled,
                knownRemotes,
                modifyKnownRemotes: (act) => setKnownRemotes(prev => modifyList(prev, act)),
                connectedRemotes: Array.from(connectedRemotes),
                connectionQueue: Array.from(connectionQueue),
                
            }}
        >
            {children}
        </NetworkingContext.Provider>
    )
};
