import { Fieldset, Stack, Checkbox, Group, Text, Code, Divider, ActionIcon, TextInput, Tooltip, Popover } from "@mantine/core";
import { IconCheck, IconEdit, IconKey, IconKeyOff, IconQrcode, IconUserCheck, IconX } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "../../../../host/ControllerAPI";
import { OnlineBadge } from "../../../components/view/OnlineBadge";
import { QRCODE_PREFIX } from "../../../../meta";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { QRCodeSVG } from "qrcode.react";
import { modals } from "@mantine/modals";
import { EditLabelModal } from "../remoteControl/EditLabelModal";
import { AuthenticatedRemote } from "../remoteControl/AuthenticatedRemote";
import { UnknownRemote } from "../remoteControl/UnknownRemote";


export const RemoteControlSettings = () => {
    const { t } = useTranslation();
    const {
        proxyUrl, setProxyUrl, remoteControlEnabled, setRemoteControlEnabled, hostId, isConnected, connectedRemotes, authenticatedRemotes, setAuthenticatedRemotes, remoteQueue, acceptRemote, denyRemote, kickRemote,
    } = useContext(Controller);

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
                            onChange={(e) => setProxyUrl(e.currentTarget.value)} />
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
                                            fgColor="#ffffff" />
                                    </Popover.Dropdown>
                                </Popover>
                            </Group>
                        </Group>
                        <Stack>
                            {!!authenticatedRemotes?.length && (
                                <>
                                    <Divider label={t("rc.authenticatedRemotes")} />
                                    {authenticatedRemotes.map((remote, i) => (
                                        <AuthenticatedRemote
                                            connectedRemotes={connectedRemotes}
                                            onChange={setAuthenticatedRemotes}
                                            remote={remote}
                                            key={i}
                                        />
                                    ))}
                                </>
                            )}
                            {!!untrustedConnected?.length && (
                                <>
                                    <Divider label={t("rc.connectedRemotes")} />
                                    {untrustedConnected.map((remoteId, i) => (
                                        <UnknownRemote
                                            key={i}
                                            kickRemote={kickRemote}
                                            remoteId={remoteId}
                                            setAuthenticatedRemotes={setAuthenticatedRemotes}
                                        />
                                    )
                                    )}
                                </>
                            )}
                            {!!remoteQueue?.length && (
                                <>
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
                                </>
                            )}
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Fieldset>
    );
};
