import { modals } from "@mantine/modals";
import { useState } from "react";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

const TextInputModal = ({ defaultValue, onSubmit }: {
    defaultValue: string;
    onSubmit: (s: string) => void;
}) => {
    const [t] = useTranslation();
    const [value, setValue] = useState(defaultValue);

    return (
        <Stack align="center">
            <TextInput
                autoFocus
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onSubmit={() => onSubmit(value)}
            />
            <Group>
                <Button
                    color="gray"
                    onClick={() => onSubmit(defaultValue)}>
                    {t("modals.cancel")}
                </Button>
                <Button onClick={() => onSubmit(value)}>
                    {t("modals.confirm")}
                </Button>
            </Group>
        </Stack>
    );
};

export const openTextInputModal = (
    title: string,
    defaultValue: string,
    onSubmit: (value: string) => void,
) => {
    modals.open({
        title,
        children: <TextInputModal
            defaultValue={defaultValue}
            onSubmit={onSubmit}
        />,
    })
};
