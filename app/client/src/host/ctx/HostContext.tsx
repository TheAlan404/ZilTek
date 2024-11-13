import { ClientType } from "@ziltek/common/src/networking/ClientType";
import { createContext } from "react";
import { noop } from "@mantine/core";

export type IHost = {
    clientType: ClientType;
    connectTo?: string;
    remoteRelayURL?: string;
    exit: () => void;
};

export const HostContext = createContext<IHost>({
    clientType: "host",
    exit: noop,
});

