import { Button, Group, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const EditLabelModal = ({
    label,
    onRename,
}: {
    label: string,
    onRename: (n: string) => void,
}) => {
    const { t } = useTranslation();
    const [renameTo, setRenameTo] = useState(label);

    const renameLabel = () => {
        onRename?.(renameTo);
        modals.closeAll();
    };

    return (
        <Stack p="md" justify="center" align="">
            <TextInput
                autoFocus
                placeholder={label}
                label={t("modals.editRemoteLabel.label")}
                value={renameTo}
                onChange={(e) => setRenameTo(e.currentTarget.value)}
                onSubmit={renameLabel}
            />
            <Group>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>
                <Button onClick={renameLabel}>
                    {t("modals.editRemoteLabel.confirm")}
                </Button>
            </Group>
        </Stack>
    );
}
