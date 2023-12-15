import { useEffect, useState } from "react";
import { Button, Center, Code, Group, Loader, Stack, Text } from "@mantine/core";
import { ControllerAPI } from "./ControllerAPI";
import { v4 as uuidv4 } from "uuid";
import { useSocketIO } from "./Networking";
import { useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { App } from "../app/App";

export const RemoteHost = ({
    proxyUrl,
    hostId,
    exitRemoteMode,
}) => {
    let { t } = useTranslation();
    let [remoteId, setRemoteId] = useLocalStorage({
        key: "ziltek-remote-id",
    });

    if(!remoteId) setRemoteId(uuidv4());

    let [bigState, setBigState] = useState(null);

    let {
        socket,
        isConnected,
    } = useSocketIO({
        url: proxyUrl,
        connect: true,
        deps: [],
        events: {
            updateState: setBigState,
        },
        auth: {
            mode: "remote",
            hostId,
            remoteId,
        },
    });

    const processCommand = (cmd) => {
        socket.current?.emit("processCommand", cmd);
    };

    return (
        bigState ? (
            <ControllerAPI.Provider value={{
                ...bigState,
                processCommand,
                hostMode: "remote",
                exit: () => exitRemoteMode(),
            }}>
                <App />
            </ControllerAPI.Provider>
        ) : (
            <Center h="100%" p="xl">
                <Stack align="center" ta="center">
                    <Loader />
                    <Text>
                        {t("rc.connecting")}
                    </Text>
                    <Group>
                        <Code>{remoteId}</Code>
                        <Text>{"==>"}</Text>
                        <Code>{hostId}</Code>
                    </Group>
                    <Button
                        color="red"
                        variant="light"
                        onClick={() => {
                            exitRemoteMode();
                        }}
                    >
                        {t("rc.disconnect")}
                    </Button>
                </Stack>
            </Center>
        )
    );
}
