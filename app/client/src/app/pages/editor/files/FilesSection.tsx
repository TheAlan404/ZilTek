import { Fieldset, Group, Stack, Text } from "@mantine/core";
import useMobile from "../../../../hooks/useMobile";
import { useTranslation } from "react-i18next";
import { useContext, useRef } from "react";
import { FilesystemContext } from "../../../../host/fs/FilesystemContext";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { IconBrandYoutube, IconUpload } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { FilesList } from "./FilesList";
import { Controller } from "../../../../host/ControllerAPI";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { FSRefreshButton } from "../../../components/editor/FSRefreshButton";

export const FilesSection = () => {
    const { t } = useTranslation();
    const { files } = useContext(FilesystemContext);
    const { processCommand } = useContext(Controller);

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Fieldset
            w="100%"
            legend={t("editor.sections.files.title")}
        >

            <input style={{ display: "none" }}
                type="file"
                multiple
                accept="audio/*,video/*"
                onChange={(e) => {
                    let fileList = e.currentTarget.files;
                    let files = Array.from(fileList || []);
                    for (let file of files) {
                        file.arrayBuffer().then((data) => {
                            processCommand(Command.Filesystem(FilesystemCommand.AddFile({
                                filename: file.name,
                                data,
                            })));

                            notifications.show({
                                title: t("notif.fileUploadedTitle"),
                                icon: <IconCheck />,
                                message: t("notif.fileUploaded", { filename: file.name }),
                            });
                        });
                    }
                }}
                ref={inputRef}
            />


            <Stack>
                <Text>{t("editor.sections.files.desc")}</Text>
                <Group justify="space-between">
                    <Text fw={600}>{t("editor.sections.files.amount", { count: files.length })}</Text>
                    <Group>
                        <FSRefreshButton />
                        <ActionButtonWithTooltip
                            label={t("editor.sections.files.upload")}
                            icon={<IconUpload />}
                            onClick={() => inputRef.current?.click()}
                        />
                        <ActionButtonWithTooltip
                            label={t("editor.sections.files.downloadFromYoutube")}
                            icon={<IconBrandYoutube />}
                            onClick={() => {
                                modals.open({
                                    title: t("editor.sections.files.downloadFromYoutube"),
                                    size: "xl",
                                })
                            }}
                        />
                    </Group>
                </Group>
                <Stack>
                    {files.length ? (
                        <FilesList />
                    ) : (
                        <Text style={{ textAlign: "center" }} py="lg" my="lg">{t("errors.noFilesLong")}</Text>
                    )}
                </Stack>
            </Stack>
        </Fieldset>
    )
};
