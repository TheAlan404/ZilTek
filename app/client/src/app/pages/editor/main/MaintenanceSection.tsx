import { useTranslation } from "react-i18next";
import { Button, Fieldset, Group, Stack } from "@mantine/core";
import { IconDownload, IconTrash, IconUpload } from "@tabler/icons-react";
import { useContext, useRef } from "react";
import { ControllerAPI } from "../../../../host/ControllerAPI";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { exportToZip, importFromZip } from "../../../DropzoneProvider";

export const MaintenanceSection = () => {
    const { t } = useTranslation();
    const {
        processCommand,
        data,
        files,
        hostMode,
    } = useContext(ControllerAPI);

    const inputRef = useRef<HTMLInputElement>();

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
                                    processCommand({ type: "deleteAllFiles" });
                                    notifications.show({
                                        message: t("notif.deletedEverything"),
                                        color: "red",
                                    });
                                },
                            });
                        }}>
                        {t("deleteAllData")}
                    </Button>

                    <Button
                        color="blue"
                        variant="light"
                        leftSection={<IconDownload />}
                        onClick={() => {
                            inputRef.current?.click();
                        }}>
                        {t("importFromZip")}
                    </Button>

                    <input style={{ display: "none" }}
                        type="file"
                        multiple
                        accept="application/x-zip-compressed,application/zip"
                        onChange={(e) => {
                            let fileList = e.currentTarget.files;
                            let files = Array.from(fileList);
                            let file = files[0];

                            importFromZip(processCommand, file).then(() => {
                                notifications.show({
                                    message: t("notif.imported"),
                                    color: "green",
                                });
                            });
                        }}
                        ref={inputRef} />

                    <Button
                        color="blue"
                        variant="light"
                        leftSection={<IconUpload />}
                        onClick={() => {
                            exportToZip(data, files).then(() => {
                                notifications.show({
                                    message: t("notif.exported"),
                                    color: "green",
                                });
                            })
                        }}>
                        {t("exportToZip")}
                    </Button>
                </Group>
            </Stack>
        </Fieldset>
    );
};
