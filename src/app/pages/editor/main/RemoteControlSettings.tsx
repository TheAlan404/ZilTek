import { Fieldset, Stack, Checkbox, Group, Text, Code, Divider, ActionIcon, TextInput } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI } from "../../../../host/ControllerAPI";

export const RemoteControlSettings = () => {
    const { t } = useTranslation();
    const {
        proxyUrl,
        setProxyUrl,
        remoteControlEnabled,
        setRemoteControlEnabled,
        hostId,
        isConnected,
        connectedRemotes,
        remoteQueue,
    } = useContext(ControllerAPI);

    return (
        <Fieldset
            legend={t("editor.sections.rc.title")}>
            <Stack>
                <Checkbox
                    checked={remoteControlEnabled}
                    onChange={(v) => setRemoteControlEnabled(v.target.checked)}
                    label={t("rc.enabled")}
                    description={t("rc.enabledDesc")} />
                {remoteControlEnabled && (
                    <Stack>
                        <TextInput
                            label={t("mode.proxyurl")}
                            value={proxyUrl}
                            onChange={(e) => setProxyUrl(e.currentTarget.value)}
                        />
                        <Group justify="space-between">
                            <Text>
                                {t("rc.hostId")}
                            </Text>
                            <Group>
                                <Code>
                                    {hostId}
                                </Code>
                            </Group>
                        </Group>
                        <Stack>
                            <Divider label={t("rc.connectedRemotes")} />
                            {!!connectedRemotes?.length ? (
                                connectedRemotes.map((remoteId, i) => (
                                    <Code key={i}>{remoteId}</Code>
                                ))
                            ) : (
                                <Text ta="center">{t("rc.noRemotesConnected")}</Text>
                            )}
                            {!!remoteQueue?.length && (
                                <Stack>
                                    <Divider label={t("rc.connectionRequests")} />
                                    {remoteQueue.map(({ remoteId, cb }, i) => (
                                        <Group justify="space-between" key={i}>
                                            <Code>{remoteId}</Code>
                                            <Group>
                                                <ActionIcon
                                                    variant="light"
                                                    color="green"
                                                    onClick={() => cb(true)}
                                                >
                                                    <IconCheck />
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => cb(false)}
                                                >
                                                    <IconX />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Fieldset>
    );
};
