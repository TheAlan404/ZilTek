import { ActionIcon, Code, Group, Text, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next"
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { IconEdit, IconKey, IconKeyOff, IconUserCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { KnownRemote } from "@ziltek/common/src/networking/KnownRemote";
import { openTextInputModal } from "../../../../utils";
import { IconCheck } from "@tabler/icons-react";

export const RemoteItem = ({
    remote,
    trusted,
    connected,
    queued,
    onTrust,
    onUntrust,
    onKick,
    onAccept,
    onDeny,
    onSetLabel,
}: {
    remote: KnownRemote;
    queued?: boolean;
    trusted?: boolean;
    connected?: boolean;
    onTrust?: () => void;
    onUntrust?: () => void;
    onDeny?: () => void;
    onAccept?: () => void;
    onSetLabel?: (label: string) => void;
    onKick?: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <Group justify="end">
            {remote.label ? (
                <Tooltip label={remote.remoteId}>
                    <Text fw="bold">{remote.label}</Text>
                </Tooltip>
            ) : (
                <Code>{remote.remoteId}</Code>
            )}

            {connected && (
                <Tooltip label={t("rc.connected")}>
                    <IconUserCheck color="var(--mantine-color-green-9)" />
                </Tooltip>
            )}

            {queued && (
                <ActionIcon
                    variant="light"
                    color="green"
                    onClick={() => onAccept?.()}
                >
                    <IconCheck />
                </ActionIcon>
            )}

            {queued && (
                <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => onDeny?.()}
                >
                    <IconX />
                </ActionIcon>
            )}

            {!trusted && !queued && onTrust && (
                <ActionButtonWithTooltip
                    color="yellow"
                    label={t("rc.trustRemote")}
                    icon={<IconKey />}
                    onClick={() => {
                        modals.openConfirmModal({
                            title: t("modals.trustRemote.title"),
                            children: t("modals.trustRemote.content"),
                            labels: {
                                confirm: t("modals.trustRemote.confirm"),
                                cancel: t("modals.cancel")
                            },
                            onConfirm: onTrust,
                        });
                    }}
                />
            )}

            {trusted && (
                <ActionButtonWithTooltip
                    color="blue"
                    label={t("rc.editLabel")}
                    icon={<IconEdit />}
                    onClick={() => {
                        openTextInputModal(
                            t("modals.editRemoteLabel"),
                            remote.label || "",
                            onSetLabel || (() => { }),
                        )
                    }}
                />
            )}

            {trusted && (
                <ActionButtonWithTooltip
                    color="yellow"
                    label={t("rc.removeTrust")}
                    icon={<IconKeyOff />}
                    onClick={() => onUntrust?.()}
                />
            )}

            {onKick && (
                <ActionButtonWithTooltip
                    color="red"
                    label={t("rc.kickRemote")}
                    icon={<IconX />}
                    onClick={() => onKick()}
                />
            )}
        </Group>
    )
}
