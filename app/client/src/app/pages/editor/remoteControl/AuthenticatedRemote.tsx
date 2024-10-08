import { Code, Group, Text, Tooltip } from "@mantine/core";
import { Remote } from "../../../../host/Networking";
import { useTranslation } from "react-i18next";
import { IconEdit, IconKeyOff, IconUserCheck } from "@tabler/icons-react";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { modals } from "@mantine/modals";
import { EditLabelModal } from "./EditLabelModal";

export const AuthenticatedRemote = ({
    remote,
    onChange,
    connectedRemotes,
}: {
    remote: Remote,
    onChange: React.SetStateAction<Remote[]>,
    connectedRemotes: string[],
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
                    modals.open({
                        title: t("modals.renameFile.title"),
                        children: <EditLabelModal
                            label={remote.label}
                            onRename={(label) => onChange(li => li.map((r) => r.remoteId == remote.remoteId ? ({
                                ...r,
                                label,
                            }) : r))} />
                    });
                }} />
            <ActionButtonWithTooltip
                color="yellow"
                label={t("rc.removeTrust")}
                icon={<IconKeyOff />}
                onClick={() => onChange(li => li.filter(r => r.remoteId !== remote.remoteId))} />
        </Group>
    )
}
