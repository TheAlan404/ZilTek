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
                placeholder={t("instance.namePlaceholder")}
                label={t("instance.name")}
                value={instance.label}
                onChange={(e) => setInstanceProp("label", e.target.value)}
            />

            <TextInput
                placeholder={t("instance.idPlaceholder")}
                label={t("instance.id")}
                value={instance.id}
                onChange={(e) => setInstanceProp("id", e.currentTarget.value)}
            />

            <TextInput
                placeholder={t("instance.relayPlaceholder")}
                label={t("instance.relay")}
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
                                title: t("instance.delete"),
                                children: t("instance.deleteConfirmation"),
                                confirmProps: { color: "red" },
                                onConfirm() {
                                    onDelete();
                                    modals.closeAll();
                                    notifications.show({
                                        message: t("instance.deletedRemote"),
                                        color: "red",
                                    });
                                },
                            });
                        }}>
                        {t("instance.delete")}
                    </Button>
                )}
                
                <Button
                    variant="light"
                    color="green"
                    onClick={add}
                >
                    {onDelete ? t("instance.save") : t("instance.add")}
                </Button>
            </Group>
        </Stack>
    );
}
