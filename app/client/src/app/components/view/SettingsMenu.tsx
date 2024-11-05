import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Stack, Text } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { LanguageSwitch } from "../LanguageSwitch";
import { HostContext } from "../../../host/HostContext";

export const SettingsMenu = () => {
    const { exit } = useContext(HostContext);
    const { t } = useTranslation();

    return (
        <Stack align="center">
            <Group justify="space-between">
                <Text>{t("language")}</Text>
                <LanguageSwitch />
            </Group>
            <Button
                fullWidth
                variant="light"
                color="red"
                leftSection={<IconLogout2 />}
                onClick={() => exit()}>
                {t(`exit`)}
            </Button>
        </Stack>
    )
}
