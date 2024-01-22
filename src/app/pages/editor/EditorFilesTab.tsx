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
import useMobile from "../../../hooks/useMobile";
import { modals } from "@mantine/modals";
import { YouTubeVideoPicker } from "./files/YouTubeVideoPicker";

const FileEditList = ({
    files,
}: {
    files: StoredFile[],
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");

    const list = files
        .filter((item) => item.filename.toLowerCase().includes(search.toLowerCase().trim()))
        .map((file, i) => <FileEditRow
            file={file}
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
                        {list.length ? t("edit.fileSearchResults", { count: list.length }) : t("edit.fileSearchNoResults")}
                    </Text>
                )}
            </Transition>
            {list}
        </Stack>
    )
}

export const EditorFilesTab = () => {
    const isMobile = useMobile();
    const { t } = useTranslation();
    const {
        files,
        processCommand,
    } = useContext(ControllerAPI);

    const inputRef = useRef<HTMLInputElement>();

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
                        processCommand({
                            type: "addFile",
                            data: {
                                filename: file.name,
                                filedata: file,
                            }
                        });

                        notifications.show({
                            title: t("notif.fileUploadedTitle"),
                            icon: <IconCheck />,
                            message: t("notif.fileUploaded", { filename: file.name }),
                        });
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
                        <Text fw={600}>{t("editor.sections.files.amount", { count: files.length })}</Text>
                        <Group>
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
                                        children: <YouTubeVideoPicker
                                            processCommand={processCommand}
                                        />,
                                    })
                                }}
                            />
                        </Group>
                    </Group>
                    <Stack>
                        {files.length ? (
                            <FileEditList
                                files={files} />
                        ) : (
                            <Text style={{ textAlign: "center" }} py="lg" my="lg">{t("errors.noFilesLong")}</Text>
                        )}
                    </Stack>
                </Stack>
            </Fieldset>
        </Flex>
    );
}
