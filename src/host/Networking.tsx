import React, { useContext, useRef } from "react";

export interface NetworkingCtx {
    
}

export const Networking = React.createContext<NetworkingCtx>({

});

export const NetworkingProvider = ({
    children,
    proxyUrl,
}: {
    children: React.ReactElement,
    proxyUrl: string,
}) => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(proxyUrl);
    
    return (
        <Networking.Provider>
            {children}
        </Networking.Provider>
    )
}

export const NetworkingState = () => {
    const {} = useContext(Networking);


}
