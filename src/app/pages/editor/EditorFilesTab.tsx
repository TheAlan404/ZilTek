import { ActionIcon, Box, Button, Center, CloseButton, Fieldset, Flex, Group, Menu, Select, SimpleGrid, Stack, Table, Text, TextInput, Tooltip, Transition, em, useCombobox } from "@mantine/core";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI, StoredFile, StoredFileHandlers } from "../../../host/ControllerAPI";
import { IconBrandYoutube, IconCheck, IconPlus, IconReload, IconUpload } from "@tabler/icons-react";
import { ReloadButton } from "../../components/editor/ReloadButton";
import { useMediaQuery } from "@mantine/hooks";
import { ActionButtonWithTooltip } from "../../components/editor/ActionButtonWithTooltip";
import { notifications } from "@mantine/notifications";
import { NotifyError } from "../../../utils";
import { t } from "i18next";
import { FileEditRow } from "./files/FileEditRow";

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
            <Transition mounted={!!search} transition="slide-down">
                {(styles) => (
                    <Text style={{ textAlign: "center", ...styles }}>
                        {list.length ? t("edit.fileSearchResults", { amount: list.length }) : t("edit.fileSearchNoResults")}
                    </Text>
                )}
            </Transition>
            {list}
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
                        fileHandlers.addFile({
                            filename: file.name,
                            data: file,
                        })
                            .then(() => {
                                notifications.show({
                                    title: t("notif.fileUploadedTitle"),
                                    icon: <IconCheck />,
                                    message: t("notif.fileUploaded", { filename: file.name }),
                                });

                                reloadFiles();
                            }, NotifyError);
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
