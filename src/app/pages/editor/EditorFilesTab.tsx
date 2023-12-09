import { ActionIcon, Box, Button, Center, CloseButton, Fieldset, Flex, Group, Menu, Paper, Select, SimpleGrid, Stack, Table, Text, TextInput, Tooltip, em, useCombobox } from "@mantine/core";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI, StoredFile, StoredFileHandlers } from "../../../host/ControllerAPI";
import { IconBrandYoutube, IconCheck, IconFileMusic, IconHighlight, IconPlayerPlay, IconPlus, IconReload, IconTrash, IconUpload } from "@tabler/icons-react";
import { ReloadButton } from "../../components/editor/ReloadButton";
import { useMediaQuery } from "@mantine/hooks";
import { ActionButtonWithTooltip } from "../../components/editor/ActionButtonWithTooltip";
import { notifications } from "@mantine/notifications";
import { NotifyError } from "../../../utils";
import { modals } from '@mantine/modals';
import { t } from "i18next";

const FileRenameModal = ({
    name,
    onRename,
}: {
    name: string,
    onRename: (n: string) => void,
}) => {
    const [renameTo, setRenameTo] = useState(name);

    const renameFile = () => onRename?.(renameTo);

    return (
        <Stack p="md" justify="center" align="">
            <TextInput
                autoFocus
                placeholder={name}
                label={t("modals.renameFile.filename")}
                value={renameTo}
                onChange={(e) => setRenameTo(e.currentTarget.value)}
                onSubmit={renameFile}
            />
            <Group>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>
                <Button onClick={renameFile}>
                    {t("modals.renameFile.confirm")}
                </Button>
            </Group>
        </Stack>
    );
}

const FileEditRow = ({
    file,
    fileHandlers,
    reloadFiles,
}: {
    file: StoredFile,
    fileHandlers: StoredFileHandlers,
    reloadFiles: () => void,
}) => {
    const { processCommand } = useContext(ControllerAPI);
    const { t } = useTranslation();

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
                        {t("edit.bytes", { bytes: file.data.byteLength })}
                    </Text>
                </Group>
                <Group>
                    <ActionButtonWithTooltip
                        label={t("editor.sections.files.playAudio")}
                        icon={<IconPlayerPlay />}
                        color="green"
                        onClick={() => {
                            processCommand({
                                type: "forcePlayAudio",
                                data: {
                                    filename: file.filename,
                                },
                            });
                        }}
                    />
                    <ActionButtonWithTooltip
                        label={t("edit.renameFile")}
                        icon={<IconHighlight />}
                        onClick={() => {
                            modals.open({
                                title: t("modals.renameFile.title"),
                                children: <FileRenameModal
                                    name={file.filename}
                                    onRename={renameFile}
                                />
                            })
                        }}
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
                            })
                        }}
                    />
                </Group>
            </Group>
        </Paper>
    )
}

const FileEditList = ({
    files,
    fileHandlers,
    reloadFiles,
}: {
    files: StoredFile[],
    fileHandlers: StoredFileHandlers,
    reloadFiles: () => void,
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");

    const list = files
        .filter((item) => item.filename.toLowerCase().includes(search.toLowerCase().trim()))
        .map((file, i) => <FileEditRow
            file={file}
            fileHandlers={fileHandlers}
            reloadFiles={reloadFiles}
            key={i} />);
    
    return (
        <Stack>
            <TextInput
                autoFocus
                placeholder={t("editor.sections.files.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
            />
            {list.length ? list : <Text style={{ textAlign: "center" }}>{t("edit.fileSearchNoResults")}</Text>}
        </Stack>
    )
}

export const EditorFilesTab = () => {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const { t } = useTranslation();
    const {
        fileHandlers
    } = useContext(ControllerAPI);

    const inputRef = useRef<HTMLInputElement>();

    const [files, setFiles] = useState<StoredFile[]>([]);

    const reloadFiles = async () => {
        let allFiles = await fileHandlers.getAllFiles();
        setFiles(allFiles);
    };

    useEffect(() => {
        reloadFiles();
    }, []);

    return (
        <Flex justify="center" pb="xl" mb="xl">
            <input style={{ display: "none" }}
                type="file"
                multiple
                accept="audio/*,video/*"
                onChange={(e) => {
                    let fileList = e.currentTarget.files;
                    let files = Array.from(fileList);
                    for (let file of files) {
                        file.arrayBuffer().then(buf => {
                            fileHandlers.addFile({
                                filename: file.name,
                                data: buf,
                            })
                                .then(() => {
                                    notifications.show({
                                        title: t("notif.fileUploadedTitle"),
                                        icon: <IconCheck />,
                                        message: t("notif.fileUploaded", { filename: file.name }),
                                    });

                                    reloadFiles();
                                }, NotifyError);
                        }).catch(NotifyError);
                    }
                }}
                ref={inputRef} />
            <Fieldset
                w={isMobile ? "100%" : "50%"}
                mb="xl"
                legend={t("editor.sections.files.title")}>
                <Stack>
                    <Text>{t("editor.sections.files.desc")}</Text>
                    <Group justify="space-between">
                        <Text fw={600}>{t("editor.sections.files.amount", { amount: files.length })}</Text>
                        <Group>
                            <ActionButtonWithTooltip
                                label={t("editor.sections.files.upload")}
                                icon={<IconUpload />}
                                onClick={() => inputRef.current?.click()}
                            />
                            <ActionButtonWithTooltip
                                label={t("editor.sections.files.downloadFromYoutube")}
                                icon={<IconBrandYoutube />}
                            />
                            <ReloadButton onClick={reloadFiles} />
                        </Group>
                    </Group>
                    <Stack>
                        {files.length ? (
                            <FileEditList
                                files={files}
                                fileHandlers={fileHandlers}
                                reloadFiles={reloadFiles} />
                        ) : (
                            <Text style={{ textAlign: "center" }} py="lg" my="lg">{t("errors.noFilesLong")}</Text>
                        )}
                    </Stack>
                </Stack>
            </Fieldset>
        </Flex>
    );
}
