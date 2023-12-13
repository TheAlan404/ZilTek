import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Center, Text } from "@mantine/core";
import { ControllerAPI } from "./ControllerAPI";
import { v4 } from "uuid";

export const RemoteHost = ({
    proxyUrl,
    hostId,
    exitRemoteMode,
}) => {
    let [connecting, setConnecting] = useState(true);
    let [bigState, setBigState] = useState(null);

    let { sendJsonMessage, readyState } = useWebSocket(proxyUrl, {
        onMessage(e) {
            let json = JSON.parse(e.data);

            if(json.type == "Proxy") {
                setBigState(json.data);
            }
        }
    });

    useEffect(() => {
        if (readyState == ReadyState.OPEN) {
            sendJsonMessage({
                type: "Connect",
                data: {
                    remoteId: v4(), // TODO
                    hostId,
                },
            })
        }
    }, [readyState]);

    const processCommand = (cmd) => {
        sendJsonMessage({
            type: "Send",
            data: cmd,
        });
    };

    return (
        bigState ? (
            <ControllerAPI.Provider value={{
                ...bigState,
                processCommand,
            }}>
                <App />
            </ControllerAPI.Provider>
        ) : (
            <Center>
                <Text>Loading...</Text>
            </Center>
        )
    );
}
