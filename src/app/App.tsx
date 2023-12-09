import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { ControllerAPI } from "../host/ControllerAPI.tsx"
import { ActionIcon, AppShell, Button, Checkbox, Divider, Flex, Group, Popover, Select, Stack, Text, Title, Tooltip } from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { VERSION } from "../AppBase"
import { IconLogout2 } from "@tabler/icons-react"
import { useListState, useLocalStorage } from "@mantine/hooks"
import useMobile from "../hooks/useMobile"
import { IconEdit } from "@tabler/icons-react"
import { IconLayout } from "@tabler/icons-react"
import { ChangesContext } from "./ChangesContext"
import { ViewPage } from "./pages/View.tsx"
import { EditorPage } from "./pages/Editor.tsx"

const SettingsMenu = () => {
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

const AppTitle = () => {
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

const PageChangeButton = ({
    currentPage,
    setCurrentPage,
    unsavedChanges,
}) => {
    const { t } = useTranslation();
    const mobile = useMobile();

    const buttonIcon = currentPage == "view" ? <IconEdit /> : <IconLayout />;
    const buttonProps = {
        onClick: () => setCurrentPage(p => p == "view" ? "edit" : "view"),
        variant: "light",
        color: currentPage == "view" ? "violet" : (
            unsavedChanges.length ? "yellow" : "violet"
        ),
    };
    
    return (
        <Tooltip disabled={!unsavedChanges.length} label={unsavedChanges.length && t("edit.unsavedChanges")}>
            {mobile ? (
                <ActionIcon {...buttonProps}>
                    {buttonIcon}
                </ActionIcon>
            ) : (
                <Button {...buttonProps} leftSection={buttonIcon}>
                    {currentPage == "view" ? t("menu.edit") : t("menu.view")}
                </Button>
            )}
        </Tooltip>
    );
}

const App = () => {
    const { audioState, processCommand } = useContext(ControllerAPI);
    let [currentPage, setCurrentPage] = useState("view");
    const { t } = useTranslation();

    const [unsavedChanges, unsavedHandlers] = useListState([]);
    const [savedChanges, savedHandlers] = useListState([]);

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
                        <PageChangeButton {...{
                            currentPage,
                            setCurrentPage,
                            unsavedChanges,
                        }} />
                    </Group>
                </Flex>
            </AppShell.Header>
            <AppShell.Main>
                <ChangesContext.Provider value={{
                    unsavedChanges,
                    savedChanges,
                    markAsDirty: (id) => {
                        if (!unsavedChanges.includes(id)) unsavedHandlers.append(id);
                        if (savedChanges.includes(id)) savedHandlers.filter(item => item != id);
                    },
                    markAsSaved: (id) => {
                        unsavedHandlers.filter(item => item != id);
                        savedHandlers.append(id);
                    },
                    markAsReverted: (id) => {
                        unsavedHandlers.filter(item => item != id);
                    },
                }}>
                    {currentPage == "view" ? <ViewPage /> : <EditorPage />}
                </ChangesContext.Provider>
            </AppShell.Main>
        </AppShell>
    )
}

export {
    App,
};
