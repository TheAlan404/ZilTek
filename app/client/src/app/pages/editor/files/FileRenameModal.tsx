import { Button, Group, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const FileRenameModal = ({
    name,
    onRename,
}: {
    name: string,
    onRename: (n: string) => void,
}) => {
    const { t } = useTranslation();
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
