import { Fieldset, Stack, Checkbox, Group, Text, Code, Divider, ActionIcon, TextInput, Tooltip, Popover } from "@mantine/core";
import { IconQrcode } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { OnlineBadge } from "../../../components/view/OnlineBadge";
import { WEBSITE } from "../../../../meta";
import { QRCodeSVG } from "qrcode.react";
import { RemoteItem } from "./RemoteItem";
import { NetworkingContext } from "../../../../host/NetworkingContext";
import { ListAction } from "@ziltek/common/src/ListAction";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";


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

    let qrcodeValue = `${WEBSITE}#/${selfHostId}@${hostRelayURL}` + "?" + new URLSearchParams({
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
                                    {knownRemotes.map((remote, index) => (
                                        <RemoteItem
                                            key={remote.remoteId}
                                            remote={remote}
                                            trusted
                                            onKick={() => kickConnectedRemote(remote.remoteId)}
                                            connected={connectedRemotes.includes(remote.remoteId)}
                                            onSetLabel={(label) => modifyKnownRemotes(ListAction<KnownRemote>().Modify({
                                                index,
                                                value: { ...remote, label },
                                            }))}
                                            onUntrust={() => modifyKnownRemotes(ListAction<KnownRemote>().Remove(index))}
                                        />
                                    ))}
                                </>
                            )}
                            {!!untrustedConnected?.length && (
                                <>
                                    <Divider label={t("rc.connectedRemotes")} />
                                    {untrustedConnected.map((remoteId, i) => (
                                        <RemoteItem
                                            key={remoteId}
                                            remote={{ remoteId }}
                                            onKick={() => kickConnectedRemote(remoteId)}
                                            onTrust={() => modifyKnownRemotes(ListAction<KnownRemote>().Add({
                                                remoteId,
                                                label: "",
                                            }))}
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
                                            onAccept={() => acceptConnection(remoteId)}
                                            onDeny={() => denyConnection(remoteId)}
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
