import { useTranslation } from "react-i18next";
import { Button, Fieldset, Group, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { ControllerAPI } from "../../../../host/ControllerAPI";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export const MaintenanceSection = () => {
    const { t } = useTranslation();
    const {
        processCommand
    } = useContext(ControllerAPI);

    return (
        <Fieldset
            legend={t("editor.sections.maintenance.title")}>
            <Stack>
                <Group justify="center">
                    <Button
                        color="red"
                        variant="light"
                        leftSection={<IconTrash />}
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("modals.clearAllData.title"),
                                children: t("modals.clearAllData.content"),
                                confirmProps: { color: "red" },
                                labels: {
                                    confirm: t("modals.clearAllData.confirm"),
                                    cancel: t("modals.cancel")
                                },
                                onConfirm() {
                                    processCommand({ type: "clearAllData" });
                                    notifications.show({
                                        message: t("notif.deletedEverything"),
                                        color: "red",
                                    });
                                },
                            });
                        }}>
                        {t("deleteAllData")}
                    </Button>
                </Group>
            </Stack>
        </Fieldset>
    );
};
