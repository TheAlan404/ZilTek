import { ActionIcon, Button, Center, Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import { DOWNLOAD_LINK, HOST_MODE_ALLOWED, MODE, REMOTE_MODE_ALLOWED, VERSION } from "../meta";
import { LanguageSwitch } from "../app/components/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconDownload } from "@tabler/icons-react";
import { InstancesList } from "./InstancesList";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const [t] = useTranslation();

    const navigate = useNavigate();

    let [autoLocal, setAutoLocal] = useLocalStorage({
        key: "ziltek-auto-local",
        defaultValue: false,
    });

    return (
        <Center w="100%" h="100%">
            <Stack align="center" gap="xl" p="md" mt="md">
                <Group justify="space-between" align="center" px="md" w="100%">
                    <Title>ZilTek {VERSION}</Title>
                    <LanguageSwitch />
                </Group>

                {HOST_MODE_ALLOWED && (
                    <Group justify={"space-between"} align="center" p="md">
                        <Checkbox
                            checked={autoLocal}
                            onChange={(e) => setAutoLocal(e.currentTarget.checked)}
                            label={t("mode.local.checkbox")}
                            description={t("mode.local.desc")}
                        />

                        <Button
                            variant="light"
                            color="green"
                            rightSection={<IconArrowRight />}
                            onClick={() => navigate("/local")}>
                            {t("mode.local.button")}
                        </Button>
                    </Group>)}

                {MODE === "WEB" && (
                    <Group justify="end" align="center" px="md" w="100%">
                        <Text>{t("download")}</Text>
                        <ActionIcon
                            component="a"
                            href={DOWNLOAD_LINK}
                            target="_blank"
                            color="green"
                            variant="light"
                        >
                            <IconDownload />
                        </ActionIcon>
                    </Group>
                )}

                {REMOTE_MODE_ALLOWED && (
                    <InstancesList
                        onConnect={() => { }}
                    />
                )}
            </Stack>
        </Center>
    )
};
