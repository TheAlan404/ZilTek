import { useTranslation } from "react-i18next";
import { Instance } from "./instance";
import { ChangeEvent, useState } from "react";
import { DEFAULT_RELAY } from "../meta";
import { modals } from "@mantine/modals";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export const InstanceModal = ({
    instance: _instance,
    onUpdate,
    onDelete,
}: {
    instance?: Instance;
    onUpdate: (i: Instance) => void;
    onDelete?: () => void;
}) => {
    const { t } = useTranslation();
    const [instance, setInstance] = useState<Instance>({
        id: _instance?.id || "",
        label: _instance?.label || "",
        relay: _instance?.relay || DEFAULT_RELAY,
    });

    const add = () => {
        modals.closeAll();

        onUpdate(instance);
    };

    const setter = (k: keyof Instance) => (e: ChangeEvent<HTMLInputElement>) => setInstance(i => ({ ...i, [k]: e.currentTarget.value }));

    return (
        <Stack p="md" justify="center">
            <TextInput
                placeholder={t("modals.addRemote.placeholderName")}
                label={t("modals.addRemote.labelName")}
                value={instance.label}
                onChange={setter("label")}
            />

            <TextInput
                autoFocus
                placeholder={t("modals.addRemote.placeholderId")}
                label={t("modals.addRemote.labelId")}
                value={instance.id}
                onChange={setter("id")}
            />

            <TextInput
                placeholder={t("modals.addRemote.placeholderRelay")}
                label={t("modals.addRemote.labelRelay")}
                value={instance.relay}
                onChange={setter("relay")}
            />

            <Group justify="space-between" grow>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>

                {onDelete && (
                    <Button
                        color="red"
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("modals.deleteRemote.title"),
                                children: t("modals.deleteRemote.content"),
                                confirmProps: { color: "red" },
                                labels: {
                                    confirm: t("modals.deleteRemote.confirm"),
                                    cancel: t("modals.cancel")
                                },
                                onConfirm() {
                                    onDelete();
                                    modals.closeAll();
                                    notifications.show({
                                        message: t("notifs.deletedRemote"),
                                        color: "red",
                                    });
                                },
                            });
                        }}>
                        {t("modals.addRemote.delete")}
                    </Button>
                )}
                
                <Button onClick={add}>
                    {onDelete ? t("modals.addRemote.save") : t("modals.addRemote.add")}
                </Button>
            </Group>
        </Stack>
    );
}
