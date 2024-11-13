import { useTranslation } from "react-i18next";
import { Button, Fieldset, Group, Stack } from "@mantine/core";
import { IconDownload, IconTrash, IconUpload } from "@tabler/icons-react";
import { useContext, useRef } from "react";
import { Controller } from "../../../../host/ctx/Controller";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { exportToZip, importFromZip } from "../../../DropzoneProvider";
import { Command } from "@ziltek/common/src/cmd/Command";
import { MaintenanceCommand } from "@ziltek/common/src/cmd/MaintenanceCommand";

export const MaintenanceSection = () => {
    const { t } = useTranslation();
    const {
        processCommand,
        data,
    } = useContext(Controller);

    const inputRef = useRef<HTMLInputElement>();

    return (
        <Fieldset
            legend={t("maintenance.title")}>
            <Stack>
                <Group justify="center">
                    <Button
                        color="red"
                        variant="light"
                        leftSection={<IconTrash />}
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("maintenance.deleteAll"),
                                children: t("maintenance.deleteAllConfirmation"),
                                confirmProps: { color: "red" },
                                onConfirm() {
                                    processCommand(Command.Maintenance(MaintenanceCommand.ClearAllData()));
                                },
                            });
                        }}>
                        {t("maintenance.deleteAll")}
                    </Button>

                    {/* <Button
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
                    </Button> */}
                </Group>
            </Stack>
        </Fieldset>
    );
};
