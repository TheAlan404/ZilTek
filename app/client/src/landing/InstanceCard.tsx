import { useTranslation } from "react-i18next";
import { Instance } from "./instance";
import { ActionIcon, Button, Group, Paper, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconArrowRight, IconPencil } from "@tabler/icons-react";

export const InstanceCard = ({
    instance,
    onEdit,
    onConnect,
}: {
    instance: Instance;
    onEdit: () => void;
    onConnect: () => void;
}) => {
    const [t] = useTranslation();

    return (
        <Paper withBorder p="md" w="100%">
            <Stack>
                <Group justify="space-between" align="start">
                    <Stack gap={0}>
                        <Title order={4}>{instance.label}</Title>
                        <Text c="dimmed">{instance.id}</Text>
                        <Text c="dimmed" fz="xs">{instance.relay}</Text>
                    </Stack>
                    <Group>
                        <Tooltip label={t("mode.remote.edit")}>
                            <ActionIcon
                                variant="light"
                                color="gray"
                                onClick={onEdit}>
                                <IconPencil />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
                <Button
                    variant="light"
                    color="blue"
                    onClick={onConnect}
                    rightSection={<IconArrowRight />}
                >
                    {t("mode.remote.connect")}
                </Button>
            </Stack>
        </Paper>
    )
};
