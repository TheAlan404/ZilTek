import { Code, Group } from "@mantine/core";
import { useTranslation } from "react-i18next"
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { IconKey, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { Remote } from "../../../../host/Networking";

export const UnknownRemote = ({
    remoteId,
    setAuthenticatedRemotes,
    kickRemote,
}: {
    remoteId: string,
    setAuthenticatedRemotes: React.SetStateAction<Remote>,
    kickRemote: (remoteId: string) => void,
}) => {
    const { t } = useTranslation();

    return (
        <Group justify="end">
            <Code>{remoteId}</Code>
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
                        onConfirm() {
                            setAuthenticatedRemotes(li => [...li, {
                                label: "",
                                remoteId,
                            }]);
                        }
                    });
                }} />
            <ActionButtonWithTooltip
                color="red"
                label={t("rc.kickRemote")}
                icon={<IconX />}
                onClick={() => kickRemote(remoteId)} />
        </Group>
    )
}
