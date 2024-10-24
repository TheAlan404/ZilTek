import { Button, Center, Code, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconPlugX, IconUserX } from "@tabler/icons-react";
import { HostStatus } from "@ziltek/common/src/networking/HostStatus";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { HostContext } from "../host/HostContext";
import { NetworkingContext } from "../host/NetworkingContext";

export type LoadingScreenVariant = HostStatus | "storage";

export const LoadingScreen = ({
    variant,
}: {
    variant: LoadingScreenVariant;
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
    } as Record<LoadingScreenVariant, React.ComponentType<any>>)[variant];

    return (
        <Center h="100%" p="xl">
            <Stack align="center" ta="center" gap="xl" mt="xl">
                <Icon />

                <Title order={4}>{t(`loadingScreen.${variant}`)}</Title>
                <Text>{t(`loadingScreen.${variant}Desc`)}</Text>

                {clientType == "remote" && (
                    <Stack>
                        <Group>
                            <Text>{t("loadingScreen.self")}</Text>
                            <Code>{remoteId}</Code>
                        </Group>
                        <Group>
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
                        {t("loadingScreen.exit")}
                    </Button>
                )}
            </Stack>
        </Center>
    )
};
