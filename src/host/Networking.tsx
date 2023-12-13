import React, { useContext, useEffect, useRef } from "react";

export const useCustomWebSocket = ({
    url,
    events,
    deps = [],
}: {
    url: string,
    events: WebSocketEventMap,
    deps: React.DependencyList,
}) => {
    let ws = useRef(new WebSocket(url));

    useEffect(() => {
        for(let [k, v] of Object.values(events)) {
            ws.current[`on${k}`] = v;
        }
    }, [events]);

    return {
        send(msg) {
            ws.current.send(JSON.stringify(msg));
        }
    };
}
