import { ActionIcon, Box, Button, Center, Checkbox, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { DOWNLOAD_LINK, HOST_MODE_ALLOWED, MODE, REMOTE_MODE_ALLOWED, VERSION } from "../meta";
import { LanguageSwitch } from "../app/components/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconBell, IconDownload } from "@tabler/icons-react";
import { InstancesList } from "./InstancesList";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";
import { useEffect } from "react";

export const Landing = () => {
    const [t] = useTranslation();

    const navigate = useNavigate();

    let [autoLocal, setAutoLocal] = useLocalStorage({
        key: "ziltek:auto-local",
        defaultValue: false,
        getInitialValueInEffect: false,
    });

    useEffect(() => {
        if(autoLocal) navigate("/local");
    }, []);

    return (
        <ModalsProvider
            labels={{
                confirm: t("modals.confirm"),
                cancel: t("modals.cancel"),
            }}
        >
            <Stack w="100%" align="center">
                <Stack w={{ base: "100%", sm: "80%", md: "70%", lg: "50%" }}>
                    <Stack align="center" gap="xl" p="md" mt="md" w="100%">
                        <Group justify="space-between" align="center" w="100%">
                            <Group>
                                <Group align="center">
                                    <IconBell />
                                    <Title order={3}>ZilTek</Title>
                                </Group>
                                <Text c="dimmed">{VERSION}</Text>
                            </Group>
                            <LanguageSwitch />
                        </Group>

                        {HOST_MODE_ALLOWED && (
                            <Group justify="space-between" w="100%" align="center">
                                <Checkbox
                                    checked={autoLocal}
                                    onChange={(e) => setAutoLocal(e.currentTarget.checked)}
                                    label={t("autoLocal")}
                                    description={t("autoLocalDesc")}
                                />

                                <Button
                                    variant="light"
                                    color="green"
                                    rightSection={<IconArrowRight />}
                                    onClick={() => navigate("/local")}>
                                    {t("enterLocal")}
                                </Button>
                            </Group>)}

                        {MODE === "web" && (
                            <Group justify="end" wrap="nowrap" align="center" px="md" w="100%">
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
                                onConnect={(instance) => navigate(`/${instance.id}@${instance.relay.replace(/\//g, "!")}`)}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </ModalsProvider>
    )
};
