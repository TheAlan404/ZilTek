import { ClientType } from "@ziltek/common/src/networking/ClientType";
import { createContext, useContext } from "react";
import { LocalHost } from "./Local";
import { RemoteHost } from "./Remote";

export type IHost = {
    clientType: ClientType;
    connectTo?: string;
    exit?: () => void;
};

export const HostContext = createContext<IHost>({
    clientType: "host",
});

export const Host = () => {
    const { clientType } = useContext(HostContext);

    if(clientType == "host") {
        return <LocalHost />;
    } else {
        return <RemoteHost />;
    }
};
