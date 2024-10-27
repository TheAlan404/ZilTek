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
    const setInstanceProp = <K extends keyof Instance>(k: K, v: Instance[K]) => setInstance(i => ({
        ...i,
        [k]: v,
    }));

    const add = () => {
        modals.closeAll();

        onUpdate(instance);
    };

    return (
        <Stack p="md" justify="center">
            <TextInput
                placeholder={t("modals.addRemote.placeholderName")}
                label={t("modals.addRemote.labelName")}
                value={instance.label}
                onChange={(e) => setInstanceProp("label", e.target.value)}
            />

            <TextInput
                placeholder={t("modals.addRemote.placeholderId")}
                label={t("modals.addRemote.labelId")}
                value={instance.id}
                onChange={(e) => setInstanceProp("id", e.currentTarget.value)}
            />

            <TextInput
                placeholder={t("modals.addRemote.placeholderRelay")}
                label={t("modals.addRemote.labelRelay")}
                value={instance.relay}
                onChange={(e) => setInstanceProp("relay", e.currentTarget.value)}
            />

            <Group justify="space-between" grow>
                <Button
                    color="gray"
                    variant="light"
                    onClick={() => modals.closeAll()}
                >
                    {t("modals.cancel")}
                </Button>

                {onDelete && (
                    <Button
                        color="red"
                        variant="light"
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
                
                <Button
                    variant="light"
                    color="green"
                    onClick={add}
                >
                    {onDelete ? t("modals.addRemote.save") : t("modals.addRemote.add")}
                </Button>
            </Group>
        </Stack>
    );
}
