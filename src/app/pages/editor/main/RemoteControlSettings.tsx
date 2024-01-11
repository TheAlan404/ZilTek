import { Fieldset, Stack, Checkbox, Group, Text, Code, Divider, ActionIcon, TextInput, Tooltip, Popover, Image } from "@mantine/core";
import { IconCheck, IconEdit, IconKey, IconKeyOff, IconLock, IconQrcode, IconReload, IconUserCheck, IconX } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI } from "../../../../host/ControllerAPI";
import { OnlineBadge } from "../../../components/view/OnlineBadge";
import { DEFAULT_RELAY, QRCODE_PREFIX } from "../../../../meta";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { QRCodeSVG } from "qrcode.react";

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
        authenticatedRemotes,
        setAuthenticatedRemotes,
        remoteQueue,
        acceptRemote,
        denyRemote,
        kickRemote,
    } = useContext(ControllerAPI);

    let qrcodeValue = QRCODE_PREFIX + "?" + new URLSearchParams({
        connect: hostId,
        relay: proxyUrl,
    }).toString();

    let untrustedConnected = connectedRemotes?.filter(r => !authenticatedRemotes?.some(x => x.remoteId === r));

    return (
        <Fieldset
            legend={t("editor.sections.rc.title")}>
            <Stack>
                <Group justify="space-between" wrap="nowrap">
                    <Checkbox
                        checked={remoteControlEnabled}
                        onChange={(v) => setRemoteControlEnabled(v.target.checked)}
                        label={t("rc.enabled")}
                        description={t("rc.enabledDesc")} />
                    {remoteControlEnabled && <OnlineBadge />}
                </Group>
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
                                <Popover withArrow>
                                    <Popover.Target>
                                        <ActionIcon
                                            variant="light"
                                            color="gray"
                                        >
                                            <IconQrcode />
                                        </ActionIcon>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <QRCodeSVG
                                            value={qrcodeValue}
                                            bgColor="transparent"
                                            fgColor="#ffffff"
                                        />
                                    </Popover.Dropdown>
                                </Popover>
                            </Group>
                        </Group>
                        <Stack>
                            {!!authenticatedRemotes?.length && (
                                <>
                                    <Divider label={t("rc.authenticatedRemotes")} />
                                    {authenticatedRemotes.map((remote, i) => (
                                        <Group justify="end" key={i}>
                                            <Code key={i}>{remote.remoteId}</Code>
                                            {connectedRemotes?.includes(remote.remoteId) && (
                                                <Tooltip label={t("rc.connected")}>
                                                    <IconUserCheck color="var(--mantine-color-green-9)" />
                                                </Tooltip>
                                            )}
                                            <ActionButtonWithTooltip
                                                color="blue"
                                                label={t("rc.editLabel")}
                                                icon={<IconEdit />}
                                                onClick={() => {

                                                }}
                                            />
                                            <ActionButtonWithTooltip
                                                color="yellow"
                                                label={t("rc.removeTrust")}
                                                icon={<IconKeyOff />}
                                                onClick={() => setAuthenticatedRemotes(li => li.filter(r => r.remoteId !== remote.remoteId))}
                                            />
                                        </Group>
                                    ))}
                                </>
                            )}
                            {!!untrustedConnected?.length && (
                                <>
                                    <Divider label={t("rc.connectedRemotes")} />
                                    {untrustedConnected.map((remoteId, i) => (
                                            <Group justify="end" key={i}>
                                                <Code key={i}>{remoteId}</Code>
                                                <ActionButtonWithTooltip
                                                    color="yellow"
                                                    label={t("rc.trustRemote")}
                                                    icon={<IconKey />}
                                                    onClick={() => setAuthenticatedRemotes(li => [...li, {
                                                        label: "",
                                                        remoteId,
                                                    }])}
                                                />
                                            </Group>
                                        )
                                    )}
                                </>
                            )}
                            {!!remoteQueue?.length && (
                                <Stack>
                                    <Divider label={t("rc.connectionRequests")} />
                                    {remoteQueue.map(({ remoteId }, i) => (
                                        <Group justify="end" key={i}>
                                            <Code>{remoteId}</Code>
                                            <Group>
                                                <ActionIcon
                                                    variant="light"
                                                    color="green"
                                                    onClick={() => acceptRemote(remoteId)}
                                                >
                                                    <IconCheck />
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => denyRemote(remoteId)}
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
