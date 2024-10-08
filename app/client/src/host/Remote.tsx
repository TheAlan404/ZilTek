import { useEffect, useMemo, useState } from "react";
import { Button, Center, Code, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { ControllerAPI } from "./ControllerAPI";
import { v4 as uuidv4 } from "uuid";
import { useSocketIO } from "./Networking";
import { useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { App } from "../app/App";
import { IconPlugX, IconUserX } from "@tabler/icons-react";

export const RemoteHost = ({
    proxyUrl,
    hostId,
    exitRemoteMode,
}) => {
    let { t } = useTranslation();
    if(!localStorage.getItem("ziltek-remote-id"))
        localStorage.setItem("ziltek-remote-id", uuidv4());
    const remoteId = useMemo(() => localStorage.getItem("ziltek-remote-id"), []);

    let [bigState, setBigState] = useState(null);

    let {
        socket,
        isConnected,
        hostState,
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
        socket.current?.volatile.emit("processCommand", cmd);
    };

    return (
        (bigState && !["offline", "kicked", "denied"].includes(hostState)) ? (
            <ControllerAPI.Provider value={{
                ...bigState,
                processCommand,
                hostMode: "remote",
                isConnected,
                exit: () => exitRemoteMode(),
            }}>
                <App />
            </ControllerAPI.Provider>
        ) : (
            <Center h="100%" p="xl">
                <Stack align="center" ta="center" gap="xl" mt="xl">
                    {(({
                        connecting: () => (
                            <>
                                <Loader />
                                <Title order={4}>{t("rc.connecting")}</Title>
                                <Text>{t("rc.connectingDesc")}</Text>
                            </>
                        ),
                        waiting: () => (
                            <>
                                <Loader />
                                <Title order={4}>{t("rc.waitingForAcception")}</Title>
                                <Text>{t("rc.waitingForAcceptionDesc")}</Text>
                            </>
                        ),
                        denied: () => (
                            <>
                                <IconUserX />
                                <Title order={4}>{t("rc.denied")}</Title>
                                <Text>{t("rc.deniedDesc")}</Text>
                            </>
                        ),
                        kicked: () => (
                            <>
                                <IconUserX />
                                <Title order={4}>{t("rc.kicked")}</Title>
                                <Text>{t("rc.kickedDesc")}</Text>
                            </>
                        ),
                        offline: () => (
                            <>
                                <IconPlugX />
                                <Title order={4}>{t("rc.hostOffline")}</Title>
                                <Text>{t("rc.hostOfflineDesc")}</Text>
                            </>
                        ),
                    })[hostState || "connecting"] || (() => (
                        <Text>{hostState}</Text>
                    )))()}
                    
                    <Stack>
                        <Group>
                            <Text>
                                {t("rc.remoteId")}
                            </Text>
                            <Code>{remoteId}</Code>
                        </Group>
                    </Stack>

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
