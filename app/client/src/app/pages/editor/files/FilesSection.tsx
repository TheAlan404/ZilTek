import { Fieldset, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext, useRef } from "react";
import { FilesystemContext } from "../../../../host/fs/FilesystemContext";
import { ActionButtonWithTooltip } from "../../../components/editor/ActionButtonWithTooltip";
import { IconUpload } from "@tabler/icons-react";
import { FilesList } from "./FilesList";
import { Controller } from "../../../../host/ctx/Controller";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { FSRefreshButton } from "../../../components/editor/FSRefreshButton";

export const FilesSection = () => {
    const { t } = useTranslation();
    const { files } = useContext(FilesystemContext);
    const { processCommand } = useContext(Controller);

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Fieldset
            w="100%"
            legend={t("files.title")}
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
                        });
                    }
                }}
                ref={inputRef}
            />

            <Stack>
                <Text>{t("files.desc")}</Text>
                <Group justify="space-between">
                    <Text fw={600}>{t("files.amount", { count: files.length })}</Text>
                    <Group>
                        <FSRefreshButton />
                        <ActionButtonWithTooltip
                            label={t("files.upload")}
                            icon={<IconUpload />}
                            onClick={() => inputRef.current?.click()}
                        />
                    </Group>
                </Group>
                <Stack>
                    <FilesList />
                </Stack>
            </Stack>
        </Fieldset>
    )
};
