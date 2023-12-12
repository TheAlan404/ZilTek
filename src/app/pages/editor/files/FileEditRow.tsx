import { Group, Paper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconFileMusic, IconHighlight, IconPlayerPause, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI, StoredFile, StoredFileHandlers } from "../../../../host/ControllerAPI";
import { NotifyError } from "../../../../utils";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { FileRenameModal } from "./FileRenameModal";

export const FileEditRow = ({
    file, fileHandlers, reloadFiles,
}: {
    file: StoredFile;
    fileHandlers: StoredFileHandlers;
    reloadFiles: () => void;
}) => {
    const { processCommand, currentlyPlayingAudio } = useContext(ControllerAPI);
    const { t } = useTranslation();

    const isPlaying = currentlyPlayingAudio === file.filename;

    const renameFile = (renameTo) => {
        modals.closeAll();

        if (!renameTo || renameTo === file.filename)
            return;

        let id = notifications.show({
            message: t("notif.renamingFile", { filename: file.filename }),
            loading: true,
        });

        fileHandlers.renameFile(file.filename, renameTo)
            .then(() => {
                notifications.update({
                    id,
                    loading: false,
                    message: t("notif.fileRenamed", { from: file.filename, to: renameTo }),
                    icon: <IconHighlight />,
                });

                reloadFiles();
            }, NotifyError);
    };

    return (
        <Paper withBorder p="md">
            <Group justify="space-between">
                <Group>
                    <IconFileMusic />
                    <Text>
                        {file.filename}
                    </Text>
                    <Text c="dark">
                        {t("edit.bytes", { bytes: file.data.byteLength || file.data.size })}
                    </Text>
                </Group>
                <Group>
                    <ActionButtonWithTooltip
                        label={isPlaying ? t("editor.sections.files.audioPlaying") : t("editor.sections.files.playAudio")}
                        icon={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
                        color={isPlaying ? "yellow" : "green"}
                        onClick={() => {
                            processCommand(isPlaying ? {
                                type: "stopAllAudio",
                            } : {
                                type: "forcePlayAudio",
                                data: {
                                    filename: file.filename,
                                },
                            });
                        } } />
                    <ActionButtonWithTooltip
                        label={t("edit.renameFile")}
                        icon={<IconHighlight />}
                        onClick={() => {
                            modals.open({
                                title: t("modals.renameFile.title"),
                                children: <FileRenameModal
                                    name={file.filename}
                                    onRename={renameFile} />
                            });
                        } } />
                    <ActionButtonWithTooltip
                        label={t("edit.deleteFile")}
                        color="red"
                        icon={<IconTrash />}
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("modals.deleteFile.title"),
                                children: (
                                    <Text>{t("modals.deleteFile.content", { filename: file.filename })}</Text>
                                ),
                                labels: {
                                    confirm: t("modals.deleteFile.confirm"),
                                    cancel: t("modals.cancel"),
                                },
                                confirmProps: { color: "red" },
                                onConfirm: () => {
                                    let id = notifications.show({
                                        message: t("notif.deletingFile", { filename: file.filename }),
                                        loading: true,
                                    });

                                    fileHandlers.removeFile(file.filename)
                                        .then(() => {
                                            notifications.update({
                                                id,
                                                loading: false,
                                                message: t("notif.fileDeleted", { filename: file.filename }),
                                                icon: <IconTrash />,
                                            });

                                            reloadFiles();
                                        }, NotifyError);
                                }
                            });
                        } } />
                </Group>
            </Group>
        </Paper>
    );
};
