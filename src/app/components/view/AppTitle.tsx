import { useTranslation } from "react-i18next";
import { ActionIcon, Group, Popover, Text, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { VERSION } from "../../../AppBase.tsx"
import useMobile from "../../../hooks/useMobile";
import { SettingsMenu } from "./SettingsMenu.tsx";

export const AppTitle = () => {
    const { t } = useTranslation();
    const mobile = useMobile();

    return (
        <Group>
            <Popover withArrow transitionProps={{ transition: "scale-y" }}>
                <Popover.Target>
                    <ActionIcon
                        variant="light"
                        color="gray">
                        <IconSettings />
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown m="md">
                    <SettingsMenu />
                </Popover.Dropdown>
            </Popover>
            <Title order={3}>ZilTek {!mobile && VERSION}</Title>
            <Text>{!mobile && t("by_dennis")}</Text>
        </Group>
    )
}
