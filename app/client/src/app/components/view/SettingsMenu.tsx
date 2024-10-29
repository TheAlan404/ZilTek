import { useContext } from "react";
import { Controller } from "../../../host/ControllerAPI";
import { useTranslation } from "react-i18next";
import { Button, Divider, Group, Select, Stack, Text } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { LanguageSwitch } from "../LanguageSwitch";
import { HostContext } from "../../../host/HostContext";

export const SettingsMenu = () => {
    const { exit, clientType } = useContext(HostContext);
    const { t, i18n } = useTranslation();

    return (
        <Stack align="center">
            <Text>{t(`mode.${clientType}.running`)}</Text>
            <Divider w="80%" />
            <Group justify="space-between">
                <Text>{t("language")}</Text>
                <LanguageSwitch />
            </Group>
            <Group justify="flex-end">
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconLogout2 />}
                    onClick={() => exit()}>
                    {t(`mode.${clientType}.exit`)}
                </Button>
            </Group>
        </Stack>
    )
}