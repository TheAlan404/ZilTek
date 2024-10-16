import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Center, Code, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { Controller } from "./ControllerAPI";
import { App } from "../app/App";
import { NetworkingContext } from "./NetworkingContext";
import { createState, State } from "@ziltek/common/src/state/State";
import { useEventListener } from "../hooks/useEvents";

export const RemoteHost = () => {
    const {
        emitter,
        processCommand,
        isConnected,
    } = useContext(NetworkingContext);
    
    let [state, setState] = useState<State | null>(null);
    
    useEffect(() => {
        // on disconnect (?)
        if(!isConnected) setState(null);
    }, [isConnected]);

    useEventListener(emitter, "UpdateState", (st: State) => setState(st));

    if(!state) return (
        ""
    );

    return (
        <Controller.Provider
            value={{
                ...(state!),
                processCommand,
            }}
        >
            
        </Controller.Provider>
    )

    /* return (
        (bigState && !["offline", "kicked", "denied"].includes(hostState)) ? (
            <Controller.Provider value={{
                ...bigState,
                processCommand,
                hostMode: "remote",
                isConnected,
                exit: () => exitRemoteMode(),
            }}>
                <App />
            </Controller.Provider>
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
    ); */
}
