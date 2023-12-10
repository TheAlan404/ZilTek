import { useContext } from "react";
import { ControllerAPI } from "../../../host/ControllerAPI";
import { useTranslation } from "react-i18next";
import { Button, Divider, Group, Select, Stack, Text } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";

export const SettingsMenu = () => {
    const { hostMode: mode, exit } = useContext(ControllerAPI);
    const { t, i18n } = useTranslation();

    return (
        <Stack align="center">
            <Text>{t(`mode.${mode}.running`)}</Text>
            <Divider w="80%" />
            <Group justify="space-between">
                <Text>{t("language")}</Text>
                <Select
                    value={i18n.resolvedLanguage}
                    onChange={(v) => i18n.changeLanguage(v)}
                    data={[
                        { value: "en", label: "English" },
                        { value: "tr", label: "Türkçe" },
                    ]}
                    comboboxProps={{ withinPortal: false }}
                />
            </Group>
            <Group justify="flex-end">
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconLogout2 />}
                    onClick={() => exit()}>
                    {t(`mode.${mode}.exit`)}
                </Button>
            </Group>
        </Stack>
    )
}
