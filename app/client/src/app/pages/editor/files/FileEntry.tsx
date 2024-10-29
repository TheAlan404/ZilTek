import { Group, Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCut, IconFileMusic, IconHighlight, IconPlayerPause, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "../../../../host/ControllerAPI";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { FileRenameModal } from "./FileRenameModal";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { createTextInputModal } from "../../../components/editor/TextInputModal";

const sufixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const getBytes = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return !bytes && '0 B' || (bytes / Math.pow(1024, i)).toFixed(2) + " " + sufixes[i];
};

export const FileEntry = ({
    file,
}: {
    file: StoredFileMetadata;
}) => {
    const { processCommand, audioState } = useContext(Controller);
    const { t } = useTranslation();

    const isPlaying = audioState.currentlyPlaying === file.filename;

    let bytes = getBytes(file.fileSize);

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
                            ({bytes})
                        </Text>
                    </Stack>
                </Group>
                <Group wrap="nowrap">
                    <ActionButtonWithTooltip
                        label={isPlaying ? t("editor.sections.files.audioPlaying") : t("editor.sections.files.playAudio")}
                        icon={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
                        color={isPlaying ? "yellow" : "green"}
                        onClick={() => {
                            processCommand(isPlaying ? Command.ForceStop() : Command.ForcePlayMelody({ filename: file.filename }));
                        }}
                    />
                    
                    <ActionButtonWithTooltip
                        label={t("edit.renameFile")}
                        icon={<IconHighlight />}
                        onClick={() => createTextInputModal({
                            value: file.filename,
                            onChange: (to) => processCommand(Command.Filesystem(FilesystemCommand.Rename({
                                from: file.filename,
                                to,
                            })))
                        })}
                    />

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
                                    processCommand(Command.Filesystem(FilesystemCommand.Delete(file.filename)));
                                }
                            });
                        }}
                    />
                </Group>
            </Group>
        </Paper>
    );
};
