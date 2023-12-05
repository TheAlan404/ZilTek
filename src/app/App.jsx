import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { ControllerAPI } from "../host/common/ControllerAPI"
import { ActionIcon, AppShell, Button, Divider, Flex, Group, Popover, Select, Stack, Text, Title, Tooltip } from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { VERSION } from "../AppBase"

const SettingsMenu = () => {
    const { hostMode, exit } = useContext(ControllerAPI);
    const { t, i18n } = useTranslation();

    return (
        <Stack>
            <Text>{t(`mode.${hostMode}.running`)}</Text>
            <Divider w="80%" />
            <Group>
                <Text>{t("language")}</Text>
                <Select
                    w="auto"
                    value={i18n.resolvedLanguage}
                    onChange={(v) => i18n.changeLanguage(v)}
                    data={[
                        { value: "en", label: "English" },
                        { value: "tr", label: "Türkçe" },
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    />
            </Group>
        </Stack>
    )
}

const AppTitle = () => {
    const { t } = useTranslation();

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
                <Popover.Dropdown>
                    <SettingsMenu />
                </Popover.Dropdown>
            </Popover>
            <Title order={3}>ZilTek {VERSION}</Title>
            <Text>{t("by_dennis")}</Text>
        </Group>
    )
}

const App = () => {
    const { audioState, processCommand } = useContext(ControllerAPI);
    let [currentPage, setCurrentPage] = useState("view");
    const { t } = useTranslation();

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md">
            <AppShell.Header>
                <Flex px="md" h="100%" justify="space-between" align="center">
                    <AppTitle />
                    <Group>
                        {audioState == "playing" && (
                            <Tooltip label={t("header.audioPlayingTooltip")}>
                                <Button
                                    variant='light'
                                    size="compact-md"
                                    color="green"
                                    onClick={() => processCommand({ type: "stopAudio" })}>
                                    {t("header.audioPlaying")}
                                </Button>
                            </Tooltip>
                        )}
                        {audioState == "suppressed" && (
                            <Tooltip label={t("header.suppressedTooltip")}>
                                <Button
                                    variant='light'
                                    color="red"
                                    onClick={() => {
                                        processCommand({ type: "changeBellStatus", data: { on: true } });
                                    }}>
                                    {t("header.suppressed")}
                                </Button>
                            </Tooltip>
                        )}
                    </Group>
                    <Group>

                    </Group>
                </Flex>
            </AppShell.Header>
        </AppShell>
    )
}

export {
    App,
};
