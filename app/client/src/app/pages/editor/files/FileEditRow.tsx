import { Group, Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCut, IconFileMusic, IconHighlight, IconPlayerPause, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI, StoredFile } from "../../../../host/ControllerAPI";
import { NotifyError } from "../../../../utils";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { FileRenameModal } from "./FileRenameModal";
import { FileCutModal } from "./FileCutModal";

export const FileEditRow = ({
    file,
}: {
    file: StoredFile;
}) => {
    const { processCommand, currentlyPlayingAudio, files } = useContext(ControllerAPI);
    const { t } = useTranslation();

    const isPlaying = currentlyPlayingAudio === file.filename;

    const renameFile = (renameTo) => {
        modals.closeAll();

        if (!renameTo || renameTo === file.filename)
            return;

        const doRename = () => {
            processCommand({
                type: "renameFile",
                data: {
                    from: file.filename,
                    to: renameTo,
                }
            });

            notifications.show({
                message: t("notif.fileRenamed", { from: file.filename, to: renameTo }),
                icon: <IconHighlight />,
            });
        }

        if (files.some(f => f.filename === renameTo)) {
            modals.openConfirmModal({
                title: t("modals.fileWithNameExists.title"),
                children: t("modals.fileWithNameExists.content", { filename: renameTo }),
                labels: {
                    confirm: t("modals.fileWithNameExists.confirm"),
                    cancel: t("modals.cancel"),
                },
                confirmProps: { color: "red" },
                onConfirm: doRename,
            })
        } else {
            doRename();
        }
    };

    return (
        <Paper withBorder p="md">
            <Group justify="space-between">
                <Group wrap="nowrap">
                    <IconFileMusic />
                    <Stack gap={0}>
                        <Text>
                            {file.filename}
                        </Text>
                        <Text c="dark">
                            {t("edit.bytes", { bytes: file.data ? (file.data.byteLength || file.data.size) : "?" })}
                        </Text>
                    </Stack>
                </Group>
                <Group wrap="nowrap">
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
                        }} />
                    <ActionButtonWithTooltip
                        label={t("edit.cutFile")}
                        icon={<IconCut />}
                        color="blue"
                        onClick={() => {
                            modals.open({
                                title: t("modals.cutFile.title"),
                                size: "xl",
                                children: <FileCutModal
                                    file={file}
                                    onCut={([startTime, endTime]) => {
                                        modals.closeAll();
                                        processCommand({
                                            type: "cutFile",
                                            data: {
                                                startTime,
                                                endTime,
                                                filename: file.filename,
                                            }
                                        })
                                    }}
                                />,
                            });
                        }} />
                    <ActionButtonWithTooltip
                        label={t("edit.renameFile")}
                        icon={<IconHighlight />}
                        onClick={() => {
                            modals.open({
                                title: t("modals.renameFile.title"),
                                children: <FileRenameModal
                                    name={file.filename}
                                    onRename={renameFile}
                                />,
                            });
                        }} />
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

                                    processCommand({
                                        type: "deleteFile",
                                        data: { filename: file.filename },
                                    });

                                    notifications.update({
                                        id,
                                        loading: false,
                                        message: t("notif.fileDeleted", { filename: file.filename }),
                                        icon: <IconTrash />,
                                    });
                                }
                            });
                        }} />
                </Group>
            </Group>
        </Paper>
    );
};
