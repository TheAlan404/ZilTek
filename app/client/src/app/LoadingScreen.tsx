import { Button, Center, Code, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle, IconPlugX, IconUserX } from "@tabler/icons-react";
import { HostStatus } from "@ziltek/common/src/networking/HostStatus";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { HostContext } from "../host/ctx/HostContext";
import { NetworkingContext } from "../host/ctx/NetworkingContext";

export type LoadingScreenVariant = HostStatus | "storage" | "error";

export const LoadingScreen = ({
    variant,
    content,
}: {
    variant: LoadingScreenVariant;
    content?: ReactNode;
}) => {
    const { remoteId } = useContext(NetworkingContext);
    const { clientType, connectTo, exit } = useContext(HostContext);
    const [t] = useTranslation();

    const Icon = ({
        connected: Loader,
        connecting: Loader,
        inQueue: Loader,
        hostDisconnected: IconPlugX,
        kicked: IconUserX,
        remoteDisconnected: IconPlugX,
        storage: Loader,
        error: IconAlertTriangle,
    } as Record<LoadingScreenVariant, React.ComponentType<any>>)[variant];

    return (
        <Center h="100%" p="xl">
            <Stack align="center" ta="center" gap="xl" mt="xl">
                <Icon />

                <Title order={4}>{t(`loadingScreen.${variant}`)}</Title>
                
                {content || (
                    <Text>{t(`loadingScreen.${variant}Desc`)}</Text>
                )}

                {clientType == "remote" && (
                    <Stack>
                        <Group justify="space-between">
                            <Text>{t("loadingScreen.self")}</Text>
                            <Code>{remoteId}</Code>
                        </Group>
                        <Group justify="space-between">
                            <Text>{t("loadingScreen.connectTo")}</Text>
                            <Code>{connectTo}</Code>
                        </Group>
                    </Stack>
                )}

                {clientType == "remote" && (
                    <Button
                        color="red"
                        variant="light"
                        onClick={exit}
                    >
                        {t("exit")}
                    </Button>
                )}
            </Stack>
        </Center>
    )
};
