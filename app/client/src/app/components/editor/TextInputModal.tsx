import { Button, Group, Stack, TextInput } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const createTextInputModal = ({
    value,
    onChange,
    title,
}: {
    value: string;
    onChange: (s: string) => void;
    title: string;
}) => {
    const modalId = randomId();
    modals.open({
        modalId,
        title,
        children: (
            <TextInputModal
                value={value}
                onChange={(v) => {
                    modals.close(modalId);
                    onChange(v);
                }}
                onCancel={() => {
                    modals.close(modalId);
                }}
            />
        ),
    })
};

export const TextInputModal = ({
    value: defaultValue = "",
    onChange,
    onCancel,
    placeholder,
}: {
    value?: string;
    onChange?: (s: string) => void;
    onCancel?: () => void;
    placeholder?: string;
}) => {
    const [t] = useTranslation();
    const [value, setValue] = useState(defaultValue);

    return (
        <Stack p="md" justify="center">
            <TextInput
                autoFocus
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onSubmit={() => onChange?.(value)}
            />
            <Group justify="space-between">
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => onCancel?.()}
                >
                    {t("modals.cancel")}
                </Button>
                <Button
                    variant="light"
                    color="green"
                    onClick={() => onChange?.(value)}
                >
                    {t("modals.confirm")}
                </Button>
            </Group>
        </Stack>
    );
};
