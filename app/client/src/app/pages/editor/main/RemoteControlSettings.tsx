import { Fieldset, Stack, Checkbox, Group, Text, Code, Divider, ActionIcon, TextInput, Tooltip, Popover } from "@mantine/core";
import { IconQrcode } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { OnlineBadge } from "../../../components/view/OnlineBadge";
import { QRCODE_PREFIX } from "../../../../meta";
import { QRCodeSVG } from "qrcode.react";
import { RemoteItem } from "./RemoteItem";
import { NetworkingContext } from "../../../../host/NetworkingContext";


export const RemoteControlSettings = () => {
    const { t } = useTranslation();
    const {
        selfHostId,
        hostRelayURL,
        setHostRelayURL,
        label,
        rcEnabled,
        setRCEnabled,
        connectedRemotes,
        connectionQueue,
        acceptConnection,
        denyConnection,
        kickConnectedRemote,
        knownRemotes,
        modifyKnownRemotes,
        setLabel,
    } = useContext(NetworkingContext);

    let qrcodeValue = QRCODE_PREFIX + "?" + new URLSearchParams({
        connect: selfHostId,
        relay: hostRelayURL,
        label,
    }).toString();

    let untrustedConnected = connectedRemotes.filter(connectedId => !knownRemotes.some(x => x.remoteId === connectedId));

    return (
        <Fieldset
            legend={t("editor.sections.rc.title")}>
            <Stack>
                <Group justify="space-between" wrap="nowrap">
                    <Checkbox
                        checked={rcEnabled}
                        onChange={(v) => setRCEnabled(v.target.checked)}
                        label={t("rc.enabled")}
                        description={t("rc.enabledDesc")} />
                    {rcEnabled && <OnlineBadge />}
                </Group>
                {rcEnabled && (
                    <Stack>
                        <TextInput
                            label={t("mode.proxyurl")}
                            value={hostRelayURL}
                            onChange={(e) => setHostRelayURL(e.currentTarget.value)} />
                        <Group justify="space-between">
                            <Text>
                                {t("rc.hostId")}
                            </Text>
                            <Group>
                                <Code>
                                    {selfHostId}
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
                                            fgColor="#ffffff" />
                                    </Popover.Dropdown>
                                </Popover>
                            </Group>
                        </Group>
                        <Stack>
                            {!!knownRemotes?.length && (
                                <>
                                    <Divider label={t("rc.authenticatedRemotes")} />
                                    {knownRemotes.map((remote, i) => (
                                        <RemoteItem
                                            key={i}
                                            remote={remote}
                                            trusted
                                            onKick={() => kickConnectedRemote(remote.remoteId)}
                                            connected={connectedRemotes.includes(remote.remoteId)}
                                            onSetLabel={() => {}}
                                            onUntrust={() => {}}
                                        />
                                    ))}
                                </>
                            )}
                            {!!untrustedConnected?.length && (
                                <>
                                    <Divider label={t("rc.connectedRemotes")} />
                                    {untrustedConnected.map((remoteId, i) => (
                                        <RemoteItem
                                            key={i}
                                            remote={{ remoteId }}
                                            onKick={() => kickConnectedRemote(remoteId)}
                                            onTrust={() => {}}
                                        />
                                    )
                                    )}
                                </>
                            )}
                            {!!connectionQueue?.length && (
                                <>
                                    <Divider label={t("rc.connectionRequests")} />
                                    {connectionQueue.map((remoteId, i) => (
                                        <RemoteItem
                                            key={i}
                                            queued
                                            remote={{ remoteId }}
                                            onAccept={() => {}}
                                            onDeny={() => {}}
                                        />
                                    ))}
                                </>
                            )}
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Fieldset>
    );
};
