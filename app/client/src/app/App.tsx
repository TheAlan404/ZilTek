import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { ControllerAPI } from "../host/ControllerAPI.tsx"
import { ActionIcon, AppShell, Button, Checkbox, Divider, Flex, Group, Popover, Select, Stack, Text, Title, Tooltip } from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { VERSION } from "../AppBase.tsx/index.ts"
import { IconLogout2 } from "@tabler/icons-react"
import { useListState, useLocalStorage } from "@mantine/hooks"
import useMobile from "../hooks/useMobile"
import { IconEdit } from "@tabler/icons-react"
import { IconLayout } from "@tabler/icons-react"
import { ChangesContext } from "./ChangesContext"
import { ViewPage } from "./pages/View.tsx"
import { EditorPage } from "./pages/Editor.tsx"
import { PageChangeButton } from "./components/view/PageChangeButton.tsx"
import { AppHeader } from "./components/view/AppHeader.tsx"
import { OnlineBadge } from "./components/view/OnlineBadge.tsx"
import { AppTitle } from "./components/view/AppTitle.tsx"
import { DropzoneProvider } from "./DropzoneProvider.tsx"

const App = () => {
    let [currentPage, setCurrentPage] = useState("view");

    const [unsavedChanges, unsavedHandlers] = useListState([]);
    const [savedChanges, savedHandlers] = useListState([]);

    return (
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
            ignoreAll() {
                unsavedHandlers.setState([]);
            },
        }}>
            <AppShell
                header={{ height: 60 }}
            >
                <AppShell.Header>
                    <Flex px="md" h="100%" justify="space-between" align="center">
                        <AppTitle />
                        <AppHeader />
                        <Group>
                            <OnlineBadge />
                            <PageChangeButton {...{
                                currentPage,
                                setCurrentPage,
                            }} />
                        </Group>
                    </Flex>
                </AppShell.Header>
                <AppShell.Main>
                    {currentPage == "view" ? <ViewPage /> : <EditorPage />}
                    <DropzoneProvider />
                </AppShell.Main>
            </AppShell>
        </ChangesContext.Provider>
    )
}

export {
    App,
};
