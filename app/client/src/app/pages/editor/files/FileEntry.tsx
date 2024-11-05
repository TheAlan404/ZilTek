import { Group, Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconFileMusic, IconHighlight, IconPlayerPause, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "../../../../host/ControllerAPI";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { createTextInputModal } from "../../../components/editor/TextInputModal";
import { FilesystemContext } from "../../../../host/fs/FilesystemContext";
import { HostContext } from "../../../../host/HostContext";

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
    const { clientType } = useContext(HostContext);
    const { processCommand } = useContext(Controller);
    const { t } = useTranslation();

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
                    {clientType == "remote" && <LocalPlayButton filename={file.filename} />}
                    
                    <HostPlayButton filename={file.filename} />

                    <ActionButtonWithTooltip
                        label={t("files.rename")}
                        icon={<IconHighlight />}
                        onClick={() => createTextInputModal({
                            value: file.filename,
                            title: t("files.rename"),
                            onChange: (to) => processCommand(Command.Filesystem(FilesystemCommand.Rename({
                                from: file.filename,
                                to,
                            })))
                        })}
                    />

                    <ActionButtonWithTooltip
                        label={t("files.delete")}
                        color="red"
                        icon={<IconTrash />}
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("files.delete"),
                                children: (
                                    <Text>{t("files.deleteConfirmation", { filename: file.filename })}</Text>
                                ),
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

const LocalPlayButton = ({ filename }: { filename: string }) => {
    const fs = useContext(FilesystemContext);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            if(!isPlaying) return audioRef.current.pause();

            if(!audioRef.current.src) {
                setLoading(true);
                let buffer = await fs.read(filename);
                let source = URL.createObjectURL(new File([buffer], filename));
                audioRef.current.src = source;
                setLoading(false);
            }

            audioRef.current.currentTime = 0;
            audioRef.current.play();
        })();

        return () => {
            audioRef.current.pause();
            try { URL.revokeObjectURL(audioRef.current.src); } catch(e) {};
        };
    }, [isPlaying]);

    return (
        <ActionButtonWithTooltip
            label={isPlaying ? t("controls.stop") : t("controls.playLocally")}
            loading={loading}
            icon={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
            color={isPlaying ? "yellow" : "green"}
            onClick={() => setPlaying(p => !p)}
        />
    )
};

const HostPlayButton = ({ filename }: { filename: string }) => {
    const { clientType } = useContext(HostContext);
    const { processCommand, audioState } = useContext(Controller);
    const { t } = useTranslation();

    const isPlaying = audioState.currentlyPlaying === filename;

    return (
        <ActionButtonWithTooltip
            label={isPlaying ? t("controls.stop") : (
                clientType == "remote" ? t("controls.playOnHost") : t("controls.play")
            )}
            icon={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
            color={isPlaying ? "yellow" : "green"}
            onClick={() => {
                processCommand(isPlaying ? Command.ForceStop() : Command.ForcePlayMelody({ filename: filename }));
            }}
        />
    )
};
